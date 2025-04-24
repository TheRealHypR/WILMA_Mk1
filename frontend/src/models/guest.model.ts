import { Timestamp } from 'firebase/firestore';

/**
 * Repräsentiert einen einzelnen Gast oder eine Gast-Einheit.
 */
export interface Guest {
  // Grundlegende Informationen
  id: string;                 // Dokument-ID
  firstName: string;          // Vorname
  lastName?: string;          // Nachname (optional gemacht)
  email?: string | null;      // E-Mail-Adresse (optional)
  phoneNumber?: string | null; // Telefonnummer (optional)
  
  // Adressinformationen (als optional markiert, da oft nicht sofort bekannt)
  address?: {
    street?: string | null;
    city?: string | null;
    state?: string | null;
    postalCode?: string | null;
    country?: string | null;
  };
  
  // Beziehung und Gruppierung (als optional markiert)
  relationship?: string;       // z.B. "Freund des Bräutigams", "Familie der Braut"
  group?: string;              // Gruppierungskategorie für Einladungen und Sitzplan
  tableAssignment?: string | null; // Tischnummer/-name
  role?: 'guest' | 'witness_bride' | 'witness_groom'; // Rolle des Gastes (Standard: 'guest')
  
  // Einladungs- und RSVP-Status
  status: "to-invite" | "invited" | "confirmed" | "declined" | "maybe";
  invitationSentDate?: Timestamp | null;
  responseDate?: Timestamp | null;
  
  // Begleitung
  plusOne?: boolean;           // Darf eine Begleitung mitbringen (optional, Standard false)
  plusOneName?: string | null; // Name der Begleitung falls bekannt
  plusOneConfirmed?: boolean;  // Ob Begleitung teilnimmt (optional, Standard false)
  
  // Besondere Anforderungen
  dietaryRestrictions?: string[];  // z.B. "vegetarisch", "glutenfrei"
  specialRequirements?: string | null; // Weitere Anforderungen
  
  // Kind-spezifische Informationen
  isChild?: boolean;            // (optional, Standard false)
  childAge?: number | null;    // Alter falls Kind
  
  // Geschenk-Tracking (optional)
  gifts?: Array<{
    description: string;
    status: "wished" | "received";
    thankyouSent: boolean;
    thankyouSentDate?: Timestamp | null;
  }>;
  
  // Veranstaltungsteilnahme (optional)
  eventParticipation?: {
    [eventId: string]: boolean;
  };
  
  // Metadaten
  createdFrom?: string | null;  // Message-ID, aus der dieser Gast extrahiert wurde
  createdAt: Timestamp;        // Erstellungszeitpunkt
  modifiedAt: Timestamp;       // Letzter Änderungszeitpunkt
  notes?: string | null;        // Interne Notizen zur Person
}

/**
 * Repräsentiert eine Gruppe von Gästen (z.B. Familie, Paar).
 */
export interface GuestGroup {
  id: string;                 // Dokument-ID
  name: string;               // Gruppenname (z.B. "Familie Schmidt")
  primaryContactId?: string;  // ID des Hauptkontakts in der Gruppe (optional)
  members: string[];          // Array von Gast-IDs (mind. 1)
  type?: "family" | "couple" | "friends" | "other"; // Optional
  // Gemeinsame Adresse (optional)
  address?: {
    street?: string | null;
    city?: string | null;
    state?: string | null;
    postalCode?: string | null;
    country?: string | null;
  };
  invitationSentDate?: Timestamp | null; // Datum, wann Gruppeneinladung gesendet wurde
  notes?: string | null;
}

/**
 * Repräsentiert einen Tisch für die Sitzordnung.
 */
export interface Table {
  id: string;               // Dokument-ID
  name: string;             // Tischname/-nummer
  capacity: number;         // Maximale Anzahl Gäste
  location?: string;        // Position im Raum (optional)
  assignedGuests?: string[]; // Array von Gast-IDs (optional)
  notes?: string | null;
}

/**
 * Repräsentiert aggregierte Statistiken zur Gästeliste.
 */
export interface GuestStats {
  total?: number;            // Gesamtzahl der Gäste
  confirmed?: number;        // Anzahl zugesagter Gäste
  declined?: number;         // Anzahl abgesagter Gäste
  pending?: number;          // Anzahl ausstehender Antworten
  maybe?: number;            // Anzahl unsicherer Zusagen
  invited?: number;          // Anzahl eingeladener Gäste
  toInvite?: number;         // Noch nicht eingeladene Gäste
  
  plusOnes?: {
    potential?: number;      // Anzahl möglicher +1
    confirmed?: number;      // Anzahl bestätigter +1
  };
  
  children?: number;         // Anzahl Kinder
  
  // Optional: Detailliertere Aufschlüsselungen
  byRelationship?: { [relationship: string]: number };
  byGroup?: { [group: string]: number };
  dietaryRestrictions?: { [restriction: string]: number };
  
  lastUpdated?: Timestamp;   // Zeitpunkt der letzten Aktualisierung
} 