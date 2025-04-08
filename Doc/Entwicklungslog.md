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
    - Korrekturen an Dateipfaden nach `firebase init` wurden vorgenommen.
    - Die Firebase-Konfigurationsdateien (`firebase.json`, `.firebaserc`, `firestore.rules`, `firestore.indexes.json`) und der `functions/`-Ordner wurden committet.

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
    - Die `firestore.rules`-Datei wurde aktualisiert, um eine `users/{userId}`-Sammlung zu definieren.
    - Regeln erlauben das Erstellen durch authentifizierte Benutzer und Lesen/Aktualisieren/Löschen nur durch den jeweiligen Benutzer selbst.
- **Cloud Function (Automatische Profilerstellung):**
    - Eine Cloud Function (`createUserDocument` in `functions/src/index.ts`) wurde implementiert.
    - Sie verwendet den V2-Trigger `onUserCreated`.
    - Bei der Erstellung eines neuen Auth-Benutzers wird automatisch ein Dokument in `users/{userId}` mit der E-Mail und einem `createdAt`-Zeitstempel erstellt.
    - *Hinweis:* Es gab Linter-Probleme mit den V2-Imports, die aber das Deployment nicht verhinderten (weiterhin zu beobachten/beheben).
- **Deployment:**
    - Die aktualisierten Firestore-Regeln und die `createUserDocument`-Funktion wurden erfolgreich deployed (`firebase deploy --only firestore:rules,functions`).

## 5. Laufende Dokumentation

- **MVP-Plan Aktualisierung:** Die erledigten Aufgaben in `Doc/Phase1_MVP_Plan.md` wurden abgehakt.
- **Entwicklungslog:** Diese Datei (`Entwicklungslog.md`) wurde erstellt, um den Fortschritt zu dokumentieren.

---

Nächste geplante Schritte (siehe `Phase1_MVP_Plan.md`):
- Frontend-Funktionalität zum Aktualisieren des Nutzerprofils.
- Beginn der Implementierung des Basis-Chat-Interfaces. 