import React, { useState } from 'react';
import { Task } from '../models/task.model';
import { 
    ListItem, ListItemText, Checkbox, IconButton, 
    Typography, Box, TextField, Stack, Chip // Chip hinzugefügt
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import EventIcon from '@mui/icons-material/Event'; // Icon für Datum
import { TaskUpdatePayload } from '../services/task.service';
import { Timestamp } from 'firebase/firestore'; // Import Timestamp for conversion

// Hilfsfunktion aus AddTaskForm wiederverwenden (oder besser in eine utils-Datei auslagern)
// Passe den Typ an, um Date oder Timestamp zu akzeptieren
const formatDateForInput = (date: Date | Timestamp | null | undefined): string => {
    if (!date) return '';
    // Wenn es ein Timestamp ist, zuerst in Date konvertieren
    const dateObj = date instanceof Timestamp ? date.toDate() : date;
    const year = dateObj.getFullYear();
    const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
    const day = dateObj.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
};

interface TaskItemProps {
  task: Task;
  onUpdate: (taskId: string, updates: TaskUpdatePayload) => Promise<void>; // Mache es zu Promise für await
  onDelete: (taskId: string) => Promise<void>; // Mache es zu Promise für await
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDueDateString, setEditDueDateString] = useState(formatDateForInput(task.dueDate)); // Format für <input type="date">
  const [isUpdating, setIsUpdating] = useState(false); // Für Ladezustand während Update/Delete

  const handleStatusChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const newStatus = event.target.checked ? 'done' : 'open';
    setIsUpdating(true);
    try {
       await onUpdate(task.id, { status: newStatus });
    } finally {
        setIsUpdating(false);
    }
  };

  const handleDeleteClick = async () => {
    setIsUpdating(true);
    try {
        await onDelete(task.id);
     } finally {
         // Komponente wird eh entfernt, kein Reset nötig
     }
  };

  const handleEditClick = () => {
    setEditTitle(task.title); // Setze auf aktuellen Wert beim Öffnen
    setEditDueDateString(formatDateForInput(task.dueDate));
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    // Werte zurücksetzen ist nicht nötig, da sie beim nächsten Öffnen neu gesetzt werden
  };

  const handleSaveClick = async () => {
    if (!editTitle.trim()) return; // Titel darf nicht leer sein
    setIsUpdating(true);
    const updates: TaskUpdatePayload = {};
    if (editTitle.trim() !== task.title) {
        updates.title = editTitle.trim();
    }
    const currentDueDateString = formatDateForInput(task.dueDate);
    if (editDueDateString !== currentDueDateString) {
        updates.dueDate = editDueDateString ? new Date(editDueDateString) : null;
    }

    // Nur speichern, wenn es Änderungen gibt
    if (Object.keys(updates).length > 0) {
        try {
            await onUpdate(task.id, updates);
            setIsEditing(false);
        } catch (error) {
            console.error("Fehler beim Speichern der Änderungen:", error);
            // Hier könnte man eine Fehlermeldung anzeigen
        }
    } else {
        setIsEditing(false); // Keine Änderungen, einfach schließen
    }
    setIsUpdating(false);
  };

  // Heutiges Datum für das min-Attribut des Date Inputs
  const today = formatDateForInput(new Date());

  return (
    <ListItem
      key={task.id}
      disablePadding
      sx={{ 
          opacity: isUpdating ? 0.5 : 1, 
          py: isEditing ? 1: 0.5, // Etwas vertikaler Abstand
          borderBottom: '1px solid', 
          borderColor: 'divider',
       }}
    >
      {!isEditing ? (
        // Ansichtsmodus: Passe Box-Ausrichtung an und entferne gap
        <Box sx={{ display: 'flex', alignItems: 'flex-start', width: '100%' }}> 
          <Checkbox
            edge="start"
            checked={task.status === 'done'}
            onChange={handleStatusChange}
            tabIndex={-1}
            disableRipple
            inputProps={{ 'aria-labelledby': `checkbox-list-label-${task.id}` }}
            disabled={isUpdating}
            sx={{ pt: 0.5 }} // Leichter Abstand oben für bessere Ausrichtung mit Text
          />
          {/* Stack für Titel, Datum UND Icons */}
          <Stack sx={{ flexGrow: 1, pl: 1 /* Abstand zur Checkbox */ }}> 
            <Typography 
                id={`checkbox-list-label-${task.id}`}
                variant="body1" 
                sx={{ 
                    textDecoration: task.status === 'done' ? 'line-through' : 'none',
                    wordBreak: 'break-word' // Zeilenumbruch für lange Titel
                }}
            >
              {task.title}
            </Typography>
            {task.dueDate && (
              <Chip 
                icon={<EventIcon fontSize="small" />} // Datums-Icon
                label={`Fällig: ${formatDateForInput(task.dueDate)}`} 
                size="small" 
                variant="outlined" // Dezenterer Look
                sx={{ mt: 0.5, width: 'fit-content' }} // Etwas Abstand oben, Breite an Inhalt anpassen
              />
            )}
            {/* Füge den Button-Stack hier UNTER Datum/Titel ein */}
            <Stack direction="row" spacing={0} sx={{ mt: 1 /* Abstand nach oben */ }}> 
                 <IconButton size="small" aria-label="edit" onClick={handleEditClick} disabled={isUpdating}>
                     <EditIcon fontSize="small" />
                 </IconButton>
                  <IconButton size="small" aria-label="delete" onClick={handleDeleteClick} disabled={isUpdating}>
                     <DeleteIcon fontSize="small" />
                  </IconButton>
             </Stack>
          </Stack>
           
           {/* Entferne den Button-Stack von hier */}
           
        </Box>
      ) : (
         // Bearbeitungsmodus bleibt gleich
         <Box sx={{ width: '100%', display: 'flex', alignItems: 'flex-start', gap: 1.5, px: 1 }}>
          <TextField
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            variant="standard"
            size="small"
            disabled={isUpdating}
            autoFocus
            sx={{ flexGrow: 1, mt: 0.5 }}
            multiline
            maxRows={4}
          />
           <TextField
             type="date"
             value={editDueDateString}
             onChange={(e) => setEditDueDateString(e.target.value)}
             variant="standard"
             size="small"
             disabled={isUpdating}
             inputProps={{ min: today }}
             InputLabelProps={{ shrink: true }}
             sx={{ width: '140px' }}
           />
          <Stack direction="row" spacing={0.5} sx={{ mt: 0.5 }}>
            <IconButton size="small" aria-label="save" onClick={handleSaveClick} disabled={isUpdating || !editTitle.trim()}>
              <SaveIcon fontSize="small"/>
            </IconButton>
            <IconButton size="small" aria-label="cancel" onClick={handleCancelClick} disabled={isUpdating}>
              <CancelIcon fontSize="small" />
            </IconButton>
          </Stack>
        </Box>
      )}
    </ListItem>
  );
};

export default TaskItem; 