import { Timestamp } from 'firebase/firestore';

export interface Task {
  id: string; // Die Firestore Dokument ID
  title: string;
  status: 'open' | 'done';
  createdAt: Timestamp; // Firestore Timestamp
  dueDate?: Timestamp | null; // Optionales Firestore Timestamp oder null
} 