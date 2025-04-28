# Konsolidierte & Priorisierte To-Do-Liste für HEUTE (24.04.2025)

**Ziel:** Sicherstellen, dass Kernfunktionen sicher laufen und bereit für Tests/Deployment sind. Kritische Fixes und Entscheidungen treffen.

**Priorität 1: Blocker, Sicherheit & Kritische Fixes (MUSS heute!)**

*   **[X] Firebase Billing aktivieren/prüfen:** Gehe zur Firebase Console -> Projekteinstellungen -> Nutzung und Abrechnung -> Sicherstellen, dass der "Blaze"-Plan aktiv ist. (*Blockiert Deployment.*)
*   **[X] Sichere Firebase Konfiguration (Frontend):**
    *   `.env` in `frontend` erstellen/prüfen.
    *   `.gitignore` prüfen (`frontend/.env` drin?).
    *   **Werte in `frontend/.env` eintragen (`VITE_FIREBASE_*`).**
    *   **`firebaseConfig.ts` auf `import.meta.env` umstellen.**
    *   Lokalen Server neu starten & prüfen, ob Frontend noch läuft. (*Wichtig für Sicherheit & Funktion.*)
*   **[X] Firestore Security Rules definieren (Entwurf - Core & Checkliste):** Regeln für `users`, `messages` und `userChecklists` definieren. (*Blockiert sichere Nutzung.*)
*   **[X] Newsletter-Anmeldung reparieren (Debugging & Fix):** Funktion auf `/ressourcen/hochzeitsbudget-rechner` debuggen und zum Laufen bringen (Frontend-Debugging: Konsole, Code-Analyse; Fehlerbehebung). (*Wichtige Funktion.*)
*   **[X] Entscheidung CRM Backend:** Firestore oder Airtable? (*Blockiert n8n & CRM-Entwicklung.*)

**Priorität 2: Vorbereitung Kern-Deployment (Nach Prio 1)**

*   **[X] Firebase Login & Projektauswahl:** `firebase login` und `firebase use --add` ausführen, falls noch nicht geschehen. (Einmalig.)
*   **[X] `firebaseConfig.ts` prüfen:** Sicherstellen, dass Live-Konfig korrekt ist (keine Emulator-Pfade mehr).
*   **[X] `firebase.json` prüfen:** Pfad `hosting.public` prüfen.
*   **[ ] Frontend Build (Core/Chat):** `cd frontend && npm run build && cd ..`. (*Erst NACHDEM sichere Config & Newsletter-Fix laufen.*)
*   **[ ] Deployment-Umgebung konfigurieren:** `VITE_FIREBASE_*`-Variablen im Hosting-Provider eintragen. (*Wichtig für den Build im CI/CD.*)

**Priorität 3: Code-Bereinigung & n8n (Wenn Zeit)**

*   **[ ] Debug `console.log` entfernen (Chat & Newsletter):** Code aufräumen in `ChatLayout.tsx`, `MessageList.tsx`, `functions/src/index.ts`, `ThematicLandingPage.tsx`.
*   **[ ] n8n Workflow (Location Form - Basics):** Basierend auf CRM-Entscheidung: Passenden Node (Firestore/Airtable) hinzufügen, Credentials, Mapping konfigurieren.

**Zurückgestellt / Fokus für Morgen:**

*   Deployment (`firebase deploy`).
*   Live-Test (Core - Auth, Chat, Newsletter).
*   Finale Security Rules prüfen/deployen (inkl. CRM-Regeln).
*   n8n Workflow (Location Form): Fehlerbehandlung, E-Mail, Antwort.
*   Personalisierte Checkliste: Implementierung.
*   CRM Admin-Panel (falls Firestore).
*   Frontend-Optimierungen (Mobil etc.).
*   MUI Grid Warnings.
*   Git-Historie bereinigen. 