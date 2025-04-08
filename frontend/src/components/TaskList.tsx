import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getTasks, updateTask, deleteTask, TaskUpdatePayload } from '../services/task.service';
import { Task } from '../models/task.model';
import TaskItem from './TaskItem'; // Importiere die TaskItem Komponente
import AddTaskForm from './AddTaskForm'; // Importiere AddTaskForm
import { List, Typography, Box, CircularProgress, Alert, Divider } from '@mui/material'; // Material UI Imports ergänzt
import { Timestamp } from 'firebase/firestore';

const TaskList: React.FC = () => {
  const { currentUser } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingTaskId, setUpdatingTaskId] = useState<string | null>(null); // Für Ladeindikator beim Update/Delete

  // Funktion zum Abrufen der Aufgaben (mit useCallback optimiert)
  const fetchTasks = useCallback(async () => {
    if (!currentUser) {
      setTasks([]);
      setLoading(false);
      return;
    }
    if (!updatingTaskId) setLoading(true);
    setError(null);
    try {
      const fetchedTasks = await getTasks(currentUser.uid);
      setTasks(fetchedTasks);
    } catch (err) {
      console.error("Fehler beim Abrufen der Aufgaben:", err);
      setError("Aufgaben konnten nicht geladen werden.");
    } finally {
      setLoading(false);
    }
  }, [currentUser, updatingTaskId]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Callback für Task-Updates
  const handleUpdateTask = async (taskId: string, updates: TaskUpdatePayload) => {
    if (!currentUser) return;
    setUpdatingTaskId(taskId);
    setError(null);
    try {
      // Firestore Update (akzeptiert Date oder null für dueDate)
      await updateTask(currentUser.uid, taskId, updates);

      // Korrigiertes optimistisches Update für den lokalen State:
      setTasks(prevTasks =>
        prevTasks.map(task => {
          if (task.id === taskId) {
            // Erstelle das aktualisierte Task-Objekt
            const updatedTask = { ...task, ...updates };

            // Wenn dueDate im Update enthalten war, konvertiere es zu Timestamp für den lokalen State
            if (updates.hasOwnProperty('dueDate')) {
                updatedTask.dueDate = updates.dueDate ? Timestamp.fromDate(updates.dueDate) : null;
            }
            return updatedTask as Task; // Stelle sicher, dass der Typ Task ist
          }
          return task;
        })
      );
      await fetchTasks(); // Aufgaben neu laden für Konsistenz

    } catch (err) {
      console.error("Fehler beim Aktualisieren der Aufgabe:", err);
      setError("Aufgabe konnte nicht aktualisiert werden.");
    } finally {
      setUpdatingTaskId(null);
    }
  };

  // Callback für Task-Löschung
  const handleDeleteTask = async (taskId: string) => {
    if (!currentUser) return;
    setUpdatingTaskId(taskId); // Zeige Ladeindikator für das zu löschende Item
    setError(null);
    const originalTasks = [...tasks]; // Kopie für Rollback bei Fehler
    // Optimistisches Update: Entferne Task sofort aus der UI
    setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
    try {
      await deleteTask(currentUser.uid, taskId);
      // Kein fetchTasks nötig, da lokal schon entfernt
    } catch (err) {
      console.error("Fehler beim Löschen der Aufgabe:", err);
      setError("Aufgabe konnte nicht gelöscht werden.");
      setTasks(originalTasks); // Bei Fehler: alten Zustand wiederherstellen
    } finally {
      setUpdatingTaskId(null);
    }
  };

  if (loading && tasks.length === 0) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}><CircularProgress /></Box>;
  }

  if (error) {
    return <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>;
  }

  if (!currentUser) {
     // Sollte durch ProtectedRoute abgedeckt sein, aber sicher ist sicher
    return <Typography sx={{ mt: 2 }}>Bitte anmelden.</Typography>;
  }

  return (
    <Box>
      <AddTaskForm onTaskAdded={fetchTasks} />

      <Divider sx={{ my: 2 }} />

      {tasks.length === 0 && !loading ? (
        <Typography sx={{ mt: 2, textAlign: 'center' }}>Keine Aufgaben vorhanden.</Typography>
      ) : (
        <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
          {tasks.map((task) => (
            <Box key={task.id} sx={{ position: 'relative', opacity: updatingTaskId === task.id ? 0.5 : 1 }}>
              <TaskItem
                task={task}
                onUpdate={handleUpdateTask}
                onDelete={handleDeleteTask}
              />
              {updatingTaskId === task.id && (
                 <CircularProgress size={24} sx={{ position: 'absolute', top: '50%', right: 50, marginTop: '-12px' }} />
              )}
             </Box>
          ))}
        </List>
      )}
    </Box>
  );
};

export default TaskList; 