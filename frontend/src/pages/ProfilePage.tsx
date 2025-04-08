import React, { useState, useEffect } from 'react';
import { Container, Typography, Paper, TextField, Button, Box, CircularProgress, Alert } from '@mui/material';
import { doc, getDoc, updateDoc, setDoc, Timestamp } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebaseConfig';

// Interface für die HochzeitsProfildaten (optional, aber gut für Typsicherheit)
interface WeddingProfile {
  date: string; // Vorerst als String, für DatePicker später anpassen
  style: string;
  guestEstimate: number | string; // Kann Zahl oder leerer String sein
}

const ProfilePage: React.FC = () => {
  const { currentUser } = useAuth();
  const [profileData, setProfileData] = useState<WeddingProfile>({ date: '', style: '', guestEstimate: '' });
  const [initialDataLoaded, setInitialDataLoaded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Daten aus Firestore laden
  useEffect(() => {
    if (!currentUser) return;

    const fetchProfileData = async () => {
      setLoading(true);
      setError(null);
      const userDocRef = doc(db, 'users', currentUser.uid);
      try {
        const docSnap = await getDoc(userDocRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          // Setze die Formulardaten mit den vorhandenen Daten oder Defaults
          setProfileData({
            date: data.weddingProfile?.date || '',
            style: data.weddingProfile?.style || '',
            guestEstimate: data.weddingProfile?.guestEstimate || '',
          });
        } else {
          // Dokument existiert nicht (sollte durch Cloud Function erstellt werden, aber als Fallback)
          console.log("Kein Profildokument gefunden, initialisiere mit Defaults.");
          setProfileData({ date: '', style: '', guestEstimate: '' });
        }
      } catch (err) {
        console.error("Fehler beim Laden des Profils:", err);
        setError("Profildaten konnten nicht geladen werden.");
      } finally {
        setLoading(false);
        setInitialDataLoaded(true);
      }
    };

    fetchProfileData();
  }, [currentUser]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setProfileData(prev => ({
      ...prev,
      [name]: name === 'guestEstimate' ? (value === '' ? '' : Number(value)) : value,
    }));
  };

  const handleSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!currentUser) return;

    setSaving(true);
    setError(null);
    setSuccess(null);
    const userDocRef = doc(db, 'users', currentUser.uid);

    try {
      // Verwende setDoc mit merge:true statt updateDoc.
      // Das erstellt das Dokument, falls es fehlt, oder aktualisiert es.
      await setDoc(userDocRef, {
        // Wir müssen auch Felder mitschicken, die nicht geändert werden sollen,
        // wenn wir sicherstellen wollen, dass sie nicht überschrieben werden,
        // falls das Dokument doch schon existiert (obwohl merge das meist verhindert).
        // Hier fokussieren wir uns aber auf das weddingProfile.
        weddingProfile: {
          date: profileData.date,
          style: profileData.style,
          guestEstimate: profileData.guestEstimate === '' ? null : Number(profileData.guestEstimate),
        },
        // Optional: Stelle sicher, dass E-Mail und createdAt erhalten bleiben, falls das Dokument neu erstellt wird
        // email: currentUser.email, // Nur nötig, wenn wir NICHT mergen oder sicher sein wollen
        // createdAt: ??? // Könnten wir neu setzen oder beim ersten Laden speichern
      }, { merge: true }); // WICHTIG: merge Option

      setSuccess("Profil erfolgreich gespeichert!");
    } catch (err) {
      console.error("Fehler beim Speichern des Profils:", err);
      setError("Profil konnte nicht gespeichert werden.");
    } finally {
      setSaving(false);
    }
  };

  if (loading && !initialDataLoaded) {
    return <CircularProgress sx={{ display: 'block', margin: 'auto', mt: 4 }} />;
  }

  return (
    <Container maxWidth="md">
      <Typography variant="h4" component="h1" gutterBottom>
        Mein Profil & Hochzeitsdetails
      </Typography>
      <Paper elevation={2} sx={{ p: 3 }}>
        <Box component="form" onSubmit={handleSave} noValidate>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
          
          <Typography variant="h6" gutterBottom>
            Hochzeits-Eckdaten
          </Typography>
          <TextField
            margin="normal"
            fullWidth
            id="date"
            label="Geplantes Hochzeitsdatum" 
            name="date"
            // Für einen echten DatePicker: type="date" oder MUI DatePicker verwenden
            // Installation: npm install @mui/x-date-pickers date-fns
            placeholder="TT.MM.JJJJ"
            value={profileData.date}
            onChange={handleInputChange}
            disabled={saving}
            InputLabelProps={{
              shrink: true, // Label bleibt oben, auch wenn Feld leer ist
            }}
          />
          <TextField
            margin="normal"
            fullWidth
            id="style"
            label="Hochzeitsstil (z.B. Modern, Rustikal, Vintage)"
            name="style"
            value={profileData.style}
            onChange={handleInputChange}
            disabled={saving}
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
            disabled={saving}
            InputProps={{
              inputProps: { 
                  min: 0 // Verhindert negative Zahlen
              } 
            }}
          />
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
            <Button 
              type="submit" 
              variant="contained" 
              disabled={saving}
            >
              {saving ? <CircularProgress size={24} /> : 'Speichern'}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default ProfilePage; 