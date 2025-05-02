# Entwicklungsplan: Phase 1 - MVP (Kernfunktionalität)

Basierend auf dem PRD (`Doc/prd.md`, Abschnitt 6 & 11).
**Dauer:** ca. 3 Monate

**Ziele:**
- Basis-Chat-Interface implementieren.
- Nutzerauthentifizierung und Profilerstellung ermöglichen.
- Grundlegendes, manuelles Aufgabenmanagement.
- Grundlegendes, manuelles Gästemanagement (Liste, einfacher RSVP).
- Grundlegendes, manuelles Budgettracking.
- Einfache Backend-Logik zur Simulation von Chat-Antworten (Platzhalter für NLP).

---

## 1. Projekt Setup & Infrastruktur (Woche 1-2)

- **[x] Aufgabe:** Frontend-Projekt initialisieren (React mit Vite oder Create React App).
    - *Details:* Standard-Projektstruktur, Linter/Formatter (ESLint, Prettier), Routing-Setup (z.B. React Router).
- **[x] Aufgabe:** Backend-Setup mit Firebase.
    - *Details:* Firebase-Projekt erstellen, benötigte Dienste aktivieren (Authentication, Firestore, Functions), CLI installiert & Projekt initialisiert.
- **[x] Aufgabe:** Grundlegendes UI-Kit/Design-System auswählen und integrieren.
    - *Details:* Entscheidung für eine Komponentenbibliothek (z.B. Material UI, Ant Design, Chakra UI), Basis-Theme konfigurieren.
- **[ ] Aufgabe:** Einfache CI/CD-Pipeline einrichten (z.B. GitHub Actions).
    - *Details:* Automatisches Linting, Testausführung (initial leer), Build-Prozess. Deployment zu Firebase Hosting (manuell oder automatisiert).
- **[x] Aufgabe:** Versionskontrolle einrichten (Git, GitHub/GitLab Repository).

**Meilenstein 1 (Ende Woche 2):** Projekt-Grundgerüst steht, Firebase konfiguriert, Basis-Deployment funktioniert.

---

## 2. Nutzerauthentifizierung & Profil (Woche 3-4)

- **[x] Aufgabe:** Firebase Authentication implementieren (Email/Passwort).
    - *Backend:* Firebase Auth konfigurieren.
    - *Frontend:* Login-, Registrierungs-, Logout- und Auth-State-Management implementiert.
- **[x] Aufgabe:** UI-Komponenten für Authentifizierung erstellen (React).
    - *Details:* Formulare für Login, Registrierung.
- **[x] Aufgabe:** Firestore Datenmodell für Nutzerprofile definieren.
    - *Details:* Struktur für `users` Collection (userId, email, createdAt, weddingProfile), Firestore-Regeln implementiert.
- **[x] Aufgabe:** Funktionalität zum Erstellen/Aktualisieren des Nutzerprofils implementieren.
    - *Frontend:* Profilseite (`ProfilePage.tsx`) zum Anzeigen/Bearbeiten/Speichern implementiert.
    - *Backend:* Automatische Erstellung bei Registrierung via Cloud Function implementiert (Deployment noch offen).

**Meilenstein 2 (Ende Woche 4):** Nutzer können sich registrieren, anmelden und grundlegende Profildaten speichern/aktualisieren.

Hinweis zur Cloud Function: Die automatische Erstellung des Nutzerprofils 
bei Registrierung (ursprünglich per Cloud Function geplant) erfolgt 
nun im Frontend (RegisterPage.tsx) als Workaround für Deployment-Probleme.
Siehe docs/06_Troubleshooting_Cloud_Functions_Deployment.md

---

## 3. Basis-Chat-Interface (Woche 5-7)

- **[x] Aufgabe:** Firestore Datenmodell für Chatnachrichten definieren.
    *Details:* Struktur `/users/{userId}/messages` (angepasst an bestehende Function/Workaround). Siehe `docs/05_Datenmodell_Chat.md` (aktualisiert).
- **[x] Aufgabe:** UI-Komponente für Chat-Layout erstellen (React).
- **[x] Aufgabe:** UI-Komponente für Nachrichtenanzeige erstellen (React).
- **[x] Aufgabe:** UI-Komponente für Nachrichteneingabe erstellen (React).
- **[x] Aufgabe:** Frontend-Logik zum Senden und Empfangen von Nachrichten (React <-> Firestore).
- **[~] Aufgabe:** Einfache Firebase Function (HTTP Trigger) als Chat-Backend erstellen.
    *Details:* **UMGANGEN (MVP):** Simulierte AI-Antwort wird nun im Frontend (`ChatLayout.tsx`) nach dem Senden der Benutzernachricht mittels `setTimeout` generiert und in Firestore gespeichert. Die ursprüngliche Cloud Function (`simulateAiResponse`) konnte aufgrund von Deployment-Problemen nicht genutzt/aktualisiert werden. Siehe `docs/06_Troubleshooting_Cloud_Functions_Deployment.md`.
- **[~] Aufgabe:** Frontend-Logik zur Interaktion mit der Chat-Backend-Function.
    *Details:* **ENTFÄLLT (MVP):** Da die Antwort im Frontend simuliert wird, ist keine explizite Interaktion mit einer Backend-Function nötig.

**Meilenstein 3 (Ende Woche 7):** Nutzer können Nachrichten senden, diese werden angezeigt, eine simple (im Frontend simulierte) Antwort vom "AI"-Backend erscheint im Chat.

---

## 4. Manuelles Aufgabenmanagement (Woche 8-9)

- **[x] Aufgabe:** Firestore Datenmodell für Aufgaben definieren.
    - *Details:* Struktur für `users/{userId}/tasks` Subcollection (taskId, title, description, status (open/done), dueDate - optional).
- **[x] Aufgabe:** UI-Komponente zur Anzeige der Aufgabenliste erstellen (React).
    - *Details:* Liste der Aufgaben, Filter-/Sortieroptionen (minimal).
- **[x] Aufgabe:** UI-Komponenten zum Hinzufügen/Bearbeiten/Löschen/Abhaken von Aufgaben (React).
    - *Details:* Modale Dialoge oder Inline-Bearbeitung.
- **[x] Aufgabe:** CRUD-Operationen für Aufgaben implementieren (Frontend <-> Firestore).
    - *Details:* Direkte Interaktion des Frontends mit Firestore unter Verwendung von Firebase SDK und Sicherheitsregeln.

---

## 5. Manuelles Gästemanagement (Woche 10-11)

- **[x] Aufgabe:** Firestore Datenmodell für Gäste definieren.
    - *Details:* Struktur für `users/{userId}/guests` Subcollection (guestId, firstName, lastName, status (invited/accepted/declined/pending), notes).
- **[x] Aufgabe:** UI-Komponente zur Anzeige der Gästeliste erstellen (React).
    - *Details:* Tabelle oder Liste der Gäste mit Status.
- **[x] Aufgabe:** UI-Komponenten zum Hinzufügen/Bearbeiten/Löschen von Gästen (React).
- **[x] Aufgabe:** UI-Komponente zur einfachen RSVP-Verwaltung (Status ändern) (React).
- **[x] Aufgabe:** CRUD-Operationen für Gäste implementieren (Frontend <-> Firestore).

---

## 6. Manuelles Budgettracking (Woche 11-12)

- **[ ] Aufgabe:** Firestore Datenmodell für Budget/Ausgaben definieren.
    - *Details:* Struktur für `users/{userId}/budgetItems` Subcollection (itemId, description, category, estimatedCost, actualCost, status (planned/paid)). Eventuell separates `budgetSummary` Dokument pro User.
- **[ ] Aufgabe:** UI-Komponente zur Anzeige der Budgetübersicht/Ausgabenliste erstellen (React).
    - *Details:* Einfache Summenanzeige, Liste der Posten.
- **[ ] Aufgabe:** UI-Komponenten zum Hinzufügen/Bearbeiten/Löschen von Budgetposten/Ausgaben (React).
- **[ ] Aufgabe:** CRUD-Operationen für Budget/Ausgaben implementieren (Frontend <-> Firestore).

---

## 7. Abschluss Phase 1 (Ende Woche 12)

- **[ ] Aufgabe:** Basis-Testing durchführen (manuell, ggf. erste Unit-Tests für kritische Logik).
- **[ ] Aufgabe:** Code-Review und Refactoring.
- **[ ] Aufgabe:** Dokumentation aktualisieren (README, ggf. Kommentare).
- **[ ] Aufgabe:** MVP-Release für interne Tests / erste Testnutzer vorbereiten.

**Meilenstein MVP (Ende Woche 12):** Alle Kernfunktionen sind manuell nutzbar, Chat-Interface funktioniert mit simulierten Antworten, Authentifizierung steht. 