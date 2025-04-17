import React, { useState, useEffect, FormEvent } from 'react';
import { Box, TextField, Button, Select, MenuItem, FormControl, InputLabel, InputAdornment, Typography, Stack, Alert } from '@mui/material';
import { Timestamp } from 'firebase/firestore';

// Interface für die Daten, die das Formular verarbeitet (angepasst für null)
export interface BudgetItemFormData {
  description: string;
  category?: string | null; // Erlaube null
  estimatedCost: number | string; 
  actualCost?: number | string | null; // Erlaube null
  status: 'planned' | 'booked' | 'partially-paid' | 'paid';
  // Datenfelder (dueDate, paidDate) könnten hier als String oder Date-Objekt hinzugefügt werden
  notes?: string | null; // Erlaube null
}

// Interface für die Props der Komponente
interface BudgetItemFormProps {
  onSubmit: (formData: BudgetItemFormData) => Promise<void>; 
  onCancel: () => void; 
  // Passe initialData an, um null zu erlauben (obwohl es von Firestore kommt)
  initialData?: Partial<BudgetItemFormData> & { id?: string }; 
  isSaving?: boolean; 
}

const BudgetItemForm: React.FC<BudgetItemFormProps> = ({ 
  onSubmit, 
  onCancel, 
  initialData, 
  isSaving = false 
}) => {
  // State für die Formularfelder, initialisiert mit initialData oder Defaults
  const [description, setDescription] = useState(initialData?.description || '');
  const [category, setCategory] = useState(initialData?.category || '');
  const [estimatedCost, setEstimatedCost] = useState<number | string>(initialData?.estimatedCost ?? '');
  const [actualCost, setActualCost] = useState<number | string>(initialData?.actualCost ?? '');
  const [status, setStatus] = useState<'planned' | 'booked' | 'partially-paid' | 'paid'>(initialData?.status || 'planned');
  const [notes, setNotes] = useState(initialData?.notes || '');
  const [error, setError] = useState<string | null>(null);

  // Update state if initialData changes (e.g., when opening modal for different item)
  useEffect(() => {
    if (initialData) {
      setDescription(initialData.description || '');
      setCategory(initialData.category || '');
      setEstimatedCost(initialData.estimatedCost ?? '');
      setActualCost(initialData.actualCost ?? '');
      setStatus(initialData.status || 'planned');
      setNotes(initialData.notes || '');
    } else {
      // Reset form for adding new item
      setDescription('');
      setCategory('');
      setEstimatedCost('');
      setActualCost('');
      setStatus('planned');
      setNotes('');
    }
  }, [initialData]);

  const handleSubmit = async (event: FormEvent) => {
    console.log("Form handleSubmit triggered");
    event.preventDefault();
    setError(null);

    // Einfache Validierung
    const estCostNum = parseFloat(String(estimatedCost));
    if (!description.trim()) {
      setError("Beschreibung darf nicht leer sein.");
      return;
    }
    if (isNaN(estCostNum) || estCostNum < 0) {
      setError("Geschätzte Kosten müssen eine positive Zahl sein.");
      return;
    }

    const actCostNum = actualCost !== '' ? parseFloat(String(actualCost)) : undefined;
    if (actualCost !== '' && (isNaN(actCostNum!) || actCostNum! < 0)) {
        setError("Tatsächliche Kosten müssen eine positive Zahl sein (oder leer).");
        return;
    }

    console.log("Validation passed, calling onSubmit prop...");
    const formData: BudgetItemFormData = {
      description: description.trim(),
      category: category.trim() || null,
      estimatedCost: estCostNum,
      actualCost: actCostNum !== undefined ? actCostNum : null,
      status,
      notes: notes.trim() || null,
    };

    try {
      await onSubmit(formData);
    } catch (err) {
      console.error("Fehler beim Speichern des Budget-Items (aus onSubmit Prop):", err);
      setError("Speichern fehlgeschlagen. Bitte versuchen Sie es erneut.");
    }
  };

  console.log("Form rendering, isSaving prop:", isSaving, "description:", description);

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      <Stack spacing={2}>
        {error && <Alert severity="error">{error}</Alert>}
        <TextField
          label="Beschreibung"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          fullWidth
          disabled={isSaving}
          autoFocus // Fokussiert das erste Feld beim Öffnen
        />
        <TextField
          label="Kategorie (Optional)"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          fullWidth
          disabled={isSaving}
        />
        <TextField
          label="Geschätzte Kosten"
          value={estimatedCost}
          onChange={(e) => setEstimatedCost(e.target.value.replace(/[^0-9.,]/g, ''))} // Erlaube nur Zahlen, Komma, Punkt
          required
          fullWidth
          type="text" // Verwende text, um Komma zu erlauben, Konvertierung in handleSubmit
          inputMode="decimal"
          InputProps={{
            startAdornment: <InputAdornment position="start">€</InputAdornment>,
          }}
          disabled={isSaving}
        />
        <TextField
          label="Tatsächliche Kosten (Optional)"
          value={actualCost}
          onChange={(e) => setActualCost(e.target.value.replace(/[^0-9.,]/g, ''))}
          fullWidth
          type="text"
          inputMode="decimal"
          InputProps={{
            startAdornment: <InputAdornment position="start">€</InputAdornment>,
          }}
          disabled={isSaving}
        />
        <FormControl fullWidth required disabled={isSaving}>
          <InputLabel id="status-select-label">Status</InputLabel>
          <Select
            labelId="status-select-label"
            id="status-select"
            value={status}
            label="Status"
            onChange={(e) => setStatus(e.target.value as BudgetItemFormData['status'])}
          >
            <MenuItem value={'planned'}>Geplant</MenuItem>
            <MenuItem value={'booked'}>Gebucht/Bestellt</MenuItem>
            <MenuItem value={'partially-paid'}>Angezahlt</MenuItem>
            <MenuItem value={'paid'}>Bezahlt</MenuItem>
          </Select>
        </FormControl>
        <TextField
          label="Notizen (Optional)"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          fullWidth
          multiline
          rows={3}
          disabled={isSaving}
        />
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 2 }}>
          <Button onClick={onCancel} disabled={isSaving} variant="outlined">
            Abbrechen
          </Button>
          <Button type="submit" disabled={isSaving} variant="contained">
            {isSaving ? 'Speichert...' : (initialData ? 'Änderungen speichern' : 'Posten hinzufügen')}
          </Button>
        </Box>
      </Stack>
    </Box>
  );
};

export default BudgetItemForm; 