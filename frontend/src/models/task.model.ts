import { Timestamp } from 'firebase/firestore';

/**
 * Repräsentiert eine einzelne Aufgabe oder To-Do.
 */
export interface Task {
  id: string;                 // Dokument-ID
  description: string;        // Beschreibung der Aufgabe (Pflichtfeld)
  status: 'open' | 'done';    // Status der Aufgabe (Pflichtfeld)
  dueDate?: Timestamp | null;  // Fälligkeitsdatum (optional)
  createdAt: Timestamp;       // Erstellungszeitpunkt (vom Server gesetzt)
  modifiedAt: Timestamp;      // Letzter Änderungszeitpunkt (vom Server gesetzt)
  // Optional: Weitere Felder wie Priorität, Kategorie, zugewiesen an, Notizen etc.
  // priority?: 'low' | 'medium' | 'high';
  // category?: string;
  // assignedTo?: string; // Könnte userId sein, falls Aufgaben geteilt werden
  // notes?: string;
} 