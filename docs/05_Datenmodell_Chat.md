# Datenmodell: Chat

Dieses Dokument beschreibt das Firestore-Datenmodell für die Chat-Funktionalität in WILMA Mk1, basierend auf Phase 1 des MVP-Plans und der bestehenden Cloud Function `simulateAiResponse`.

## Übersicht

Die Chat-Nachrichten werden direkt in einer Subcollection unter dem jeweiligen Benutzerdokument gespeichert.

## Collection

### `messages` (Subcollection von `users`)

Diese Subcollection enthält die einzelnen Nachrichten innerhalb der Konversation eines spezifischen Nutzers.

-   **Pfad:** `/users/{userId}/messages/{messageId}`
-   **Dokument-ID (`messageId`):** Automatisch von Firestore generierte, eindeutige ID für jede Nachricht.
-   **Felder:**
    -   `senderId` (string): Identifiziert den Absender der Nachricht.
        -   Wert ist `'user'`, wenn der Nutzer sendet.
        -   Wert ist `'ai'`, wenn die simulierte AI antwortet (durch die `simulateAiResponse` Function).
    -   `text` (string): Der textuelle Inhalt der Nachricht.
    -   `timestamp` (timestamp): Der Zeitpunkt, an dem die Nachricht gesendet/gespeichert wurde (Firestore Server-Timestamp). Wird zur Sortierung der Nachrichten verwendet.

## Sicherheitsregeln (Grundkonzept)

-   Nutzer können nur Nachrichten in ihrer eigenen Subcollection (`users/{userId}/messages`) lesen und schreiben (mit `senderId: 'user'`).
-   Die Cloud Function (`simulateAiResponse`) benötigt Schreibrechte, um Nachrichten mit `senderId: 'ai'` in die jeweilige Subcollection des Nutzers hinzuzufügen.

---

*Hinweis: Dieses Modell basiert auf der bestehenden Struktur und ist für Phase 1 (MVP) ausgelegt.* 