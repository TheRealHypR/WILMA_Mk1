import React, { useEffect, useState, useRef } from 'react';
import { Box, List, ListItem, Paper, Typography, CircularProgress } from '@mui/material';
import { collection, query, orderBy, onSnapshot, Timestamp, DocumentData, QueryDocumentSnapshot } from 'firebase/firestore';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../firebaseConfig';

// Interface für unsere Nachrichtenobjekte
interface Message {
  id: string;
  text: string;
  senderId: 'user' | 'ai';
  timestamp: Timestamp;
}

const MessageList: React.FC = () => {
  const { currentUser } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<null | HTMLDivElement>(null); // Ref für Autoscroll

  // Effekt zum Abrufen der Nachrichten
  useEffect(() => {
    if (!currentUser) {
      setLoading(false);
      setError("Benutzer nicht angemeldet.");
      return;
    }

    setLoading(true);
    setError(null);

    // Referenz zur Nachrichten-Subkollektion des Benutzers
    const messagesCollectionRef = collection(db, `users/${currentUser.uid}/messages`);
    // Query, um Nachrichten nach Zeitstempel zu sortieren
    const q = query(messagesCollectionRef, orderBy("timestamp"));

    // Listener für Echtzeit-Updates
    const unsubscribe = onSnapshot(q,
      (querySnapshot) => {
        const fetchedMessages: Message[] = [];
        querySnapshot.forEach((doc: QueryDocumentSnapshot<DocumentData>) => {
          const data = doc.data();
          // Stelle sicher, dass das Timestamp-Objekt korrekt behandelt wird
          const timestamp = data.timestamp instanceof Timestamp ? data.timestamp : Timestamp.now();
          fetchedMessages.push({
            id: doc.id,
            text: data.text || '',
            senderId: data.senderId === 'user' || data.senderId === 'ai' ? data.senderId : 'ai', // Fallback
            timestamp: timestamp,
          });
        });
        setMessages(fetchedMessages);
        setLoading(false);
      },
      (err) => {
        console.error("Fehler beim Abrufen der Nachrichten:", err);
        setError("Nachrichten konnten nicht geladen werden.");
        setLoading(false);
      }
    );

    // Cleanup-Funktion: Listener entfernen, wenn Komponente unmountet
    return () => unsubscribe();
  }, [currentUser]); // Effekt neu ausführen, wenn sich der Benutzer ändert

  // Effekt zum automatischen Scrollen zum Ende
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]); // Immer scrollen, wenn sich Nachrichten ändern

  if (loading) {
    return <CircularProgress sx={{ display: 'block', margin: 'auto' }} />;
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  return (
    <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
      {messages.map((message) => (
        <ListItem
          key={message.id}
          sx={{
            display: 'flex',
            justifyContent: message.senderId === 'user' ? 'flex-end' : 'flex-start',
            mb: 1, // Abstand zwischen Nachrichten
          }}
        >
          <Paper
            elevation={1}
            sx={{
              p: 1.5,
              bgcolor: message.senderId === 'user' ? 'primary.main' : 'grey.300',
              color: message.senderId === 'user' ? 'primary.contrastText' : 'text.primary',
              borderRadius: message.senderId === 'user' 
                ? '20px 20px 5px 20px' 
                : '20px 20px 20px 5px',
              maxWidth: '70%', // Verhindert, dass Nachrichten zu breit werden
              wordWrap: 'break-word', // Zeilenumbruch für lange Wörter
            }}
          >
            <Typography variant="body1">{message.text}</Typography>
          </Paper>
        </ListItem>
      ))}
      {/* Unsichtbares Element am Ende der Liste für Autoscroll */}
      <div ref={messagesEndRef} />
    </List>
  );
};

export default MessageList; 