# To-Do Liste: Newsletter-Anmeldung reparieren (Stand 18.04.2025 / Update 24.04.2025)

**Problem:** Das Absenden des Newsletter-Formulars auf der Budget-Ressourcenseite (`/ressourcen/hochzeitsbudget-rechner`) löste keine sichtbare Aktion oder Fehlermeldung aus. Der Klick auf den "Vorlage erhalten"-Button schien keine Wirkung zu haben, obwohl die Cloud Function `subscribeToNewsletter` nach der Typkorrektur erfolgreich deployed wurde.

**Ziel:** Die Newsletter-Anmeldung soll zuverlässig funktionieren, die E-Mail in der Firestore-Collection `newsletter_subscriptions` speichern und dem Nutzer im Frontend eine Erfolgs- oder Fehlermeldung anzeigen.

**Schritte:**

1.  **[X] Frontend Debugging (Browser-Konsole prüfen):**
    *   Fehler (500) wurde im Browser angezeigt.
    *   Problem lag im Backend (Firestore Rules wurden nicht geladen).

2.  **[X] Frontend Code Analyse (`ThematicLandingPage.tsx`):**
    *   Der Frontend-Aufruf der Funktion war korrekt.

3.  **[X] Backend Debugging (Cloud Function Logs - falls nötig):**
    *   Emulator-Logs zeigten "Error compiling rules: Rules content empty".

4.  **[X] Fehlerbehebung:**
    *   Emulator wurde neu gestartet, um die aktualisierten `firestore.rules` zu laden. Anmeldung funktioniert nun.

5.  **[ ] Testing:**
    *   Teste den gesamten Ablauf erneut:
        *   Gültige E-Mail eingeben -> Erfolgsmeldung + Firestore-Eintrag?
        *   Ungültige E-Mail eingeben -> Fehlermeldung im Frontend?
        *   Netzwerkfehler simulieren (falls möglich) -> Korrekte Fehlermeldung?

6.  **[ ] Aufräumen:**
    *   Entferne die hinzugefügten `console.log`-Debugging-Zeilen aus `ThematicLandingPage.tsx`. 