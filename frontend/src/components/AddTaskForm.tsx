import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { addTask } from '../services/task.service';
import { TextField, Button, Box, CircularProgress, Alert } from '@mui/material';

interface AddTaskFormProps {
  onTaskAdded: () => void; // Callback, um die Liste zu aktualisieren
}

const AddTaskForm: React.FC<AddTaskFormProps> = ({ onTaskAdded }) => {
  const { currentUser } = useAuth();
  const [title, setTitle] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!currentUser || !title.trim()) {
      setError("Titel darf nicht leer sein.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await addTask(currentUser.uid, title.trim());
      setTitle('');
      onTaskAdded();
    } catch (err) {
      console.error("Fehler beim Hinzufügen der Aufgabe:", err);
      setError("Aufgabe konnte nicht hinzugefügt werden.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2, display: 'flex', gap: 1 }}>
      <TextField
        label="Neue Aufgabe"
        variant="outlined"
        size="small"
        fullWidth
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        disabled={loading}
      />
      <Button
        type="submit"
        variant="contained"
        disabled={loading || !title.trim()}
        sx={{ flexShrink: 0 }}
      >
        {loading ? <CircularProgress size={24} color="inherit" /> : 'Hinzufügen'}
      </Button>
      {error && <Alert severity="error" sx={{ mt: 1, width: '100%' }}>{error}</Alert>}
    </Box>
  );
};

export default AddTaskForm; 