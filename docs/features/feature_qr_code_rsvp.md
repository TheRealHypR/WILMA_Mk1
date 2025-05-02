# Feature Planung: QR-Code RSVP für Gäste

## 1. Zielsetzung

Gästen soll eine moderne und einfache Möglichkeit geboten werden, über einen QR-Code (z.B. auf der physischen Einladung) auf eine personalisierte Webseite zuzugreifen. Dort können sie:

*   Wichtige Hochzeitsdetails einsehen (Datum, Ort, Zeitplan etc.).
*   Ihre Teilnahme bestätigen oder absagen (RSVP).
*   Präferenzen angeben (z.B. Essenswahl, Songwünsche).

Dies soll **ohne** einen Benutzer-Login für den Gast möglich sein.

## 2. Kernkonzept & Technischer Ansatz

Die Identifizierung des Gastes erfolgt über ein eindeutiges, geheimes Token, das im QR-Code kodiert ist.

*   **Token:** Ein langes, zufälliges `rsvpToken` wird für jeden Gast (oder jede Einladung/Gästegruppe) generiert und sicher im `Guest`-Dokument in Firestore gespeichert.
*   **QR-Code URL:** Der QR-Code verweist auf eine spezifische Route, z.B. `https://deine-app.web.app/rsvp/{rsvpToken}`.
*   **Datenzugriff & Sicherheit:** Um unbefugten Zugriff zu verhindern und die Firestore-Regeln einfach zu halten, werden für den Datenabruf und das Speichern der Antwort **Cloud Functions (HTTP Callable)** empfohlen.
    *   `getGuestRsvpData`: Frontend ruft diese CF mit dem Token auf. CF validiert Token, holt Gast- und Hochzeitsdaten und gibt sie zurück.
    *   `submitGuestRsvp`: Frontend ruft diese CF mit dem Token und den Formulardaten auf. CF validiert Token & Daten und schreibt sicher in Firestore.
*   **Frontend:** Eine neue öffentliche Seite (`GuestRsvpPage.tsx`) unter einer neuen Route (`/rsvp/:token`) verarbeitet die Logik, ruft die Cloud Functions auf und zeigt die UI an.

## 3. Detaillierte TODO-Liste

Siehe [TODO_Deployment.md](./TODO_Deployment.md) unter "Post-Launch / Future Features" für die detaillierten Schritte:

*   Datenmodell erweitern (`rsvpToken`).
*   Cloud Functions erstellen (`generateRsvpToken`, `getGuestRsvpData`, `submitGuestRsvp`).
*   Frontend-Route und Seite (`/rsvp/:token`, `GuestRsvpPage.tsx`) implementieren.
*   UI für Detailanzeige und Formulare gestalten.
*   QR-Code-Generierungsmechanismus definieren.
*   Testing.

## 4. Offene Fragen / Entscheidungen

*   Soll das Token pro Gast oder pro Gästegruppe/Einladung gelten?
*   Wie genau sollen QR-Codes generiert und verteilt werden?
*   Welche spezifischen Präferenzen sollen abgefragt werden?
*   Wie wird die effiziente Suche nach dem `rsvpToken` in Firestore implementiert (Security Rules vs. Cloud Function vs. separate Kollektion)? (Aktuelle Empfehlung: Suche in Cloud Function) 