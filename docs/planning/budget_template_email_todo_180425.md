# To-Do Liste: Budget-Vorlage per E-Mail versenden (für 18.04.2025)

**Gesamtziel:** Den direkten Download der Budget-Excel-Vorlage auf der Ressourcenseite (`/ressourcen/hochzeitsbudget-rechner`) durch einen Prozess ersetzen, bei dem der Nutzer seine E-Mail-Adresse eingibt und die Vorlage dann automatisch per E-Mail als Anhang zugeschickt bekommt. Dies dient gleichzeitig der Lead-Generierung und potenziellen E-Mail-Verifizierung.

**Phase 1: Backend - Cloud Function & E-Mail Versand vorbereiten**

1.  **E-Mail-Versanddienst auswählen & konfigurieren:**
    *   Entscheide dich für einen Dienst zum Senden von E-Mails (Optionen):
        *   **Firebase "Trigger Email" Extension:** Relativ einfach zu installieren und zu verwenden, wenn du bereits stark auf Firebase setzt. Benötigt oft einen externen SMTP-Anbieter (wie SendGrid etc.) im Hintergrund.
        *   **SendGrid:** Beliebter Dienst mit guter Dokumentation und kostenlosem Kontingent. Erfordert Account-Erstellung, Domain-/Absender-Verifizierung und API-Key-Generierung.
        *   **Mailgun:** Ähnlich wie SendGrid.
    *   Richte den gewählten Dienst ein: Erstelle einen Account, verifiziere deine Absender-E-Mail-Adresse oder Domain.
    *   Besorge dir die notwendigen API-Schlüssel oder Konfigurationsdaten.
    *   **WICHTIG:** Speichere sensible Daten (API-Keys) sicher über Firebase Environment Configuration (Secrets): `firebase functions:secrets:set EMAIL_API_KEY` (Beispiel).

2.  **Excel-Vorlage in Cloud Storage hochladen:**
    *   Gehe zur [Google Cloud Console](https://console.cloud.google.com/) -> Projekt `wilma-mk1` -> Cloud Storage -> Browser.
    *   Erstelle einen neuen Bucket (falls noch kein passender existiert, z. B. `wilma-mk1-ressourcen`) oder wähle einen bestehenden.
    *   Lade die Datei `WILMA_Budgetplanung_Vorlage.xlsx` in diesen Bucket hoch. Merke dir den Bucket-Namen und den exakten Dateinamen/Pfad.
    *   **Berechtigungen prüfen:** Stelle sicher, dass das Dienstkonto deiner Cloud Functions (normalerweise `<projekt-id>@appspot.gserviceaccount.com`) Lesezugriff (`roles/storage.objectViewer`) auf diesen Bucket/diese Datei hat.

3.  **(Optional) Firestore Collection für Leads/Newsletter:**
    *   Entscheide, ob und wo die eingegebenen E-Mail-Adressen gespeichert werden sollen (z. B. in der bestehenden `newsletter_subscriptions` Collection oder einer neuen `leads` Collection).
    *   Passe ggf. die Firestore Security Rules an, um Schreibzugriff für die neue Cloud Function zu erlauben.

4.  **Notwendige NPM Pakete installieren (im `functions` Verzeichnis):**
    *   Wechsle ins `functions`-Verzeichnis (`cd functions`).
    *   Installiere den Google Cloud Storage Client: `npm install @google-cloud/storage`
    *   Installiere das SDK für den gewählten E-Mail-Dienst, z. B.: `npm install @sendgrid/mail`
    *   (Optional) Installiere `uuid` zur Generierung eindeutiger IDs, falls benötigt: `npm install uuid` und `npm install --save-dev @types/uuid`

**Phase 2: Backend - Neue Cloud Function implementieren**

5.  **Neue Funktion in `index.ts` erstellen:**
    *   Erstelle eine neue **HTTPS Callable Function**, z. B. `export const sendBudgetTemplate = functions.https.onCall(async (data, context) => { ... });`.
6.  **Eingangsdaten validieren:**
    *   Extrahiere die E-Mail-Adresse aus `data.email`.
    *   Führe eine serverseitige Validierung der E-Mail durch.
    *   Prüfe ggf. auf Authentifizierung (`context.auth`), falls nur eingeloggte Nutzer das tun dürfen (aktuell ist es eine öffentliche Ressourcenseite, also wahrscheinlich nicht nötig).
7.  **(Optional) E-Mail in Firestore speichern:**
    *   Importiere `admin.firestore()`.
    *   Füge die E-Mail zur festgelegten Collection hinzu (`addDoc` oder `setDoc`).
8.  **Excel-Datei aus Cloud Storage holen:**
    *   Importiere die `@google-cloud/storage` Bibliothek.
    *   Initialisiere den Storage Client.
    *   Definiere Bucket-Name und Dateiname.
    *   Lade die Datei in den temporären Speicher der Cloud Function herunter (z. B. `/tmp/WILMA_Budgetplanung_Vorlage.xlsx`). Verwende `bucket.file(fileName).download({ destination: tempFilePath })`.
9.  **E-Mail senden mit Anhang:**
    *   Importiere das SDK des E-Mail-Dienstes.
    *   Konfiguriere das SDK mit deinem API-Key (sicher geladen aus Environment/Secrets).
    *   Lese die heruntergeladene Excel-Datei aus dem temporären Speicher (z. B. mit `fs.readFileSync`).
    *   Konvertiere den Dateiinhalt nach Base64.
    *   Erstelle das E-Mail-Objekt:
        *   `to`: Die E-Mail aus `data.email`.
        *   `from`: Deine konfigurierte Absenderadresse.
        *   `subject`: z. B. "Deine WILMA Budgetplanungsvorlage".
        *   `text`/`html`: Ein netter E-Mail-Text.
        *   `attachments`: Ein Array mit einem Objekt für den Anhang, das den Base64-codierten Inhalt, den Dateinamen (`WILMA_Budgetplanung_Vorlage.xlsx`) und den Mime-Typ (`application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`) enthält.
    *   Sende die E-Mail über die API des Dienstes.
10. **Rückgabe & Fehlerbehandlung:**
    *   Implementiere `try...catch`-Blöcke.
    *   Bei Erfolg: Gib ein Objekt zurück, z. B. `{ success: true }`.
    *   Bei Fehlern: Logge den Fehler und wirf einen `functions.https.HttpsError` mit einer aussagekräftigen Fehlermeldung für das Frontend.

**Phase 3: Frontend Anpassungen (`ThematicLandingPage.tsx`)**

11. **Handler `handleEmailSubmit` anpassen:**
    *   Ändere den Namen der aufgerufenen Cloud Function von `subscribeToNewsletter` auf `sendBudgetTemplate`.
    *   Entferne `setShowDownload(true)` im `try`-Block.
    *   Setze stattdessen eine Erfolgsmeldung im State, z. B. `setSubmitMessage('Vorlage wurde per E-Mail versendet!')` (neue State-Variable `submitMessage` erstellen).
    *   Passe ggf. die Fehlermeldung im `catch`-Block an.
12. **UI Rendering anpassen:**
    *   Im `else if (slug === 'hochzeitsbudget-rechner')` Block:
        *   Ändere die Logik, die den Download-Button anzeigt (`showDownload`).
        *   Zeige stattdessen die Erfolgsmeldung (`submitMessage`) an, wenn diese gesetzt ist (z. B. in einem `<Alert severity="success">`).
        *   Entferne den Download-Button komplett aus dem JSX.
        *   Stelle sicher, dass das E-Mail-Formular ausgeblendet wird, wenn die Erfolgsmeldung angezeigt wird.

**Phase 4: Testing & Deployment**

13. **Konfiguration testen:** Stelle sicher, dass die Firebase Environment Variables/Secrets korrekt gesetzt sind.
14. **Backend testen:** Teste die `sendBudgetTemplate`-Funktion (ggf. mit lokalen Emulatoren oder nach Deployment). Prüfe, ob E-Mails ankommen und der Anhang korrekt ist.
15. **Frontend testen:** Teste den Ablauf im Frontend: E-Mail eingeben, Senden klicken, Ladeanzeige prüfen, Erfolgs-/Fehlermeldung prüfen.
16. **Deployment:** Deploye die neue Cloud Function und die Frontend-Änderungen: `firebase deploy`. 