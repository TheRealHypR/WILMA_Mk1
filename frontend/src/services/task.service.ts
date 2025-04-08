import { db } from '../firebaseConfig'; // Pfad anpassen, falls nötig
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
} from 'firebase/firestore';
import { Task } from '../models/task.model';

// Schnittstelle für die Daten, die zum Aktualisieren einer Aufgabe verwendet werden
export interface TaskUpdatePayload {
  title?: string;
  status?: 'open' | 'done';
  dueDate?: Date | null; // Akzeptiert Date oder null vom Aufrufer
}

/**
 * Ruft alle Aufgaben für einen bestimmten Benutzer ab.
 * @param userId Die ID des Benutzers.
 */
export const getTasks = async (userId: string): Promise<Task[]> => {
  if (!userId) throw new Error("UserID ist erforderlich.");

  const tasksColRef = collection(db, 'users', userId, 'tasks');
  const q = query(tasksColRef, orderBy('createdAt', 'desc')); // Neueste zuerst

  const querySnapshot = await getDocs(q);
  const tasks: Task[] = [];
  querySnapshot.forEach((doc) => {
    const data = doc.data();
    tasks.push({
      id: doc.id,
      title: data.title,
      status: data.status,
      createdAt: data.createdAt, // Annahme: Ist bereits ein Timestamp
      dueDate: data.dueDate,   // Annahme: Ist bereits ein Timestamp oder null
    } as Task);
  });
  return tasks;
};

/**
 * Fügt eine neue Aufgabe für einen bestimmten Benutzer hinzu.
 * @param userId Die ID des Benutzers.
 * @param title Der Titel der neuen Aufgabe.
 * @param dueDate Optionales Fälligkeitsdatum.
 */
export const addTask = async (userId: string, title: string, dueDate?: Date | null): Promise<string> => {
  if (!userId) throw new Error("UserID ist erforderlich.");

  const tasksColRef = collection(db, 'users', userId, 'tasks');
  
  const newTaskData: Omit<Task, 'id'> = {
    title,
    status: 'open',
    createdAt: serverTimestamp() as Timestamp, // Server-Timestamp verwenden
    dueDate: dueDate ? Timestamp.fromDate(dueDate) : null,
  };

  const docRef = await addDoc(tasksColRef, newTaskData);
  return docRef.id;
};

/**
 * Aktualisiert eine bestehende Aufgabe für einen bestimmten Benutzer.
 * @param userId Die ID des Benutzers.
 * @param taskId Die ID der zu aktualisierenden Aufgabe.
 * @param updates Ein Objekt mit den zu aktualisierenden Feldern.
 */
export const updateTask = async (userId: string, taskId: string, updates: TaskUpdatePayload): Promise<void> => {
  if (!userId) throw new Error("UserID ist erforderlich.");

  const taskDocRef = doc(db, 'users', userId, 'tasks', taskId);

  const dataToUpdate: { [key: string]: any } = { ...updates };

  if (updates.hasOwnProperty('dueDate')) {
      dataToUpdate.dueDate = updates.dueDate ? Timestamp.fromDate(updates.dueDate) : null;
  }

  await updateDoc(taskDocRef, dataToUpdate);
};

/**
 * Löscht eine Aufgabe für einen bestimmten Benutzer.
 * @param userId Die ID des Benutzers.
 * @param taskId Die ID der zu löschenden Aufgabe.
 */
export const deleteTask = async (userId: string, taskId: string): Promise<void> => {
  if (!userId) throw new Error("UserID ist erforderlich.");

  const taskDocRef = doc(db, 'users', userId, 'tasks', taskId);
  await deleteDoc(taskDocRef);
}; 