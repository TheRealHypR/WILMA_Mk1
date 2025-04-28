import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { addGuest } from '../services/guest.service';
import { Guest } from '../models/guest.model';
import {
    TextField, Button, Box, CircularProgress, Alert, Stack, 
    FormControl, InputLabel, Select, MenuItem, SelectChangeEvent,
    Typography, Divider, Checkbox, FormControlLabel, FormGroup
} from '@mui/material';

interface AddGuestFormProps {
  onGuestAdded: () => void; // Callback nach erfolgreichem Hinzufügen
  onCancel?: () => void;   // Callback zum Abbrechen
}

const AddGuestForm: React.FC<AddGuestFormProps> = ({ onGuestAdded, onCancel }) => {
  const { currentUser } = useAuth();
  // Grundlegende States
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [status, setStatus] = useState<Guest['status']>('to-invite'); // Standardwert
  // Neue Felder States
  const [phoneNumber, setPhoneNumber] = useState<string>('');
  const [addressStreet, setAddressStreet] = useState<string>('');
  const [addressCity, setAddressCity] = useState<string>('');
  const [addressPostalCode, setAddressPostalCode] = useState<string>('');
  const [addressCountry, setAddressCountry] = useState<string>('');
  const [relationship, setRelationship] = useState<Guest['relationship']>('family'); // Standardwert setzen
  const [group, setGroup] = useState<string>('');
  const [tableAssignment, setTableAssignment] = useState<string>('');
  const [plusOne, setPlusOne] = useState<boolean>(false);
  const [plusOneName, setPlusOneName] = useState<string>('');
  const [isChild, setIsChild] = useState<boolean>(false);
  const [childAge, setChildAge] = useState<string>(''); // Als String für Input
  const [dietaryRestrictions, setDietaryRestrictions] = useState<string>(''); // Komma-getrennt
  // Weitere Felder könnten hier hinzugefügt werden (phoneNumber, address etc.)

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!currentUser) {
      setError("Benutzer nicht angemeldet.");
      return;
    }
    if (!firstName.trim() || !lastName.trim()) {
      setError("Vor- und Nachname sind Pflichtfelder.");
      return;
    }
    // Explizite Prüfung für relationship hinzufügen
    if (!relationship) {
        setError("Bitte wählen Sie eine Beziehung aus.");
        return;
    }

    setLoading(true);
    setError(null);

    const age = parseInt(childAge, 10);

    // Bereinige Telefonnummer für die Speicherung (optional, entfernt Leerzeichen/Bindestriche)
    const cleanPhoneNumber = phoneNumber.trim() || undefined;

    // Typ Omit<...> angepasst, um invitationSent/rsvpReceived zu entfernen, falls sie im Guest-Typ nicht mehr existieren
    const newGuestData: Omit<Guest, 'id' | 'createdAt' | 'modifiedAt'> = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim() || undefined,
      status: status,
      phoneNumber: cleanPhoneNumber,
      address: {
        street: addressStreet.trim() || undefined,
        city: addressCity.trim() || undefined,
        postalCode: addressPostalCode.trim() || undefined,
        country: addressCountry.trim() || undefined,
      },
      relationship: relationship,
      group: group.trim() || undefined,
      tableAssignment: tableAssignment.trim() || undefined,
      plusOne: plusOne,
      plusOneName: plusOne ? (plusOneName.trim() || undefined) : undefined,
      plusOneConfirmed: false, // Default value
      isChild: isChild,
      childAge: isChild ? (childAge.trim() ? age : undefined) : undefined,
      dietaryRestrictions: dietaryRestrictions.split(',').map(s => s.trim()).filter(Boolean),
      gifts: [], // Default value
      eventParticipation: {}, // Default value
      createdFrom: null, // Default value
      notes: null, // Default value
      specialRequirements: null, // Default value
      // invitationSent: undefined, // Removed - Field does not exist or handled differently
      // rsvpReceived: undefined, // Removed - Field does not exist or handled differently
      // Explicitly map fields from Guest model if they exist in state, e.g.:
      // invitationSentDate: null, // <-- ENTFERNT
      // responseDate: null,       // <-- ENTFERNT
      // role: 'guest'             // <-- ENTFERNT (Regel erwartet stattdessen isTrauzeuge, wenn nötig)
      // Füge isTrauzeuge hinzu, wenn es Teil des Formulars sein soll:
      // isTrauzeuge: false, // Beispiel: Standardwert oder aus State holen
    };

    // Remove properties that are not part of the Omit<Guest, ...> type required by addGuest
    // This avoids sending extra fields like 'invitationSent' or 'rsvpReceived' if they were accidentally included above
    const finalGuestData: Omit<Guest, 'id' | 'createdAt' | 'modifiedAt'> = { ...newGuestData };
    // We could add explicit deletion here if needed, but the type casting should handle it
    // delete (finalGuestData as any).invitationSent;
    // delete (finalGuestData as any).rsvpReceived;

    console.log("Daten, die an addGuest gesendet werden (korrigiert):", finalGuestData);

    try {
      // Annahme: addGuest fügt createdAt und modifiedAt hinzu
      await addGuest(currentUser.uid, finalGuestData);
      // Formular zurücksetzen (alle Felder)
      setFirstName(''); setLastName(''); setEmail(''); setStatus('to-invite');
      setPhoneNumber(''); setAddressStreet(''); setAddressCity('');
      setAddressPostalCode(''); setAddressCountry(''); setRelationship('family');
      setGroup(''); setTableAssignment(''); setPlusOne(false); setPlusOneName('');
      setIsChild(false); setChildAge(''); setDietaryRestrictions('');
      onGuestAdded();
    } catch (err) {
        console.error("Fehler beim Hinzufügen des Gastes:", err);
        if (err instanceof Error && err.message.includes('permission')) {
            setError("Fehler: Fehlende Berechtigungen. Überprüfe die Firestore Regeln.");
        } else {
            setError("Gast konnte nicht hinzugefügt werden. Details siehe Konsole.");
        }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ p: 2, border: '1px solid', borderColor: 'divider', borderRadius: 1, mb: 2 }}>
      <Stack spacing={2}>
        <Typography variant="h6">Neuen Gast hinzufügen</Typography>
        
        {/* Grundlegende Infos */} 
        <TextField label="Vorname" required value={firstName} onChange={(e) => setFirstName(e.target.value)} disabled={loading} size="small" autoFocus />
        <TextField label="Nachname" value={lastName} onChange={(e) => setLastName(e.target.value)} disabled={loading} size="small" />
        <TextField label="E-Mail" type="email" value={email} onChange={(e) => setEmail(e.target.value)} disabled={loading} size="small" />
        <TextField label="Telefon" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} disabled={loading} size="small" />
        <FormControl fullWidth size="small" disabled={loading}>
          <InputLabel id="add-guest-status-label">Status</InputLabel>
          <Select labelId="add-guest-status-label" value={status} label="Status" onChange={(e) => setStatus(e.target.value as Guest['status'])}>
            <MenuItem value={'to-invite'}>Einladen</MenuItem>
            <MenuItem value={'invited'}>Eingeladen</MenuItem>
            <MenuItem value={'confirmed'}>Zugesagt</MenuItem>
            <MenuItem value={'declined'}>Abgesagt</MenuItem>
            <MenuItem value={'maybe'}>Vielleicht</MenuItem>
          </Select>
        </FormControl>

        <Divider sx={{ my: 1 }} />
        <Typography variant="subtitle2">Adresse</Typography>
        <TextField label="Straße" value={addressStreet} onChange={(e) => setAddressStreet(e.target.value)} disabled={loading} size="small" />
        <Stack direction="row" spacing={2}>
          <TextField label="PLZ" value={addressPostalCode} onChange={(e) => setAddressPostalCode(e.target.value)} disabled={loading} size="small" sx={{ flex: 1 }}/>
          <TextField label="Stadt" value={addressCity} onChange={(e) => setAddressCity(e.target.value)} disabled={loading} size="small" sx={{ flex: 2 }}/>
        </Stack>
        <TextField label="Land" value={addressCountry} onChange={(e) => setAddressCountry(e.target.value)} disabled={loading} size="small" />
        
        <Divider sx={{ my: 1 }} />
        <Typography variant="subtitle2">Details & Gruppierung</Typography>
         <FormControl fullWidth size="small">
             <InputLabel id="relationship-select-label">Beziehung</InputLabel>
             <Select
                 labelId="relationship-select-label"
                 value={relationship}
                 label="Beziehung"
                 onChange={(e: SelectChangeEvent<Guest['relationship']>) => setRelationship(e.target.value as Guest['relationship'])}
                 disabled={loading}
             >
                 <MenuItem value="family">Familie</MenuItem>
                 <MenuItem value="friend">Freund/in</MenuItem>
                 <MenuItem value="colleague">Kollege/in</MenuItem>
                 <MenuItem value="other">Sonstige</MenuItem>
             </Select>
         </FormControl>
         <TextField label="Gruppe (z.B. Familie Meier)" value={group} onChange={(e) => setGroup(e.target.value)} disabled={loading} size="small" />
         <TextField label="Tisch (optional)" value={tableAssignment} onChange={(e) => setTableAssignment(e.target.value)} disabled={loading} size="small" />

         <Divider sx={{ my: 1 }} />
         <Typography variant="subtitle2">Begleitung & Kind</Typography>
         <FormGroup>
            <FormControlLabel control={<Checkbox checked={plusOne} onChange={(e) => setPlusOne(e.target.checked)} disabled={loading}/>} label="Bringt Begleitung mit (+1)" />
         </FormGroup>
        {plusOne && (
            <TextField label="Name Begleitung (optional)" value={plusOneName} onChange={(e) => setPlusOneName(e.target.value)} disabled={loading} size="small" sx={{ml: 4}}/> // Einrücken
        )}
        <FormGroup>
             <FormControlLabel control={<Checkbox checked={isChild} onChange={(e) => setIsChild(e.target.checked)} disabled={loading}/>} label="Ist ein Kind" />
         </FormGroup>
         {isChild && (
            <TextField label="Alter Kind (optional)" type="number" value={childAge} onChange={(e) => setChildAge(e.target.value)} disabled={loading} size="small" sx={{ml: 4}} />
         )}

        <Divider sx={{ my: 1 }} />
        <TextField 
            label="Diätetische Einschränkungen (Komma-getrennt)" 
            value={dietaryRestrictions} 
            onChange={(e) => setDietaryRestrictions(e.target.value)} 
            disabled={loading} 
            size="small" 
            multiline
            rows={2}
         />

        <Stack direction="row" spacing={1} justifyContent="flex-end">
          {onCancel && (
            <Button variant="text" onClick={onCancel} disabled={loading}>
              Abbrechen
            </Button>
          )}
          <Button type="submit" variant="contained" disabled={loading || !firstName.trim()}>
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Gast speichern'}
          </Button>
        </Stack>

        {error && <Alert severity="error">{error}</Alert>}
      </Stack>
    </Box>
  );
};

export default AddGuestForm; 