import React, { useState, useEffect, useRef } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import { useAuth } from '../../contexts/AuthContext';
import { Message } from '../../types/chat';
// Firebase imports
import { db } from '../../firebaseConfig';
import {
  collection,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
  onSnapshot,
  Timestamp,
  QueryDocumentSnapshot,
  DocumentData,
  limit
} from 'firebase/firestore';

// Props werden vorerst nicht benötigt, da wir den State hier verwalten
interface ChatLayoutProps {
  // Keine expliziten Props von außen in dieser Phase
}

const ChatLayout: React.FC<ChatLayoutProps> = () => {
  const { currentUser } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false); // Wird kurz für die User-Nachricht verwendet

  // Ref für automatisches Scrollen zum Ende der Nachrichtenliste
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  // Effekt zum Laden und Abonnieren von Nachrichten
  useEffect(() => {
    if (!currentUser) {
      setMessages([]);
      setLoading(false);
      setError("Bitte einloggen, um den Chat zu laden.");
      return;
    }

    setLoading(true);
    setError(null);

    // KORRIGIERTER PFAD:
    const messagesCollectionPath = `users/${currentUser.uid}/messages`;
    const messagesCollectionRef = collection(db, messagesCollectionPath);
    const q = query(messagesCollectionRef, orderBy("timestamp"), limit(100));

    const unsubscribe = onSnapshot(q, 
      (querySnapshot) => {
        const fetchedMessages: Message[] = [];
        querySnapshot.forEach((doc: QueryDocumentSnapshot<DocumentData>) => {
          const data = doc.data();
          const timestamp = data.timestamp instanceof Timestamp ? data.timestamp : null;
          fetchedMessages.push({
            id: doc.id,
            text: data.text || '',
            // Annahme: senderId ist 'user' oder 'ai' (gemäß alter Function)
            senderId: data.senderId || 'unknown',
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

    // Cleanup-Funktion
    return () => unsubscribe();

  }, [currentUser]); // Neu laden, wenn Benutzer wechselt

  // Automatisches Scrollen, wenn neue Nachrichten hinzukommen
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Funktion zum Senden einer Nachricht und Simulieren einer AI-Antwort
  const handleSendMessage = async (messageText: string) => {
    console.log("ChatLayout: handleSendMessage called with text:", messageText);
    if (!currentUser || isSending || !messageText.trim()) {
      console.log("ChatLayout: handleSendMessage aborted (no user, sending, or empty text).");
      return;
    }

    setIsSending(true); 
    setError(null);
    const messagesCollectionPath = `users/${currentUser.uid}/messages`;
    const messagesCollectionRef = collection(db, messagesCollectionPath);

    try {
      // 1. Benutzernachricht speichern
      await addDoc(messagesCollectionRef, {
        text: messageText.trim(),
        senderId: 'user',
        timestamp: serverTimestamp(),
      });
      console.log("User message successfully sent to Firestore."); 

      // 2. AI-Antwort simulieren (nach kurzer Verzögerung)
      console.log("Setting timeout for AI response..."); 
      setTimeout(() => {
        console.log("---!!! setTimeout Triggered !!!---"); 
      }, 1000); // 1 Sekunde Verzögerung

    } catch (userMsgError) {
      console.error("Fehler beim Senden der Benutzernachricht:", userMsgError);
      setError("Nachricht konnte nicht gesendet werden.");
    } finally {
      // Wichtig: isSending wird nur für das Senden der User-Nachricht verwendet.
      // Die AI-Antwort kommt asynchron, die Eingabe wird nicht mehr blockiert.
      setIsSending(false); 
    }
  };

  // Rendert nichts, wenn kein User eingeloggt ist (oder zeigt Ladezustand/Fehler)
  if (!currentUser) {
    return <Box sx={{ p: 2, textAlign: 'center' }}><Typography color="error">{error || "Bitte einloggen."}</Typography></Box>;
  }

  if (loading) {
    return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}><CircularProgress /></Box>;
  }

  if (error && messages.length === 0) { // Fehler nur anzeigen, wenn keine alten Nachrichten da sind
    return <Box sx={{ p: 2, textAlign: 'center' }}><Typography color="error">{error}</Typography></Box>;
  }

  return (
    <Box
      sx={{
        // Passe die Höhe an, um den Platz unter der AppBar (angenommen 64px) zu füllen
        height: 'calc(100vh - 64px)', 
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'grey.50',
        // Wichtig: Verhindere Überlauf auf dieser Ebene
        overflow: 'hidden' 
      }}
    >
      {/* Bereich für die Nachrichtenanzeige (sollte scrollen) */}
      <Box
        sx={{
          flexGrow: 1,
          overflowY: 'auto', // Dieser Bereich soll scrollen
          p: 2,
        }}
      >
        {error && <Typography color="error" sx={{ mb: 1, textAlign: 'center' }}>{error}</Typography>} {/* Fehler auch über der Liste anzeigen */}
        <MessageList messages={messages} currentUserId={currentUser.uid} />
        {/* Referenz für Autoscroll */}
        <div ref={messagesEndRef} />
      </Box>

      {/* Bereich für die Nachrichteneingabe */}
      <Box sx={{ borderTop: 1, borderColor: 'divider' }}>
         {/* MessageInput Komponente einfügen */}
         <MessageInput
            onSendMessage={handleSendMessage}
            disabled={isSending} // Eingabe deaktivieren während des Sendens
          />
      </Box>
    </Box>
  );
};

export default ChatLayout; 