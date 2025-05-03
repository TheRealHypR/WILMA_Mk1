import React, { useState, useEffect, FormEvent } from 'react';
import { Container, Typography, Box, Paper, List, ListItem, ListItemText, Checkbox, CircularProgress, Alert, TextField, Button, Stack, IconButton } from '@mui/material';
import { useAuth } from '../contexts/AuthContext'; // Import useAuth
import { db } from '../firebaseConfig'; // Import db config
import { 
  collection, 
  query, 
  orderBy, 
  onSnapshot, 
  doc, 
  updateDoc, 
  serverTimestamp, 
  Timestamp, // Import Timestamp for interface
  QueryDocumentSnapshot,
  DocumentData,
  addDoc,
  getDocs,
  writeBatch,
  deleteDoc
} from 'firebase/firestore';
import AddIcon from '@mui/icons-material/Add'; // AddIcon hinzugefügt
import ContentCopyIcon from '@mui/icons-material/ContentCopy'; // Icon für Generieren-Button
import DeleteIcon from '@mui/icons-material/Delete'; // DeleteIcon hinzugefügt
import PageHeader from '../components/common/PageHeader'; // NEU: Import

// Interface für Checklist-Items (passend zum Firestore-Modell)
interface ChecklistItem {
  id: string;
  description: string;
  isCompleted: boolean;
  createdAt: Timestamp;
  category?: string;
  notes?: string;
  dueDate?: Timestamp;
}

const UserChecklistPage: React.FC = () => {
  const { currentUser } = useAuth(); // Holen des aktuellen Benutzers
  const [items, setItems] = useState<ChecklistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newItemDescription, setNewItemDescription] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [deletingItemId, setDeletingItemId] = useState<string | null>(null);

  // Daten laden
  useEffect(() => {
    // Nur laden, wenn der Benutzer eingeloggt ist
    if (!currentUser) {
      setLoading(false);
      // Optional: Nachricht anzeigen, dass Login erforderlich ist
      // setError("Bitte einloggen, um Ihre Checkliste zu sehen."); 
      return;
    }

    setLoading(true);
    setError(null);
    const itemsCollectionPath = `users/${currentUser.uid}/checklistItems`;
    const itemsCollectionRef = collection(db, itemsCollectionPath);
    // Sortieren nach Erstellungsdatum (oder später nach Kategorie/Fälligkeit)
    const q = query(itemsCollectionRef, orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(q, 
      (querySnapshot) => {
        const fetchedItems: ChecklistItem[] = [];
        querySnapshot.forEach((docSnap: QueryDocumentSnapshot<DocumentData>) => {
          const data = docSnap.data();
          fetchedItems.push({
            id: docSnap.id,
            description: data.description || '', 
            isCompleted: data.isCompleted || false,
            createdAt: data.createdAt, // Annahme: Ist immer ein Timestamp
            category: data.category,
            notes: data.notes,
            dueDate: data.dueDate,
          });
        });
        setItems(fetchedItems);
        setLoading(false);
      },
      (err) => {
        console.error("Fehler beim Laden der Checklist-Items:", err);
        setError("Checklist-Daten konnten nicht geladen werden.");
        setLoading(false);
      }
    );

    // Cleanup-Funktion
    return () => unsubscribe();

  }, [currentUser]); // Abhängigkeit vom currentUser

  // Funktion zum Umschalten des isCompleted-Status
  const handleToggleComplete = async (itemId: string, currentStatus: boolean) => {
    if (!currentUser) return;
    const itemDocRef = doc(db, `users/${currentUser.uid}/checklistItems`, itemId);
    try {
      await updateDoc(itemDocRef, {
        isCompleted: !currentStatus,
        modifiedAt: serverTimestamp() // Aktualisiere auch modifiedAt
      });
    } catch (err) {
      console.error("Fehler beim Aktualisieren des Checklist-Items:", err);
      // Optional: Fehlermeldung im UI anzeigen
      setError("Status konnte nicht aktualisiert werden."); 
    }
  };

  // NEU: Funktion zum Hinzufügen eines neuen Items
  const handleAddItem = async (event: FormEvent) => {
    event.preventDefault(); // Verhindert Neuladen der Seite bei Formular-Submit
    if (!currentUser || !newItemDescription.trim()) return;

    setIsAdding(true);
    setError(null); // Fehler zurücksetzen
    const itemsCollectionPath = `users/${currentUser.uid}/checklistItems`;
    const itemsCollectionRef = collection(db, itemsCollectionPath);

    try {
      await addDoc(itemsCollectionRef, {
        description: newItemDescription.trim(),
        isCompleted: false,
        createdAt: serverTimestamp(),
        modifiedAt: serverTimestamp(),
        // Optionale Felder können hier initial leer/null sein oder weggelassen werden
      });
      setNewItemDescription(''); // Feld leeren nach Erfolg
    } catch (err) {
      console.error("Fehler beim Hinzufügen des Checklist-Items:", err);
      setError("Neues Item konnte nicht hinzugefügt werden.");
    } finally {
      setIsAdding(false);
    }
  };

  // NEU: Funktion zum Generieren der Checkliste aus der Master-Vorlage
  const handleGenerateChecklist = async () => {
    if (!currentUser) return;

    setIsGenerating(true);
    setError(null);

    try {
      // 1. Master-Items lesen
      const masterItemsRef = collection(db, 'masterChecklistItems');
      const masterItemsSnapshot = await getDocs(query(masterItemsRef, orderBy("order"))); // Sortieren nach Order, falls vorhanden

      if (masterItemsSnapshot.empty) {
        setError("Keine Vorlage gefunden, um die Checkliste zu generieren.");
        setIsGenerating(false);
        return;
      }

      // 2. Batch-Write vorbereiten
      const batch = writeBatch(db);
      const userItemsCollectionPath = `users/${currentUser.uid}/checklistItems`;
      const userItemsCollectionRef = collection(db, userItemsCollectionPath);

      masterItemsSnapshot.forEach((masterDoc) => {
        const masterData = masterDoc.data();
        const newItemRef = doc(userItemsCollectionRef); // Generiert eine neue ID für das User-Item
        
        // Daten für das neue User-Item zusammenstellen
        const newItemData = {
          description: masterData.description || 'Unbekanntes Item',
          isCompleted: false,
          category: masterData.category || null, // Übernehme Kategorie (optional)
          notes: masterData.details || null, // Übernehme Details als Notizen (optional)
          // dueDate: null, // Optional: Standard-Fälligkeit?
          createdAt: serverTimestamp(),
          modifiedAt: serverTimestamp(),
          masterItemId: masterDoc.id // Optional: Referenz zum Master-Item speichern
        };
        batch.set(newItemRef, newItemData); // Füge Set-Operation zum Batch hinzu
      });

      // 3. Batch ausführen
      await batch.commit();
      // Nach Erfolg werden die Items durch den onSnapshot-Listener automatisch neu geladen
      
    } catch (err) {
      console.error("Fehler beim Generieren der Checkliste:", err);
      setError("Checkliste konnte nicht aus Vorlage generiert werden.");
    } finally {
      setIsGenerating(false);
    }
  };

  // NEU: Funktion zum Löschen eines Items
  const handleDeleteItem = async (itemId: string) => {
    if (!currentUser) return;
    // Sicherheitsabfrage
    if (!window.confirm("Diesen Checklist-Punkt wirklich löschen?")) {
      return;
    }

    setDeletingItemId(itemId); // Ladezustand für dieses Item setzen
    setError(null);
    const itemDocRef = doc(db, `users/${currentUser.uid}/checklistItems`, itemId);

    try {
      await deleteDoc(itemDocRef);
      // Item verschwindet automatisch durch onSnapshot
    } catch (err) {
      console.error("Fehler beim Löschen des Checklist-Items:", err);
      setError("Item konnte nicht gelöscht werden.");
    } finally {
      setDeletingItemId(null); // Ladezustand zurücksetzen
    }
  };

  // ----- RENDERING ----- 

  // Ladezustand
  if (loading) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, mb: 4, textAlign: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  // Fehlerzustand
  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  // Nicht eingeloggt (könnte auch eine Weiterleitung sein)
  if (!currentUser) {
     return (
      <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
        <Alert severity="info">Bitte einloggen, um Ihre Checkliste zu sehen.</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      {/* NEU: PageHeader einfügen */}
      <PageHeader title="Meine Checkliste" />
      
      {/* Formular zum Hinzufügen neuer Items */}
      <Paper sx={{ p: 2, mb: 2 }}> {/* Eigene Paper-Komponente für das Formular */} 
        <Box component="form" onSubmit={handleAddItem}> 
          <Stack direction="row" spacing={1}> 
            <TextField
              label="Neuer Checklist-Punkt"
              variant="outlined"
              size="small"
              fullWidth
              value={newItemDescription}
              onChange={(e) => setNewItemDescription(e.target.value)}
              disabled={isAdding || isGenerating}
            />
            <Button 
              type="submit"
              variant="contained"
              disabled={!newItemDescription.trim() || isAdding || isGenerating}
              startIcon={isAdding ? <CircularProgress size={16} color="inherit" /> : <AddIcon />}
            >
              Hinzufügen
            </Button>
          </Stack>
        </Box>
      </Paper>

      <Paper sx={{ p: 2 }}>
        {/* Anzeige der Fehler (falls beim Hinzufügen aufgetreten) */} 
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        {/* Liste der Items */} 
        {loading && items.length === 0 ? (
          <Box sx={{ textAlign: 'center' }}><CircularProgress /></Box>
        ) : items.length === 0 ? (
          <Box sx={{ textAlign: 'center', p: 2 }}>
             <Typography variant="body1" sx={{ mb: 2 }}>
                Ihre persönliche Checkliste ist noch leer.
             </Typography>
            <Button
              variant="contained"
              onClick={handleGenerateChecklist}
              disabled={isGenerating}
              startIcon={isGenerating ? <CircularProgress size={16} color="inherit" /> : <ContentCopyIcon />}
            >
              Checkliste aus Vorlage erstellen
            </Button>
          </Box>
        ) : (
          <List>
            {items.map((item) => (
              <ListItem 
                key={item.id}
                sx={{ opacity: deletingItemId === item.id ? 0.5 : 1 }} 
                secondaryAction={
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Checkbox
                      edge="end"
                      onChange={() => handleToggleComplete(item.id, item.isCompleted)}
                      checked={item.isCompleted}
                      inputProps={{ 'aria-labelledby': `checkbox-list-label-${item.id}` }}
                      disabled={isGenerating || deletingItemId === item.id}
                    />
                    <IconButton 
                      edge="end" 
                      aria-label="delete"
                      onClick={() => handleDeleteItem(item.id)}
                      disabled={isGenerating || deletingItemId === item.id}
                      size="small"
                    >
                      {deletingItemId === item.id ? <CircularProgress size={20} /> : <DeleteIcon fontSize="small" />}
                    </IconButton>
                  </Stack>
                }
                disablePadding
              >
                <ListItemText 
                  id={`checkbox-list-label-${item.id}`} 
                  primary={item.description}
                  sx={{ 
                    pr: 1,
                    textDecoration: item.isCompleted ? 'line-through' : 'none',
                    color: item.isCompleted ? 'text.disabled' : 'text.primary'
                  }}
                />
              </ListItem>
            ))}
          </List>
        )}
      </Paper>

    </Container>
  );
};

export default UserChecklistPage; 