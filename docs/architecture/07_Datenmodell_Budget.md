# Datenmodell: Budgettracking

Dieses Dokument beschreibt das Firestore-Datenmodell für das manuelle Budgettracking in WILMA Mk1 (Phase 1 - MVP).

## Übersicht

Die Budgetdaten bestehen aus einzelnen Posten (Ausgaben oder geplante Kosten), die in einer Subcollection unter dem jeweiligen Benutzer gespeichert werden. Optional kann ein separates Dokument zur Speicherung von zusammengefassten Werten verwendet werden.

## Collections & Dokumente

### 1. `budgetItems` (Subcollection von `users`)

Diese Subcollection enthält die einzelnen Budgetposten für einen spezifischen Nutzer.

-   **Pfad:** `/users/{userId}/budgetItems/{itemId}`
-   **Dokument-ID (`itemId`):** Automatisch von Firestore generierte, eindeutige ID für jeden Budgetposten.
-   **Felder:**
    -   `description` (string, erforderlich): Beschreibung des Postens (z.B. "Miete Location", "DJ Anzahlung").
    -   `category` (string, optional): Kategorie zur Gruppierung (z.B. "Location", "Musik", "Deko", "Kleidung", "Dienstleister", "Sonstiges"). Könnte im Frontend als Dropdown implementiert werden.
    -   `estimatedCost` (number, erforderlich): Die geschätzten/geplanten Kosten für diesen Posten.
    -   `actualCost` (number, optional): Die tatsächlich angefallenen Kosten. Wird gesetzt, sobald bekannt oder bezahlt.
    -   `status` (string, erforderlich): Der aktuelle Status des Postens. Mögliche Werte:
        -   `'planned'`: Posten ist geplant, aber noch nicht gebucht/bezahlt.
        -   `'booked'`: Dienstleistung/Produkt ist gebucht/bestellt, aber noch nicht (vollständig) bezahlt.
        -   `'partially-paid'`: Eine Anzahlung wurde geleistet.
        -   `'paid'`: Der Posten wurde vollständig bezahlt.
    -   `createdAt` (timestamp, erforderlich): Zeitpunkt der Erstellung des Eintrags (Firestore Server-Timestamp).
    -   `paidDate` (timestamp, optional): Datum, an dem der Posten (vollständig) bezahlt wurde.
    -   `dueDate` (timestamp, optional): Fälligkeitsdatum für eine Zahlung.
    -   `notes` (string, optional): Zusätzliche Notizen oder Details zum Posten.

### 2. `budgetSummary` (Subcollection von `users` - Optional für MVP)

Diese Subcollection könnte *ein einziges* Dokument enthalten, um berechnete Summen zu speichern. Für den manuellen MVP ist dies **optional**, da die Summen auch im Frontend berechnet werden können.

-   **Pfad:** `/users/{userId}/budgetSummary/summary`
-   **Dokument-ID:** Immer `summary` (oder ein anderer fester Name).
-   **Felder (Beispiele):**
    -   `totalEstimatedCost` (number): Summe aller `estimatedCost`.
    -   `totalActualCost` (number): Summe aller `actualCost`.
    -   `totalPaid` (number): Summe aller `actualCost` mit Status `'paid'`.
    -   `overallBudget` (number, optional): Das vom Nutzer gesetzte Gesamtbudget.
    -   `lastUpdated` (timestamp): Wann wurden die Summen zuletzt aktualisiert?

    *Hinweis: Das Aktualisieren dieses Dokuments würde idealerweise über Cloud Functions erfolgen, um Konsistenz zu gewährleisten. Im MVP ohne Functions müsste es entweder ignoriert oder manuell/im Frontend (mit potenziellen Inkonsistenzen) aktualisiert werden.* 

## Sicherheitsregeln (Grundkonzept)

-   Nutzer können nur ihre eigenen Budgeteinträge (`users/{userId}/budgetItems`) lesen, erstellen, aktualisieren und löschen.
-   Regeln sollten die Datentypen validieren (z.B. `estimatedCost` muss eine Zahl sein).
-   Falls das `budgetSummary`-Dokument verwendet wird, sollten Regeln dessen Aktualisierung steuern (im MVP evtl. nur Lesezugriff für den Nutzer erlauben, wenn es nicht zuverlässig aktualisiert werden kann).

--- 