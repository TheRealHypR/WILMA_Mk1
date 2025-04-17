import { db } from '../firebaseConfig';
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  serverTimestamp,
  Timestamp,
  DocumentData,
  QueryDocumentSnapshot,
} from 'firebase/firestore';
import { Guest } from '../models/guest.model';

// Hilfsfunktion zum Konvertieren eines Firestore Docs in ein Guest-Objekt
// Behandelt Timestamps und stellt sicher, dass alle Felder vorhanden sind
const docToGuest = (doc: QueryDocumentSnapshot<DocumentData>): Guest => {
    const data = doc.data();
    // Standardwerte für optionale Felder setzen, falls sie fehlen
    return {
        id: doc.id,
        firstName: data.firstName || '',
        lastName: data.lastName,
        email: data.email,
        phoneNumber: data.phoneNumber,
        address: data.address, // Bleibt Objekt oder undefined
        relationship: data.relationship,
        group: data.group,
        tableAssignment: data.tableAssignment,
        status: data.status || 'to-invite', // Standardstatus
        invitationSentDate: data.invitationSentDate, // Kann Timestamp oder null sein
        responseDate: data.responseDate, // Kann Timestamp oder null sein
        plusOne: data.plusOne || false,
        plusOneName: data.plusOneName,
        plusOneConfirmed: data.plusOneConfirmed || false,
        dietaryRestrictions: data.dietaryRestrictions || [],
        specialRequirements: data.specialRequirements,
        isChild: data.isChild || false,
        childAge: data.childAge,
        gifts: data.gifts || [],
        eventParticipation: data.eventParticipation || {},
        createdFrom: data.createdFrom,
        createdAt: data.createdAt || Timestamp.now(), // Fallback, sollte aber gesetzt sein
        modifiedAt: data.modifiedAt || Timestamp.now(), // Fallback, sollte aber gesetzt sein
        notes: data.notes,
    } as Guest;
};


/**
 * Ruft alle Gäste für einen bestimmten Benutzer ab.
 * @param userId Die ID des Benutzers.
 * @returns Eine Promise, die ein Array von Guest-Objekten liefert.
 */
export const getGuests = async (userId: string): Promise<Guest[]> => {
  if (!userId) throw new Error("UserID ist erforderlich.");

  const guestsColRef = collection(db, 'users', userId, 'guests');
  // Optional: Sortierung hinzufügen, z.B. nach Nachname oder Erstellungsdatum
  const q = query(guestsColRef, orderBy('createdAt', 'desc')); 

  const querySnapshot = await getDocs(q);
  const guests: Guest[] = [];
  querySnapshot.forEach((doc) => {
    guests.push(docToGuest(doc));
  });
  return guests;
};

/**
 * Fügt einen neuen Gast für einen bestimmten Benutzer hinzu.
 * Wichtige Felder wie firstName und status sollten in guestData enthalten sein.
 * @param userId Die ID des Benutzers.
 * @param guestData Die Daten des neuen Gastes (ohne id, createdAt, modifiedAt).
 * @returns Eine Promise, die die ID des neu erstellten Gast-Dokuments liefert.
 */
export const addGuest = async (userId: string, guestData: Omit<Guest, 'id' | 'createdAt' | 'modifiedAt'>): Promise<string> => {
  if (!userId) throw new Error("UserID ist erforderlich.");
  if (!guestData || !guestData.firstName) {
      throw new Error("Vorname des Gastes ist erforderlich.");
  }

  const guestsColRef = collection(db, 'users', userId, 'guests');
  
  const newGuestData = {
    ...guestData,
    status: guestData.status || 'to-invite', // Standardstatus setzen
    createdAt: serverTimestamp(), 
    modifiedAt: serverTimestamp(), 
  };

  const docRef = await addDoc(guestsColRef, newGuestData);
  return docRef.id;
};

/**
 * Aktualisiert einen bestehenden Gast für einen bestimmten Benutzer.
 * @param userId Die ID des Benutzers.
 * @param guestId Die ID des zu aktualisierenden Gastes.
 * @param updates Ein Objekt mit den zu aktualisierenden Feldern (Teil von Guest).
 * @returns Eine Promise, die nach Abschluss der Aktualisierung aufgelöst wird.
 */
export const updateGuest = async (userId: string, guestId: string, updates: Partial<Omit<Guest, 'id' | 'createdAt'>>): Promise<void> => {
  if (!userId) throw new Error("UserID ist erforderlich.");
  if (!guestId) throw new Error("GuestID ist erforderlich.");
  if (!updates || Object.keys(updates).length === 0) {
      console.warn("Keine Updates für Gast angegeben.");
      return; // Keine Änderungen
  }

  const guestDocRef = doc(db, 'users', userId, 'guests', guestId);

  const dataToUpdate = {
    ...updates,
    modifiedAt: serverTimestamp(), // Immer modifiedAt aktualisieren
  };

  // Konvertiere Date-Objekte in Timestamps, falls nötig (Beispiel für optionale Felder)
  if (updates.invitationSentDate && updates.invitationSentDate instanceof Date) {
      dataToUpdate.invitationSentDate = Timestamp.fromDate(updates.invitationSentDate);
  }
  if (updates.responseDate && updates.responseDate instanceof Date) {
    dataToUpdate.responseDate = Timestamp.fromDate(updates.responseDate);
  }
  // Ähnliche Konvertierungen für gifts.thankyouSentDate etc. wären hier nötig, 
  // falls das Frontend Date-Objekte übergibt.

  await updateDoc(guestDocRef, dataToUpdate);
};

/**
 * Löscht einen Gast für einen bestimmten Benutzer.
 * @param userId Die ID des Benutzers.
 * @param guestId Die ID des zu löschenden Gastes.
 * @returns Eine Promise, die nach Abschluss des Löschvorgangs aufgelöst wird.
 */
export const deleteGuest = async (userId: string, guestId: string): Promise<void> => {
  if (!userId) throw new Error("UserID ist erforderlich.");
  if (!guestId) throw new Error("GuestID ist erforderlich.");

  const guestDocRef = doc(db, 'users', userId, 'guests', guestId);
  await deleteDoc(guestDocRef);
}; 