# To-Do Liste: Sichere Firebase Konfiguration (Stand 18.04.2025 / Update 24.04.2025)

**Problem:** Die Firebase-Konfigurationsschlüssel (apiKey, authDomain etc.) sind direkt in der Datei `frontend/src/firebaseConfig.ts` im Code hinterlegt. Diese Datei wurde versioniert und auf GitHub hochgeladen, wodurch die Schlüssel öffentlich sichtbar sind (GitHub Security Alert #L10). Dies stellt ein Sicherheitsrisiko dar.

**Ziel:** Die sensiblen Firebase-Konfigurationswerte sollen aus dem versionierten Quellcode entfernt und stattdessen über Umgebungsvariablen sicher verwaltet werden.

**Schritte:**

1.  **[X] `.env`-Datei erstellen:**
    *   `.env` und `.env.local` existieren im `frontend`-Verzeichnis.

2.  **[X] `.gitignore` aktualisieren:**
    *   Die `.gitignore`-Datei im Hauptverzeichnis ignoriert `frontend/.env`.

3.  **[X] Umgebungsvariablen definieren:**
    *   Die `VITE_FIREBASE_*`-Werte sind in `frontend/.env.local` eingetragen.

4.  **[X] `firebaseConfig.ts` anpassen:**
    *   Die Datei liest die Werte bereits aus `import.meta.env`.

5.  **[X] Lokalen Server neu starten:**
    *   Server wurde neu gestartet und das Frontend funktioniert lokal weiterhin.

6.  **[ ] Deployment-Umgebung konfigurieren:**
    *   Denke daran, dieselben `VITE_...`-Umgebungsvariablen auch in den Einstellungen deines Hosting-Anbieters (z.B. Firebase Hosting Build Environment, Netlify, Vercel) zu setzen, damit der Build-Prozess beim Deployment funktioniert.

7.  **(Optional, aber empfohlen) Git-Historie bereinigen:**
    *   Die Schlüssel sind zwar jetzt nicht mehr im aktuellen Code, aber noch in der Git-Historie vorhanden. Um sie komplett zu entfernen, müsstest du fortgeschrittene Git-Befehle wie `git filter-branch` oder Tools wie `bfg-repo-cleaner` verwenden. Dies ist komplexer und kann die Historie umschreiben. Wäge ab, ob dies für dein Projekt notwendig ist. **Vorsicht:** Mache vorher unbedingt ein Backup deines Repositories!
    *   **Wichtiger:** Ändere zur Sicherheit deine Firebase API Keys im Firebase Projekt, falls du die Historie nicht bereinigst. 