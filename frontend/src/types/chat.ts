// Definition des Firestore Timestamps (kann von Firebase importiert oder hier definiert werden)
interface FirestoreTimestamp {
  seconds: number;
  nanoseconds: number;
  toDate(): Date;
}

export interface Message {
  id: string; // Dokument-ID aus Firestore
  text: string;
  // Sender ist entweder 'user' oder 'ai' (gemäß bestehender Function)
  senderId: 'user' | 'ai'; 
  timestamp: FirestoreTimestamp | Date | null; // Kann Firestore Timestamp, ein Date-Objekt (temporär) oder null sein
}

// Optional: Spezifischere Typen, falls benötigt
// export type SenderType = 'user' | 'WILMA_AI';
// export interface Message {
//   id: string;
//   text: string;
//   senderId: SenderType | string; // User ID ist auch ein String
//   timestamp: FirestoreTimestamp | Date | null;
// } 