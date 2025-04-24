import React, { useState, useEffect, useCallback } from 'react';
import { Box, Typography, CircularProgress, Alert, Button, Paper, Grid } from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import { Guest } from '../../models/guest.model';
// Annahme: Der GuestService hat Funktionen zum Laden und Aktualisieren von Gästen
// import { getGuests, updateWitnessRoles } from '../../services/guest.service'; // Entfernt, da updateWitnessRoles nicht existiert
import { getGuests, updateGuest } from '../../services/guest.service'; // updateGuest wird benötigt
import { writeBatch, doc, collection, serverTimestamp } from 'firebase/firestore'; // Import für Batch Writes und fehlende Firestore-Funktionen
import { db } from '../../firebaseConfig'; // Import db
import WitnessSelectionModal from './WitnessSelectionModal'; // Importieren Sie das neue Modal
import { useSnackbar } from '../../contexts/SnackbarContext'; // Corrected path

const ProfilePage: React.FC = () => {
    const { currentUser, loading: authLoading } = useAuth(); // user -> currentUser
    const { showSnackbar } = useSnackbar();
    const [guests, setGuests] = useState<Guest[]>([]);
    const [brideWitness, setBrideWitness] = useState<Guest | null>(null);
    const [groomWitness, setGroomWitness] = useState<Guest | null>(null);
    const [loadingGuests, setLoadingGuests] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [isWitnessModalOpen, setIsWitnessModalOpen] = useState(false); // State für Modal

    const loadData = useCallback(async () => {
        if (!currentUser) return; 
        console.log("loadData: Starte Ladevorgang, loadingGuests = true");
        setLoadingGuests(true);
        setError(null);
        try {
            const loadedGuests = await getGuests(currentUser.uid); 
            console.log("loadData: Gäste erfolgreich geladen");
            setGuests(loadedGuests);
            setBrideWitness(loadedGuests.find(g => g.role === 'witness_bride') || null); 
            setGroomWitness(loadedGuests.find(g => g.role === 'witness_groom') || null); 
        } catch (err) {
            console.error("Fehler beim Laden der Gäste:", err);
            console.log("loadData: Fehler beim Laden, loadingGuests bleibt true bis finally");
            setError("Gäste konnten nicht geladen werden.");
            showSnackbar("Fehler beim Laden der Gäste.", "error");
        } finally {
            console.log("loadData: Finally Block erreicht, loadingGuests = false");
            setLoadingGuests(false);
        }
    }, [currentUser, showSnackbar]);

    useEffect(() => {
        console.log("useEffect für loadData: Wird ausgeführt.", { currentUser: currentUser, authLoading: authLoading });
        loadData();
    }, [loadData, currentUser, authLoading]); // Hinzufügen von currentUser und authLoading zu den Deps für Logging

    // Funktionen zum Öffnen/Schließen des Modals
    const handleOpenWitnessModal = () => {
        console.log("Öffne Modal, Gäste:", guests); // Log guests before opening
        setIsWitnessModalOpen(true);
    };

    const handleCloseWitnessModal = () => {
        setIsWitnessModalOpen(false);
    };

    // Funktion zum Speichern der Auswahl aus dem Modal
    // Implementiert jetzt die Batch-Logik direkt hier
    const handleSaveWitnesses = async (newBrideWitnessId: string | null, newGroomWitnessId: string | null) => {
        if (!currentUser) return; // user -> currentUser

        // Validierung: Derselbe Gast kann nicht beide Rollen haben
        if (newBrideWitnessId && newGroomWitnessId && newBrideWitnessId === newGroomWitnessId) {
            showSnackbar("Eine Person kann nicht beide Trauzeugen-Rollen übernehmen.", "warning");
            throw new Error("Duplicate witness selected"); 
        }

        const currentBrideWitnessId = brideWitness?.id || null;
        const currentGroomWitnessId = groomWitness?.id || null;

        // Nur speichern, wenn sich etwas geändert hat
        if (newBrideWitnessId === currentBrideWitnessId && newGroomWitnessId === currentGroomWitnessId) {
             handleCloseWitnessModal();
             return; 
        }

        const batch = writeBatch(db);
        const guestsColRef = collection(db, 'users', currentUser.uid, 'guests');

        try {
             // 1. Alte Trauzeugen zurücksetzen (wenn geändert)
             if (currentBrideWitnessId && currentBrideWitnessId !== newBrideWitnessId) {
                 const oldWitnessRef = doc(guestsColRef, currentBrideWitnessId);
                 batch.update(oldWitnessRef, { role: 'guest', modifiedAt: serverTimestamp() });
             }
             if (currentGroomWitnessId && currentGroomWitnessId !== newGroomWitnessId) {
                 const oldWitnessRef = doc(guestsColRef, currentGroomWitnessId);
                 batch.update(oldWitnessRef, { role: 'guest', modifiedAt: serverTimestamp() });
             }

             // 2. Neue Trauzeugen setzen (wenn neu oder geändert)
             if (newBrideWitnessId && newBrideWitnessId !== currentBrideWitnessId) {
                 const newWitnessRef = doc(guestsColRef, newBrideWitnessId);
                 batch.update(newWitnessRef, { role: 'witness_bride', modifiedAt: serverTimestamp() });
             }
             if (newGroomWitnessId && newGroomWitnessId !== currentGroomWitnessId) {
                 const newWitnessRef = doc(guestsColRef, newGroomWitnessId);
                 batch.update(newWitnessRef, { role: 'witness_groom', modifiedAt: serverTimestamp() });
             }
             
             await batch.commit(); // Batch ausführen

            showSnackbar("Trauzeugen erfolgreich aktualisiert!", "success");
            await loadData(); // Daten neu laden
            handleCloseWitnessModal(); // Modal schließen
        } catch (error) {
            console.error("Fehler beim Speichern der Trauzeugen:", error);
            showSnackbar("Fehler beim Speichern der Trauzeugen.", "error");
            throw error; 
        }
    };

    if (authLoading || loadingGuests) {
        return <CircularProgress />;
    }

    if (error) {
        return <Alert severity="error">{error}</Alert>;
    }

    if (!currentUser) { // user -> currentUser
        return <Alert severity="warning">Bitte melden Sie sich an, um Ihr Profil zu sehen.</Alert>;
    }

    const displayWitnessName = (witness: Guest | null) => {
        return witness ? `${witness.firstName} ${witness.lastName || ''}` : 'Nicht festgelegt';
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>Profil</Typography>
            <Paper elevation={3} sx={{ p: 3, mt: 2 }}>
                <Typography variant="h6" gutterBottom>Persönliche Informationen</Typography>
                <Typography>Email: {currentUser.email}</Typography> {/* user -> currentUser */} 
                {/* Weitere Profilinfos hier... */}
            </Paper>

            <Paper elevation={3} sx={{ p: 3, mt: 3 }}>
                <Typography variant="h6" gutterBottom>Trauzeugen</Typography>
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
                            disabled={loadingGuests} // Deaktivieren während dem Laden
                        >
                            Auswählen
                        </Button>
                    </Grid>
                </Grid>
            </Paper>

            {/* Das Modal selbst */}
            <WitnessSelectionModal
                open={isWitnessModalOpen}
                onClose={handleCloseWitnessModal}
                guests={guests} // Übergebe die geladene Gästeliste
                currentBrideWitnessId={brideWitness?.id || null}
                currentGroomWitnessId={groomWitness?.id || null}
                onSave={handleSaveWitnesses} // Übergib die Speicherfunktion
            />

            {/* Weitere Abschnitte des Profils hier... */}
        </Box>
    );
};

export default ProfilePage; 