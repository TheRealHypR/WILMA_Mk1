import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getGuests, updateGuest, deleteGuest } from '../services/guest.service'; // Importiere Guest-Service
import { Guest } from '../models/guest.model'; // Importiere Guest-Modell
import { 
    List, ListItem, ListItemText, Typography, Box, 
    CircularProgress, Alert, Divider, Button, Stack,
    Select, MenuItem, FormControl, InputLabel
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import AddGuestForm from './AddGuestForm'; // Importiere AddGuestForm
import GuestItem, { GuestUpdatePayload } from './GuestItem'; // GuestItem importieren + Payload Typ

// Typ für Status-Filteroptionen
type StatusFilterOption = Guest['status'] | 'all';
// Typ für Sortieroptionen
type GuestSortOption = 'firstName_asc' | 'lastName_asc' | 'status_asc' | 'modifiedAt_desc';

const GuestList: React.FC = () => {
  const { currentUser } = useAuth();
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [statusFilter, setStatusFilter] = useState<StatusFilterOption>('all'); // State für Status-Filter
  const [guestSortOrder, setGuestSortOrder] = useState<GuestSortOption>('firstName_asc'); // State für Sortierung

  // Funktion zum Abrufen der Gäste
  const fetchGuests = useCallback(async () => {
    if (!currentUser) {
      setGuests([]);
      setLoading(false);
      return;
    }
    // Initiales Laden
    if (guests.length === 0) setLoading(true); 
    setError(null);
    try {
      const fetchedGuests = await getGuests(currentUser.uid);
      setGuests(fetchedGuests);
    } catch (err) {
      console.error("Fehler beim Abrufen der Gäste:", err);
      setError("Gästeliste konnte nicht geladen werden.");
    } finally {
      setLoading(false);
    }
  }, [currentUser, guests.length]); 

  useEffect(() => {
    fetchGuests();
  }, [fetchGuests]);

  // Placeholder für Handler (add, update, delete)
  const handleGuestAdded = () => {
      setShowAddForm(false);
      fetchGuests(); 
  };

  const handleCancelAddGuest = () => {
      setShowAddForm(false);
  };

  // Handler für Updates aus GuestItem
  const handleUpdateGuest = async (guestId: string, updates: GuestUpdatePayload) => {
    if (!currentUser) return;
    setError(null); // Fehler zurücksetzen
    const originalGuests = [...guests];
    // Optimistisches Update: Wende Änderungen lokal an.
    // modifiedAt wird serverseitig durch den updateGuest-Aufruf aktualisiert.
    setGuests(prevGuests => 
        prevGuests.map(guest => 
            guest.id === guestId ? { ...guest, ...updates } as Guest : guest // Cast zu Guest
        )
    );
    try {
      await updateGuest(currentUser.uid, guestId, updates);
      // Erfolgreich - das optimistische Update bleibt bestehen.
    } catch (err) {
      console.error("Fehler beim Aktualisieren des Gastes (GuestList):", err);
      setError(`Fehler beim Speichern von Gast ${guestId}.`);
      setGuests(originalGuests); // Rollback bei Fehler
    }
  };

  // Handler für Löschen aus GuestItem
  const handleDeleteGuest = async (guestId: string) => {
      if (!currentUser) return;
      setError(null); // Fehler zurücksetzen
      const originalGuests = [...guests];
      // Optimistisches Update
      setGuests(prevGuests => prevGuests.filter(g => g.id !== guestId));
      try {
          await deleteGuest(currentUser.uid, guestId);
      } catch (err) {
          console.error("Fehler beim Löschen des Gastes (GuestList):", err);
          setError(`Fehler beim Löschen von Gast ${guestId}.`);
          setGuests(originalGuests); // Rollback
      }
  };

  // Gefilterte UND sortierte Gästeliste
  const filteredAndSortedGuests = useMemo(() => {
    let result = guests;

    // 1. Filtern nach Status
    if (statusFilter !== 'all') {
      result = result.filter(guest => guest.status === statusFilter);
    }

    // 2. Sortieren
    result = [...result].sort((a, b) => {
      switch (guestSortOrder) {
        case 'lastName_asc':
          return (a.lastName || '').localeCompare(b.lastName || '');
        case 'status_asc':
          // Optional: Eigene Reihenfolge für Status definieren
          return a.status.localeCompare(b.status);
        case 'modifiedAt_desc':
          return b.modifiedAt.toMillis() - a.modifiedAt.toMillis();
        case 'firstName_asc':
        default:
          return a.firstName.localeCompare(b.firstName);
      }
    });

    return result;
  }, [guests, statusFilter, guestSortOrder]); // guestSortOrder als Abhängigkeit hinzugefügt

  // --- Render Logik ---

  if (loading && guests.length === 0) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}><CircularProgress /></Box>;
  }

  if (error) {
    return <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>;
  }

  if (!currentUser) {
    return <Typography sx={{ mt: 2 }}>Bitte anmelden.</Typography>;
  }

  return (
    <Box>
      {/* Steuerungsleiste: Add Form Toggle und Filter */} 
      <Stack direction="row" spacing={2} sx={{ mb: 2 }} alignItems="center" flexWrap="wrap">
          {!showAddForm && (
            <Button 
              variant="contained" 
              startIcon={<AddIcon />} 
              onClick={() => setShowAddForm(true)}
            >
              Neuen Gast hinzufügen
            </Button>
          )}

          {/* Status Filter Dropdown */} 
          <FormControl size="small" sx={{ minWidth: 150, ml: showAddForm ? 0 : 'auto' /* Nach rechts schieben, wenn Button weg ist */ }}>
              <InputLabel id="status-filter-select-label">Status filtern</InputLabel>
              <Select
                  labelId="status-filter-select-label"
                  id="status-filter-select"
                  value={statusFilter}
                  label="Status filtern"
                  onChange={(e) => setStatusFilter(e.target.value as StatusFilterOption)}
              >
                  <MenuItem value={'all'}>Alle Status</MenuItem>
                  <MenuItem value={'to-invite'}>Einladen</MenuItem>
                  <MenuItem value={'invited'}>Eingeladen</MenuItem>
                  <MenuItem value={'confirmed'}>Zugesagt</MenuItem>
                  <MenuItem value={'declined'}>Abgesagt</MenuItem>
                  <MenuItem value={'maybe'}>Vielleicht</MenuItem>
              </Select>
          </FormControl>
          
          {/* Sortier-Dropdown */} 
          <FormControl size="small" sx={{ minWidth: 180 }}> {/* ml:auto entfernt, da es nicht mehr das letzte Element sein muss */} 
              <InputLabel id="guest-sort-select-label">Sortieren nach</InputLabel>
              <Select
                  labelId="guest-sort-select-label"
                  id="guest-sort-select"
                  value={guestSortOrder}
                  label="Sortieren nach"
                  onChange={(e) => setGuestSortOrder(e.target.value as GuestSortOption)}
              >
                  <MenuItem value={'firstName_asc'}>Vorname (A-Z)</MenuItem>
                  <MenuItem value={'lastName_asc'}>Nachname (A-Z)</MenuItem>
                  <MenuItem value={'status_asc'}>Status</MenuItem>
                  <MenuItem value={'modifiedAt_desc'}>Zuletzt geändert</MenuItem>
              </Select>
          </FormControl>
       </Stack>

      {/* Formular zum Hinzufügen */}
      {showAddForm && (
         <AddGuestForm 
             onGuestAdded={handleGuestAdded} 
             onCancel={handleCancelAddGuest} 
         />
      )}

      {/* Platzhalter für Filter/Sortier-Optionen */} 
      {/* <Divider sx={{ my: 2 }} /> */}

      {/* Liste anzeigen (verwende gefilterte UND sortierte Liste) */} 
      {filteredAndSortedGuests.length === 0 && !loading ? (
        <Typography sx={{ mt: 2, textAlign: 'center' }}>
           {guests.length > 0 && statusFilter !== 'all' ? 'Keine Gäste entsprechen dem Filter.' : 'Keine Gäste vorhanden.'}
        </Typography>
      ) : (
        <List sx={{ width: '100%', bgcolor: 'background.paper' }}> 
          {filteredAndSortedGuests.map((guest) => (
            <GuestItem 
                key={guest.id} 
                guest={guest} 
                onUpdate={handleUpdateGuest}
                onDelete={handleDeleteGuest}
            />
          ))}
        </List>
      )}
    </Box>
  );
};

export default GuestList; 