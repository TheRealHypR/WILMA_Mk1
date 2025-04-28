# WILMA Mk1 - Wedding Impulse Lovely Management Assistant

![WILMA Logo/Banner Placeholder](placeholder.png) <!-- Optional: Platzhalter für ein Logo -->

> Deine persönliche Hochzeitsplanerin - KI-gestützt und immer für dich da.

WILMA ist ein chat-basierter Assistent, entwickelt um Paare stressfrei durch die Hochzeitsplanung zu begleiten. Die Anwendung kombiniert eine intuitive Chat-Oberfläche mit Werkzeugen zur Verwaltung von Aufgaben, Gästen und Budget.

## ✨ Features (MVP - Phase 1)

*   **Benutzerauthentifizierung:** Sichere Registrierung und Login per E-Mail/Passwort.
*   **Profilverwaltung:** Speichern und Bearbeiten grundlegender Hochzeitsinformationen (Datum, Stil, Gästeanzahl).
*   **Chat-Interface:** Senden und Empfangen von Nachrichten mit einer (aktuell im Frontend simulierten) KI-Antwort.
*   **Manuelles Aufgabenmanagement:** Erstellen, Bearbeiten, Abhaken und Löschen von To-Do-Listen-Einträgen.
*   **Manuelles Gästemanagement:** Erstellen, Bearbeiten und Löschen von Gästen, Verwalten des RSVP-Status.
*   **Manuelles Budgettracking:** Erfassen, Bearbeiten und Löschen von Budgetposten (geplant/bezahlt), Anzeige einer Kostenzusammenfassung.
*   **Design System:** Angepasstes UI-Theme basierend auf Material UI.

## 🚀 Verwendete Technologien

*   **Frontend:**
    *   React.js (mit Vite)
    *   TypeScript
    *   Material UI (MUI) v5
    *   React Router DOM v6
    *   Firebase SDK (Auth, Firestore)
*   **Backend (Firebase):**
    *   Firebase Authentication
    *   Firestore (NoSQL Datenbank)
    *   Firebase Hosting (für Deployment)
    *   (Cloud Functions - Deployment aktuell problematisch, siehe `docs/06_Troubleshooting_Cloud_Functions_Deployment.md`)
*   **Dokumentation:** Markdown

## 📁 Projektstruktur

```
WILMA Mk1/
├── frontend/       # React Frontend Code (Vite)
│   ├── public/
│   │   ├── assets/      # Statische Assets (Bilder, SVGs)
│   │   ├── src/
│   │   │   ├── components/  # Wiederverwendbare UI-Komponenten
│   │   │   ├── contexts/    # React Contexts (z.B. AuthContext)
│   │   │   ├── pages/       # Seiten-Komponenten (pro Route)
│   │   │   ├── types/       # TypeScript Typdefinitionen
│   │   │   ├── App.tsx      # Haupt-App-Komponente (Routing)
│   │   │   ├── main.tsx     # Einstiegspunkt (React Render, Theme)
│   │   │   └── theme.ts     # MUI Theme Definition
│   │   ├── index.html
│   │   ├── package.json
│   │   └── vite.config.ts
│   ├── functions/      # Firebase Cloud Functions Code (TypeScript)
│   │   ├── src/
│   │   │   └── index.ts   # Funktionsdefinitionen
│   │   ├── lib/         # Kompilierter JS-Code (nach `npm run build`)
│   │   ├── package.json
│   │   └── tsconfig.json
│   ├── docs/           # Projektdokumentation (Markdown)
│   ├── .firebaserc     # Firebase Projekt-Konfiguration
│   ├── firebase.json   # Firebase Konfiguration (Hosting, Functions, Firestore)
│   ├── firestore.rules # Firestore Sicherheitsregeln
│   ├── .gitignore
│   └── README.md       # Diese Datei
```

## ⚙️ Setup & Installation

**Voraussetzungen:**
*   Node.js (v20 empfohlen, siehe `functions/package.json`)
*   npm (wird mit Node.js installiert)
*   Firebase CLI (`npm install -g firebase-tools`)
*   Ein Firebase-Projekt (erstellt über die [Firebase Console](https://console.firebase.google.com/))

**Schritte:**

1.  **Projekt klonen:**
    ```bash
    git clone <repository_url>
    cd WILMA-Mk1
    ```
2.  **Frontend Abhängigkeiten installieren:**
    ```bash
    cd frontend
    npm install
    cd .. 
    ```
3.  **Backend Abhängigkeiten installieren:**
    ```bash
    cd functions
    npm install --legacy-peer-deps # Notwendig wg. Abhängigkeitskonflikt (siehe Logs)
    cd ..
    ```
4.  **Firebase Konfiguration:**
    *   Erstelle eine Datei `.env.local` im `frontend`-Verzeichnis (`frontend/.env.local`).
    *   Füge deine Firebase Projekt-Konfigurationsdaten hinzu (du findest sie in den Projekteinstellungen deines Firebase-Projekts -> Web-App): 
        ```plaintext
        VITE_FIREBASE_API_KEY=DEIN_API_KEY
        VITE_FIREBASE_AUTH_DOMAIN=DEIN_AUTH_DOMAIN
        VITE_FIREBASE_PROJECT_ID=DEINE_PROJECT_ID
        VITE_FIREBASE_STORAGE_BUCKET=DEIN_STORAGE_BUCKET
        VITE_FIREBASE_MESSAGING_SENDER_ID=DEIN_MESSAGING_SENDER_ID
        VITE_FIREBASE_APP_ID=DEINE_APP_ID
        # VITE_FIREBASE_MEASUREMENT_ID=DEINE_MEASUREMENT_ID (optional)
        ```
    *   Stelle sicher, dass die Firebase CLI mit deinem Konto angemeldet ist (`firebase login`) und das korrekte Projekt ausgewählt ist (`firebase use DEINE_PROJECT_ID`).

## ▶️ Lokales Ausführen

1.  **Frontend Entwicklungsserver starten:**
    ```bash
    cd frontend
    npm run dev
    ```
    Die Anwendung sollte unter `http://localhost:5173` (oder einem ähnlichen Port) erreichbar sein.

2.  **(Optional) Firebase Emulatoren starten:**
    Um Firestore, Auth etc. lokal zu testen, ohne das Live-Projekt zu beeinflussen (noch nicht vollständig konfiguriert):
    ```bash
    # Im Hauptverzeichnis
    firebase emulators:start
    ```

## 🚀 Deployment

1.  **Firestore Regeln deployen:**
    ```bash
    firebase deploy --only firestore:rules
    ```
2.  **(Problembehaftet) Cloud Functions deployen:**
    *   Aufgrund aktueller Probleme ist ein manueller Build-Schritt nötig:
        ```bash
        cd functions
        .\node_modules\.bin\tsc -p .  # Für Windows PowerShell
        # oder: ./node_modules/.bin/tsc -p . # Für Git Bash/Linux/Mac
        cd ..
        ```
    *   Dann das Deployment (ohne predeploy hooks in `firebase.json`):
        ```bash
        firebase deploy --only functions
        ```
    *   Siehe `docs/06_Troubleshooting_Cloud_Functions_Deployment.md` für Details.
3.  **Frontend deployen (Firebase Hosting):**
    *   Frontend bauen:
        ```bash
        cd frontend
        npm run build
        cd ..
        ```
    *   Hosting deployen (stellt den Inhalt von `frontend/dist` bereit, gemäß `firebase.json`):
        ```bash
        firebase deploy --only hosting
        ```

---

*Dieses Projekt befindet sich in aktiver Entwicklung.* 