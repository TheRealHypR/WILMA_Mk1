import React, { useState } from 'react';
import { Task } from '../models/task.model';
import { 
    ListItem, ListItemText, Checkbox, IconButton, 
    Typography, Box, TextField, Stack, Chip,
    Select, MenuItem, FormControl, InputLabel, SelectChangeEvent
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

// NEU: Status Labels und Farben für Tasks
const getTaskStatusLabel = (status: Task['status']): string => {
    switch (status) {
        case 'open': return 'Offen';
        case 'done': return 'Erledigt';
        default: return status;
    }
};

const taskStatusColors: Record<Task['status'], string> = {
    'open': '#FDFDC1', // Pastell Gelb
    'done': '#D4F0C1'  // Pastell Grün
};

interface TaskItemProps {
  task: Task;
  onUpdate: (taskId: string, updates: TaskUpdatePayload) => Promise<void>; // Mache es zu Promise für await
  onDelete: (taskId: string) => Promise<void>; // Mache es zu Promise für await
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editDescription, setEditDescription] = useState(task.description);
  const [editDueDateString, setEditDueDateString] = useState(formatDateForInput(task.dueDate)); // Format für <input type="date">
  const [isUpdating, setIsUpdating] = useState(false); // Für Ladezustand während Update/Delete

  const handleStatusSelectChange = async (event: SelectChangeEvent<Task['status']>) => {
    const newStatus = event.target.value as Task['status'];
    if (newStatus === task.status) return; // Keine Änderung
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
    setEditDescription(task.description);
    setEditDueDateString(formatDateForInput(task.dueDate));
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    // Werte zurücksetzen ist nicht nötig, da sie beim nächsten Öffnen neu gesetzt werden
  };

  const handleSaveClick = async () => {
    if (!editDescription.trim()) return; // Beschreibung darf nicht leer sein
    setIsUpdating(true);
    const updates: TaskUpdatePayload = {};
    if (editDescription.trim() !== task.description) {
        updates.description = editDescription.trim();
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
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'flex-start'
       }}
    >
      {!isEditing ? (
        // Ansichtsmodus
        <>
          <Stack sx={{ flexGrow: 1, pr: 1 /* Abstand zum Status/Aktionen */ }}> 
            <Typography 
                id={`task-label-${task.id}`}
                variant="body1" 
                sx={{ 
                    wordBreak: 'break-word' // Zeilenumbruch für lange Titel
                }}
            >
              {task.description}
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
          </Stack>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.5, flexShrink: 0 }}> 
                 <FormControl size="small" variant="standard"
                    sx={{ 
                        minWidth: 90,
                        "& .MuiInput-underline:before": { borderBottom: 'none' },
                        "& .MuiInput-underline:hover:not(.Mui-disabled):before": { borderBottom: 'none' },
                        "& .MuiInput-underline:after": { borderBottom: 'none' },
                        "& .MuiSelect-select:focus": { backgroundColor: 'transparent' }
                    }}
                    disabled={isUpdating}
                  >
                    <Select
                        value={task.status}
                        onChange={handleStatusSelectChange}
                        variant="standard"
                        disableUnderline
                        displayEmpty
                        renderValue={(selectedValue) => (
                            <Chip 
                                label={getTaskStatusLabel(selectedValue)}
                                size="small" 
                                sx={{ 
                                    backgroundColor: taskStatusColors[selectedValue] || '#E0E0E0',
                                    color: '#333', 
                                    fontWeight: '500', 
                                    height: '22px',
                                    fontSize: '0.75rem',
                                    cursor: 'pointer' 
                                }}
                            />
                        )}
                    >
                        <MenuItem value={'open'}>{getTaskStatusLabel('open')}</MenuItem>
                        <MenuItem value={'done'}>{getTaskStatusLabel('done')}</MenuItem>
                    </Select>
                </FormControl>
                 <IconButton size="small" aria-label="edit" onClick={handleEditClick} disabled={isUpdating}>
                     <EditIcon fontSize="small" />
                 </IconButton>
                  <IconButton size="small" aria-label="delete" onClick={handleDeleteClick} disabled={isUpdating}>
                     <DeleteIcon fontSize="small" />
                  </IconButton>
             </Stack>
        </>
      ) : (
         // Bearbeitungsmodus bleibt gleich
         <Box sx={{ width: '100%', display: 'flex', alignItems: 'flex-start', gap: 1.5, px: 1 }}>
          <TextField
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
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
            <IconButton size="small" aria-label="save" onClick={handleSaveClick} disabled={isUpdating || !editDescription.trim()}>
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