# To-Do Liste: Personalisierte Checkliste (MVP für 18.04.2025)

**Gesamtziel:** Eine neue Seite im eingeloggten Bereich erstellen, die die Standard-Checkliste als Vorlage verwendet, aber dem Nutzer erlaubt, Aufgaben als erledigt zu markieren (persistent gespeichert), eigene Aufgaben hinzuzufügen und bestehende Aufgaben zu löschen.

**Voraussetzungen:** Nutzer ist eingeloggt.

**Phase 1: Setup & Grundstruktur (React Frontend)**

1.  **Neue Seitenkomponente erstellen:**
    *   Erstelle die Datei: `frontend/src/pages/UserChecklistPage.tsx`.
    *   Implementiere eine Grundstruktur mit Titel (z. B. "Meine persönliche Checkliste") und Platz für die Abschnitte.
2.  **Routing einrichten:**
    *   Importiere `UserChecklistPage` in `frontend/src/App.tsx`.
    *   Füge eine neue Route *innerhalb* des geschützten `AppLayout`-Blocks hinzu, z. B. `<Route path="/meine-checkliste" element={<UserChecklistPage />} />`.
3.  **Navigation hinzufügen:**
    *   Füge einen Link zur neuen Seite `/meine-checkliste` in der Navigation des `AppLayout` (`frontend/src/components/common/AppLayout.tsx`) hinzu (neben Dashboard, Profil etc.).

**Phase 2: Firestore Setup & Datenmodell**

4.  **Firestore Collection definieren:**
    *   Lege fest, dass die Daten in einer Top-Level-Collection namens `userChecklists` gespeichert werden.
    *   Jedes Dokument in dieser Collection hat die `userId` des Benutzers als Dokument-ID.
5.  **Datenstruktur pro Nutzer festlegen:**
    *   Das Dokument `userChecklists/{userId}` sollte ein Objekt enthalten, z. B. mit einem Feld `sections`, das ein Array ist.
    *   Jedes Element im `sections`-Array repräsentiert einen Zeitabschnitt und enthält:
        *   `timeframe`: (String) Der Name des Zeitfensters (z. B. "18-12 Monate...").
        *   `tasks`: (Array) Eine Liste von Aufgaben-Objekten.
    *   Jedes Aufgaben-Objekt im `tasks`-Array enthält:
        *   `id`: (String) Eine eindeutige ID für diese Aufgabe (z. B. generiert mit `uuid` oder einer einfachen Timestamp-Kombination beim Erstellen).
        *   `text`: (String) Der Text der Aufgabe.
        *   `isChecked`: (Boolean) Ob die Aufgabe erledigt ist.
6.  **[X] Firestore Security Rules (Grundlagen):**
    *   Regeln für die `userChecklists`-Collection wurden in `firestore.rules` hinzugefügt (Entwurf).
    *   Regel 1: Nur eingeloggte Nutzer dürfen ihr eigenes Dokument lesen (`allow read: if request.auth.uid == userId;`).
    *   Regel 2: Nur eingeloggte Nutzer dürfen ihr eigenes Dokument schreiben/aktualisieren/löschen (`allow write: if request.auth.uid == userId;`).

**Phase 3: Daten laden & Initialisierung (React Frontend)**

7.  **Daten aus Firestore laden:**
    *   In `UserChecklistPage.tsx`: Importiere `useAuth`, `getFirestore`, `doc`, `getDoc`.
    *   Verwende einen `useEffect`-Hook, der ausgeführt wird, wenn `currentUser` verfügbar ist.
    *   Innerhalb des `useEffect`:
        *   Hole die `userId` aus `currentUser`.
        *   Erstelle eine Referenz zum Dokument: `doc(db, 'userChecklists', userId)`.
        *   Versuche, das Dokument mit `getDoc` zu lesen.
8.  **Initialisierung bei erstem Besuch:**
    *   Innerhalb des `useEffect` (nach `getDoc`):
        *   **Wenn** das Dokument *nicht existiert* (`!docSnap.exists()`):
            *   Importiere die Standard-Checklisten-Daten (aus `ChecklistPage.tsx` oder einer separaten Datei).
            *   Formatiere diese Daten in die neue Struktur (mit IDs und `isChecked: false` für jede Aufgabe).
            *   Schreibe diese initialen Daten mit `setDoc` nach `userChecklists/{userId}`.
            *   Setze den lokalen State (`useState`) mit diesen initialen Daten.
        *   **Wenn** das Dokument *existiert*:
            *   Lese die Daten (`docSnap.data()`) aus Firestore.
            *   Setze den lokalen State (`useState`) mit den geladenen Daten.
9.  **Lokalen State definieren:**
    *   Verwende `useState` in `UserChecklistPage.tsx`, um die geladene/initialisierte Checklistenstruktur (das `sections`-Array) zu speichern.
    *   Füge einen Ladezustand hinzu (`useState<boolean>(true)`), um anzuzeigen, während die Daten aus Firestore geladen werden.

**Phase 4: Checkliste anzeigen & Interaktivität (React Frontend)**

10. **Checkliste rendern:**
    *   Iteriere über den lokalen State (`sections`-Array).
    *   Für jede Sektion: Zeige den `timeframe` als Überschrift an.
    *   Iteriere über das `tasks`-Array der Sektion.
    *   Für jede Aufgabe:
        *   Rendere eine "Task-Box" (z. B. `Paper`, `Card` oder gestylte `Box`).
        *   Zeige eine `Checkbox` (Material UI) an. Der `checked`-Status der Checkbox basiert auf `task.isChecked` aus dem State.
        *   Zeige den `task.text` an.
        *   **(Wichtig für Phase 5):** Füge einen Platzhalter für einen Löschen-Button hinzu.
    *   **(Wichtig für Phase 5):** Füge einen Platzhalter für einen "Aufgabe hinzufügen"-Button am Ende jeder Sektion hinzu.
11. **Abhaken implementieren:**
    *   Importiere `updateDoc` und `doc`.
    *   Erstelle eine `handleToggleCheck`-Funktion (ähnlich wie in `ChecklistPage`, aber mit `taskId` und `sectionIndex`).
    *   Bei Klick auf eine Checkbox:
        *   Finde die Aufgabe im lokalen State und ändere ihren `isChecked`-Wert.
        *   Aktualisiere den lokalen State, um die UI sofort zu aktualisieren.
        *   Finde den *aktuellen gesamten* `sections`-Array-Zustand.
        *   Schreibe das *komplette, geänderte* `sections`-Array mit `updateDoc` zurück nach `userChecklists/{userId}`. (Das ist einfacher als einzelne Felder in verschachtelten Arrays zu patchen).

**Phase 5: Aufgaben hinzufügen & löschen (React Frontend)**

12. **Aufgabe löschen:**
    *   Ersetze den Platzhalter durch einen `IconButton` mit einem Löschen-Icon (z. B. `DeleteIcon`) in jeder Task-Box.
    *   Erstelle eine `handleDeleteTask`-Funktion (benötigt `sectionIndex`, `taskId`).
    *   Bei Klick auf den Löschen-Button:
        *   (Optional: Bestätigungsdialog anzeigen).
        *   Filtere die zu löschende Aufgabe aus dem lokalen State (`sections`-Array).
        *   Aktualisiere den lokalen State.
        *   Schreibe das *komplette, geänderte* `sections`-Array mit `updateDoc` zurück nach `userChecklists/{userId}`.
13. **Aufgabe hinzufügen:**
    *   Ersetze den Platzhalter durch einen "Hinzufügen"-Button am Ende jeder Sektions-Taskliste.
    *   Bei Klick auf "Hinzufügen":
        *   Öffne ein einfaches Eingabefeld oder einen kleinen Dialog, um den neuen Aufgabentext einzugeben.
        *   Nach Bestätigung:
            *   Generiere eine neue, eindeutige `id` (z. B. mit `uuid` – muss ggf. installiert werden – oder einfacher Timestamp + Zufallszahl).
            *   Erstelle das neue Task-Objekt: `{ id: newId, text: inputText, isChecked: false }`.
            *   Füge das neue Objekt zum `tasks`-Array der entsprechenden Sektion im lokalen State hinzu.
            *   Aktualisiere den lokalen State.
            *   Schreibe das *komplette, geänderte* `sections`-Array mit `updateDoc` zurück nach `userChecklists/{userId}`.

**Phase 6: UI/UX Refinements (Optional für MVP)**

14. **Visuelles Styling:** Style die "Task-Boxen" ansprechend.
15. **Ladeanzeige:** Zeige einen Spinner oder Skeleton an, während die Daten initial aus Firestore geladen werden.
16. **Feedback:** Gib visuelles Feedback bei Firestore-Schreibvorgängen (z. B. kurzes Deaktivieren des Buttons, Erfolgs-/Fehlermeldung). 