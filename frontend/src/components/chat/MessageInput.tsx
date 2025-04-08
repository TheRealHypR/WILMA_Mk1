import React, { useState } from 'react';
import { Box, TextField, IconButton, CircularProgress } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../firebaseConfig';

const MessageInput: React.FC = () => {
  const { currentUser } = useAuth();
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSendMessage = async (event?: React.FormEvent<HTMLFormElement>) => {
    event?.preventDefault(); // Verhindert Neuladen bei Formular-Submit (Enter)
    if (!currentUser || sending || !newMessage.trim()) {
      return; // Nichts tun, wenn nicht eingeloggt, schon sendet oder Nachricht leer ist
    }

    setSending(true);
    setError(null);

    try {
      // Referenz zur Nachrichten-Subkollektion des Benutzers
      const messagesCollectionRef = collection(db, `users/${currentUser.uid}/messages`);
      
      // Neues Nachrichtendokument hinzufügen
      await addDoc(messagesCollectionRef, {
        text: newMessage.trim(),
        senderId: 'user',
        timestamp: serverTimestamp(), // Wichtig: Server-Zeitstempel verwenden
      });

      setNewMessage(''); // Eingabefeld leeren

    } catch (err) {
      console.error("Fehler beim Senden der Nachricht:", err);
      setError("Nachricht konnte nicht gesendet werden.");
      // Optional: Fehler dem Benutzer anzeigen (z.B. mit einem Alert)
    } finally {
      setSending(false);
    }
  };

  return (
    <Box 
      component="form" 
      onSubmit={handleSendMessage} 
      sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
    >
      <TextField
        fullWidth
        variant="outlined"
        size="small"
        placeholder="Nachricht eingeben..."
        value={newMessage}
        onChange={(e) => setNewMessage(e.target.value)}
        disabled={sending || !currentUser}
        onKeyDown={(e) => {
          // Optional: Senden bei Enter, aber nicht bei Shift+Enter
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault(); // Standard-Enter-Verhalten verhindern
            handleSendMessage();
          }
        }}
        // Zeigt den letzten Fehler an (optional, kann auch als Alert o.ä. realisiert werden)
        error={!!error}
        helperText={error}
      />
      <IconButton type="submit" color="primary" disabled={sending || !currentUser || !newMessage.trim()}>
        {sending ? <CircularProgress size={24} /> : <SendIcon />}
      </IconButton>
    </Box>
  );
};

export default MessageInput; 