import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getTasks, updateTask, deleteTask, TaskUpdatePayload } from '../services/task.service';
import { Task } from '../models/task.model';
import TaskItem from './TaskItem'; // Importiere die TaskItem Komponente
import AddTaskForm from './AddTaskForm'; // Importiere AddTaskForm
import { List, Typography, Box, CircularProgress, Alert, Divider, Button, Stack, Checkbox, FormControlLabel, TextField, InputAdornment, IconButton, Select, MenuItem, FormControl, InputLabel } from '@mui/material'; // Material UI Imports ergänzt
import { Timestamp } from 'firebase/firestore';
import AddIcon from '@mui/icons-material/Add'; // Optional: Icon für Button
import ClearIcon from '@mui/icons-material/Clear'; // Icon für Clear-Button

// Hilfsfunktion für Datumsformatierung (könnte in utils ausgelagert werden)
const formatDateForInput = (date: Date | Timestamp | null | undefined): string => {
    if (!date) return '';
    const dateObj = date instanceof Timestamp ? date.toDate() : date;
    const year = dateObj.getFullYear();
    const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
    const day = dateObj.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
};

// Typ für Sortieroptionen
type SortOption = 'createdAt_desc' | 'dueDate_asc' | 'description_asc';
// Typ für Datumsfilteroptionen
type DueDateFilterOption = 'all' | 'today' | 'this_week';

const TaskList: React.FC = () => {
  const { currentUser } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingTaskId, setUpdatingTaskId] = useState<string | null>(null); // Für Ladeindikator beim Update/Delete
  const [showAddForm, setShowAddForm] = useState<boolean>(false); // State für Formular-Sichtbarkeit
  
  // States für Filter
  const [hideCompleted, setHideCompleted] = useState<boolean>(false);
  const [dueDateFilter, setDueDateFilter] = useState<DueDateFilterOption>('all'); // Neuer State
  const [sortOrder, setSortOrder] = useState<SortOption>('createdAt_desc'); // State für Sortierung

  // Funktion zum Abrufen der Aufgaben (mit useCallback optimiert)
  const fetchTasks = useCallback(async () => {
    if (!currentUser) {
      setTasks([]);
      setLoading(false);
      return;
    }
    if (tasks.length === 0 && !updatingTaskId) setLoading(true);
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
  }, [currentUser, tasks.length]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Callback für Task-Updates
  const handleUpdateTask = async (taskId: string, updates: TaskUpdatePayload) => {
    if (!currentUser) return;
    setUpdatingTaskId(taskId);
    setError(null);
    const originalTask = tasks.find(t => t.id === taskId);
    // Optimistisches Update
    setTasks(prevTasks =>
        prevTasks.map(task => {
          if (task.id === taskId) {
            const updatedTask = { ...task, ...updates };
            if (updates.hasOwnProperty('dueDate')) {
                if (updates.dueDate instanceof Date) {
                    updatedTask.dueDate = Timestamp.fromDate(updates.dueDate);
                } else {
                     updatedTask.dueDate = updates.dueDate;
                }
            }
            return updatedTask as Task;
          }
          return task;
        })
    );
    try {
        await updateTask(currentUser.uid, taskId, updates);
    } catch (err) {
        console.error("Fehler beim Aktualisieren der Aufgabe:", err);
        setError("Aufgabe konnte nicht aktualisiert werden.");
        // Rollback bei Fehler
        if (originalTask) setTasks(prev => prev.map(t => t.id === taskId ? originalTask : t));
        else await fetchTasks(); // Fallback: neu laden
    } finally {
        setUpdatingTaskId(null);
    }
  };

  // Callback für Task-Löschung
  const handleDeleteTask = async (taskId: string) => {
    if (!currentUser) return;
    setUpdatingTaskId(taskId);
    setError(null);
    const originalTasks = [...tasks];
    setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
    try {
        await deleteTask(currentUser.uid, taskId);
    } catch (err) {
        console.error("Fehler beim Löschen der Aufgabe:", err);
        setError("Aufgabe konnte nicht gelöscht werden.");
        setTasks(originalTasks);
    } finally {
        setUpdatingTaskId(null);
    }
  };

  // Callback, wenn eine Aufgabe hinzugefügt wurde
  const handleTaskAdded = () => {
    setShowAddForm(false);
    fetchTasks();
  };

  // Callback zum Abbrechen des Hinzufügens
  const handleCancelAddTask = () => {
    setShowAddForm(false);
  };

  // Gefilterte und sortierte Aufgabenliste mit useMemo erstellen
  const filteredAndSortedTasks = useMemo(() => {
    let result = tasks;

    // 1. Nach Status filtern (falls hideCompleted true ist)
    if (hideCompleted) {
      result = result.filter(task => task.status !== 'done');
    }

    // 2. Filtern nach Fälligkeitsdatum (NEUE LOGIK)
    if (dueDateFilter !== 'all') {
        const now = new Date();
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0).getTime();
        const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59, 999).getTime();

        if (dueDateFilter === 'today') {
            result = result.filter(task => {
                if (!task.dueDate) return false;
                const taskDueDateMs = task.dueDate.toMillis();
                return taskDueDateMs >= todayStart && taskDueDateMs <= todayEnd;
            });
        } else if (dueDateFilter === 'this_week') {
            const dayOfWeek = now.getDay(); // 0=Sonntag, 1=Montag, ...
            const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // Tage bis zum letzten Montag
            const monday = new Date(now.getFullYear(), now.getMonth(), now.getDate() + diffToMonday, 0, 0, 0, 0);
            const sunday = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + 6, 23, 59, 59, 999); // Ende des Sonntags dieser Woche
            const weekStartMs = monday.getTime();
            const weekEndMs = sunday.getTime();

            result = result.filter(task => {
                if (!task.dueDate) return false;
                const taskDueDateMs = task.dueDate.toMillis();
                return taskDueDateMs >= weekStartMs && taskDueDateMs <= weekEndMs;
            });
        }
    }

    // 3. Sortieren (Kopie erstellen, um Original-Array nicht zu ändern)
    result = [...result].sort((a, b) => {
      switch (sortOrder) {
        case 'dueDate_asc':
          if (!a.dueDate && !b.dueDate) return 0;
          if (!a.dueDate) return 1; // Ohne Datum ans Ende
          if (!b.dueDate) return -1; // Ohne Datum ans Ende
          return a.dueDate.toMillis() - b.dueDate.toMillis();
        case 'description_asc':
          return a.description.localeCompare(b.description);
        case 'createdAt_desc':
        default:
          return b.createdAt.toMillis() - a.createdAt.toMillis();
      }
    });

    return result;
  }, [tasks, hideCompleted, dueDateFilter, sortOrder]);

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
      {/* Bereich für Steuerelemente - Jetzt aufgeteilt */}
      
      {/* Zeile 1: Button zum Hinzufügen (nur wenn Formular nicht sichtbar ist) */}
      {!showAddForm && (
        <Box sx={{ mb: 2 }}> {/* Eigener Container für den Button mit Abstand nach unten */} 
          <Button 
            variant="contained" 
            startIcon={<AddIcon />} 
            onClick={() => setShowAddForm(true)}
          >
            Neue Aufgabe
          </Button>
        </Box>
      )}

       {/* Zeile 2: Filter- und Sortier-Steuerelemente in einem horizontalen Stack */} 
       <Stack direction="row" spacing={2} sx={{ mb: 2 }} alignItems="center" flexWrap="wrap"> {/* flexWrap für kleinere Bildschirme */}
          <FormControlLabel 
            control={<Checkbox checked={hideCompleted} onChange={(e) => setHideCompleted(e.target.checked)} />} 
            label="Erledigte ausblenden"
          />
           {/* Neues Select für Datumsfilter */} 
           <FormControl size="small" sx={{ minWidth: 160 }}> 
               <InputLabel id="duedate-filter-select-label">Fälligkeit</InputLabel>
               <Select
                   labelId="duedate-filter-select-label"
                   id="duedate-filter-select"
                   value={dueDateFilter}
                   label="Fälligkeit"
                   onChange={(e) => setDueDateFilter(e.target.value as DueDateFilterOption)}
               >
                   <MenuItem value={'all'}>Alle</MenuItem>
                   <MenuItem value={'today'}>Heute fällig</MenuItem>
                   <MenuItem value={'this_week'}>Diese Woche fällig</MenuItem>
               </Select>
           </FormControl>
          {/* Sortier-Dropdown */} 
          <FormControl size="small" sx={{ minWidth: 150, ml: 'auto' /* Schiebt nach rechts */ }}> 
              <InputLabel id="sort-select-label">Sortieren nach</InputLabel>
              <Select
                  labelId="sort-select-label"
                  id="sort-select"
                  value={sortOrder}
                  label="Sortieren nach"
                  onChange={(e) => setSortOrder(e.target.value as SortOption)}
              >
                  <MenuItem value={'createdAt_desc'}>Neueste zuerst</MenuItem>
                  <MenuItem value={'dueDate_asc'}>Fälligkeit (aufst.)</MenuItem>
                  <MenuItem value={'description_asc'}>Beschreibung (A-Z)</MenuItem>
              </Select>
          </FormControl>
        </Stack>

      {/* Formular (wird nur bei Bedarf angezeigt) */} 
      {showAddForm && (
        <AddTaskForm 
            onTaskAdded={handleTaskAdded} 
            onCancel={handleCancelAddTask} 
        />
      )}

      <Divider sx={{ my: 2 }} />

      {/* Zeige die gefilterte und sortierte Liste an */} 
      {filteredAndSortedTasks.length === 0 && !loading ? (
        <Typography sx={{ mt: 2, textAlign: 'center' }}>
          {tasks.length > 0 ? 'Keine Aufgaben entsprechen den Filtern.' : 'Keine Aufgaben vorhanden.'}
        </Typography>
      ) : (
        <List sx={{ width: '100%', bgcolor: 'background.paper', pt: 0 }}>
          {filteredAndSortedTasks.map((task) => (
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