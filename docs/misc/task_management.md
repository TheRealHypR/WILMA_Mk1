## Dokumentation: Aufgabenverwaltung (Task Management)

Dieses Modul ermöglicht es Benutzern, persönliche Aufgaben innerhalb der WILMA-Anwendung zu verwalten.

### 1. Datenspeicherung (Firestore)

*   **Datenpfad:** Aufgaben werden für jeden Benutzer individuell in einer Subkollektion unter `/users/{userId}/tasks/{taskId}` in Firestore gespeichert.
*   **Datenmodell pro Aufgabe (`Task`):**
    *   `id` (string): Die automatisch generierte Firestore Dokumenten-ID (wird im Frontend hinzugefügt).
    *   `title` (string): Der Name oder die Beschreibung der Aufgabe. *Pflichtfeld*.
    *   `status` (string): Der aktuelle Status der Aufgabe, entweder `'open'` oder `'done'`. *Standard: 'open'*.
    *   `createdAt` (Timestamp): Firestore Server-Zeitstempel, wann die Aufgabe erstellt wurde. Wird automatisch gesetzt.
    *   `dueDate` (Timestamp | null): Optionales Fälligkeitsdatum für die Aufgabe. Kann `null` sein, wenn kein Datum gesetzt ist.

### 2. Sicherheitsregeln (`firestore.rules`)

Die Regeln für die `/users/{userId}/tasks/{taskId}`-Kollektion stellen sicher, dass:
*   Nur der **authentifizierte Benutzer** (`request.auth.uid == userId`), dem die Aufgaben gehören, seine eigenen Aufgaben lesen (`read`) und löschen (`delete`) kann.
*   Ein Benutzer nur Aufgaben für sich selbst **erstellen** (`create`) kann. Dabei wird validiert, dass:
    *   Ein `title` (nicht-leerer String) vorhanden ist.
    *   Der `status` initial auf `'open'` gesetzt wird.
    *   Ein korrekter `createdAt` Server-Zeitstempel gesetzt wird.
*   Ein Benutzer nur seine eigenen Aufgaben **aktualisieren** (`update`) kann. Dabei wird über `request.resource.data.diff(resource.data).affectedKeys().hasOnly([...])` sichergestellt, dass **nur** die Felder `title`, `status` oder `dueDate` geändert werden. Die neuen Werte werden ebenfalls validiert (Titel nicht leer, Status ist 'open' oder 'done', dueDate ist Timestamp oder null). Änderungen an `createdAt` sind nicht erlaubt.

### 3. Frontend Implementierung (`frontend/src/`)

Die Implementierung im Frontend (React mit TypeScript und Material UI) gliedert sich wie folgt:

*   **Kontext (`contexts/AuthContext.tsx`):** Stellt die Informationen des aktuell angemeldeten Benutzers (insbesondere `currentUser.uid`) bereit, die für alle Aufgabenoperationen benötigt werden.
*   **Modell (`models/task.model.ts`):** Definiert das `Task`-Interface entsprechend dem Firestore-Datenmodell (inklusive der `id`).
*   **Service (`services/task.service.ts`):**
    *   Enthält asynchrone Funktionen (`getTasks`, `addTask`, `updateTask`, `deleteTask`) zur Interaktion mit der Firestore-Datenbank für die Aufgaben.
    *   Diese Funktionen nehmen die `userId` als Parameter entgegen und kapseln die Firestore SDK-Aufrufe.
    *   Kümmert sich um die Konvertierung zwischen `Date`-Objekten (aus UI-Komponenten) und Firestore `Timestamp`-Objekten.
*   **Hauptkomponente (`components/TaskList.tsx`):**
    *   Verwendet `useAuth`, um die `userId` zu erhalten.
    *   Ruft `getTasks` auf, um die Aufgaben zu laden und im State (`tasks`) zu speichern.
    *   Verwaltet Lade- und Fehlerzustände.
    *   **Filterung & Sortierung:**
        *   Implementiert States und UI-Elemente (Checkbox, zwei `Select`-Dropdowns) für:
            *   Ausblenden erledigter Aufgaben (`hideCompleted`).
            *   Filtern nach Fälligkeit (`dueDateFilter`: 'all', 'today', 'this_week').
            *   Sortieren der Liste (`sortOrder`: 'createdAt_desc', 'dueDate_asc', 'title_asc').
        *   Verwendet `useMemo`, um die `filteredAndSortedTasks`-Liste effizient basierend auf den Filter- und Sortier-States zu berechnen.
    *   **Aufgabe hinzufügen:**
        *   Zeigt einen "Neue Aufgabe"-Button an.
        *   Rendert die `AddTaskForm`-Komponente nur bei Bedarf (wenn der Button geklickt wird).
        *   Übergibt Callbacks (`handleTaskAdded`, `handleCancelAddTask`) an das Formular.
    *   Rendert die `filteredAndSortedTasks`-Liste mithilfe der `TaskItem`-Komponente.
*   **Formular zum Hinzufügen (`components/AddTaskForm.tsx`):**
    *   Ermöglicht die Eingabe eines Titels (`TextField`).
    *   Ermöglicht die Auswahl eines optionalen Fälligkeitsdatums über ein **natives HTML `<input type="date">` Feld** (integriert in ein `TextField`).
    *   Ruft beim Absenden die `addTask`-Servicefunktion auf.
    *   Bietet einen "Abbrechen"-Button (ruft `onCancel` auf).
    *   Zeigt Lade- und Fehlerzustände an.
*   **Aufgaben-Item (`components/TaskItem.tsx`):**
    *   Stellt eine einzelne Aufgabe dar.
    *   Zeigt Titel und, falls vorhanden, das Fälligkeitsdatum (formatiert als `Chip` mit Icon) an.
    *   Enthält eine Checkbox, um den `status` über `onUpdate` zu ändern.
    *   **Bearbeitungsmodus:**
        *   Wird über einen Edit-Button (Stift-Icon) aktiviert.
        *   Zeigt `TextField`-Elemente für Titel und Fälligkeitsdatum (nativ `type="date"`).
        *   Bietet Speichern- (Diskette) und Abbrechen-Buttons (Kreuz).
        *   Ruft bei Änderungen die `onUpdate`-Funktion auf.
    *   Enthält einen Löschen-Button (Mülleimer-Icon), der `onDelete` aufruft.
    *   Zeigt einen dezenten Ladeindikator (Opacity) während Update-/Delete-Operationen.
    *   Icons für Bearbeiten/Löschen sind unterhalb des Titels/Datums angeordnet.
*   **Integration (`pages/DashboardPage.tsx`):** Die `TaskList`-Komponente wird auf der Dashboard-Seite eingebunden und angezeigt. 