# To-Do Liste: CRM-Implementierung (Stand 21.04.2025 / Update 24.04.2025)

**Ziel:** Eingehende Leads aus dem Location-Request-Formular systematisch erfassen, verwalten und in einem Admin-Panel bearbeiten.

**1. Entscheidung Backend**
   - [X] Finale Entscheidung getroffen: **Firebase Firestore** als Backend für die Lead-Datenbank.

**2. n8n-Workflow anpassen**
   - [ ] Neuen Node hinzufügen (Firestore oder Airtable).
   - [ ] Connection/Credentials in n8n-Secrets hinterlegen.
   - [ ] Mapping konfigurieren:
     - *Pflichtfelder:* `firstName`, `lastName`, `email`, `eventDate`, `source`.
     - *Optional:* `budget`, `guestCount`, `notes`, `createdAt`.
   - [ ] (Optional) Tags/Labels ergänzen (z. B. "Location Anfrage", "Newsletter").

**3. Fehlerbehandlung in n8n**
   - [ ] Definieren, was bei DB-Fehlern passieren soll (Retry, Fallback, Admin-Benachrichtigung).
   - [ ] Error-Flows implementieren:
     - On Error → Slack-Node → "Lead konnte nicht gespeichert werden."
     - On Success → E-Mail-Bestätigung an User.

**4. Frontend-Verbesserungen (Formular)**
   - [x] Webhook-URL in `.env` auslagern (`VITE_N8N_WEBHOOK_URL`).
   - [x] Snackbar/Toast statt `alert()` für Erfolg/Fehler.
   - [x] Ladezustand beim Abschicken (`isSubmitting` + Spinner).
   - [ ] Validierung: E-Mail, Datum, Pflichtfelder (im Frontend bereits teilweise umgesetzt, ggf. verfeinern).

**5. Datenmodell in Firestore finalisieren (falls Firestore gewählt)**
   - [ ] Collections definieren:
     - `users` (Admin/Sales)
     - `leads`
     - `leads/{leadId}/notes`
     - `statuses` (konfigurierbare Lead-Status)
     - `settings`
   - [ ] Felder für `leads/{leadId}`:
     - `firstName`, `lastName`, `email`, `phone`
     - `eventDate` (Timestamp), `budget` (Number)
     - `status` (String, Referenz auf `statuses` ID oder Name), `assignedTo` (userId)
     - `source` (String), `createdAt`, `updatedAt` (Timestamps)
   - [ ] Security Rules formulieren (siehe §7).

**6. Admin-Panel (React/Next.js) aufsetzen (falls Firestore gewählt)**
   - [ ] Projekt scaffolden (Next.js + TypeScript + Tailwind).
   - [ ] Firebase-Init in `lib/firebase.ts`.
   - [ ] Authentication mit Firebase Auth (Google + Email/Passwort).
   - [ ] Layout-Component: Header, Sidebar (Leads, Dashboard, Users, Settings).

   **6.1 Lead-Übersicht**
      - [ ] `pages/admin/leads/index.tsx` → Tabelle mit:
        - Filter by Status, Datum, `assignedTo`
        - Suche (Name, E-Mail)
        - Pagination / Infinite Scroll

   **6.2 Lead-Detail**
      - [ ] `pages/admin/leads/[id].tsx` → Formular zum Editieren aller Felder
      - [ ] Notes-Subcollection anzeigen & hinzufügen (`pages/admin/leads/[id]/notes`).
      - [ ] Status-Dropdown (mit Farben aus `statuses`-Collection).

   **6.3 User- und Status-Management**
      - [ ] CRUD für `users` (Rollen: Admin, Sales).
      - [ ] CRUD für `statuses` (Name, Farbe, Reihenfolge).

**7. Security & Berechtigungen (falls Firestore gewählt)**
   - [ ] Firestore Security Rules:
     - Nur authentifizierte User dürfen lesen/schreiben.
     - Sales-User: nur eigene Leads (über `assignedTo`).
     - Admin-User: Vollzugriff.
   - [ ] Role-Based Access Control im Admin-UI implementieren.

**8. Benachrichtigungen & Automatisierungen**
   - [ ] Slack-Notifikation bei neuem Lead (n8n Slack-Node).
   - [ ] E-Mail an Sales-Team mit Lead-Kurzübersicht.
   - [ ] Cron-Job (n8n) für tägliche Lead-Übersicht an Admin.

**9. Testing & Qualitätssicherung**
   - [ ] Unit-Tests für n8n-Workflows (Mock-Webhook → DB-Write).
   - [ ] Integrationstests im Admin-Panel (Jest + React Testing Library).
   - [ ] E-2-E Test: Formular → Lead erscheint im Panel.

**10. Deployment & Monitoring**
    - [ ] Next.js auf Vercel / Netlify deployen (Environment-Variablen setzen).
    - [ ] n8n-Instance (Self-Hosted oder n8n.cloud) live schalten.
    - [ ] Monitoring & Alerts: Sentry oder Firebase Crashlytics.

**11. Dokumentation & Rollout**
    - [ ] Tech-Docs: n8n-Workflow, Firestore-Modelle, Admin-Setup.
    - [ ] Onboarding-Guide für Sales: "Wie bearbeite ich Leads?"
    - [ ] Change-Log pflegen (git + Release Notes).

**Priorität:**
- **High:** Punkt 1–5, 7
- **Medium:** Punkt 6, 8
- **Low:** Punkt 9–11 