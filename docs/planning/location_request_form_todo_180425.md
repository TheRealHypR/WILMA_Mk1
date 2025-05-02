# To-Do Liste: Interaktives Location Request Formular (Stand: Aktuell)

**Gesamtziel:** Ein mehrstufiges Formular auf einer neuen Seite erstellen, das Nutzerdaten und Location-Wünsche sammelt. Nach dem Absenden wird ein **n8n-Workflow** getriggert, der die Daten verarbeitet (Lead speichern, E-Mail senden, ggf. PDF generieren). Dient der Lead-Generierung.

**Phase 1: Frontend - Formular UI & State (Größtenteils erledigt)**

1.  **[x] Neue Seite/Komponente erstellen:**
    *   Seite `frontend/src/pages/LocationRequestPage.tsx` erstellt.
    *   Route `/location-anfrage` hinzugefügt (Annahme, bitte prüfen).
2.  **[x] Formular-Bibliothek auswählen & installieren:**
    *   `react-hook-form` installiert und verwendet.
3.  **[x] Validierungs-Bibliothek auswählen & installieren:**
    *   `yup` und `@hookform/resolvers` installiert und verwendet.
4.  **[x] Formularstruktur (3-Step-Wizard):**
    *   Logik für 3 Schritte implementiert.
    *   **Step 1 (Kontaktdaten & Event):** Felder implementiert.
    *   **Step 2 (Location-Details):** Felder implementiert.
    *   **Step 3 (Wünsche & Anfrage):** Felder implementiert (inkl. Multi-Select Checkboxes).
5.  **[x] Validierungsschema definieren:**
    *   `yup`-Schema für alle Schritte erstellt und integriert.
6.  **[x] UI/UX Details implementieren:**
    *   Fortschrittsanzeige (`Stepper`).
    *   GDPR-Checkbox.
    *   Lade-/Submit-Zustand für den Senden-Button.
    *   Fehleranzeige pro Feld.
    *   Snackbar für generelles Feedback (Erfolg/Fehler).
    *   [ ] (Optional) Newsletter-Opt-in hinzufügen.
    *   [ ] Mobil-Optimierung der Inputs prüfen/verbessern.

**Phase 2: Frontend - Logik & Backend-Anbindung (Angepasst an n8n)**

7.  **[x] Formular-Submit-Handler:**
    *   `onSubmit`-Funktion erstellt.
8.  **[x] n8n Webhook aufrufen:**
    *   URL aus `.env` geladen (`VITE_N8N_WEBHOOK_URL`).
    *   `fetch`-Aufruf mit `POST` und JSON-Body implementiert.
    *   Ladezustand (`isSubmitting`) wird berücksichtigt.
9.  **[x] Erfolgsfall (Frontend):**
    *   Snackbar "Vielen Dank" wird angezeigt.
    *   Formular wird zurückgesetzt.
    *   Benutzer wird zu Schritt 1 zurückgeleitet.
    *   [ ] (Offen aus Backend) Warten auf Bestätigung, dass E-Mail gesendet wurde (aktuell nur `response.ok` vom Webhook).
10. **[x] Fehlerfall (Frontend):**
    *   Snackbar zeigt Fehler (Status/Netzwerk) an.
    *   Ladezustand wird zurückgesetzt.

**Phase 3: Backend - n8n Workflow (Statt Cloud Function)**

11. **[ ] n8n Workflow erstellen/anpassen:**
    *   Webhook-Node (existiert: `fff781fb-a18e-4818-808a-940cd2ba4c88`).
    *   Daten-Validierung im Workflow (optional, zusätzlich zum Frontend).
12. **[ ] Lead-Speicherung (CRM):**
    *   **[X] Entscheidung:** Firebase Firestore wird verwendet.
    *   [ ] Entsprechenden Firestore-Node hinzufügen und konfigurieren (Credentials, Mapping).
    *   [ ] Fehlerbehandlung für DB-Speicherung implementieren.
13. **[ ] E-Mail-Versand konfigurieren:**
    *   E-Mail Node (z.B. SendGrid, SMTP) hinzufügen.
    *   Credentials in n8n hinterlegen.
    *   E-Mail-Inhalt definieren (an Nutzer, optional an Team).
14. **[ ] (Optional) PDF generieren:**
    *   Entscheiden, ob PDF benötigt wird.
    *   Wenn ja: Passenden Node oder Code-Node zur PDF-Generierung einfügen.
    *   PDF an E-Mail anhängen.
15. **[ ] Workflow-Abschluss & Antwort:**
    *   Sicherstellen, dass der Workflow korrekt auf den Webhook antwortet (z.B. mit `{ "success": true }`), auch wenn Hintergrund-Tasks laufen.

**Phase 4: Testing & Deployment (Angepasst)**

16. **[ ] Backend testen:** n8n-Workflow manuell oder mit Testdaten auslösen.
17. **[ ] Frontend testen:** Gesamten Formularablauf inkl. Erfolgs-/Fehler-Snackbar testen.
18. **[ ] Deployment:**
    *   Frontend (Vite/React) deployen (inkl. Env Vars).
    *   n8n-Workflow aktivieren/sicherstellen, dass er läuft.

**Nächste Schritte (Empfehlung):**

*   Fokus auf **Phase 3 (n8n Workflow)** legen, insbesondere Punkt 12 (Lead-Speicherung) basierend auf der CRM-Backend-Entscheidung.
*   Parallel dazu kann Punkt 6 (Newsletter, Mobil-Optimierung) im Frontend angegangen werden. 