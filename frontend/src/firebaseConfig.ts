// Import the functions you need from the SDKs you need
import { initializeApp, FirebaseApp, getApps, getApp } from "firebase/app";
import { getFirestore, connectFirestoreEmulator, Firestore } from "firebase/firestore";
import { getAuth, connectAuthEmulator, Auth } from "firebase/auth"; // Auth hinzugefügt, wird oft gebraucht
import { getFunctions, connectFunctionsEmulator, Functions } from "firebase/functions"; // Functions Typ hinzugefügt
// import { getAnalytics } from "firebase/analytics"; // Optional, falls Analytics genutzt wird

// --- ALT: Hartcodierte Konfiguration (Sicherheitsrisiko) ---
// const firebaseConfig_OLD = {
//   apiKey: "...", 
//   authDomain: "...",
//   projectId: "...",
//   storageBucket: "...", 
//   messagingSenderId: "...",
//   appId: "...",
//   measurementId: "..." 
// };

// --- NEU: Konfiguration über Umgebungsvariablen (Vite) ---
const baseFirebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID // Optional
};

// Überprüfen, ob alle Variablen geladen wurden (empfohlen) - außer apiKey im Dev-Modus
for (const key in baseFirebaseConfig) {
  const typedKey = key as keyof typeof baseFirebaseConfig;
  // API Key wird später überschrieben, daher hier nicht prüfen, wenn DEV
  if (typedKey === 'apiKey' && import.meta.env.DEV) continue;

  // @ts-ignore // Nötig, da firebaseConfig[key] dynamisch geprüft wird und der Typ komplex ist
  // const typedKey = key as keyof typeof firebaseConfig; // Typsicherer Zugriff - WAR SCHON OBEN
  if (baseFirebaseConfig[typedKey] === undefined || baseFirebaseConfig[typedKey] === '') {
      // Versuche, den ursprünglichen Key-Namen für die Fehlermeldung zu rekonstruieren
      const envVarName = `VITE_FIREBASE_${key.replace(/([A-Z])/g, '_$1').toUpperCase()}`;
      console.error(`Fehlende oder leere Umgebungsvariable: ${envVarName}`);
      // Wirf einen Fehler oder handle das Problem, um den App-Start zu verhindern
      throw new Error(`Konfigurationsfehler: Umgebungsvariable ${envVarName} ist nicht gesetzt.`);
  }
}


// === Hinzufügen: API Key für Emulator überschreiben ===
const finalFirebaseConfig = { ...baseFirebaseConfig };
if (import.meta.env.DEV) {
    // WICHTIG: Einen beliebigen nicht-leeren String verwenden, der NICHT der echte API-Key ist.
    finalFirebaseConfig.apiKey = "emulator-api-key"; 
    console.log("DEV Mode: Using dummy API key for emulators.");
}
// ======================================================

// Initialize Firebase - Sicherstellen, dass es nur einmal geschieht
let app: FirebaseApp;

if (!getApps().length) { // Prüfen, ob bereits Apps initialisiert wurden
  try {
    // Verwende die potenziell modifizierte Konfiguration
    app = initializeApp(finalFirebaseConfig);
    console.log("Firebase app initialized successfully.");
  } catch (error) {
    console.error("Error initializing Firebase:", error);
    throw new Error("Firebase initialization failed during initial setup.");
  }
} else {
  app = getApp(); // Hole die bereits existierende Standard-App
  console.log("Firebase app already initialized. Reusing existing instance.");
}

// Initialize Firebase services
let db: Firestore;
let auth: Auth;
let functions: Functions; // Typ hinzugefügt

try {
  db = getFirestore(app);
  console.log(`Firestore initialized successfully for project: ${app.options.projectId}`);
  auth = getAuth(app);
  console.log("Firebase Auth initialized successfully.");
  functions = getFunctions(app); // Functions initialisieren
  console.log("Firebase Functions initialized successfully.");

  // === Hinzufügen: Mit Emulatoren verbinden (nur im Entwicklungsmodus) ===
  if (import.meta.env.DEV) { // Prüfen, ob Vite im Entwicklungsmodus läuft
    try {
      // Firestore Emulator verbinden
      connectFirestoreEmulator(db, "localhost", 8180); // Korrigierter Port
      console.log("Verbunden mit Firebase Firestore Emulator auf localhost:8180");

      // Auth Emulator verbinden
      connectAuthEmulator(auth, "http://localhost:9199"); // Korrigierter Port
      console.log("Verbunden mit Firebase Auth Emulator auf localhost:9199");

      // Functions Emulator verbinden
      connectFunctionsEmulator(functions, "localhost", 5103); // Korrigierter Port
      console.log("Verbunden mit Firebase Functions Emulator auf localhost:5103");

    } catch (error) {
      console.error("Fehler beim Verbinden mit Firebase Emulatoren:", error);
    }
  }
  // ======================================================================

  // const analytics = getAnalytics(app); // Optional

} catch (error) {
  // Fehler bei der Initialisierung der Dienste ist immer noch kritisch
  console.error("Error initializing Firebase services:", error);
  throw new Error("Firebase service initialization failed.");
}


// Export the instances for use in other parts of the app
export { db, auth, app, functions }; // Exportiere auch functions 