import React, { useState, useEffect, useCallback } from 'react';
import {
  Container, Typography, Paper, TextField, Button, Box, CircularProgress, Alert,
  Card, CardHeader, CardContent, List, ListItem, ListItemText, Checkbox, FormControlLabel,
  Snackbar, Grid
} from '@mui/material';
import { doc, getDoc, updateDoc, setDoc, Timestamp, writeBatch, collection, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebaseConfig';
import { Guest } from '../models/guest.model'; // Guest-Typ importieren
import { getGuests, updateGuest } from '../services/guest.service'; // updateGuest statt updateTrauzeugeStatus
import { useSnackbar } from '../contexts/SnackbarContext';
import WitnessSelectionModal from '../components/profile/WitnessSelectionModal';

// Interface für die HochzeitsProfildaten
interface WeddingProfile {
  date: string;
  style: string;
  guestEstimate: number | string;
}

const ProfilePage: React.FC = () => {
  const { currentUser, loading: authLoading } = useAuth();
  const { showSnackbar } = useSnackbar();
  const [profileData, setProfileData] = useState<WeddingProfile>({ date: '', style: '', guestEstimate: '' });
  const [initialDataLoaded, setInitialDataLoaded] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // State für Gäste und Trauzeugen
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loadingGuests, setLoadingGuests] = useState<boolean>(true);
  const [brideWitness, setBrideWitness] = useState<Guest | null>(null);
  const [groomWitness, setGroomWitness] = useState<Guest | null>(null);
  const [isWitnessModalOpen, setIsWitnessModalOpen] = useState(false);

  // Lade Gäste und finde aktuelle Trauzeugen
  const loadGuestsAndWitnesses = useCallback(async () => {
    if (!currentUser) return;
    setLoadingGuests(true);
    setError(null);
    try {
      const loadedGuests = await getGuests(currentUser.uid);
      setGuests(loadedGuests);
      const foundBrideWitness = loadedGuests.find(g => g.role === 'witness_bride') || null;
      const foundGroomWitness = loadedGuests.find(g => g.role === 'witness_groom') || null;
      setBrideWitness(foundBrideWitness);
      setGroomWitness(foundGroomWitness);
    } catch (err) {
      console.error("Error loading guests/witnesses:", err);
      const message = "Gäste/Trauzeugen konnten nicht geladen werden.";
      setError(message);
      showSnackbar(message, "error");
    } finally {
      setLoadingGuests(false);
    }
  }, [currentUser, showSnackbar]);

  // Daten aus Firestore laden (bestehendes Profil)
  const fetchProfileData = useCallback(async () => {
    if (!currentUser) return;
    setLoadingProfile(true);
    setError(null);
    const userDocRef = doc(db, 'users', currentUser.uid);
    try {
      const docSnap = await getDoc(userDocRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setProfileData({
          date: data.weddingProfile?.date || '',
          style: data.weddingProfile?.style || '',
          guestEstimate: data.weddingProfile?.guestEstimate || '',
        });
      } else {
      }
    } catch (err) {
      console.error("Error loading profile:", err);
      const message = "Profildaten konnten nicht geladen werden.";
      setError(message);
      showSnackbar(message, "error");
    } finally {
      setLoadingProfile(false);
      setInitialDataLoaded(true);
    }
  }, [currentUser, showSnackbar]);

  // Combined useEffect to load all data
  useEffect(() => {
    if (currentUser && !authLoading) {
      fetchProfileData();
      loadGuestsAndWitnesses();
    }
  }, [currentUser, authLoading, fetchProfileData, loadGuestsAndWitnesses]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setProfileData(prev => ({
      ...prev,
      [name]: name === 'guestEstimate' ? (value === '' ? '' : Number(value)) : value,
    }));
  };

  const handleSaveProfile = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!currentUser) return;

    setSavingProfile(true);
    setError(null);
    const userDocRef = doc(db, 'users', currentUser.uid);

    try {
      await setDoc(userDocRef, {
        weddingProfile: {
          date: profileData.date,
          style: profileData.style,
          guestEstimate: profileData.guestEstimate === '' ? null : Number(profileData.guestEstimate),
        },
      }, { merge: true });

      showSnackbar("Profil erfolgreich gespeichert!", "success");
    } catch (err) {
      console.error("Error saving profile:", err);
      const message = "Profil konnte nicht gespeichert werden.";
      setError(message);
      showSnackbar(message, "error");
    } finally {
      setSavingProfile(false);
    }
  };

  const handleOpenWitnessModal = () => {
    setIsWitnessModalOpen(true);
  };

  const handleCloseWitnessModal = () => {
    setIsWitnessModalOpen(false);
  };

  const handleSaveWitnesses = async (newBrideWitnessId: string | null, newGroomWitnessId: string | null) => {
    if (!currentUser) return;

    if (newBrideWitnessId && newGroomWitnessId && newBrideWitnessId === newGroomWitnessId) {
      showSnackbar("Eine Person kann nicht beide Trauzeugen-Rollen übernehmen.", "warning");
      throw new Error("Duplicate witness selected");
    }

    const currentBrideWitnessId = brideWitness?.id || null;
    const currentGroomWitnessId = groomWitness?.id || null;

    if (newBrideWitnessId === currentBrideWitnessId && newGroomWitnessId === currentGroomWitnessId) {
      handleCloseWitnessModal();
      return;
    }

    const batch = writeBatch(db);
    const guestsColRef = collection(db, 'users', currentUser.uid, 'guests');
    let updatesMade = false;

    try {
      if (currentBrideWitnessId && currentBrideWitnessId !== newBrideWitnessId) {
        const oldWitnessRef = doc(guestsColRef, currentBrideWitnessId);
        batch.update(oldWitnessRef, { role: 'guest', modifiedAt: serverTimestamp() });
        updatesMade = true;
      }
      if (currentGroomWitnessId && currentGroomWitnessId !== newGroomWitnessId) {
        const oldWitnessRef = doc(guestsColRef, currentGroomWitnessId);
        batch.update(oldWitnessRef, { role: 'guest', modifiedAt: serverTimestamp() });
        updatesMade = true;
      }

      if (newBrideWitnessId && newBrideWitnessId !== currentBrideWitnessId) {
        const newWitnessRef = doc(guestsColRef, newBrideWitnessId);
        batch.update(newWitnessRef, { role: 'witness_bride', modifiedAt: serverTimestamp() });
        updatesMade = true;
      }
      if (newGroomWitnessId && newGroomWitnessId !== currentGroomWitnessId) {
        const newWitnessRef = doc(guestsColRef, newGroomWitnessId);
        batch.update(newWitnessRef, { role: 'witness_groom', modifiedAt: serverTimestamp() });
        updatesMade = true;
      }

      if (!updatesMade) {
        handleCloseWitnessModal();
        return;
      }

      await batch.commit();

      showSnackbar("Trauzeugen erfolgreich aktualisiert!", "success");
      await loadGuestsAndWitnesses();
      handleCloseWitnessModal();
    } catch (error) {
      console.error("Error saving witnesses:", error);
      showSnackbar("Fehler beim Speichern der Trauzeugen.", "error");
      throw error;
    }
  };

  const displayWitnessName = (witness: Guest | null) => {
    return witness ? `${witness.firstName} ${witness.lastName || ''}` : 'Nicht festgelegt';
  };

  if ((loadingProfile || authLoading) && !initialDataLoaded) {
    return (
      <Container maxWidth="md" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Mein Profil & Hochzeitsdetails
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Box component="form" onSubmit={handleSaveProfile} noValidate>
          <Typography variant="h6" gutterBottom>
            Hochzeits-Eckdaten
          </Typography>
          <TextField
            margin="normal"
            fullWidth
            id="date"
            label="Geplantes Hochzeitsdatum"
            name="date"
            placeholder="TT.MM.JJJJ"
            value={profileData.date}
            onChange={handleInputChange}
            disabled={savingProfile}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            margin="normal"
            fullWidth
            id="style"
            label="Hochzeitsstil (z.B. Modern, Rustikal, Vintage)"
            name="style"
            value={profileData.style}
            onChange={handleInputChange}
            disabled={savingProfile}
          />
          <TextField
            margin="normal"
            fullWidth
            id="guestEstimate"
            label="Geschätzte Gästeanzahl"
            name="guestEstimate"
            type="number"
            value={profileData.guestEstimate}
            onChange={handleInputChange}
            disabled={savingProfile}
            InputProps={{ inputProps: { min: 0 } }}
          />
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              type="submit"
              variant="contained"
              disabled={savingProfile}
            >
              {savingProfile ? <CircularProgress size={24} /> : 'Eckdaten Speichern'}
            </Button>
          </Box>
        </Box>
      </Paper>

      <Paper elevation={2} sx={{ p: 3, mt: 3 }}>
        <Typography variant="h6" gutterBottom>Trauzeugen</Typography>
        {loadingGuests && <CircularProgress size={24} sx={{ display: 'block', mb: 1 }} />}
        {!loadingGuests && (
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={5}>
              <Typography><strong>Trauzeuge Braut:</strong> {displayWitnessName(brideWitness)}</Typography>
            </Grid>
            <Grid item xs={12} sm={5}>
              <Typography><strong>Trauzeuge Bräutigam:</strong> {displayWitnessName(groomWitness)}</Typography>
            </Grid>
            <Grid item xs={12} sm={2}>
              <Button
                variant="contained"
                onClick={handleOpenWitnessModal}
                disabled={loadingGuests || guests.length === 0}
              >
                Auswählen
              </Button>
            </Grid>
          </Grid>
        )}
      </Paper>

      <WitnessSelectionModal
        open={isWitnessModalOpen}
        onClose={handleCloseWitnessModal}
        guests={guests}
        currentBrideWitnessId={brideWitness?.id || null}
        currentGroomWitnessId={groomWitness?.id || null}
        onSave={handleSaveWitnesses}
      />

    </Container>
  );
};

export default ProfilePage; 