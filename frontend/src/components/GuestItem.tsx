import React, { useState, ChangeEvent } from 'react';
import { Guest } from '../models/guest.model';
import {
    ListItem,
    Typography, Box, Chip, Avatar,
    IconButton, Stack,
    TextField, Select, MenuItem, FormControl, InputLabel,
    Button, CircularProgress,
    Divider, Checkbox, FormControlLabel, FormGroup
} from '@mui/material';
import {
    Edit as EditIcon, Delete as DeleteIcon,
    Save as SaveIcon,
    Phone as PhoneIcon,
    Group as GroupIcon, Link as RelationshipIcon,
    ChildCare as ChildIcon,
    Restaurant as DietaryIcon, CardGiftcard as GiftIcon, EventSeat as TableIcon
} from '@mui/icons-material';
import { SelectChangeEvent } from '@mui/material';

// Definiere den Typ für die Updates, die an onUpdate übergeben werden
// Stelle sicher, dass plusOneAllowed Teil des Typs sein kann, falls es existiert
export type GuestUpdatePayload = Partial<Omit<Guest, 'id' | 'userId' | 'createdAt' | 'modifiedAt' | 'plusOneConfirmed'>> & { modifiedAt?: any; dietaryRestrictions?: string[] };

interface GuestItemProps {
  guest: Guest;
  onUpdate: (id: string, updates: GuestUpdatePayload) => void;
  onDelete: (id: string) => void;
}

// Hilfsfunktion zur Generierung von Initialen für Avatar
const getInitials = (firstName?: string, lastName?: string): string => {
    const first = firstName?.charAt(0) || '';
    const last = lastName?.charAt(0) || '';
    return `${first}${last}`.toUpperCase();
};

// Funktion zur Übersetzung des Status für die Anzeige
const getStatusLabel = (status: Guest['status']): string => {
    switch (status) {
        case 'to-invite': return 'Einladen';
        case 'invited': return 'Eingeladen';
        case 'confirmed': return 'Zugesagt';
        case 'declined': return 'Abgesagt';
        case 'maybe': return 'Vielleicht';
        default: return status;
    }
};

// Farbpalette für Status-Chips (Pastelltöne)
const statusColors: Record<Guest['status'], string> = {
    'to-invite': '#FFDDC1', // Pastell Orange
    'invited': '#C1E1FF', // Pastell Blau
    'confirmed': '#D4F0C1', // Pastell Grün
    'declined': '#FFC1C1', // Pastell Rot
    'maybe': '#FDFDC1' // Pastell Gelb
};

const GuestItem: React.FC<GuestItemProps> = ({ guest, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false); // Für Ladezustand (Update/Delete)

  // Grundlegende Edit-States
  const [editFirstName, setEditFirstName] = useState(guest.firstName);
  const [editLastName, setEditLastName] = useState(guest.lastName || '');
  const [editEmail, setEditEmail] = useState(guest.email || '');
  const [editStatus, setEditStatus] = useState<Guest['status']>(guest.status);
  // Neue Edit-States
  const [editPhoneNumber, setEditPhoneNumber] = useState(guest.phoneNumber || '');
  const [editAddressStreet, setEditAddressStreet] = useState(guest.address?.street || '');
  const [editAddressCity, setEditAddressCity] = useState(guest.address?.city || '');
  const [editAddressZip, setEditAddressZip] = useState(guest.address?.postalCode || '');
  const [editAddressCountry, setEditAddressCountry] = useState(guest.address?.country || '');
  const [editRelationship, setEditRelationship] = useState(guest.relationship || '');
  const [editGuestGroup, setEditGuestGroup] = useState(guest.group || '');
  const [editTableAssignment, setEditTableAssignment] = useState(guest.tableAssignment || '');
  const [editPlusOne, setEditPlusOne] = useState<boolean>(guest.plusOne || false);
  const [editPlusOneName, setEditPlusOneName] = useState(guest.plusOneName || '');
  const [editIsChild, setEditIsChild] = useState<boolean>(guest.isChild || false);
  const [editChildAge, setEditChildAge] = useState(guest.childAge?.toString() || ''); // Als String
  const [editDietaryRestrictions, setEditDietaryRestrictions] = useState<string[]>(
    Array.isArray(guest.dietaryRestrictions) ? guest.dietaryRestrictions : []
  );
  const [editNotes, setEditNotes] = useState(guest.notes || '');

  const handleDeleteClick = async () => {
    const confirmed = window.confirm(`Möchten Sie ${guest.firstName} ${guest.lastName || ''} wirklich löschen?`);
    if (!confirmed) return;

    setIsProcessing(true);
    try {
      await onDelete(guest.id);
    } catch (error) {
      console.error("Fehler beim Löschen des Gastes:", error);
      setIsProcessing(false);
    }
    // Kein setIsProcessing(false) im Erfolgsfall, da Komponente verschwindet
  };

  const handleEditClick = () => {
    // Setze alle Edit-States auf aktuelle Werte
    setEditFirstName(guest.firstName);
    setEditLastName(guest.lastName || '');
    setEditEmail(guest.email || '');
    setEditStatus(guest.status);
    setEditPhoneNumber(guest.phoneNumber || '');
    setEditAddressStreet(guest.address?.street || '');
    setEditAddressCity(guest.address?.city || '');
    setEditAddressZip(guest.address?.postalCode || '');
    setEditAddressCountry(guest.address?.country || '');
    setEditRelationship(guest.relationship || '');
    setEditGuestGroup(guest.group || '');
    setEditTableAssignment(guest.tableAssignment || '');
    setEditPlusOne(guest.plusOne || false);
    setEditPlusOneName(guest.plusOneName || '');
    setEditIsChild(guest.isChild || false);
    setEditChildAge(guest.childAge?.toString() || '');
    setEditDietaryRestrictions(Array.isArray(guest.dietaryRestrictions) ? guest.dietaryRestrictions : []);
    setEditNotes(guest.notes || '');
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
  };

  const handleSaveClick = async () => {
    if (!editFirstName.trim()) return;
    
    const updates: GuestUpdatePayload = {};
    const age = parseInt(editChildAge, 10);
    const dietArray = editDietaryRestrictions.map(s => s.trim()).filter(Boolean);

    // Vergleiche jeden Edit-State mit dem Original-Guest-Objekt
    if (editFirstName.trim() !== guest.firstName) updates.firstName = editFirstName.trim();
    if (editLastName.trim() !== (guest.lastName || '')) updates.lastName = editLastName.trim() || undefined;
    if (editEmail.trim() !== (guest.email || '')) updates.email = editEmail.trim() || null;
    if (editStatus !== guest.status) updates.status = editStatus;
    if (editPhoneNumber.trim() !== (guest.phoneNumber || '')) updates.phoneNumber = editPhoneNumber.trim() || null;
    // Adresse prüfen (etwas komplexer)
    const addressUpdates: Guest['address'] = {};
    if (editAddressStreet.trim() !== (guest.address?.street || '')) addressUpdates.street = editAddressStreet.trim() || null;
    if (editAddressCity.trim() !== (guest.address?.city || '')) addressUpdates.city = editAddressCity.trim() || null;
    if (editAddressZip.trim() !== (guest.address?.postalCode || '')) addressUpdates.postalCode = editAddressZip.trim() || null;
    if (editAddressCountry.trim() !== (guest.address?.country || '')) addressUpdates.country = editAddressCountry.trim() || null;
    if (Object.keys(addressUpdates).length > 0) updates.address = { ...guest.address, ...addressUpdates };
    
    if (editRelationship.trim() !== (guest.relationship || '')) updates.relationship = editRelationship.trim() || undefined;
    if (editGuestGroup.trim() !== (guest.group || '')) updates.group = editGuestGroup.trim() || undefined;
    if (editTableAssignment.trim() !== (guest.tableAssignment || '')) updates.tableAssignment = editTableAssignment.trim() || null;
    if (editPlusOne !== (guest.plusOne || false)) updates.plusOne = editPlusOne;
    if (editPlusOne && editPlusOneName.trim() !== (guest.plusOneName || '')) updates.plusOneName = editPlusOneName.trim() || null;
    if (!editPlusOne) updates.plusOneName = null; // Namen löschen, wenn +1 deaktiviert wird
    if (editIsChild !== (guest.isChild || false)) updates.isChild = editIsChild;
    if (editIsChild && editChildAge !== (guest.childAge?.toString() || '')) updates.childAge = !isNaN(age) ? age : null;
    if (!editIsChild) updates.childAge = null; // Alter löschen, wenn kein Kind
    // Diät-Vergleich (Array-Vergleich ist komplex, einfacher ist, immer zu senden wenn geändert)
    const originalDietString = (Array.isArray(guest.dietaryRestrictions) ? guest.dietaryRestrictions : []).join(',');
    const editedDietString = dietArray.join(',');
    if (originalDietString !== editedDietString) {
      updates.dietaryRestrictions = dietArray;
    }
    if (editNotes !== (guest.notes || '')) updates.notes = editNotes;

    if (Object.keys(updates).length > 0) {
        setIsProcessing(true);
        try {
            await onUpdate(guest.id, updates);
            setIsEditing(false);
        } catch (error) {
            console.error("Fehler beim Speichern der Gaständerungen:", error);
            // Optional: Fehlermeldung anzeigen
        } finally {
            setIsProcessing(false);
        }
    } else {
        setIsEditing(false); // Keine Änderungen, einfach schließen
    }
  };

  // Helper für diätetische Einschränkungen (aktualisiert Array-State)
  const handleDietaryChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    const dietArray = value.split(',').map(item => item.trim()).filter(item => item !== '');
    // Setze den State mit dem Array
    setEditDietaryRestrictions(dietArray); 
  };

  // NEU: Handler für Status-Dropdown im Ansichtsmodus
  const handleStatusSelectChange = async (event: SelectChangeEvent<Guest['status']>) => {
    const newStatus = event.target.value as Guest['status'];
    if (newStatus === guest.status) return; // Keine Änderung
    setIsProcessing(true); // Verwende isProcessing statt isUpdating
    try {
       await onUpdate(guest.id, { status: newStatus });
    } finally {
        setIsProcessing(false);
    }
  };

  return (
    <ListItem 
        key={guest.id} 
        divider 
        sx={{ 
            alignItems: 'flex-start',
            py: 1.5,
            opacity: isProcessing ? 0.5 : 1, // Visuelles Feedback bei Aktionen
            display: 'flex',
            justifyContent: 'space-between'
        }}
    >
      {!isEditing ? (
        // Ansichtsmodus
        <>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', flexGrow: 1, mr: 1 /* Abstand zu Aktionen */ }}> 
            <Avatar sx={{ bgcolor: 'primary.light', mr: 2, mt: 0.5 }}>
              {getInitials(guest.firstName, guest.lastName)}
            </Avatar>
            <Stack sx={{ flexGrow: 1 }}> 
              <Stack direction="row" spacing={1} alignItems="center" mb={0.5}>
                  <Typography variant="body1">
                      {`${guest.firstName} ${guest.lastName || ''}`.trim()}
                  </Typography>
              </Stack>
              {guest.email && <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>{guest.email}</Typography>}
              {guest.phoneNumber && <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}><PhoneIcon sx={{ fontSize: '0.8rem', verticalAlign: 'middle' }}/> {guest.phoneNumber}</Typography>}
              {guest.relationship && <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}><RelationshipIcon sx={{ fontSize: '0.8rem', verticalAlign: 'middle' }}/> {guest.relationship}</Typography>}
              {guest.group && <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}><GroupIcon sx={{ fontSize: '0.8rem', verticalAlign: 'middle' }}/> {guest.group}</Typography>}
               {guest.tableAssignment && <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}><TableIcon sx={{ fontSize: '0.8rem', verticalAlign: 'middle' }}/> Tisch: {guest.tableAssignment}</Typography>}
               {guest.plusOne && <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}><GiftIcon sx={{ fontSize: '0.8rem', verticalAlign: 'middle' }}/> +1 {guest.plusOneName ? `(${guest.plusOneName})` : ''}</Typography>}
               {guest.isChild && <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}><ChildIcon sx={{ fontSize: '0.8rem', verticalAlign: 'middle' }}/> Kind {guest.childAge ? `(${guest.childAge} J.)` : ''}</Typography>}
               {guest.dietaryRestrictions && guest.dietaryRestrictions.length > 0 && 
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}><DietaryIcon sx={{ fontSize: '0.8rem', verticalAlign: 'middle' }}/> {guest.dietaryRestrictions.join(', ')}</Typography>}
            </Stack>
          </Box>
          {/* Stack für Status-Chip-Select und Aktionen */}
          <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.5, flexShrink: 0 }}> 
                {/* Status Select, das wie ein Chip aussieht */}
                <FormControl size="small" variant="standard"
                  sx={{ 
                      minWidth: 110, 
                      "& .MuiInput-underline:before": { borderBottom: 'none' },
                      "& .MuiInput-underline:hover:not(.Mui-disabled):before": { borderBottom: 'none' },
                      "& .MuiInput-underline:after": { borderBottom: 'none' },
                      "& .MuiSelect-select:focus": { backgroundColor: 'transparent' }
                  }}
                  disabled={isProcessing}
                >
                    <Select
                        value={guest.status}
                        onChange={handleStatusSelectChange}
                        variant="standard"
                        disableUnderline
                        displayEmpty
                        renderValue={(selectedValue) => (
                            <Chip 
                                label={getStatusLabel(selectedValue)}
                                size="small" 
                                sx={{ 
                                    backgroundColor: statusColors[selectedValue] || '#E0E0E0',
                                    color: '#333',
                                    fontWeight: '500', 
                                    height: '22px',
                                    fontSize: '0.75rem',
                                    cursor: 'pointer' 
                                }}
                            />
                        )}
                    >
                        <MenuItem value={'to-invite'}>{getStatusLabel('to-invite')}</MenuItem>
                        <MenuItem value={'invited'}>{getStatusLabel('invited')}</MenuItem>
                        <MenuItem value={'confirmed'}>{getStatusLabel('confirmed')}</MenuItem>
                        <MenuItem value={'declined'}>{getStatusLabel('declined')}</MenuItem>
                        <MenuItem value={'maybe'}>{getStatusLabel('maybe')}</MenuItem>
                    </Select>
                </FormControl>
                 <IconButton size="small" aria-label="edit" onClick={handleEditClick} disabled={isProcessing}>
                     <EditIcon fontSize="small" />
                 </IconButton>
                  <IconButton size="small" aria-label="delete" onClick={handleDeleteClick} disabled={isProcessing}>
                     <DeleteIcon fontSize="small" />
                  </IconButton>
             </Stack>
        </>
      ) : (
        // Bearbeitungsmodus
        <Box sx={{ width: '100%', pt: 1 }}>
            <Stack spacing={2}>
                <Stack direction="row" spacing={2}> 
                     <TextField
                        label="Vorname"
                        value={editFirstName}
                        onChange={(e) => setEditFirstName(e.target.value)}
                        variant="outlined"
                        size="small"
                        required
                        disabled={isProcessing}
                        autoFocus
                        sx={{ flexGrow: 1 }}
                    />
                     <TextField
                        label="Nachname"
                        value={editLastName}
                        onChange={(e) => setEditLastName(e.target.value)}
                        variant="outlined"
                        size="small"
                        disabled={isProcessing}
                        sx={{ flexGrow: 1 }}
                    />
                 </Stack>
                 <TextField
                    label="E-Mail"
                    type="email"
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    variant="outlined"
                    size="small"
                    disabled={isProcessing}
                 />
                 <TextField
                    label="Telefon"
                    value={editPhoneNumber}
                    onChange={(e) => setEditPhoneNumber(e.target.value)}
                    variant="outlined"
                    size="small"
                    disabled={isProcessing}
                 />
                <FormControl fullWidth size="small" disabled={isProcessing}>
                    <InputLabel id={`edit-guest-status-label-${guest.id}`}>Status</InputLabel>
                    <Select
                        labelId={`edit-guest-status-label-${guest.id}`}
                        id={`edit-guest-status-${guest.id}`}
                        value={editStatus}
                        label="Status"
                        onChange={(e) => setEditStatus(e.target.value as Guest['status'])}
                    >
                        <MenuItem value={'to-invite'}>Einladen</MenuItem>
                        <MenuItem value={'invited'}>Eingeladen</MenuItem>
                        <MenuItem value={'confirmed'}>Zugesagt</MenuItem>
                        <MenuItem value={'declined'}>Abgesagt</MenuItem>
                        <MenuItem value={'maybe'}>Vielleicht</MenuItem>
                    </Select>
                </FormControl>
                 <Divider sx={{ my: 1 }}><Typography variant="caption">Adresse</Typography></Divider>
                 <TextField label="Straße" value={editAddressStreet} onChange={(e) => setEditAddressStreet(e.target.value)} variant="outlined" size="small" disabled={isProcessing} />
                 <Stack direction="row" spacing={2}>
                    <TextField label="PLZ" value={editAddressZip} onChange={(e) => setEditAddressZip(e.target.value)} variant="outlined" size="small" disabled={isProcessing} sx={{ flex: 1 }}/>
                    <TextField label="Stadt" value={editAddressCity} onChange={(e) => setEditAddressCity(e.target.value)} variant="outlined" size="small" disabled={isProcessing} sx={{ flex: 2 }}/>
                 </Stack>
                 <TextField label="Land" value={editAddressCountry} onChange={(e) => setEditAddressCountry(e.target.value)} variant="outlined" size="small" disabled={isProcessing} />
                 <Divider sx={{ my: 1 }}><Typography variant="caption">Details</Typography></Divider>
                 <TextField label="Beziehung" value={editRelationship} onChange={(e) => setEditRelationship(e.target.value)} variant="outlined" size="small" disabled={isProcessing} />
                 <TextField label="Gruppe" value={editGuestGroup} onChange={(e) => setEditGuestGroup(e.target.value)} variant="outlined" size="small" disabled={isProcessing} />
                 <TextField label="Tisch" value={editTableAssignment} onChange={(e) => setEditTableAssignment(e.target.value)} variant="outlined" size="small" disabled={isProcessing} />
                  <Divider sx={{ my: 1 }}><Typography variant="caption">Optionen</Typography></Divider>
                 <FormGroup>
                    <FormControlLabel control={<Checkbox checked={editPlusOne} onChange={(e) => setEditPlusOne(e.target.checked)} disabled={isProcessing}/>} label="+1" />
                 </FormGroup>
                {editPlusOne && (
                    <TextField label="Name Begleitung" value={editPlusOneName} onChange={(e) => setEditPlusOneName(e.target.value)} variant="outlined" size="small" disabled={isProcessing} sx={{ml: 4}}/>
                )}
                <FormGroup>
                    <FormControlLabel control={<Checkbox checked={editIsChild} onChange={(e) => setEditIsChild(e.target.checked)} disabled={isProcessing}/>} label="Kind" />
                 </FormGroup>
                 {editIsChild && (
                    <TextField label="Alter Kind" type="number" value={editChildAge} onChange={(e) => setEditChildAge(e.target.value)} variant="outlined" size="small" disabled={isProcessing} sx={{ml: 4}} />
                 )}
                 <TextField label="Diät (Komma-getrennt)" value={editDietaryRestrictions.join(', ')} onChange={handleDietaryChange} variant="outlined" size="small" multiline rows={2} disabled={isProcessing} />

                 <Stack direction="row" spacing={1} justifyContent="flex-end">
                    <Button variant="text" onClick={handleCancelClick} disabled={isProcessing}>
                         Abbrechen
                    </Button>
                     <Button 
                         variant="contained" 
                         onClick={handleSaveClick} 
                         disabled={isProcessing || !editFirstName.trim()}
                         startIcon={isProcessing ? <CircularProgress size={16} color="inherit"/> : <SaveIcon />}
                      >
                         Speichern
                     </Button>
                 </Stack>
            </Stack>
        </Box>
      )}
    </ListItem>
  );
};

export default GuestItem; 