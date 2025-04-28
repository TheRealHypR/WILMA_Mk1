import * as admin from "firebase-admin";
// V1-Import für Auth-Trigger
import * as functions from "firebase-functions";
import * as functionsV1 from "firebase-functions/v1";

// V2-Importe für andere Trigger
import { onDocumentCreated } from "firebase-functions/v2/firestore";
import { onCall, HttpsError } from "firebase-functions/v2/https";
import { UserRecord } from "firebase-admin/auth"; // Nur UserRecord, da v1 Trigger admin.auth.UserRecord verwendet
import { FieldValue } from "firebase-admin/firestore"; // FieldValue explizit importiert

admin.initializeApp();
const db = admin.firestore();

// Auth Trigger (V1)
export const createUserDocument = functionsV1.auth.user().onCreate((user: admin.auth.UserRecord) => {
  if (!user) {
    console.log("Kein Benutzerobjekt im Event gefunden.");
    return null;
  }

  console.log(`Neuer Benutzer erstellt (v1): ${user.uid}`);

  return admin.firestore().collection("users").doc(user.uid).set({
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL,
    createdAt: FieldValue.serverTimestamp(),
  });
});

// Firestore Trigger (V2)
export const simulateAiResponse = onDocumentCreated(
  "users/{userId}/messages/{messageId}", 
  async (event) => { // FirestoreEvent und QueryDocumentSnapshot werden intern verwendet
    const snapshot = event.data;
    if (!snapshot) {
      console.log("Kein Snapshot im Event gefunden.");
      return null;
    }
    const messageData = snapshot.data();

    // Hinzugefügtes Log, um die empfangenen Daten zu prüfen:
    console.log("Empfangene Nachrichtendaten:", messageData);

    // GUARD CLAUSE: Ignoriere Nachrichten, die von der AI selbst stammen (über senderId prüfen)
    if (messageData.senderId === 'ai') {
      console.log("Ignoriere AI-generierte Nachricht (senderId='ai').");
      return null; 
    }

    const { userId, messageId } = event.params;
    
    console.log(
      `Neue Nachricht erkannt (v2): ${messageId} von Benutzer ${userId}`
    );

    // Korrigiertes AI Response Objekt mit korrekten Feldnamen
    const aiResponse = {
      text: `Antwort auf: "${messageData.text}"`, // Feld 'text' verwenden
      timestamp: FieldValue.serverTimestamp(),     // Feld 'timestamp' verwenden
      senderId: 'ai',                              // Feld 'senderId' hinzufügen
      // isAi: true, // Kann optional bleiben oder entfernt werden, da senderId jetzt da ist
    };

    try {
      const messageCollectionRef = admin.firestore()
        .collection("users")
        .doc(userId)
        .collection("messages");
      return await messageCollectionRef.add(aiResponse);
    } catch (error) {
      console.error("Fehler beim Speichern der AI-Antwort (v2):", error);
      return null;
    }
  }
);

// Definieren eines Interface für die erwarteten Daten
interface NewsletterSubscriptionData {
  email: string;
}

// HTTPS Callable Trigger (V2)
export const subscribeToNewsletter = onCall<NewsletterSubscriptionData>(
  async (request) => { // CallableRequest wird intern verwendet
    const email = request.data.email;

    if (!email || typeof email !== "string" || !validateEmail(email)) {
      console.error("Ungültige E-Mail-Adresse empfangen (v2):", email);
      const errorMessage =
        "Bitte geben Sie eine gültige " +
        "E-Mail-Adresse an.";
      throw new HttpsError(
        "invalid-argument",
        errorMessage
      );
    }

    const normalizedEmail = email.toLowerCase();

    const subscriptionData = {
      email: normalizedEmail,
      subscribedAt: FieldValue.serverTimestamp(), // Geändert: FieldValue direkt verwenden
    };

    try {
      const docRef = await admin.firestore()
        .collection("newsletter_subscriptions")
        .add(subscriptionData);
      
      console.log(
        `Neue Newsletter-Anmeldung gespeichert (v2): ${docRef.id} für ${normalizedEmail}`
      );
      
      const successMessage =
        "Erfolgreich zum Newsletter angemeldet!";
      return {
        success: true,
        message: successMessage,
      };
    } catch (error) {
      console.error("Fehler beim Speichern der Newsletter-Anmeldung (v2):", error);
      throw new HttpsError(
        "internal",
        "Anmeldung zum Newsletter fehlgeschlagen. " +
        "Bitte versuchen Sie es später erneut."
      );
    }
  }
);

/**
 * Überprüft, ob eine E-Mail-Adresse ein gültiges Format hat.
 * @param {string} email Die zu überprüfende E-Mail-Adresse.
 * @return {boolean} True, wenn die E-Mail gültig erscheint, sonst false.
 */
function validateEmail(email: string): boolean {
  if (!email || typeof email !== "string") {
    return false;
  }
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email.toLowerCase());
}

// Kein v1-Code mehr hier unten

// Keine separaten Exporte mehr nötig, da die Hauptfunktionen exportiert werden