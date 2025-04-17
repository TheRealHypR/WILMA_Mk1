// Import the functions you need from the SDKs you need
import { initializeApp, FirebaseApp } from "firebase/app";
import { getFirestore, Firestore } from "firebase/firestore";
import { getAuth, Auth } from "firebase/auth"; // Auth hinzugefügt, wird oft gebraucht
// import { getAnalytics } from "firebase/analytics"; // Optional, falls Analytics genutzt wird

// Your web app's Firebase configuration
// Hole die Werte aus deiner Firebase Config.txt oder Firebase Konsole
const firebaseConfig = {
  apiKey: "AIzaSyDEM6nbLS2kC5i32tWaKkM7IXLu6CuNYro", // ACHTUNG: API-Schlüssel sichtbar im Frontend-Code!
  authDomain: "wilma-mk1.firebaseapp.com",
  projectId: "wilma-mk1",
  storageBucket: "wilma-mk1.appspot.com", // Korrigiere ggf. die Endung (.appspot.com ist üblich)
  messagingSenderId: "196205457840",
  appId: "1:196205457840:web:03caea2384d797ecbae675",
  measurementId: "G-RZQP8DNHLP" // Optional
};

// Initialize Firebase
let app: FirebaseApp;
try {
  app = initializeApp(firebaseConfig);
  console.log("Firebase app initialized successfully.");
} catch (error) {
  console.error("Error initializing Firebase:", error);
  // Handle the error appropriately - maybe show a message to the user
  throw error; // Re-throw or handle as needed
}


// Initialize Firebase services
let db: Firestore;
let auth: Auth;
try {
  db = getFirestore(app, "(default)");
  console.log(`Firestore initialized successfully for project: ${db.app.options.projectId}`);
  auth = getAuth(app);
  console.log("Firebase Auth initialized successfully.");
  // const analytics = getAnalytics(app); // Optional
} catch (error) {
  console.error("Error initializing Firebase services:", error);
   // Handle the error appropriately
  throw error;
}


// Export the instances for use in other parts of the app
export { db, auth, app }; // Exportiere db und auth (und app, falls benötigt) 