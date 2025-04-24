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
  description?: string;
  status?: 'open' | 'done';
  dueDate?: Date | Timestamp | null;
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
      description: data.description,
      status: data.status,
      createdAt: data.createdAt, // Annahme: Ist bereits ein Timestamp
      dueDate: data.dueDate,   // Annahme: Ist bereits ein Timestamp oder null
      modifiedAt: data.modifiedAt,
    } as Task);
  });
  return tasks;
};

/**
 * Fügt eine neue Aufgabe für einen bestimmten Benutzer hinzu.
 * @param userId Die ID des Benutzers.
 * @param description Die Beschreibung der neuen Aufgabe.
 * @param dueDate Optionales Fälligkeitsdatum.
 */
export const addTask = async (userId: string, description: string, dueDate?: Date | null): Promise<string> => {
  if (!userId) throw new Error("UserID ist erforderlich.");
  if (!description.trim()) {
      throw new Error("Beschreibung der Aufgabe ist erforderlich.");
  }

  const tasksColRef = collection(db, 'users', userId, 'tasks');
  
  const newTaskData = {
    description: description.trim(),
    status: 'open',
    createdAt: serverTimestamp() as Timestamp,
    modifiedAt: serverTimestamp() as Timestamp,
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

  const dataToUpdate: { [key: string]: any } = { 
    ...updates,
    modifiedAt: serverTimestamp()
  };

  if (updates.hasOwnProperty('dueDate')) {
      if (updates.dueDate instanceof Date) {
          dataToUpdate.dueDate = Timestamp.fromDate(updates.dueDate);
      } else if (updates.dueDate === null || updates.dueDate instanceof Timestamp) {
          dataToUpdate.dueDate = updates.dueDate;
      } else {
          console.warn(`Ungültiger Typ für dueDate in updateTask: ${typeof updates.dueDate}`);
          delete dataToUpdate.dueDate; 
      }
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