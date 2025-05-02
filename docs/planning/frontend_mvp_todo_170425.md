# Frontend MVP To-Do Liste (Stand 16.04.2025 für 17.04.2025) - ERLEDIGT

**Wichtige Anmerkung:** Da die Cloud Functions aktuell nicht deploybar sind, müssen wir davon ausgehen, dass Features, die direkt darauf angewiesen sind (wie die Newsletter-Anmeldung und potenziell Teile der geschützten Seiten), im MVP entweder **nicht funktionieren** oder nur **als Attrappe (Mockup)** implementiert werden können.

**Prio 1: Kernfunktionalität & Navigation für eingeloggte Nutzer**

1.  **[ERLEDIGT] App-Layout implementieren:**
    *   Erstelle eine einfache Layout-Komponente (z. B. `AppLayout.tsx`) für den eingeloggten Bereich.
    *   Diese sollte eine **AppBar** oder **Sidebar** enthalten.
    *   Implementiere in dieser AppBar/Sidebar die **Navigation** (Links) zwischen den vorhandenen geschützten Seiten: `/dashboard`, `/profile`, `/guests`, `/budget`.
    *   Integriere dieses `AppLayout` in `App.tsx` für die geschützten Routen (ersetze die aktuellen `<Container>`-Wrapper dort).
2.  **[ERLEDIGT] Auth-Status im Header:**
    *   Binde den `Header.tsx` an den `AuthContext` an (`useAuth`).
    *   Zeige dynamisch die "Login/Register"-Buttons ODER den "Dashboard"-Button an, je nachdem, ob `currentUser` vorhanden ist.
3.  **[ERLEDIGT] Logout implementieren:**
    *   Füge den Logout-Button im `Header.tsx` für eingeloggte Nutzer hinzu.
    *   Implementiere die `handleLogout`-Funktion im Header (kann die aus `App.tsx` übernehmen oder `useAuth` verwenden, falls dort eine Logout-Funktion bereitgestellt wird).
4.  **[ERLEDIGT] Login/Register sicherstellen:**
    *   Überprüfe kurz, ob `LoginPage.tsx` und `RegisterPage.tsx` korrekt mit dem `AuthContext` interagieren und den Nutzer nach Erfolg zum `/dashboard` weiterleiten.

**Prio 2: Rechtliches & fehlende Platzhalter-Seiten**

5.  **[TEILWEISE ERLEDIGT/ÜBERERFÜLLT] Basis-Seiten erstellen:**
    *   Erstelle minimale Komponenten für `/impressum`, `/datenschutz`, `/about` und `/tasks` (z. B. in `frontend/src/pages/`). Diese können vorerst nur eine Überschrift und einen Text wie "Inhalt folgt" enthalten.
    *   Binde diese neuen Seiten-Komponenten in `App.tsx` an die entsprechenden Routen an (die Routen für `/about`, `/impressum`, `/datenschutz` müssen dort noch hinzugefügt werden, `/tasks` muss den Platzhalter ersetzen).
    *   *Anmerkung: `/tasks` wurde durch spezifische funktionale Seiten ersetzt, nicht nur Platzhalter.* 
6.  **[ERLEDIGT] Links zu rechtlichen Seiten:**
    *   Stelle sicher, dass die Links zu `/impressum` und `/datenschutz` im `Footer.tsx` vorhanden sind und funktionieren (sie sind schon da, aber die Zielseiten müssen existieren).
7.  **[INDIREKT ERLEDIGT/ANDERES KONZEPT] Link zur Aufgaben-Seite:**
    *   Füge den Link zur (jetzt existierenden) `/tasks`-Seite in der neuen App-Layout-Navigation (AppBar/Sidebar aus Schritt 1) hinzu.
    *   *Anmerkung: Navigation erfolgt zu spezifischen Ressourcen/Funktionen, nicht zu einer generischen `/tasks`-Seite.* 

**Prio 3: Grundlegende Benutzerfreundlichkeit**

8.  **[ERLEDIGT] Mobile Navigation (Header):**
    *   Implementiere eine sehr einfache mobile Navigation (Hamburger-Menü) im `Header.tsx`.
    *   Diese sollte zumindest Links zur Hauptseite (`/`), Trends (`/trends`), Ressourcen (`/ressourcen`) und Login/Register (bzw. Dashboard, wenn eingeloggt) enthalten.

**Was erstmal weggelassen wurde (Nicht MVP für morgen):**

*   **Newsletter-Formular-Logik:** (Blocked by Functions) - Das Formular im Footer bleibt vorerst ohne Funktion.
*   **Social Media Links:** (Footer) - Nicht essenziell für MVP.
*   **Detaillierter Inhalt:** Der Inhalt der Seiten `/about`, `/impressum`, `/datenschutz`, `/tasks` bleibt minimal. Auch der Inhalt der Ressourcen- und Trend-Detailseiten wird nicht im Detail geprüft/implementiert.
*   **Backend-abhängige Features:** Alle Features innerhalb von Dashboard, Profil, Budget etc., die auf die *aktuell nicht funktionierenden* Cloud Functions angewiesen sind, werden nicht funktionieren.
*   **UI-Feinschliff:** Fokus auf Funktionalität, nicht auf perfektes Aussehen. 