# Offene Punkte & Verbesserungen (Nach MVP Phase 1 Testing)

**Datum:** 2025-04-09

Dieses Dokument listet die offenen Aufgaben und Verbesserungsvorschläge auf, die sich aus dem manuellen Testing am Ende der MVP Phase 1 ergeben haben.

## MVP Abschluss (Phase 1) - Priorisierte Aufgaben

Diese Punkte sollten adressiert werden, um den MVP abzuschließen und für erste Tests freizugeben.

*   **[BUG] Chat:** Simulierte AI-Antwort erscheint nicht.
    *   *Aktion:* Ursache untersuchen (vermutlich `setTimeout`-Problem oder fehlende Logs in `ChatLayout.tsx` / `MessageInput.tsx`).
*   **[BUG] Navigation:** Link "Aufgaben" in AppBar führt zum Dashboard statt zu `/tasks`.
    *   *Aktion:* Route und Link in `App.tsx` prüfen und ggf. eine `TasksPage.tsx` erstellen oder den Link anpassen.
*   **[FEATURE] Dashboard Übersichten:** Platzhalter durch echte Komponenten ersetzen.
    *   *Aktion:* Einfache Komponenten (`TasksOverview`, `GuestsOverview`, `BudgetOverview`) erstellen, die Basis-Daten anzeigen (z.B. Anzahl Items, Gesamtbudget).
*   **[DOCS] README:** `README.md` erstellen/aktualisieren.
    *   *Aktion:* Projektbeschreibung, Features, Technologien, Setup-Anleitung (Backend/Frontend), Startbefehle.
*   **[TESTING] Responsivität:** Grundlegende Prüfung auf kleineren Bildschirmen.
    *   *Aktion:* Anwendung im Browser verkleinern und auf Layout-Probleme prüfen.
*   **[INFRA] CI/CD:** Einfache Pipeline einrichten (siehe Plan: `Doc/Phase1_MVP_Plan.md`).
    *   *Aktion:* GitHub Actions Workflow für Linting, Build, ggf. Deployment zu Firebase Hosting erstellen.
*   **[CODE] Review/Refactor:** Codequalität prüfen, kleinere Refactorings.
    *   *Aktion:* Insbesondere MUI Grid v2 Syntax verwenden, um Konsolenwarnungen zu beheben.

## Verbesserungen (Post-MVP / Phase 2)

Diese Punkte sind wertvolle Ideen für die Weiterentwicklung nach dem MVP.

*   **[FEATURE] Profil:**
    *   Feld "Stil" als Dropdown mit gängigen Optionen + "Eigener Stil"-Eingabefeld implementieren.
*   **[FEATURE] Gäste:**
    *   Anzeige/Filterung/Gruppierung nach Tischnummer hinzufügen.
*   **[FEATURE] Budget:**
    *   Feld für Anzahlungssumme hinzufügen (z.B. wenn Status `partially-paid`).
    *   Berechnung "Bereits bezahlt" anpassen, um Anzahlungen zu berücksichtigen.
    *   Möglichkeit schaffen, ein Gesamtbudget festzulegen (z.B. in `ProfilePage` oder als Teil eines Onboardings).
    *   Anzeige "Restbudget" berechnen und darstellen.
    *   Im Dashboard: Übersicht der Top 3 Ausgabenkategorien anzeigen.
*   **[FEATURE] Chat:**
    *   Zeitstempel (Uhrzeit) bei jeder Nachricht anzeigen.
    *   Tages-Trennlinien im Chatverlauf einfügen.
    *   Scrollverhalten verbessern (z.B. Fokus auf die *neueste* Nachricht statt nur ans Ende zu scrollen).
    *   Chatfenster-Hintergrund und Eingabebereich gemäß Mockup gestalten.
*   **[BACKEND] Cloud Functions:**
    *   Deployment-Problem (Gen 1 vs Gen 2 Erkennung) grundlegend lösen (siehe `docs/06_Troubleshooting_Cloud_Functions_Deployment.md`).
    *   Echte KI-Anbindung für Chat-Antworten implementieren.
    *   Ggf. Funktion zur automatischen Profilerstellung wieder aktivieren.
*   **[FEATURE] Partner-Verknüpfung:**
    *   Konzept entwickeln und umsetzen (z.B. gemeinsames Hochzeitsdokument, Einladungssystem).
*   **[CODE] TypeScript/Linting:**
    *   Ursache der MUI Grid Typfehler untersuchen und beheben (ggf. durch Paket-Updates).

--- 