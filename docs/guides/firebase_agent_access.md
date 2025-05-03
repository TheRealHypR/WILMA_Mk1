# Firebase Firestore-Zugriff für Agenten mittels Service Account

Dieses Dokument beschreibt, wie einem externen Agenten (z. B. einem Backend-Service, einer Cloud Function oder einem Skript) sicherer Schreibzugriff auf die Firebase Firestore-Datenbank gewährt werden kann.

## Methode: Service Account

Die empfohlene Methode ist die Verwendung eines Google Cloud Service Accounts. Dieser Account agiert im Namen des Agenten und kann spezifische Berechtigungen für Firebase-Dienste erhalten.

## Schritte

1.  **Service Account in Google Cloud Console erstellen:**
    *   Navigiere zur [Google Cloud Console](https://console.cloud.google.com/) für dein Firebase-Projekt.
    *   Gehe zu "IAM & Verwaltung" -> "Dienstkonten".
    *   Klicke auf "Dienstkonto erstellen".
    *   Vergib einen Namen (z. B. `budget-agent`) und eine optionale Beschreibung.
    *   **Rolle zuweisen:** Weise eine geeignete Rolle zu. Für das Hinzufügen von Daten zu Firestore ist die Rolle `Cloud Datastore-Nutzer` (`roles/datastore.user`) oft ausreichend. Granularere Firestore-Rollen sind ebenfalls verfügbar.
    *   Schließe die Erstellung ab.

2.  **Schlüssel generieren und sichern:**
    *   Finde das erstellte Dienstkonto in der Liste.
    *   Klicke auf die drei Punkte (Aktionen) -> "Schlüssel verwalten".
    *   Klicke auf "Schlüssel hinzufügen" -> "Neuen Schlüssel erstellen".
    *   Wähle "JSON" als Schlüsseltyp und klicke auf "Erstellen".
    *   Eine JSON-Datei wird heruntergeladen. **Behandle diese Datei wie ein Passwort!** Speichere sie sicher und teile sie nicht öffentlich (z. B. nicht in Git einchecken).

3.  **Agenten konfigurieren und implementieren:**
    *   **Firebase Admin SDK:** Der Agent benötigt das Firebase Admin SDK für seine Programmiersprache (Node.js, Python, Java, Go etc.).
    *   **Credentials bereitstellen:** Der Agent muss auf die Credentials aus der JSON-Schlüsseldatei zugreifen.
        *   **Empfohlen:** Setze den Pfad zur Schlüsseldatei in der Umgebungsvariable `GOOGLE_APPLICATION_CREDENTIALS`.
        *   **Alternativ:** Lade die Schlüsseldatei direkt im Code des Agenten (stelle sicher, dass der Pfad oder der Inhalt sicher verwaltet wird).
    *   **Admin SDK initialisieren:**
        *   *Beispiel (Node.js)*:
            ```javascript
            const admin = require('firebase-admin');

            // Methode 1: Via Umgebungsvariable
            admin.initializeApp({
              credential: admin.credential.applicationDefault()
            });

            // Methode 2: Via direktem Pfad
            // const serviceAccount = require('/pfad/zu/deiner/serviceAccountKey.json');
            // admin.initializeApp({
            //   credential: admin.credential.cert(serviceAccount)
            // });

            const db = admin.firestore();
            ```
    *   **Firestore-Sammlung definieren:** Lege fest, in welche Sammlung der Agent schreiben soll (z. B. `budgetItems` oder `users/{userId}/budgetItems`). Diese Information muss dem Agenten bekannt sein.
    *   **Daten hinzufügen:** Verwende die Firestore-API des Admin SDKs.
        *   *Beispiel (Node.js - Hinzufügen zu `budgetItems`)*:
            ```javascript
            async function addBudgetItem(budgetItemData, userId) {
              try {
                // Annahme: 'budgetItems' ist die Ziel-Sammlung
                const budgetCollectionRef = db.collection('budgetItems');

                // Füge relevante Metadaten hinzu
                const dataToAdd = {
                  ...budgetItemData,
                  userId: userId, // Wichtig zur Zuordnung!
                  createdAt: admin.firestore.FieldValue.serverTimestamp(),
                  modifiedAt: admin.firestore.FieldValue.serverTimestamp(),
                };

                const docRef = await budgetCollectionRef.add(dataToAdd);
                console.log('Budget item added with ID: ', docRef.id);
                return { success: true, id: docRef.id };
              } catch (error) {
                console.error('Error adding budget item: ', error);
                return { success: false, error: error.message };
              }
            }
            ```

## Wichtige Überlegungen

*   **User ID (`userId`):** Der Agent muss wissen, zu welchem Benutzer ein Datensatz gehört. Die `userId` muss dem Agenten übergeben oder von ihm ermittelt werden.
*   **Sicherheit:**
    *   Das Admin SDK umgeht Firestore-Sicherheitsregeln. Der Zugriff wird über die IAM-Rollen des Service Accounts in der Google Cloud Console gesteuert.
    *   Schütze die Service Account Schlüsseldatei sorgfältig.
*   **Fehlerbehandlung:** Implementiere eine robuste Fehlerbehandlung im Agenten für Firestore-Operationen. 