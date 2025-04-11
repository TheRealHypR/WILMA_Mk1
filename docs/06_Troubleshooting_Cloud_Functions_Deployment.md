# Troubleshooting Log: Cloud Functions Deployment (Phase 1)

**Datum:** 2025-04-09

**Ziel:** Deployment der initialen Cloud Functions für den MVP:
1.  `createUserDocument`: Automatisches Erstellen eines Nutzerprofil-Dokuments in Firestore bei neuer Benutzerregistrierung.
2.  `simulateAiResponse`: Generieren einer simulierten AI-Antwort im Chat, wenn ein Benutzer eine Nachricht sendet.

**Problemverlauf & Lösungsversuche:**

1.  **Ausgangspunkt:** Code für V1 Cloud Functions (`functions.auth.user().onCreate`, `functions.firestore.document().onCreate`) wurde erstellt (oder war teilweise vorhanden).
2.  **Erste Deployment-Versuche (`firebase deploy --only functions`):** Fehlgeschlagen mit Build-Fehlern.
    *   **Fehler:** TypeScript-Typfehler (`Property 'auth'/'document' does not exist on type...`), implizite `any`-Typen, Fehler in Abhängigkeiten (`crc32c.d.ts`).
    *   **Annahme:** Konflikt zwischen V1-Syntax und neueren Versionen von `firebase-functions` oder `typescript`.
3.  **Umstellung auf V2 API:** Code in `index.ts` wurde auf die V2 API umgeschrieben (`onUserCreated`, `onDocumentCreated`).
4.  **Fortbestehende Build-Fehler:** Linter meldete `Cannot find module 'firebase-functions/v2/auth'`. `package.json` zeigte `firebase-functions v6.0.1` (was V2 sein sollte).
5.  **Probleme mit dem `functions`-Verzeichnis:** Es stellte sich heraus, dass das ursprüngliche `functions`-Verzeichnis leer war oder fehlte. Ein Versuch mit einer benutzerdefinierten Codebase (`wilmamk1`) wurde gemacht.
6.  **Deployment-Blocker (`firebase.json`):** `firebase deploy` scheiterte, weil es versuchte, `predeploy`-Skripte (lint, build) in nicht mehr existenten Verzeichnissen (`wilma`, `wilmamk1`) auszuführen, die in `firebase.json` konfiguriert waren.
7.  **Reset:** `wilmamk1`-Verzeichnis gelöscht, `functions`-Verzeichnis neu mit `firebase init functions` (Standard-Codebase `default`, TypeScript) initialisiert. `firebase.json` bereinigt, V2-Code in `functions/src/index.ts` eingefügt, Konfigurationen (`package.json`, `tsconfig.json`) angepasst (Node v20, target es2021, lib dom, skipLibCheck).
8.  **Build-Probleme (`tsc`):** Manuelle Build-Versuche (`npm run build`, `npx tsc -p .`) schlugen fehl oder verhielten sich unerwartet (Hilfe angezeigt, `tsconfig.json` nicht gefunden).
9.  **Grundursache Build-Fehler:** Die Datei `functions/tsconfig.json` fehlte tatsächlich. Nach Neuerstellung konnte der manuelle Build (`.\node_modules\.bin\tsc -p .`) **erfolgreich** durchgeführt werden.
10. **Neuer Deployment-Blocker (Gen 1 vs. Gen 2):**
    *   `firebase deploy` versuchte **hartnäckig**, die Funktionen als **Gen 1** zu deployen/erstellen, obwohl der Code V2 verwendet und erfolgreich als V2 kompiliert wurde.
    *   Dies führte zu `Error: Precondition failed` und sekundären IAM-Berechtigungsfehlern (`Access to bucket gcf-sources... denied`), da der Gen 1 Build-Prozess fehlschlug.
    *   Auch das explizite Löschen der alten Gen 1-Funktionen (`firebase functions:delete`) änderte nichts daran, dass Firebase die neuen Funktionen als Gen 1 erstellen wollte.
11. **Hartnäckiger HMR-Fehler (Frontend):** Parallel dazu zeigte Vite HMR konstant den Fehler `Identifier 'handleDeleteClick' has already been declared. (172:8)` für `GuestItem.tsx`, obwohl der Code in der Datei korrekt war (nur eine Definition vorhanden). Dieser Fehler wurde als **irrelevant** für das Backend-Deployment eingestuft und ist wahrscheinlich ein Cache-Problem von Vite/Babel.

**Workaround für MVP Phase 1:**

Da das Deployment der Cloud Functions nicht zeitnah gelöst werden konnte und den Fortschritt blockierte, wurde entschieden, die Funktionalität für den MVP durch **Frontend-Logik** umzusetzen:

1.  **Benutzerprofil-Erstellung:** Erfolgt nun direkt nach der erfolgreichen Registrierung (`createUserWithEmailAndPassword`) im Frontend (`RegisterPage.tsx`) durch Schreiben in die Firestore `users`-Collection mittels `setDoc`.
2.  **Simulierte AI-Antwort:** Erfolgt nun direkt nach dem erfolgreichen Speichern der Benutzernachricht in Firestore. Die Frontend-Komponente (`ChatLayout.tsx`) verwendet `setTimeout`, um nach einer kurzen Verzögerung eine "AI"-Nachricht zu generieren und diese ebenfalls per `addDoc` in die Firestore `messages`-Subcollection zu schreiben.

**Offene Punkte:**

*   Die Ursache für die falsche Erkennung der Funktionsgeneration (Gen 1 statt Gen 2) durch `firebase deploy` muss nach dem MVP untersucht werden.
*   Die Cloud Functions (insbesondere für die echte AI-Anbindung) werden langfristig benötigt.

---

## Analyse & Nächste Schritte (Post-MVP)

### Notwendigkeit von Cloud Functions (Langfristig)

Obwohl der MVP durch Frontend-Workarounds realisiert wird, sind Cloud Functions für die Weiterentwicklung des Projekts **essenziell**:

1.  **Echte KI-Integration:** Die Anbindung an externe KI-Dienste (z.B. Gemini, OpenAI) zur Generierung intelligenter Chat-Antworten *muss* im Backend erfolgen (Sicherheit, API-Keys, zentrale Logik). Eine Cloud Function (Firestore-Trigger auf neue Nachrichten oder HTTP-Trigger vom Frontend) ist hierfür ideal.
2.  **Hintergrundprozesse:** Für Aufgaben wie das Senden von Erinnerungen (z.B. für Aufgaben, RSVP-Deadlines), Datenaggregation oder regelmäßige Wartungsarbeiten sind Cloud Functions (z.B. Pub/Sub-Trigger) notwendig.
3.  **Sicherheitskritische Operationen:** Komplexe Validierungen oder Aktionen, die über Firestore-Sicherheitsregeln hinausgehen, sollten im Backend implementiert werden.
4.  **Performance/Skalierbarkeit:** Auslagern rechenintensiver oder langlaufender Prozesse vom Client.

### Troubleshooting des Deployment-Problems (Post-MVP)

Die hartnäckige Fehlklassifizierung der Funktionen als Gen 1 trotz V2-Code und -Konfiguration deutet auf tiefere Probleme hin. Folgende Schritte sollten nach dem MVP verfolgt werden:

1.  **Lokale Umgebung & Cache bereinigen:**
    *   `npm cache clean --force`
    *   Globale Firebase CLI neu installieren (`npm uninstall -g firebase-tools`, `npm install -g firebase-tools`).
    *   Ggf. auch den Build-Cache von TypeScript löschen (falls vorhanden).
2.  **Firebase Projekt-State prüfen:**
    *   In der Google Cloud Console (IAM, Cloud Build API, Cloud Functions API) prüfen, ob alle APIs korrekt aktiviert sind und ob es verwaiste Konfigurationen oder Berechtigungsprobleme gibt.
    *   Sicherstellen, dass wirklich *alle* alten Gen 1-Funktionen (auch in anderen Regionen) gelöscht wurden.
3.  **Minimales Testprojekt:** Ein neues, leeres Firebase-Projekt erstellen und nur eine minimale V2-Function (z.B. `onUserCreated`) mit Standard-`firebase init` (TypeScript) deployen. Schlägt dies auch fehl, liegt es wahrscheinlich an der globalen CLI oder der lokalen Node/NPM-Umgebung. Funktioniert es, liegt das Problem im State des alten `wilma-mk1`-Projekts.
4.  **Explizite Konfiguration / Flags:** Recherchieren, ob es CLI-Flags (`firebase deploy --only functions --flag ...`) oder Einstellungen in `firebase.json` gibt, um Gen 2 explizit zu erzwingen (normalerweise nicht nötig).
5.  **Firebase Community / Support:** Das Problem detailliert mit allen Logs und Konfigurationen in offiziellen Foren (Stack Overflow, Slack) posten oder den Support kontaktieren.

--- 