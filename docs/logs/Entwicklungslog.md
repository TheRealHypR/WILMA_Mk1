# WILMA Mk1 - Entwicklungslogbuch

Dieses Dokument fasst die bisherigen Entwicklungsschritte für das WILMA-Projekt zusammen.

**Datum:** 08. April 2025 (Beispiel, bitte ggf. anpassen)

## 1. Initialisierung & Planung

- **Project Requirement Document (PRD):** Eine umfassende PRD-Datei (`prd.md`) wurde erstellt, die die Anforderungen, Ziele, Personas, Funktionen und technischen Aspekte von WILMA definiert.
- **Dokumentationsstruktur:** Ein Ordner `Doc/` wurde angelegt, um alle relevanten Dokumentationsdateien zu sammeln.
- **Entwicklungsplan Phase 1 (MVP):** Basierend auf dem PRD wurde ein detaillierter Plan (`Phase1_MVP_Plan.md`) für die erste Entwicklungsphase (MVP) erstellt, der die Aufgaben in wöchentliche Abschnitte unterteilt.

## 2. Projekt-Setup & Infrastruktur

- **Frontend Initialisierung:**
    - Ein neues Frontend-Projekt wurde im Ordner `frontend/` mit Vite, React und TypeScript initialisiert (`npm create vite@latest frontend --template react-ts`).
    - Abhängigkeiten wurden installiert (`npm install`).
- **Versionskontrolle (Git):**
    - Ein Git-Repository wurde im Projekt-Hauptverzeichnis initialisiert (`git init`).
    - Eine `.gitignore`-Datei wurde erstellt, um `node_modules` und andere irrelevante Dateien auszuschließen.
    - Der initiale Projektstand wurde committet.
- **UI-Bibliothek (Material UI):**
    - Material UI (MUI) wurde als UI-Bibliothek ausgewählt.
    - Die notwendigen Pakete (`@mui/material`, `@emotion/react`, `@emotion/styled`, `@mui/icons-material`) wurden installiert.
    - MUI wurde in der Hauptdatei (`frontend/src/main.tsx`) durch Integration von `ThemeProvider` und `CssBaseline` konfiguriert.
    - Die Änderungen wurden committet.
- **Backend-Setup (Firebase):**
    - Ein Firebase-Projekt ("WILMA Mk 1") wurde manuell erstellt.
    - Die Dienste Authentication (E-Mail/Passwort), Firestore Database (Produktionsmodus) und Functions wurden in der Firebase Console aktiviert/vorbereitet.
    - Das Firebase SDK wurde zum Frontend hinzugefügt (`npm install firebase`).
    - Die Firebase-Konfigurationsdaten (`firebaseConfig`) wurden abgerufen und sicher in einer `.env.local`-Datei (manuell erstellt) im Frontend abgelegt.
    - Eine Konfigurationsdatei (`frontend/src/firebaseConfig.ts`) wurde erstellt, um Firebase mit den Umgebungsvariablen zu initialisieren.
    - Die Firebase CLI (`firebase-tools`) wurde global installiert (`npm install -g firebase-tools`).
    - Die PowerShell Execution Policy wurde angepasst (`Set-ExecutionPolicy ... RemoteSigned`), um die CLI-Ausführung zu ermöglichen.
    - Der Benutzer wurde über die CLI angemeldet (`firebase login`).
    - Firebase wurde im Projekt-Hauptverzeichnis initialisiert (`firebase init`), wobei Firestore und Functions ausgewählt wurden.
    - **Troubleshooting:** Korrekturen an Dateipfaden nach `firebase init`.
    - **Troubleshooting:** Erneute Initialisierung der Functions im Ordner `wilma/` nach anhaltenden Build-/Typisierungs-Problemen im ursprünglichen `functions/`-Ordner.
    - Die Firebase-Konfigurationsdateien (`firebase.json`, `.firebaserc`, `firestore.rules`, `firestore.indexes.json`) und der `wilma/`-Ordner wurden committet.

## 3. Nutzerauthentifizierung

- **Routing:**
    - React Router DOM wurde installiert (`npm install react-router-dom`).
    - `BrowserRouter` wurde in `frontend/src/main.tsx` integriert.
    - Ein `pages/`-Ordner wurde erstellt und Platzhalter-Komponenten für `LoginPage.tsx`, `RegisterPage.tsx` und `DashboardPage.tsx` angelegt.
    - Grundlegende Routen wurden in `frontend/src/App.tsx` definiert, inklusive einer einfachen AppBar-Navigation.
    - Die Änderungen wurden committet.
- **Registrierung:**
    - Die `RegisterPage.tsx` wurde implementiert:
        - Formular mit MUI-Komponenten (`TextField`, `Button`, `Alert`).
        - State Management für Formularfelder, Ladezustand und Fehler.
        - Verwendung von `createUserWithEmailAndPassword` aus Firebase Auth.
        - Weiterleitung nach Erfolg.
    - Die Änderungen wurden committet.
- **Login:**
    - Die `LoginPage.tsx` wurde implementiert:
        - Ähnliches Formular wie Registrierung.
        - Verwendung von `signInWithEmailAndPassword` aus Firebase Auth.
        - Weiterleitung nach Erfolg.
        - Link zur Registrierungsseite.
- **Auth State Management:**
    - Ein React Context (`frontend/src/contexts/AuthContext.tsx`) wurde erstellt:
        - Hält den `currentUser`-Status und `loading`-Zustand.
        - Verwendet `onAuthStateChanged` von Firebase Auth, um auf Login/Logout zu hören.
        - Bietet einen `useAuth`-Hook.
    - Der `AuthProvider` wurde in `frontend/src/main.tsx` integriert.
    - `App.tsx` wurde angepasst:
        - Verwendet `useAuth` zum Abrufen des `currentUser`.
        - Zeigt einen Ladeindikator (`CircularProgress`).
        - Implementiert eine `handleLogout`-Funktion mit `signOut`.
        - Passt die Navigation (AppBar) basierend auf dem Login-Status an.
        - Implementiert `ProtectedRoute` und `PublicRoute`-Komponenten zur Steuerung des Routenzugriffs.
    - Die Änderungen wurden committet.

## 4. Nutzerprofil (Basis)

- **Firestore-Regeln:**
    - Die `firestore.rules`-Datei wurde aktualisiert, um eine `users/{userId}`-Sammlung zu definieren und den Zugriff zu regeln.
- **Cloud Function (Automatische Profilerstellung - Versuch 1):**
    - Eine Cloud Function (`createUserDocument`) wurde implementiert (zuerst V2, dann V1 Syntax).
    - **Probleme:** Anhaltende Build- und Deployment-Fehler aufgrund von Typisierungs- und Abhängigkeitskonflikten (V1/V2, `@google-cloud/storage`, Linting, Build-Skript-Ausführung). Mehrere Lösungsversuche (Downgrades, `tsconfig`-Anpassungen, `predeploy`-Hook entfernen/umgehen) schlugen fehl.
    - **Status:** Cloud Function ist *nicht* erfolgreich deployed.
- **Frontend Profilseite:**
    - Platzhalter `ProfilePage.tsx` erstellt.
    - Route (`/profile`) und Link in AppBar (`App.tsx`) hinzugefügt.
    - Logik zum Laden von Profildaten aus Firestore (`getDoc`) implementiert.
    - Formular (MUI `TextFields`) zur Eingabe von Hochzeitsdetails (Datum, Stil, Gäste) erstellt.
    - Speicherlogik implementiert (`handleSave`).
    - **Fix:** Speicherlogik von `updateDoc` auf `setDoc` mit `{ merge: true }` geändert, um Fehler bei nicht existierendem Dokument zu beheben.
    - Änderungen committet.

## 5. Basis-Chat-Interface

- **Firestore-Regeln:** Regeln für `users/{userId}/messages/{messageId}` Subkollektion hinzugefügt und deployed (erlaubt Lesen/Erstellen durch den jeweiligen Benutzer).
- **UI Komponenten:**
    - Ordner `frontend/src/components/chat` erstellt.
    - `ChatInterface.tsx`: Hauptcontainer erstellt.
    - `MessageList.tsx`: Komponente zum Anzeigen von Nachrichten erstellt (liest aus Firestore mit `onSnapshot`).
    - `MessageInput.tsx`: Komponente zum Eingeben und Senden neuer Nachrichten erstellt (schreibt nach Firestore mit `addDoc` und `serverTimestamp`).
    - Komponenten in `ChatInterface` und `DashboardPage` integriert.
    - Änderungen committet.

## 6. Laufende Dokumentation

- **MVP-Plan Aktualisierung:** Erledigte Aufgaben in `Doc/Phase1_MVP_Plan.md` wurden abgehakt (Stand nach Profilseite).
- **Entwicklungslog:** Diese Datei (`Entwicklungslog.md`) wurde erstellt und aktualisiert.

---

**Aktueller Stand & Nächste Schritte:**

- **Blocker:** Das Deployment der Cloud Functions (`wilma/`) ist aufgrund von Build-Fehlern blockiert. Dies verhindert die automatische Profilerstellung und die simulierte AI-Antwort im Chat.
- **Optionen:**
    1.  Lokale Behebung der Build-Fehler im `wilma`-Ordner durch den Benutzer.
    2.  Fortfahren mit anderen MVP-Features (z.B. Aufgabenmanagement), die nicht direkt von den blockierten Cloud Functions abhängen.

*(Entscheidung: Vorerst Fortfahren mit anderen Schritten)*

Nächster geplanter Schritt (gemäß obiger Entscheidung & `Phase1_MVP_Plan.md`):
- Beginn Abschnitt 4: **Manuelles Aufgabenmanagement** (Firestore Datenmodell, UI-Komponenten, CRUD-Operationen im Frontend).

---

Nächste geplante Schritte (siehe `Phase1_MVP_Plan.md`):
- Frontend-Funktionalität zum Aktualisieren des Nutzerprofils.
- Beginn der Implementierung des Basis-Chat-Interfaces. 