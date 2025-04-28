import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { addTask } from '../services/task.service';
import { TextField, Button, Box, CircularProgress, Alert, Stack } from '@mui/material';

interface AddTaskFormProps {
  onTaskAdded: () => void; // Callback, um die Liste zu aktualisieren
  onCancel?: () => void; // Optionaler Callback zum Abbrechen
}

// Hilfsfunktion zum Formatieren eines Date-Objekts als YYYY-MM-DD String
const formatDateForInput = (date: Date): string => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
};

const AddTaskForm: React.FC<AddTaskFormProps> = ({ onTaskAdded, onCancel }) => {
  const { currentUser } = useAuth();
  const [description, setDescription] = useState<string>('');
  const [dueDateString, setDueDateString] = useState<string>(''); // State für <input type="date"> (als String YYYY-MM-DD)
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!currentUser || !description.trim()) {
      setError("Beschreibung darf nicht leer sein.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Konvertiere den String aus dem Input in ein Date-Objekt oder null
      // Wichtig: Date.parse interpretiert YYYY-MM-DD als UTC. Um Zeitzonenprobleme zu vermeiden,
      // ist es oft besser, es manuell zu parsen oder eine Bibliothek wie dayjs zu verwenden,
      // aber für die reine Übergabe an Firestore (der es als Timestamp speichert) sollte Date.parse reichen.
      const dueDate = dueDateString ? new Date(dueDateString) : null;

      await addTask(currentUser.uid, description.trim(), dueDate);
      setDescription(''); // Formular zurücksetzen
      setDueDateString(''); // Datumsfeld zurücksetzen
      onTaskAdded(); // Elternkomponente benachrichtigen
    } catch (err) {
      console.error("Fehler beim Hinzufügen der Aufgabe:", err);
      setError("Aufgabe konnte nicht hinzugefügt werden.");
    } finally {
      setLoading(false);
    }
  };

  // Heutiges Datum für das min-Attribut des Date Inputs
  const today = formatDateForInput(new Date());

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2, p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1 }}>
      <Stack spacing={2}>
        <TextField
          label="Neue Aufgabe"
          variant="outlined"
          fullWidth
          size="small"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={loading}
          autoFocus
        />
        <TextField
          label="Fällig am (optional)"
          type="date"
          value={dueDateString}
          onChange={(e) => setDueDateString(e.target.value)}
          variant="outlined"
          fullWidth
          size="small"
          disabled={loading}
          inputProps={{ min: today }}
          InputLabelProps={{ shrink: true }}
        />

        <Stack direction="row" spacing={1} justifyContent="flex-end">
          {onCancel && (
            <Button
              variant="text"
              onClick={onCancel}
              disabled={loading}
            >
              Abbrechen
            </Button>
          )}
          <Button
            type="submit"
            variant="contained"
            disabled={loading || !description.trim()}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Hinzufügen'}
          </Button>
        </Stack>

        {error && <Alert severity="error" sx={{ width: '100%' }}>{error}</Alert>}
      </Stack>
    </Box>
  );
};

export default AddTaskForm; 