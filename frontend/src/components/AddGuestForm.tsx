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
  const [relationship, setRelationship] = useState<string>('');
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
    setError(null); // Fehler vor neuer Prüfung zurücksetzen

    // --- Validierungen --- 
    if (!currentUser) {
        setError("Nicht angemeldet."); // Sollte nicht passieren, aber sicher ist sicher
        return;
    }
    if (!firstName.trim()) {
      setError("Vorname ist ein Pflichtfeld.");
      return;
    }
    
    // Telefonnummer-Validierung (einfach)
    const trimmedPhone = phoneNumber.trim();
    if (trimmedPhone && !trimmedPhone.startsWith('+')) {
        setError("Telefonnummer muss im internationalen Format mit '+' beginnen (z.B. +49...). Bitte korrigieren.");
        return;
    }
    // Optional: Striktere Prüfung mit Regex auf erlaubte Zeichen (Zahlen nach +)
    // const phoneRegex = /^\+[0-9\s-]+$/;
    // if (trimmedPhone && !phoneRegex.test(trimmedPhone)) {
    //     setError("Telefonnummer enthält ungültige Zeichen.");
    //     return;
    // }

    // --- Datenaufbereitung & Senden --- 
    setLoading(true);
    
    const age = parseInt(childAge, 10);
    const dietArray = dietaryRestrictions.split(',').map(s => s.trim()).filter(Boolean);

    // Bereinige Telefonnummer für die Speicherung (optional, entfernt Leerzeichen/Bindestriche)
    // const cleanPhoneNumber = trimmedPhone ? trimmedPhone.replace(/[-\s()]/g, '') : null;
    const cleanPhoneNumber = trimmedPhone || null; // Wir speichern sie erstmal wie eingegeben (nach + Prüfung)

    const guestData: Omit<Guest, 'id' | 'createdAt' | 'modifiedAt'> = {
        firstName: firstName.trim(),
        ...(lastName.trim() && { lastName: lastName.trim() }),
        ...(email.trim() && { email: email.trim() }),
        status: status,
        // Verwende die bereinigte Nummer oder null
        phoneNumber: cleanPhoneNumber, 
        address: {
            street: addressStreet.trim() || null,
            city: addressCity.trim() || null,
            postalCode: addressPostalCode.trim() || null,
            country: addressCountry.trim() || null,
        },
        ...(relationship.trim() && { relationship: relationship.trim() }),
        ...(group.trim() && { group: group.trim() }),
        ...(tableAssignment.trim() && { tableAssignment: tableAssignment.trim() }),
        plusOne: plusOne,
        plusOneName: plusOne ? (plusOneName.trim() || null) : null, 
        plusOneConfirmed: false, 
        isChild: isChild,
        childAge: isChild && !isNaN(age) ? age : null,
        dietaryRestrictions: dietArray,
        gifts: [], 
        eventParticipation: {},
        createdFrom: null, 
        notes: null,
        specialRequirements: null,
    };

    console.log("Daten, die an addGuest gesendet werden:", guestData);

    try {
      await addGuest(currentUser.uid, guestData);
      // Formular zurücksetzen (alle Felder)
      setFirstName(''); setLastName(''); setEmail(''); setStatus('to-invite');
      setPhoneNumber(''); setAddressStreet(''); setAddressCity('');
      setAddressPostalCode(''); setAddressCountry(''); setRelationship('');
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

  const handleStatusChange = (event: SelectChangeEvent<Guest['status']>) => {
    setStatus(event.target.value as Guest['status']);
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
         <TextField label="Beziehung (z.B. Freund Braut)" value={relationship} onChange={(e) => setRelationship(e.target.value)} disabled={loading} size="small" />
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