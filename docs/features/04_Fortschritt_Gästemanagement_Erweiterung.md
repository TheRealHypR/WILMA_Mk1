# Fortschrittsbericht: Erweiterung des Gästemanagements

Datum: 2024-07-26

## Übersicht

Dieser Bericht dokumentiert die wesentlichen Erweiterungen und Verbesserungen, die seit dem letzten Update am Modul für das manuelle Gästemanagement vorgenommen wurden. Der Fokus lag auf der Anreicherung des Datenmodells, der Verbesserung der Benutzerfreundlichkeit durch Filter- und Sortieroptionen sowie der visuellen Aufwertung der Gästeliste.

## Implementierte Erweiterungen

1.  **Erweitertes Datenmodell (`models/guest.model.ts`)**:
    *   Hinzufügung neuer Felder zum `Guest`-Interface: `phoneNumber`, `address` (Objekt mit `street`, `city`, `postalCode`, `country`), `relationship`, `group` (ersetzt `guestGroup`), `plusOne` (ersetzt `plusOneAllowed`), `plusOneName`, `isChild`, `childAge`, `dietaryRestrictions` (als `string[]`), `notes`.
    *   Felder wurden teilweise als optional markiert, um Flexibilität bei der Dateneingabe zu gewährleisten.

2.  **Angepasstes Hinzufügen-Formular (`AddGuestForm.tsx`)**:
    *   Integration von Eingabefeldern für alle neuen Gast-Attribute.
    *   Implementierung von Frontend-Validierung:
        *   Telefonnummern müssen mit `+` beginnen (E.164-Format-Hinweis).
        *   Sicherstellung, dass `dietaryRestrictions` als leeres Array (`[]`) an Firestore gesendet wird, wenn das Feld leer ist (verhindert `undefined`-Fehler).
    *   Fehlermeldungen für ungültige Eingaben werden dem Benutzer angezeigt.

3.  **Verbesserte Gästelistenanzeige (`GuestList.tsx`)**:
    *   **Filterfunktion**: Hinzufügung eines Dropdown-Menüs, um Gäste nach ihrem Status (`to-invite`, `invited`, `confirmed`, etc.) zu filtern.
    *   **Sortierfunktion**: Implementierung eines Dropdown-Menüs zum Sortieren der Gästeliste nach Vorname (A-Z), Nachname (A-Z), Status oder letzter Änderung (absteigend).
    *   Die Liste wird dynamisch basierend auf den ausgewählten Filter- und Sortierkriterien aktualisiert (`useMemo`-Hook).

4.  **Überarbeitetes Gast-Element (`GuestItem.tsx`)**:
    *   **Ansichtsmodus**:
        *   Anzeige aller neuen Felder (Telefon, Adresse (teilweise), Beziehung, Gruppe, +1-Status, Kind-Status, Diät).
        *   Visuelle Hervorhebung des Gaststatus durch farbige **Chips** in Pastelltönen für bessere Übersichtlichkeit. Der alte Chip neben dem Namen wurde entfernt.
    *   **Bearbeitungsmodus**:
        *   Alle neuen Felder können nun bearbeitet werden.
        *   Die Logik zum Speichern (`handleSaveClick`) wurde angepasst, um nur geänderte Felder an die `onUpdate`-Funktion zu übergeben und die korrekten Feldnamen (`plusOne`, `group`, `postalCode`) zu verwenden.
        *   Sicherstellung der korrekten Handhabung von Datentypen (insbesondere `dietaryRestrictions` als Array).

5.  **Aktualisierte Firestore-Regeln (`firestore.rules`)**:
    *   Die Sicherheitsregeln für die `guests`-Collection wurden angepasst, um die neuen Felder und deren Datentypen (z.B. `address` als Objekt, `dietaryRestrictions` als Liste/Array) zu validieren und Schreib-/Lesezugriffe entsprechend zu regeln.

## Nächste Schritte (Vorschläge)

*   Implementierung der verbleibenden Datenmodelle (`GuestGroup`, `Table`, `GuestStats`).
*   Beginn mit dem nächsten Hauptabschnitt des Projektplans (z.B. Budget-Tracking oder Chat-Interface). 