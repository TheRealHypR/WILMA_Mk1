Product Requirements Document (PRD)

Version: 0.1
Date: 2025-04-23
Author: [Dein Name]

1. Einleitung / Ziele

Zweck des Dokuments: Dieses PRD beschreibt die Anforderungen und den Umsetzungsplan für zwei zentrale Erweiterungen von Wilma:

Ein schlankes Lead-CRM zur Erfassung und Konversion von Formular-Leads zu Nutzern („WilmaUser“).

Ein Freemium-/Premium-Modell mit technischer Architektur, Zahlungsintegration und Feature-Highlights.

Zielgruppe: Produktmanager, Entwickler, Designer, Marketing

Erfolgskriterien:

*   MVP-Lead-CRM in Produktion: >90% aller Formular-Leads werden automatisiert in Firestore gespeichert und im Team-Workflow benachrichtigt.
*   First Premium-Kunden nach Launch: Mindestens 5 zahlende Abos binnen 30 Tagen.
*   Stabiler Zahlungsablauf: <1% Fehlbuchungen oder fehlgeschlagene Webhook-Events.

2. Lead-CRM (MVP)

2.1 Kontext & Ziel

*   Leads aus dem Location-Request-Formular automatisch erfassen.
*   Leads durch das Team manuell zu echten Wilma-Usern konvertieren.

2.2 MVP-Ansatz (schlank)

*   Input: Location-Request-Formular sendet Daten an n8n-Workflow.
*   Persistenz: n8n legt neuen Eintrag in Firestore-Collection leads an mit Feldern:
    *   name (String)
    *   email (String)
    *   eventDate (Timestamp)
    *   notes (String)
    *   createdAt (Timestamp, automatisch)
    *   status (Enum: new, contacted, converted, rejected)
*   Benachrichtigung: n8n versendet automatisierte Alerts an Slack-Channel oder E-Mail-Distribution des Teams.
*   Konversion: Team prüft Neu-Lead → legt manuell User im Wilma-System an → ändert status in Firestore.

2.3 Anforderungen

*   Funktional:
    *   Formular-Webhook in n8n konfigurieren.
    *   Firestore-Zugriff (schreibend) mit Service-Account.
    *   Slack/E-Mail-Benachrichtigung mit Lead-Details.
    *   Firestore Security Rules für leads (Schreibzugriff nur durch n8n-Service-Account, Lesezugriff nur durch Team-Roles).
*   Nicht-funktional:
    *   Verfügbarkeit: 99,5% (Firestore + n8n).
    *   Performance: <200 ms pro Write-Operation.

2.4 Metriken

*   Anzahl Leads / Woche
*   Zeit bis erste Bearbeitung (Statuswechsel)
*   Konversionsrate (Leads → Registrierungen)

2.5 Phase 2 (Admin-Panel)

*   Vollwertiges CRM-Admin-Interface (Lead-Filterung, Status-Updates, Notizen, Zuordnung, Bulk-Operationen).
*   Rollen & Rechte (Admin, Sales).
*   Erweiterte Reporting-Dashboards.

3. Premium-Modell (Freemium)

3.1 Kontext & Ziel

*   Monetarisierung: Einführung kostenpflichtiger Premium-Funktionen neben kostenlosem Basisangebot.

3.2 Architektur & Datenmodell

*   Firestore Users Collection users/{userId}:
    ```json
    {
      "plan": "free" | "premium",
      "subscriptionStatus": "active" | "inactive" | "trialing" | "past_due",
      "subscriptionEndDate": <Timestamp>,
      "updatedAt": <Timestamp>
    }
    ```
*   Auth / Custom Claims (optional): Setze Claim premium: true im Auth-Token beim Abo-Update.

3.3 Zahlungsintegration (Stripe)

*   Stripe-Account und Produkte/Preise konfigurieren.
*   Frontend:
    *   Stripe Elements oder Checkout-Session-Button für Auswahl & Bezahlung.
*   Backend (Cloud Functions):
    *   `createCheckoutSession(userId, priceId)` → Session zurückgeben.
    *   Webhook-Endpunkt:
        *   `checkout.session.completed` → setze `subscriptionStatus: active`, `plan: premium`, `subscriptionEndDate`.
        *   `invoice.payment_succeeded` → erneuern.
        *   `customer.subscription.deleted` → setze `subscriptionStatus: inactive`.
    *   Firebase Stripe Extension als Abkürzung („Run Payments with Stripe").

3.4 Zugriffskontrolle

*   Frontend-Logik: Ausblenden/Einblenden von Premium-Features nach `plan`.
*   Security Rules:
    ```javascript
    function isPremium() {
      return get(/databases/$(database)/documents/users/$(request.auth.uid)).data.plan == 'premium';
    }

    match /premiumFeatures/{doc} {
      allow read: if request.auth.uid != null && isPremium();
    }
    ```
*   Cloud Functions prüfen `plan` vor Ausführung kritischer Aktionen.

3.5 Metriken

*   Anzahl aktiver Premium-Abos.
*   MRR (Monthly Recurring Revenue).
*   Churn-Rate.

4. Premium-Features (Ideen)

| Modul             | Free                           | Premium                                                                      |
| :---------------- | :----------------------------- | :--------------------------------------------------------------------------- |
| Checkliste        | Standard-Items abhaken         | Eigene Tasks anlegen/editieren, Vorlagen speichern/teilen, Kollaboration     |
| Gästeverwaltung   | Limitierte Gäste, Basisdaten   | Unbegrenzte Gäste, Gruppen/Tischpläne, Import/Export, Sitzplan-Tool          |
| Budgetplaner      | Einfache Kosten-Übersicht      | Detaillierte Kategorien, Berichte, Fristen-Tracking, mehrere Budgets         |
| Aufgaben          | Basisliste                     | Zuweisung, Deadlines mit Erinnerungen, Unteraufgaben                         |
| Wilma AI Chat     | Standard-Antworten, kurze Historie | Smart AI-Insights, lange Historie, Integration mit Modulen (z.B. Gästeliste) |
| Allgemein         | Werbung im UI                  | Werbefrei, Priority Support, Exklusive Vorlagen/Artikel, Partner-Account-Sharing |

5. Roadmap & Nächste Schritte

| Phase    | Zeitraum            | Meilenstein                                |
| :------- | :------------------ | :----------------------------------------- |
| MVP      | Q2 2025            | Lead-CRM MVP live, erste 50 Leads          |
| Beta     | Q3 2025            | Premium-Integration mit Stripe, erste Beta-Abos |
| Phase 2 | Q4 2025 – Q1 2026 | Vollwertiges Admin-Panel, erweiterte Reporting/Dashboards |

Annahmen & Abhängigkeiten

*   Firestore als primäres Backend für Leads und User-Daten.
*   n8n-Hosting und -Wartung gesichert.
*   Stripe-Account und nötige Webhook-URLs konfiguriert.

Glossar

*   CRM: Customer Relationship Management.
*   MRR: Monthly Recurring Revenue.
*   MVP: Minimum Viable Product.

Ende des Dokuments. 