# Aufgabenliste für Deployment bis Sonntag (Basisfunktionen)

## 1. Emulatoren / Firebase-Verbindung

-   [x] **Emulatoren starten:** Sicherstellen, dass `firebase emulators:start` läuft, um Registrierung/Login testen zu können.
-   [ ] **Entscheidung treffen:** Weiter Emulatoren nutzen oder auf Live-Firebase für lokale Entwicklung umstellen? (Aktuell: Emulatoren)

## 2. Kern-Chat-Funktionalität (`ChatLayout.tsx` + Firestore)

-   [ ] **Firestore-Struktur festlegen:** Datenmodell für Nachrichten definieren (z.B. `users/{userId}/messages` mit Feldern wie `text`, `sender` (`user` oder `wilma`), `timestamp`).
-   [x] **Nachrichten senden:** Funktion in `ChatLayout` / `MessageInput` implementieren, die Benutzernachrichten in Firestore schreibt. (Grundfunktion vorhanden)
-   [x] **Nachrichten empfangen/anzeigen:** Real-time Listener (`onSnapshot`) in `ChatLayout` / `MessageList` implementieren, um Nachrichten aus Firestore zu lesen und darzustellen. (Grundfunktion vorhanden)
-   [ ] **Minimal-KI-Antwort (Cloud Function):**
    -   [x] Einfache Firebase Function (`gen2` mit `onDocumentWritten`?) erstellen, die auf neue Benutzernachrichten unter `users/{userId}/messages` reagiert. (Funktion `simulateAiResponse` existiert und reagiert)
    -   [ ] Funktion schreibt eine feste oder leicht variierte Antwort ("Nachricht erhalten", "Ich denke...") als 'wilma'-Nachricht zurück in dieselbe Firestore-Collection. (Aktuell: "Antwort auf...")
    -   [ ] Funktion deployen (oder via Emulator testen).
    -> **TODO für morgen:** Umstellung auf n8n-Webhook-Trigger (`docs/TODO_n8n_Integration.md`)

## 3. Planungstools Minimal-Implementierung (`GuestPage.tsx`, `TasksPage.tsx`, `BudgetPage.tsx`, `ProfilePage.tsx`)

-   **Budget (`BudgetPage.tsx`):**
    -   [x] Anzeigen / Hinzufügen / Bearbeiten / Löschen scheint zu funktionieren (kurz gegenprüfen).
-   **Gäste (`GuestPage.tsx` / `GuestList.tsx`):**
    -   [x] Firestore-Struktur festgelegt.
    -   [x] `GuestList.tsx`: Komponente vorhanden, lädt Daten, zeigt Liste an.
    -   [x] Formular zum Hinzufügen (`AddGuestForm.tsx`) vorhanden.
    -   [x] Löschen/Bearbeiten (`GuestItem.tsx`) vorhanden.
-   **Aufgaben (`TasksPage.tsx`):**
    -   [x] Firestore-Struktur festgelegt (`task.model.ts`).
    -   [x] Service erstellt/angepasst (`task.service.ts`).
    -   [x] Listenansicht (`TaskList.tsx`) implementiert.
    -   [x] Formular zum Hinzufügen (`AddTaskForm.tsx`) vorhanden.
    -   [x] Status ändern (Checkbox) & Löschen implementiert.
-   **Profil (`ProfilePage.tsx`):**
    -   [x] Anzeigen / Speichern von Basis-Infos scheint zu funktionieren (kurz gegenprüfen).

## 4. Firebase Security Rules

-   **Firestore Rules:**
    -   [x] Regeln für `users/{userId}` vorhanden.
    -   [x] Regeln für `users/{userId}/messages` (Basis) vorhanden.
    -   [x] Regeln für `users/{userId}/tasks` (Basis create/read/update/delete) vorhanden.
    -   [x] Regeln für `users/{userId}/guests` (Basis create/read/update/delete) vorhanden.
    -   [x] Regeln für `users/{userId}/budgetItems` (Basis create/read/update/delete) vorhanden.
    -   [x] Regeln für `tends` (read-only) vorhanden.
    -   [x] Regeln für `newsletter_subscriptions` (create) vorhanden.
    -   [x] Regeln für `userChecklists` vorhanden.
    -   [ ] **WICHTIG:** Regeln für `guests` und `budgetItems` bei `update` noch unvollständig (TODOs im Code). Müssen alle Felder validieren!
    -   [x] Regeln wurden deployed.
-   **Storage Rules (falls verwendet):**
    -   [ ] Regeln definieren (z.B. für Profilbilder, falls implementiert).
    -   [ ] Regeln bereitstellen.

## 5. Firebase Live-Konfiguration

-   [ ] **Umgebungsvariablen prüfen:** Sicherstellen, dass Vite (`import.meta.env.MODE`) korrekt zwischen `development` und `production` unterscheidet.
-   [ ] **`firebaseConfig.ts` anpassen:** `connect...Emulator`-Aufrufe nur ausführen, wenn `import.meta.env.MODE === 'development'`.
-   [ ] Testen, ob die App lokal *ohne* laufende Emulatoren mit der Live-Firebase-Datenbank verbindet.

## 6. Deployment

-   [ ] **Hosting-Dienst wählen:** Firebase Hosting ist naheliegend.
-   [ ] **Firebase Hosting initialisieren:** `firebase init hosting` (falls noch nicht geschehen).
-   [ ] **Build-Prozess konfigurieren/testen:** `npm run build` im `frontend`-Ordner ausführen, sicherstellen, dass es fehlerfrei durchläuft und der `dist`-Ordner korrekt erstellt wird. Firebase Hosting muss auf diesen Build-Ordner zeigen.
-   [ ] **Deployment testen:** `firebase deploy --only hosting` ausführen und die bereitgestellte URL testen.

## 7. Aufräumen / Sonstiges

-   [ ] `ChatInterface.tsx` prüfen und ggf. löschen.
-   [ ] TODOs im Code durchgehen und bewerten.
-   [ ] Offensichtliche Konsolenwarnungen beheben.
-   [ ] Basis-Inhalte/Texte prüfen (Platzhalter?).

## 8. Neue / Ergänzende Punkte

-   [ ] *Hier können wir neue Punkte hinzufügen.*
-   [ ] ...

## 9. Zukünftige Erweiterungen (nach Alpha)

-   [ ] Aufgabenverwaltung mit mehr Funktionen und Möglichkeiten versehen (z.B. Fälligkeitsdatum setzen/bearbeiten in UI, Priorität, Kategorien).

## TODO Liste für WILMA Deployment

## Firebase Setup
- [x] Firebase Projekt erstellen
- [x] Firestore Datenbank initialisieren
- [x] Firebase Authentication einrichten (E-Mail/Passwort)
- [x] Firebase Hosting einrichten
- [x] Cloud Functions initialisieren (`firebase init functions`)
- [ ] **FEHLER/TODO:** Automatischer Datenimport in Firestore-Emulator funktioniert nicht (weder via `firebase.json` noch `--import` Flag). Seed-Dateien (`masterChecklistItems.json`, `trauzeugeChecklistItems.json`) müssen manuell importiert oder das Problem behoben werden.

## Firestore Rules
- [x] Grundlegende Sicherheitsregeln implementieren (alles blockieren, außer explizit erlaubt)
- [x] Regeln für `users/{userId}` (nur Besitzer darf lesen/schreiben) implementiert.
- [x] Regeln für `users/{userId}/messages` (User darf eigene lesen/schreiben) implementiert.
- [x] Regeln für `users/{userId}/guests` (Besitzer CRUD) implementiert.
- [x] Regeln für `users/{userId}/budgetItems` (Besitzer CRUD mit Validierung) implementiert.
- [x] Regeln für `users/{userId}/tasks` (Besitzer CRUD mit Validierung) implementiert.
- [x] Regeln für `tends` (public read) implementiert.
- [x] Regeln für `newsletter_subscriptions` (public create) implementiert.
- [x] Regeln für `userChecklists/{userId}` (Besitzer CRUD) vorhanden (alte Struktur?).
- [x] Regeln für `users/{userId}/checklistItems` (Basis CRUD mit Validierung) hinzugefügt.
- [x] Regeln für `masterChecklistItems` (Lesezugriff für eingeloggte User) hinzugefügt.
- [ ] Ggf. Regeln für Task-Checklist-Synchronisation (später).

## Cloud Functions
- [x] `createUserDocument`: Erstellt User-Dokument in Firestore bei Registrierung.
- [x] `simulateAiResponse`: Dummy-Funktion, die auf neue Nachrichten reagiert (Platzhalter).
- [x] `subscribeToNewsletter`: Speichert E-Mail-Adressen (ohne Validierung).
- [ ] Echte AI-Logik für `simulateAiResponse` implementieren (z.B. Gemini API).
- [ ] Ggf. Function für automatische Task-Erstellung aus Checkliste.
- [ ] Ggf. Function für Task/Checklist-Synchronisation.

## Authentication
- [x] Login-Seite implementiert (`LoginPage.tsx`).
- [x] Registrierungs-Seite implementiert (`RegisterPage.tsx`).
- [x] `AuthContext` implementiert.
- [x] `PrivateRoute` Komponente implementiert.
- [ ] Passwort zurücksetzen Funktionalität.
- [ ] E-Mail Verifizierung.

## Core Functionality

### Checklist
- [x] Grundstruktur für `ChecklistPage.tsx` und `UserChecklistPage.tsx` erstellt.
- [x] Datenmodell für `checklistItems` und `masterChecklistItems` definiert.
- [x] Laden und Anzeigen von Items in `UserChecklistPage` implementiert.
- [x] Abhaken (`isCompleted`-Update) von Items implementiert.
- [x] Hinzufügen von benutzerdefinierten Items implementiert.
- [x] Löschen von Items implementiert.
- [x] Generieren der persönlichen Liste aus `masterChecklistItems`-Vorlage implementiert.
- [ ] Inhalt der `masterChecklistItems`-Vorlage finalisieren.
- [ ] Funktion für allgemeine `ChecklistPage.tsx` definieren/implementieren (z.B. Anzeige Master-Liste?).
- [ ] Automatisches Erstellen von Aufgaben aus Checklist-Items (Cloud Function).
- [ ] Synchronisation Task-Status -> Checklist-Status (Cloud Function).

### Budget
- [x] `BudgetPage.tsx` erstellt.
- [x] Laden und Anzeigen von Budget-Items implementiert.
- [x] Hinzufügen/Bearbeiten von Items über Modal mit `BudgetItemForm.tsx`.
- [x] Löschen von Items implementiert.
- [x] Statusanzeige als Chip-Dropdown implementiert.

### Guests
- [x] `GuestPage.tsx` erstellt (Grundgerüst).
- [x] `GuestItem.tsx` zur Anzeige/Bearbeitung einzelner Gäste.
- [x] Laden, Hinzufügen, Bearbeiten, Löschen von Gästen implementiert.
- [x] Statusanzeige als Chip-Dropdown implementiert.

### Tasks
- [x] `TasksPage.tsx` erstellt (Grundgerüst).
- [x] `TaskItem.tsx` zur Anzeige/Bearbeitung einzelner Tasks.
- [x] Laden, Hinzufügen, Bearbeiten, Löschen von Tasks implementiert.
- [x] Statusanzeige als Chip-Dropdown implementiert.

### Chat
- [x] `ChatLayout.tsx` erstellt.
- [x] Senden von Nachrichten implementiert.
- [x] Empfangen/Anzeigen von Nachrichten (inkl. Dummy-AI-Antwort) implementiert.

## Frontend Routing
- [x] `react-router-dom` eingerichtet.
- [x] Öffentliche und private Routen definiert (`PublicLayout`, `AppLayout`).
- [x] Routen für Login, Register, Dashboard, Profil, Impressum, Datenschutz etc. erstellt.
- [x] Routen für Gäste, Budget, Tasks erstellt.
- [x] Routen für `/checklist` und `/user-checklist` hinzugefügt.

## Frontend UI/UX
- [x] `Material UI (MUI)` als Komponentenbibliothek eingerichtet.
- [x] Basis-Layouts (`PublicLayout`, `AppLayout`) mit AppBar/Footer erstellt.
- [x] Logo integriert.
- [x] `AuthContext` zur Anzeige des User-Status.
- [x] `ThemeProvider` (ggf. mit `WilmaTheme`) einrichten.
- [x] Cookie Consent Banner hinzugefügt.
- [x] Navigationslinks für Checklist-Seiten im AppLayout hinzugefügt.
- [ ] Responsiveness verbessern.
- [ ] UI der Checklist-Seiten verbessern (Layout, Details anzeigen etc.).
- [ ] Ladezustände und Fehlermeldungen konsistent implementieren.
- [ ] Theming verfeinern.

## Deployment
- [ ] Hosting konfigurieren (`firebase.json`).
- [ ] Build-Prozess für Frontend einrichten (`npm run build`).
- [ ] Deployment zu Firebase Hosting (`firebase deploy --only hosting`).
- [ ] Deployment der Functions (`firebase deploy --only functions`).
- [ ] Deployment der Firestore Rules (`firebase deploy --only firestore:rules`).

## Testing
- [ ] Unit Tests für Kernkomponenten/Funktionen.
- [ ] Integrationstests für Haupt-Workflows.
- [ ] Manuelle Tests aller Features.

# TODO Deployment WILMA Mk1

## Core Functionality Checks

- [x] User Authentication (Login, Register, Logout)
- [x] Firebase Project Setup & Initialization (incl. Emulators)
- [x] Firestore Database Setup
- [x] Basic Firestore Security Rules (Authenticated Users)
- [x] App Deployment (Firebase Hosting)
- [x] Environment Variables Setup (.env for API keys etc.)
- [x] Basic Error Handling & User Feedback (e.g., Snackbar)

## Feature Checklist

### Landing & Public Pages
- [x] Main Landing Page (`/`)
- [x] Trends Overview Page (`/trends`)
- [x] Trend Category Page (`/trends/:category`)
- [x] Trend Detail Page (`/trends/:category/:slug`)
- [ ] Resources Overview Page (`/ressourcen`) - *Funktionalität/Inhalt definieren*
- [ ] Thematic Landing Page (`/ressourcen/:slug`) - *Funktionalität/Inhalt definieren*
- [x] Location Request Page (`/location-anfrage`) - *Webhook testen*
- [x] About Page (`/about`)
- [x] Impressum (`/impressum`)
- [x] Privacy Policy (`/datenschutz`)
- [x] Cookie Policy (`/cookie-richtlinie`)
- [x] Cookie Consent Banner

### Authenticated User Area (`AppLayout`)
- [x] Dashboard (`/dashboard`) - *Inhalt/Widgets definieren*
- [x] Profile Page (`/profile`)
  - [x] Save Wedding Details (Date, Style, Guest Estimate)
  - [x] Select/Save Witnesses (Trauzeugen)
- [x] Guest Management (`/guests`)
  - [x] Add Guest
  - [x] View Guest List
  - [x] Update Guest Status (Dropdown)
  - [x] Update Guest Details (Modal? Inline?)
  - [x] Delete Guest
- [x] Budget Management (`/budget`)
  - [x] Add Budget Item
  - [x] View Budget Items
  - [x] Update Budget Item
  - [x] Delete Budget Item
  - [ ] Summaries/Totals Calculation
- [x] Task Management (`/tasks`)
  - [x] Add Task
  - [x] View Tasks
  - [x] Update Task Status/Details
  - [x] Delete Task
- [x] Checklist (`/checklist` / `/user-checklist`)
  - [x] Define Master Checklist Items (Firestore `masterChecklistItems`)
  - [x] User Checklist Page (`/user-checklist`)
    - [x] Generate Personal List from Master
    - [x] Add Custom Items
    - [x] Toggle Item Completion
    - [x] Delete Custom Items
  - [ ] Admin/General Checklist Page (`/checklist`) - *Funktion definieren (nur Master anzeigen?)*
  - [ ] Automatic Task Generation/Sync from Checklist?
- [ ] AI Chat Interface
  - [ ] Basic Message Display (User & AI)
  - [ ] Send User Message
  - [ ] Trigger `simulateAiResponse` Cloud Function
  - [ ] Display AI Response
  - [ ] Connect to real AI Backend (Post-MVP)

## Technical & Infrastructure

- [x] Firestore Security Rules - Refined for Guests, Tasks, Budget, Checklists, Master Checklist
- [x] Cloud Functions
  - [x] `createUserDocument` (Auth Trigger)
  - [x] `simulateAiResponse` (Firestore Trigger)
  - [x] `subscribeToNewsletter` (HTTP)
- [ ] Input Validation (Client-side & Security Rules)
- [x] Responsive Design Checks
- [ ] Code Linting & Formatting Setup
- [ ] Testing (Unit, Integration) - *Minimal setup*
- [x] CI/CD Pipeline (e.g., GitHub Actions for auto-deploy on merge to main) - *Basic setup*

## Post-Launch / Future Features

- [ ] **QR Code RSVP for Guests:**
  - [ ] Data Model: Add `rsvpToken` to `Guest` interface (`models/guest.model.ts`).
  - [ ] Cloud Function: `generateRsvpToken` (Optional Trigger/Manual).
  - [ ] Cloud Function: `getGuestRsvpData` (HTTP Callable - Gets guest/wedding data via token).
  - [ ] Cloud Function: `submitGuestRsvp` (HTTP Callable - Submits status/preferences via token).
  - [ ] Frontend: Route `/rsvp/:token`.
  - [ ] Frontend: Page `GuestRsvpPage.tsx` (UI for details, RSVP, preferences; calls CFs).
  - [ ] QR Code: Implement generation mechanism (e.g., using frontend library).
  - [ ] QR Code: Define distribution process.
  - [ ] Testing: Thoroughly test flow and error handling.
- [ ] Admin Dashboard/Area for managing users, content, etc.
- [ ] Advanced AI Chat Features (Context, Memory, Tool Usage)
- [ ] Email Notifications (Invites, Reminders, Updates)
- [ ] Guest Grouping & Table Assignment UI
- [ ] Vendor Management Module
- [ ] More detailed Analytics/Reporting

## Notes & Open Questions

- Purpose of `/checklist` vs `/user-checklist` needs final clarification.
- Exact content/functionality for `/dashboard` and `/ressourcen` pages.
- Testing strategy for Webhook (`/location-anfrage`).
- Still have unresolved MUI Grid linter errors in `pages/ProfilePage.tsx`. 