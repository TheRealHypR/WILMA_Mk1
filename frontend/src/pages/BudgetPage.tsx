import React, { useState, useEffect, useMemo } from 'react';
import { Container, Typography, Box, CircularProgress, Alert, Paper, List, ListItem, ListItemText, Divider, Button, Grid, Chip, IconButton, Dialog, DialogContent, DialogTitle, Select, MenuItem, FormControl, SelectChangeEvent } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebaseConfig';
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  Timestamp,
  QueryDocumentSnapshot,
  DocumentData,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp
} from 'firebase/firestore';
import BudgetItemForm, { BudgetItemFormData } from '../components/Budget/BudgetItemForm';
import PageHeader from '../components/common/PageHeader';

// Interface für Budget-Items (basierend auf docs/07_Datenmodell_Budget.md)
interface BudgetItem {
  id: string;
  description: string;
  category?: string;
  estimatedCost: number;
  actualCost?: number;
  status: 'planned' | 'booked' | 'partially-paid' | 'paid';
  createdAt: Timestamp; // Firestore Timestamp
  paidDate?: Timestamp;
  dueDate?: Timestamp;
  notes?: string;
}

// NEU: Status Labels und Farben für Budget-Items
const getBudgetStatusLabel = (status: BudgetItem['status']): string => {
    switch (status) {
        case 'planned': return 'Geplant';
        case 'booked': return 'Gebucht';
        case 'partially-paid': return 'Angezahlt';
        case 'paid': return 'Bezahlt';
        default: return status;
    }
};

const budgetStatusColors: Record<BudgetItem['status'], string> = {
    'planned': '#FFDDC1', // Pastell Orange
    'booked': '#C1E1FF', // Pastell Blau
    'partially-paid': '#FDFDC1', // Pastell Gelb
    'paid': '#D4F0C1' // Pastell Grün
};

const BudgetPage: React.FC = () => {
  const { currentUser } = useAuth();
  const [budgetItems, setBudgetItems] = useState<BudgetItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State für Modal und Bearbeitung
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<BudgetItem | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  // NEU: State für den Ladezustand einzelner Status-Updates
  const [updatingStatusId, setUpdatingStatusId] = useState<string | null>(null); 

  // Laden der Budget-Items
  useEffect(() => {
    if (!currentUser) {
      setLoading(false);
      setError("Bitte einloggen, um das Budget zu sehen.");
      return () => {}; // Cleanup für den Fall
    }

    setLoading(true);
    setError(null);

    const itemsCollectionPath = `users/${currentUser.uid}/budgetItems`;
    const itemsCollectionRef = collection(db, itemsCollectionPath);
    // Sortieren, z.B. nach Erstellungsdatum oder Kategorie
    const q = query(itemsCollectionRef, orderBy("createdAt", "desc")); 

    const unsubscribe = onSnapshot(q, 
      (querySnapshot) => {
        const fetchedItems: BudgetItem[] = [];
        querySnapshot.forEach((doc: QueryDocumentSnapshot<DocumentData>) => {
          const data = doc.data();
          // Konvertiere Timestamps und validiere Typen
          fetchedItems.push({
            id: doc.id,
            description: data.description || 'Unbekannt',
            category: data.category,
            estimatedCost: typeof data.estimatedCost === 'number' ? data.estimatedCost : 0,
            actualCost: typeof data.actualCost === 'number' ? data.actualCost : undefined,
            status: data.status || 'planned',
            createdAt: data.createdAt instanceof Timestamp ? data.createdAt : Timestamp.now(), // Fallback
            paidDate: data.paidDate instanceof Timestamp ? data.paidDate : undefined,
            dueDate: data.dueDate instanceof Timestamp ? data.dueDate : undefined,
            notes: data.notes,
          });
        });
        setBudgetItems(fetchedItems);
        setLoading(false);
      },
      (err) => {
        console.error("Fehler beim Laden der Budget-Items:", err);
        setError("Budgetdaten konnten nicht geladen werden.");
        setLoading(false);
      }
    );

    // Cleanup-Funktion
    return () => unsubscribe();

  }, [currentUser]);

  // Berechnung der Summen im Frontend (mit useMemo für Performance)
  const budgetSummary = useMemo(() => {
    const totalEstimated = budgetItems.reduce((sum, item) => sum + item.estimatedCost, 0);
    const totalActual = budgetItems.reduce((sum, item) => sum + (item.actualCost ?? 0), 0);
    const totalPaid = budgetItems.filter(item => item.status === 'paid').reduce((sum, item) => sum + (item.actualCost ?? item.estimatedCost), 0);
    
    return { totalEstimated, totalActual, totalPaid };
  }, [budgetItems]);

  // --- Modal und CRUD Funktionen --- 

  const handleOpenModal = (item: BudgetItem | null = null) => {
    setEditingItem(item);
    setIsModalOpen(true);
    setError(null);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
    setError(null);
  };

  const handleFormSubmit = async (formData: BudgetItemFormData) => {
    if (!currentUser) return;
    console.log("Submitting started, isSubmitting:", true);
    setIsSubmitting(true);
    setError(null);

    const itemsCollectionPath = `users/${currentUser.uid}/budgetItems`;
    
    // Daten für Firestore vorbereiten
    const dataToSave = {
        ...formData,
        modifiedAt: serverTimestamp()
    };

    try {
      if (editingItem) {
        const itemDocRef = doc(db, itemsCollectionPath, editingItem.id);
        await updateDoc(itemDocRef, {
          ...dataToSave,
          createdAt: editingItem.createdAt 
        });
      } else {
        const itemsCollectionRef = collection(db, itemsCollectionPath);
        await addDoc(itemsCollectionRef, {
            ...dataToSave,
            createdAt: serverTimestamp()
        });
      }
      handleCloseModal();
    } catch (err) {
      console.error("Fehler beim Speichern des Budgetpostens:", err);
      setError("Speichern des Budgetpostens fehlgeschlagen."); 
    } finally {
      console.log("Submission finished, setting isSubmitting:", false);
      setIsSubmitting(false);
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    if (!currentUser) return;
    if (!window.confirm("Soll dieser Budgetposten wirklich gelöscht werden?")) {
      return;
    }

    setError(null);
    try {
      const itemDocRef = doc(db, `users/${currentUser.uid}/budgetItems`, itemId);
      await deleteDoc(itemDocRef);
    } catch (err) {
      console.error("Fehler beim Löschen des Budgetpostens:", err);
      setError("Löschen fehlgeschlagen.");
    }
  };

  // NEU: Funktion zum Aktualisieren des Status direkt aus der Liste
  const handleStatusUpdate = async (itemId: string, newStatus: BudgetItem['status']) => {
    if (!currentUser) return;
    setUpdatingStatusId(itemId); // Zeige Ladezustand für dieses Item
    setError(null); // Fehler zurücksetzen

    const itemDocRef = doc(db, `users/${currentUser.uid}/budgetItems`, itemId);
    try {
      await updateDoc(itemDocRef, {
        status: newStatus,
        modifiedAt: serverTimestamp()
      });
      // Das Update wird durch den onSnapshot Listener automatisch im UI reflektiert
    } catch (err) {
      console.error("Fehler beim Aktualisieren des Status:", err);
      setError(`Status für Item ${itemId} konnte nicht aktualisiert werden.`);
    } finally {
      setUpdatingStatusId(null); // Ladezustand beenden
    }
  };

  // --- Rendern --- 

  if (loading && budgetItems.length === 0) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}><CircularProgress /></Box>;
  }

  if (error && budgetItems.length === 0) {
     return <Container><Alert severity="error" sx={{ mt: 2 }}>{error}</Alert></Container>;
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <PageHeader title="Budgetübersicht" />

      {error && budgetItems.length > 0 && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" gutterBottom>Zusammenfassung</Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}> 
            <Typography variant="body1">Geschätzte Gesamtkosten:</Typography>
            <Typography variant="h5">{budgetSummary.totalEstimated.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}</Typography>
          </Grid>
          <Grid item xs={12} sm={4}> 
            <Typography variant="body1">Tatsächliche Kosten (bisher):</Typography>
            <Typography variant="h5">{budgetSummary.totalActual.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}</Typography>
          </Grid>
          <Grid item xs={12} sm={4}> 
            <Typography variant="body1">Bereits bezahlt:</Typography>
            <Typography variant="h5">{budgetSummary.totalPaid.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}</Typography>
          </Grid>
        </Grid>
      </Paper>

      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenModal()}
        >
          Neuen Posten hinzufügen
        </Button>
      </Box>

      <Paper sx={{ p: 2 }}>
        <Typography variant="h6" gutterBottom>Einzelposten</Typography>
        {budgetItems.length === 0 && !loading ? (
          <Typography>Noch keine Budgetposten vorhanden.</Typography>
        ) : (
          <List>
            {budgetItems.map((item) => (
              <React.Fragment key={item.id}>
                <ListItem 
                  alignItems="flex-start"
                  // Deaktivieren, wenn der Status dieses Items gerade aktualisiert wird
                  sx={{ opacity: updatingStatusId === item.id ? 0.5 : 1 }} 
                  secondaryAction={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}> {/* Flexbox für Aktionen */}
                      
                      {/* ANGEPASST: Status-Chip als Select */}
                      <FormControl size="small" variant="standard"
                        sx={{ 
                          minWidth: 100, // Etwas mehr Platz für längere Status
                          mr: 1, // Abstand zu den Icons
                          "& .MuiInput-underline:before": { borderBottom: 'none' },
                          "& .MuiInput-underline:hover:not(.Mui-disabled):before": { borderBottom: 'none' },
                          "& .MuiInput-underline:after": { borderBottom: 'none' },
                          "& .MuiSelect-select:focus": { backgroundColor: 'transparent' }
                        }}
                        disabled={updatingStatusId === item.id || isSubmitting} // Deaktivieren bei Update oder Formular-Submit
                      >
                        <Select
                          value={item.status}
                          // Verwende die neue Update-Funktion
                          onChange={(e: SelectChangeEvent<BudgetItem['status']>) => handleStatusUpdate(item.id, e.target.value as BudgetItem['status'])} 
                          variant="standard"
                          disableUnderline
                          displayEmpty
                          renderValue={(selectedValue) => (
                            <Chip 
                              label={getBudgetStatusLabel(selectedValue)}
                              size="small" 
                              sx={{ 
                                backgroundColor: budgetStatusColors[selectedValue] || '#E0E0E0',
                                color: '#333', 
                                fontWeight: '500', 
                                height: '22px',
                                fontSize: '0.75rem',
                                cursor: 'pointer' 
                              }}
                            />
                          )}
                        >
                          {/* Optionen mit Labels */}
                          <MenuItem value={'planned'}>{getBudgetStatusLabel('planned')}</MenuItem>
                          <MenuItem value={'booked'}>{getBudgetStatusLabel('booked')}</MenuItem>
                          <MenuItem value={'partially-paid'}>{getBudgetStatusLabel('partially-paid')}</MenuItem>
                          <MenuItem value={'paid'}>{getBudgetStatusLabel('paid')}</MenuItem>
                        </Select>
                      </FormControl>
                      
                      {/* Bearbeiten/Löschen Icons */}
                      <IconButton edge={false} /* false, da nicht mehr am Rand */ aria-label="edit" onClick={() => handleOpenModal(item)} disabled={updatingStatusId === item.id || isSubmitting}>
                        <EditIcon fontSize="small"/>
                      </IconButton>
                      <IconButton edge={false} aria-label="delete" onClick={() => handleDeleteItem(item.id)} disabled={updatingStatusId === item.id || isSubmitting}>
                        <DeleteIcon fontSize="small"/>
                      </IconButton>
                    </Box>
                  }
                >
                  <ListItemText
                    primary={item.description}
                    secondaryTypographyProps={{ component: 'div' }} 
                    secondary={
                      <Box>
                        <Typography component="span" variant="body2" color="text.primary" sx={{ display: 'block' }}>
                          Geschätzt: {item.estimatedCost.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}
                          {item.actualCost !== undefined && item.actualCost !== null && ` | Tatsächlich: ${item.actualCost.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' })}`}
                        </Typography>
                        {/* Die alten Chips für Kategorie/Status werden hier entfernt */}
                        {item.category && 
                          <Chip 
                            label={item.category} 
                            size="small" 
                            sx={{ mt: 0.5, mr: 1, height: '20px', fontSize: '0.7rem' }} // Kleinere Kategorie
                          />
                        }
                        {/* Platz für den neuen Status-Chip ist jetzt in secondaryAction */}
                        {item.notes && 
                          <Typography variant="caption" display="block" sx={{ mt: 0.5, fontStyle: 'italic' }}>
                            Notiz: {item.notes}
                          </Typography>}
                      </Box>
                    }
                  />
                </ListItem>
                <Divider variant="inset" component="li" />
              </React.Fragment>
            ))}
            {loading && !updatingStatusId && <ListItem><CircularProgress size={24} /></ListItem>} {/* Zeige nur allgemeinen Loader wenn kein spezifischer Status updated wird */}
          </List>
        )}
      </Paper>

      <Dialog open={isModalOpen} onClose={handleCloseModal} maxWidth="sm" fullWidth>
        <DialogTitle>{editingItem ? 'Budgetposten bearbeiten' : 'Neuen Budgetposten hinzufügen'}</DialogTitle>
        <DialogContent>
          <BudgetItemForm 
            key={editingItem ? editingItem.id : 'new'} 
            onSubmit={handleFormSubmit} 
            onCancel={handleCloseModal} 
            initialData={editingItem ? {
              description: editingItem.description,
              category: editingItem.category,
              estimatedCost: editingItem.estimatedCost,
              actualCost: editingItem.actualCost,
              status: editingItem.status,
              notes: editingItem.notes
            } : undefined}
            isSaving={isSubmitting} 
          />
        </DialogContent>
      </Dialog>

    </Container>
  );
};

export default BudgetPage; 