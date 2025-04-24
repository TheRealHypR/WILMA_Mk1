import React, { useState, useEffect } from 'react';
import { 
    Dialog, DialogTitle, DialogContent, DialogActions, 
    Button, Select, MenuItem, FormControl, InputLabel, 
    Box, CircularProgress, Alert 
} from '@mui/material';
import { Guest } from '../../models/guest.model';

interface WitnessSelectionModalProps {
    open: boolean;
    onClose: () => void;
    guests: Guest[]; // Liste aller Gäste zur Auswahl
    currentBrideWitnessId: string | null;
    currentGroomWitnessId: string | null;
    onSave: (brideWitnessId: string | null, groomWitnessId: string | null) => Promise<void>; // Funktion zum Speichern
    // Optional: isLoading, error States für Feedback?
}

const WitnessSelectionModal: React.FC<WitnessSelectionModalProps> = ({ 
    open, onClose, guests, currentBrideWitnessId, currentGroomWitnessId, onSave 
}) => {

    const [selectedBrideWitnessId, setSelectedBrideWitnessId] = useState<string | null>(null);
    const [selectedGroomWitnessId, setSelectedGroomWitnessId] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [saveError, setSaveError] = useState<string | null>(null);

    // Initialisiere die Auswahl, wenn sich die Props ändern oder das Modal öffnet
    useEffect(() => {
        if (open) {
            setSelectedBrideWitnessId(currentBrideWitnessId);
            setSelectedGroomWitnessId(currentGroomWitnessId);
            setSaveError(null); // Fehler zurücksetzen beim Öffnen
        }
    }, [open, currentBrideWitnessId, currentGroomWitnessId]);

    const handleSave = async () => {
        setIsSaving(true);
        setSaveError(null);
        try {
            await onSave(selectedBrideWitnessId, selectedGroomWitnessId);
            // onClose(); // Schließen erfolgt durch onSave in der aufrufenden Komponente
        } catch (error) {
            console.error("Fehler beim Speichern der Trauzeugen im Modal:", error);
            setSaveError("Fehler beim Speichern. Bitte erneut versuchen.");
        } finally {
            setIsSaving(false);
        }
    };

    // Filtert Gäste heraus, die bereits für die *andere* Rolle ausgewählt wurden,
    // damit niemand beide Rollen gleichzeitig hat.
    const getAvailableGuests = (excludeRoleId: string | null): Guest[] => {
        return guests.filter(guest => guest.id !== excludeRoleId);
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
            <DialogTitle>Trauzeugen auswählen</DialogTitle>
            <DialogContent dividers>
                {saveError && <Alert severity="error" sx={{ mb: 2 }}>{saveError}</Alert>}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
                    {/* Trauzeuge Braut */}
                    <FormControl fullWidth>
                        <InputLabel id="select-bride-witness-label">Trauzeuge Braut</InputLabel>
                        <Select
                            labelId="select-bride-witness-label"
                            id="select-bride-witness"
                            value={selectedBrideWitnessId || ''} // Leerer String, wenn null
                            label="Trauzeuge Braut"
                            onChange={(e) => setSelectedBrideWitnessId(e.target.value === '' ? null : e.target.value as string)}
                            disabled={isSaving}
                        >
                            <MenuItem value=""><em>-- Keiner --</em></MenuItem>
                            {getAvailableGuests(selectedGroomWitnessId).map((guest) => (
                                <MenuItem key={guest.id} value={guest.id}>
                                    {guest.firstName} {guest.lastName || ''}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    {/* Trauzeuge Bräutigam */}
                    <FormControl fullWidth>
                        <InputLabel id="select-groom-witness-label">Trauzeuge Bräutigam</InputLabel>
                        <Select
                            labelId="select-groom-witness-label"
                            id="select-groom-witness"
                            value={selectedGroomWitnessId || ''} // Leerer String, wenn null
                            label="Trauzeuge Bräutigam"
                            onChange={(e) => setSelectedGroomWitnessId(e.target.value === '' ? null : e.target.value as string)}
                            disabled={isSaving}
                        >
                            <MenuItem value=""><em>-- Keiner --</em></MenuItem>
                            {getAvailableGuests(selectedBrideWitnessId).map((guest) => (
                                <MenuItem key={guest.id} value={guest.id}>
                                    {guest.firstName} {guest.lastName || ''}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} disabled={isSaving}>Abbrechen</Button>
                <Button onClick={handleSave} variant="contained" disabled={isSaving}>
                    {isSaving ? <CircularProgress size={24} /> : 'Speichern'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default WitnessSelectionModal; 