import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Box, CircularProgress, Typography, Button, Alert, ListItem, Avatar, Paper, useTheme } from '@mui/material';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import { useAuth } from '../../contexts/AuthContext';
import { Message } from '../../types/chat';
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
  limit,
  startAfter,
  getDocs,
  Query,
} from 'firebase/firestore';
import wilmaLogo from '../../assets/logo1.png';

// Props werden vorerst nicht benötigt, da wir den State hier verwalten
interface ChatLayoutProps {
  // Keine expliziten Props von außen in dieser Phase
}

const MESSAGES_PER_PAGE = 10; // Konstante für Nachrichten pro Seite

// Liste mit Warte-Nachrichten
const loadingMessages = [
  "Moment, ich poliere kurz meine Kristallkugel... ✨",
  "Ich frage mal die Trauzeugen... äh, meine Datenbank... 🧠",
  "Sortiere gerade das Chaos der Hochzeitsplanung... einen Augenblick... 🤯",
  "Prüfe kurz, ob das Budget das erlaubt... 💸",
  "Ich braue dir eine brillante Idee zusammen... 💡",
  "Sekunde, muss schnell die Ringe zählen... 💍",
  "Stelle sicher, dass die Torte nicht schmilzt... 🎂",
  "Denke mit Lichtgeschwindigkeit nach... (naja, fast) 🚀",
  "Entwirre kurz den Kabelsalat der Gefühle... ❤️",
  "Konsultiere das große Buch der Hochzeiten... 📖",
];

const ChatLayout: React.FC<ChatLayoutProps> = () => {
  const { currentUser } = useAuth();
  const theme = useTheme();
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [isWaitingForResponse, setIsWaitingForResponse] = useState(false);
  const [webhookError, setWebhookError] = useState<string | null>(null);
  const [currentLoadingMessage, setCurrentLoadingMessage] = useState('');

  // === State für Paginierung ===
  // Speichert den Snapshot des ältesten Dokuments der aktuell geladenen Seite.
  // Wird als Startpunkt (`startAfter`) für die nächste Abfrage verwendet.
  const [lastVisibleDoc, setLastVisibleDoc] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  // Zeigt an, ob gerade ältere Nachrichten nachgeladen werden.
  const [loadingMore, setLoadingMore] = useState(false);
  // Zeigt an, ob es potenziell noch ältere Nachrichten in Firestore gibt.
  const [hasMoreMessages, setHasMoreMessages] = useState(true);
  // Ref, um sicherzustellen, dass der initiale Snapshot-Listener nur einmal pro Benutzer angehängt wird.
  const initialLoadDone = useRef(false);

  // === Refs für UI-Interaktion ===
  // Ref zum unteren Ende der Nachrichtenliste für automatisches Scrollen.
  const messagesEndRef = useRef<null | HTMLDivElement>(null);
  // Ref zum Container-Element der Nachrichtenliste für Scroll-Positions-Handling.
  const messagesContainerRef = useRef<null | HTMLDivElement>(null);
  // Ref, um die Scroll-Höhe *vor* dem Laden älterer Nachrichten zu speichern.
  const previousScrollHeight = useRef<number | null>(null);

  // === Effekt für initiales Laden und Live-Updates ===
  // Dieser Effekt wird beim Mounten und bei Benutzerwechsel ausgeführt.
  // Er abonniert die *neuesten* Nachrichten (`orderBy desc`, `limit`) über `onSnapshot`,
  // um Live-Updates für neue Nachrichten zu erhalten.
  useEffect(() => {
    if (!currentUser || initialLoadDone.current) {
      if (!currentUser) {
        setMessages([]);
        setLoading(false);
        setError("Bitte einloggen, um den Chat zu laden.");
        setLastVisibleDoc(null);
        setHasMoreMessages(true);
        initialLoadDone.current = false;
      }
      return;
    }

    setLoading(true);
    setError(null);
    setMessages([]); // Nachrichten leeren für den neuen Benutzer/erstmaligen Ladevorgang
    setLastVisibleDoc(null);
    setHasMoreMessages(true); // Zurücksetzen
    initialLoadDone.current = true; // Markieren, dass der initiale Ladevorgang gestartet wurde

    const messagesCollectionPath = `users/${currentUser.uid}/messages`;
    const messagesCollectionRef = collection(db, messagesCollectionPath);
    // NEUESTE Nachrichten abonnieren
    const q = query(messagesCollectionRef, orderBy("timestamp", "desc"), limit(MESSAGES_PER_PAGE));

    const unsubscribe = onSnapshot(q,
      (querySnapshot) => {
        const fetchedMessages: Message[] = [];
        const docSnapshots = querySnapshot.docs; // Dokumente holen

        docSnapshots.forEach((doc) => {
          const data = doc.data();
          const timestamp = data.timestamp instanceof Timestamp ? data.timestamp : null;
          fetchedMessages.push({
            id: doc.id,
            text: data.text || '',
            senderId: data.senderId || 'unknown',
            timestamp: timestamp,
          });
        });

        // Korrigierte Logik für State-Update im onSnapshot:
        // Die neuesten Nachrichten vom Snapshot (bereits umgedreht für chronologische Reihenfolge)
        const latestMessagesFromSnapshot = fetchedMessages.reverse();

        setMessages(prevMessages => {
          const snapshotIds = new Set(latestMessagesFromSnapshot.map(m => m.id));
          const olderMessages = prevMessages.filter(m => !snapshotIds.has(m.id));
          return [...olderMessages, ...latestMessagesFromSnapshot];
        });

        // Setze lastVisibleDoc für die Paginierung (das älteste Dokument in DIESEM Batch)
        // Nur setzen, wenn wir auch Dokumente bekommen haben
        if(docSnapshots.length > 0) {
             setLastVisibleDoc(docSnapshots[docSnapshots.length - 1]);
             // Prüfen, ob es weniger als die angeforderte Menge gab -> keine weiteren Nachrichten mehr
             setHasMoreMessages(docSnapshots.length === MESSAGES_PER_PAGE);
        } else {
            setHasMoreMessages(false); // Keine Dokumente im ersten Fetch
        }

        setLoading(false); // Initiales Laden beendet
      },
      (err) => {
        console.error("Fehler beim Abrufen der Nachrichten:", err);
        setError("Nachrichten konnten nicht geladen werden.");
        setLoading(false);
        initialLoadDone.current = false; // Erlaube erneuten Versuch
      }
    );

    // Cleanup-Funktion
    return () => {
        console.log("Unsubscribing from message snapshots.");
        unsubscribe();
        initialLoadDone.current = false; // Zurücksetzen beim Unmounten/User-Wechsel
    };

  }, [currentUser]); // Nur ausführen, wenn sich der Benutzer ändert

  // === Funktion zum Laden älterer Nachrichten ===
  // Wird durch den "Ältere Nachrichten laden"-Button ausgelöst.
  // Verwendet `getDocs` (einmaliger Abruf) mit `startAfter`, um die nächste Seite zu holen.
  const loadMoreMessages = useCallback(async () => {
    if (!currentUser || loadingMore || !lastVisibleDoc || !hasMoreMessages) {
      console.log("loadMoreMessages: Aborted", { loadingMore, lastVisibleDoc: !!lastVisibleDoc, hasMoreMessages });
      return;
    }

    setLoadingMore(true);
    setError(null);

    // Scroll-Position merken
    if (messagesContainerRef.current) {
        previousScrollHeight.current = messagesContainerRef.current.scrollHeight;
    }

    const messagesCollectionPath = `users/${currentUser.uid}/messages`;
    const messagesCollectionRef = collection(db, messagesCollectionPath);

    // Abfrage für die nächste Seite, beginnend nach dem letzten sichtbaren Dokument
    let q: Query<DocumentData> = query(
        messagesCollectionRef,
        orderBy("timestamp", "desc"),
        startAfter(lastVisibleDoc),
        limit(MESSAGES_PER_PAGE)
    );


    try {
        console.log("loadMoreMessages: Fetching older messages...");
        const querySnapshot = await getDocs(q);
        const olderMessages: Message[] = [];
        const docSnapshots = querySnapshot.docs;

        console.log(`loadMoreMessages: Fetched ${docSnapshots.length} older messages.`);

        docSnapshots.forEach((doc) => {
            const data = doc.data();
            const timestamp = data.timestamp instanceof Timestamp ? data.timestamp : null;
            olderMessages.push({
                id: doc.id,
                text: data.text || '',
                senderId: data.senderId || 'unknown',
                timestamp: timestamp,
            });
        });

        // Ältere Nachrichten VOR die bestehenden setzen (und umkehren, da wir 'desc' sortiert haben)
        setMessages(prevMessages => [...olderMessages.reverse(), ...prevMessages]);

        // Das neue 'lastVisibleDoc' ist das letzte (älteste) Dokument in diesem Batch
        const newLastVisible = docSnapshots.length > 0 ? docSnapshots[docSnapshots.length - 1] : null;
        setLastVisibleDoc(newLastVisible);

        // Prüfen, ob es noch mehr Nachrichten gibt
        setHasMoreMessages(docSnapshots.length === MESSAGES_PER_PAGE);
        console.log("loadMoreMessages: hasMoreMessages set to:", docSnapshots.length === MESSAGES_PER_PAGE);

    } catch (err) {
      console.error("Fehler beim Laden älterer Nachrichten:", err);
      setError("Ältere Nachrichten konnten nicht geladen werden.");
    } finally {
      setLoadingMore(false);
    }
  }, [currentUser, loadingMore, lastVisibleDoc, hasMoreMessages]); // Abhängigkeiten für useCallback


  // === Effekt zur Wiederherstellung der Scroll-Position ===
  // Dieser Effekt wird ausgeführt, nachdem ältere Nachrichten geladen wurden (`loadingMore` wird false).
  // Er berechnet die Differenz der Scroll-Höhe und passt `scrollTop` an,
  // damit der Benutzer an der gleichen Stelle in der Nachrichtenliste bleibt.
  useEffect(() => {
      if (!loadingMore && previousScrollHeight.current && messagesContainerRef.current) {
          const newScrollHeight = messagesContainerRef.current.scrollHeight;
          messagesContainerRef.current.scrollTop += (newScrollHeight - previousScrollHeight.current);
          previousScrollHeight.current = null; // Zurücksetzen
      }
  }, [loadingMore, messages]); // Abhängig von Ladezustand und Nachrichten


  // === Effekt für automatisches Scrollen zum Ende ===
  // Scrollt zum Ende der Liste, wenn neue Nachrichten hinzukommen (via Snapshot oder Senden),
  // aber *nicht*, wenn gerade ältere Nachrichten geladen wurden.
  useEffect(() => {
      if (!loadingMore) { // Nicht scrollen während/nach dem Nachladen älterer Nachrichten
          messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }
  }, [messages, loadingMore]); // Nur wenn sich Nachrichten ändern und nicht gerade nachgeladen wird

  // Effekt zum Setzen der zufälligen Warte-Nachricht (bleibt bestehen)
  useEffect(() => {
    if (isWaitingForResponse) {
      const randomIndex = Math.floor(Math.random() * loadingMessages.length);
      setCurrentLoadingMessage(loadingMessages[randomIndex]);
    } 
  }, [isWaitingForResponse]);

  // === Funktion zum Senden einer Nachricht (ANGEPASST) ===
  const handleSendMessage = async (messageText: string) => {
    if (!currentUser || isSending || isWaitingForResponse || !messageText.trim()) return;

    setIsSending(true);
    setError(null);
    setWebhookError(null);
    setIsWaitingForResponse(true); // --> Ladezustand direkt hier setzen <--
    const messagesCollectionPath = `users/${currentUser.uid}/messages`;
    const messagesCollectionRef = collection(db, messagesCollectionPath);

    const userMessageData = {
        text: messageText.trim(),
        senderId: 'user',
        timestamp: serverTimestamp(),
    };

    try {
      // 1. User-Nachricht speichern
      await addDoc(messagesCollectionRef, userMessageData);
      setIsSending(false);

      // 2. Anfrage an n8n Webhook senden
      const webhookUrl = import.meta.env.VITE_N8N_CHAT_WEBHOOK_URL;
      if (!webhookUrl) {
        setWebhookError("Chat-Webhook ist nicht konfiguriert.");
        setIsWaitingForResponse(false); // --> Ladezustand beenden <--
        return;
      }

      console.log(`ChatLayout: Sending message to n8n webhook: ${webhookUrl}`);

      try {
        const response = await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            message: messageText.trim(),
            userId: currentUser.uid
          }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Webhook antwortete mit Status ${response.status}: ${errorText}`);
        }

        const responseData = await response.json();

        if (responseData && responseData.reply) {
          // 3. KI-Antwort in Firestore speichern
          const aiMessageData = {
            text: responseData.reply,
            senderId: 'ai',
            timestamp: serverTimestamp(),
          };
          await addDoc(messagesCollectionRef, aiMessageData);
          // Kein setMessages mehr hier nötig, onSnapshot übernimmt
        } else {
          setWebhookError("Keine gültige Antwort vom Chat-Agenten erhalten.");
          // Kein Entfernen von tempMessage mehr nötig
        }

      } catch (webhookFetchError) {
        console.error("ChatLayout: Fehler beim Senden/Empfangen vom Webhook:", webhookFetchError);
        setWebhookError(`Fehler bei der Kommunikation mit dem Chat-Agenten: ${webhookFetchError instanceof Error ? webhookFetchError.message : String(webhookFetchError)}`);
         // Kein Entfernen von tempMessage mehr nötig
      } finally {
        setIsWaitingForResponse(false); // --> Ladezustand beenden <--
      }

    } catch (firestoreError) {
      console.error("ChatLayout: Fehler beim Speichern der User-Nachricht:", firestoreError);
      setError("Nachricht konnte nicht gesendet werden.");
      setIsSending(false);
      setIsWaitingForResponse(false); // --> Ladezustand beenden <--
    }
  };

  // Rendert nichts, wenn kein User eingeloggt ist (oder zeigt Ladezustand/Fehler)
  if (!currentUser && !loading) { // Zustand ohne User nur zeigen, wenn nicht initial geladen wird
      return <Box sx={{ p: 2, textAlign: 'center' }}><Typography color="error">{error || "Bitte einloggen."}</Typography></Box>;
  }

  // Initialer Ladebildschirm
  if (loading && messages.length === 0) {
      return <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'calc(100vh - 64px)' }}><CircularProgress /></Box>;
  }

  // Fehleranzeige, wenn keine Nachrichten vorhanden sind
  if (error && messages.length === 0 && !loading) {
    return <Box sx={{ p: 2, textAlign: 'center', height: 'calc(100vh - 64px)' }}><Typography color="error">{error}</Typography></Box>;
  }

  return (
    <Box
      sx={{
        height: 'calc(100vh - 64px)',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'grey.50',
      }}
    >
      {/* Bereich für die Nachrichtenanzeige (sollte scrollen) */}
      <Box
        ref={messagesContainerRef} // Ref zum Scroll-Container hinzufügen
        sx={{
          flexGrow: 1,
          overflowY: 'auto',
          p: 2,
          display: 'flex', // Wichtig für die Positionierung des Lade-Buttons/Spinners
          flexDirection: 'column', // Nachrichten untereinander
        }}
      >
        {/* Ladeanzeige oder Button für ältere Nachrichten */}
        <Box sx={{ textAlign: 'center', mb: 1 }}>
          {loadingMore ? (
            <CircularProgress size={24} />
          ) : hasMoreMessages ? (
            <Button onClick={loadMoreMessages} size="small" disabled={loadingMore}>
              Ältere Nachrichten laden
            </Button>
          ) : (
             messages.length > 0 && <Typography variant="caption" color="textSecondary">Keine älteren Nachrichten</Typography>
          )}
        </Box>

        {/* Fehleranzeige (auch wenn schon Nachrichten da sind) */}
        {error && !loading && <Typography color="error" sx={{ mb: 1, textAlign: 'center' }}>{error}</Typography>}

        {/* Nachrichtenliste */}
        {messages.length > 0 ? (
           <MessageList messages={messages} />
        ) : (
           !loading && !error && <Typography sx={{ textAlign: 'center', mt: 4 }}>Keine Nachrichten vorhanden.</Typography> // Meldung, wenn leer
        )}

        {/* --> NEUER Ladeindikator AM ENDE der Liste <-- */} 
        {isWaitingForResponse && (
         <ListItem sx={{ display: 'flex', justifyContent: 'flex-start', mb: 1 }}>
           <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'row' }}>
             <Avatar 
               src={wilmaLogo} 
               sx={{ width: 32, height: 32, mx: 1, opacity: 0.7 }}
             />
             <Paper 
               variant="outlined" 
               sx={{ 
                 p: 1.5, 
                 bgcolor: theme.palette.background.paper,
                 borderRadius: '20px 20px 20px 5px',
                 maxWidth: '70%',
                 opacity: 0.7, 
                 display: 'flex', 
                 alignItems: 'center', 
                 gap: 1 
               }}
             >
               <CircularProgress size={16} color="inherit" />
               <Typography variant="body2" color="text.secondary">
                 {currentLoadingMessage}
               </Typography>
             </Paper>
           </Box>
         </ListItem>
        )}
        {/* -------------------------------------------------- */}

        {/* Referenz für Autoscroll ans Ende */}
        <div ref={messagesEndRef} />
      </Box>

      {/* Bereich für die Nachrichteneingabe */}
      <Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider', bgcolor: 'background.paper' }}>
        {webhookError && <Alert severity="warning" sx={{ mb: 1 }}>{webhookError}</Alert>}
        <MessageInput
            onSendMessage={handleSendMessage}
            disabled={isSending || isWaitingForResponse}
          />
      </Box>
    </Box>
  );
};

export default ChatLayout; 