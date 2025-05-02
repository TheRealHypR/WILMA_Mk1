# TODOs: n8n Chat-Agent Integration

## Firebase Function (`simulateAiResponse`) Anpassungen

-   [ ] `axios` installieren (`npm install axios` im `functions`-Ordner)
-   [ ] Logik zur KI-Antwort-Generierung entfernen.
-   [ ] Sicherer Speicherort für n8n Webhook URL & Secret festlegen (z.B. Secret Manager).
-   [ ] Daten aus Trigger extrahieren (`text`, `userId`, etc.).
-   [ ] HTTP POST Request an n8n Webhook URL senden (mit Daten und Secret/Auth).
-   [ ] Fehlerbehandlung für den HTTP Request hinzufügen.
-   [ ] Code testen (via Emulator).
-   [ ] Funktion deployen (`firebase deploy --only functions`).

## n8n Workflow Erstellung

-   [ ] Neuen Workflow in n8n anlegen.
-   [ ] Webhook Node hinzufügen (URL generieren und sicher in Firebase Function hinterlegen).
-   [ ] Firebase Credentials in n8n sicher hinterlegen.
-   [ ] KI Node konfigurieren (OpenAI/Gemini etc., mit API-Key aus n8n Credentials).
    -   [ ] Prompt definieren (Kontext sammeln?, Aktionserkennung instruieren).
-   [ ] Logik-Nodes (If/Switch) hinzufügen, um auf erkannte Aktionen zu prüfen.
-   [ ] Firebase Firestore Node hinzufügen, um Aktionen auszuführen (z.B. Task erstellen).
-   [ ] Firebase Firestore Node hinzufügen, um *textuelle* KI-Antwort in den Chat (`users/{userId}/messages`) zu schreiben.
-   [ ] Gesamten Workflow testen.

## Frontend (`ChatLayout.tsx` etc.)

-   [ ] (Voraussichtlich keine großen Änderungen nötig, da es auf Firestore-Updates lauscht).
-   [ ] Ggf. Lade-/Timeout-Indikator verbessern, falls n8n-Antwort länger dauert. 