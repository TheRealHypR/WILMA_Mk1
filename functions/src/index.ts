import * as admin from "firebase-admin";
// V1-Import für Auth-Trigger
import * as functions from "firebase-functions";
import * as functionsV1 from "firebase-functions/v1";

// V2-Importe für andere Trigger
import { onDocumentCreated } from "firebase-functions/v2/firestore";
import { onCall, HttpsError } from "firebase-functions/v2/https";
import { UserRecord } from "firebase-admin/auth"; // Nur UserRecord, da v1 Trigger admin.auth.UserRecord verwendet
import { FieldValue, Timestamp } from "firebase-admin/firestore"; // FieldValue und Timestamp explizit importiert

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
/* // <--- Auskommentieren Beginn
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
*/ // <--- Auskommentieren Ende

// Definieren eines Interface für die erwarteten Daten
interface NewsletterSubscriptionData {
  email: string;
}

/* // Temporär auskommentieren wegen V1/V2 Konflikt
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
*/

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

// --- NEU: Timeline Lead Funnel Function ---

// Interface für die erwarteten Daten vom Frontend
interface TimelineLeadData {
  email: string;
  weddingDate: string | null; // Datum als ISO-String oder null
  guestSize: 'small' | 'medium' | 'large' | null;
  guestCount: number;
  weddingStyle: string | null;
  // Optional: Gamification Daten, wenn benötigt
  pointsEarned: number;
  achievements: string[];
}

export const saveTimelineLead = onCall<TimelineLeadData>(
  async (request) => {
    const data = request.data;
    const now = FieldValue.serverTimestamp();

    // 1. Daten validieren
    if (!data.email || !validateEmail(data.email)) {
      throw new HttpsError("invalid-argument", "Ungültige E-Mail-Adresse.");
    }
    // Weitere Validierungen hinzufügen (z.B. guestCount > 0, gültiges Datum?)
    if (data.guestCount === undefined || data.guestCount < 1) {
        throw new HttpsError("invalid-argument", "Ungültige Gästezahl.");
    }
    // Optional: Datum validieren (ist es ein gültiger ISO-String?)

    const normalizedEmail = data.email.toLowerCase();

    try {
      let userId: string;
      let isNewUser = false;

      // 2. Nutzer in 'users' suchen oder erstellen
      const usersRef = db.collection("users");
      const userQuery = await usersRef.where("email", "==", normalizedEmail).limit(1).get();

      if (userQuery.empty) {
        // Nutzer existiert nicht -> Neuen Nutzer erstellen
        console.log(`Neuer Lead wird erstellt für E-Mail: ${normalizedEmail}`);
        const newUserRef = await usersRef.add({
          email: normalizedEmail,
          createdAt: now,
          lastActivity: now,
          conversionStatus: "lead",
          funnelSource: "timeline", // Quelle dieses Leads
          weddingDate: data.weddingDate ? Timestamp.fromDate(new Date(data.weddingDate)) : null,
          pointsTotal: data.pointsEarned || 0,
          achievements: data.achievements || [],
          weddingDetails: {
            guestSize: data.guestSize,
            estimatedGuestCount: data.guestCount,
            style: data.weddingStyle,
          },
          // Initial leere Engagement/Profile Daten
          engagement: { funnelsCompleted: ["timeline"] },
          profileData: {}
        });
        userId = newUserRef.id;
        isNewUser = true;
      } else {
        // Nutzer existiert -> Daten aktualisieren
        const userDoc = userQuery.docs[0];
        userId = userDoc.id;
        console.log(`Lead wird aktualisiert für Nutzer: ${userId} (E-Mail: ${normalizedEmail})`);
        
        // Verwende eine Transaktion oder Batch für atomare Updates, hier vereinfacht:
        await usersRef.doc(userId).set({
          lastActivity: now,
          // Nur aktualisieren, wenn neue Daten vorhanden oder besser sind?
          weddingDate: data.weddingDate ? Timestamp.fromDate(new Date(data.weddingDate)) : userDoc.data().weddingDate || null,
          pointsTotal: FieldValue.increment(data.pointsEarned || 0),
          achievements: FieldValue.arrayUnion(...(data.achievements || [])), // Fügt nur neue hinzu
          weddingDetails: {
            // Bestehende Details mergen, neue überschreiben/hinzufügen
            ...userDoc.data().weddingDetails,
            guestSize: data.guestSize,
            estimatedGuestCount: data.guestCount,
            style: data.weddingStyle,
          },
          engagement: {
             // Bestehende Details mergen, neue überschreiben/hinzufügen
            ...userDoc.data().engagement,
            funnelsCompleted: FieldValue.arrayUnion("timeline") // Fügt nur hinzu, wenn nicht vorhanden
          }
          // conversionStatus, funnelSource etc. werden hier nicht überschrieben
        }, { merge: true }); // Wichtig: merge: true, um andere Felder nicht zu löschen
      }

      // 3. Eintrag in 'funnel_data' erstellen
      const funnelDataRef = db.collection("funnel_data");
      await funnelDataRef.add({
        userId: userId,
        funnelType: "timeline",
        startedAt: now, // Vereinfacht: Startzeit = Endzeit, könnte vom Frontend kommen
        completedAt: now,
        pointsEarned: data.pointsEarned || 0,
        answersData: {
          weddingDate: data.weddingDate ? Timestamp.fromDate(new Date(data.weddingDate)) : null,
          guestSize: data.guestSize,
          guestCount: data.guestCount,
          weddingStyle: data.weddingStyle,
        },
        // Weitere spezifische Daten, falls vorhanden
      });

      console.log(`Funnel-Daten erfolgreich gespeichert für Nutzer: ${userId}`);

      return {
        success: true,
        message: isNewUser ? "Lead erfolgreich erstellt." : "Lead erfolgreich aktualisiert.",
        userId: userId,
      };

    } catch (error: any) {
      console.error("Fehler beim Speichern des Timeline Leads:", error);
      throw new HttpsError(
        "internal",
        "Fehler beim Speichern der Daten. Bitte versuchen Sie es später erneut.",
        error.message // Optional: Füge interne Fehlermeldung hinzu
      );
    }
  }
);

// Keine separaten Exporte mehr nötig, da die Hauptfunktionen exportiert werden