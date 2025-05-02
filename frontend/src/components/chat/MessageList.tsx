import React, { useEffect, useRef } from 'react';
import { Box, List, ListItem, Paper, Typography, Avatar, useTheme, CircularProgress } from '@mui/material';
// import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome'; // Icon wird nicht mehr benötigt
import { Message } from '../../types/chat';
import { Timestamp } from 'firebase/firestore';
import wilmaLogo from '../../assets/logo1.png'; // <-- Logo importiert (Pfad anpassen, falls nötig)

// Erweitere den Message-Typ, um das optionale isLoading-Flag zu berücksichtigen
interface ExtendedMessage extends Message {
  isLoading?: boolean;
}

interface MessageListProps {
  // Verwende den erweiterten Typ hier
  messages: ExtendedMessage[];
}

const MessageList: React.FC<MessageListProps> = ({ messages }) => {
  const theme = useTheme();
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // const sageGreen = '#B2D8B2'; // Farbe wird nicht mehr direkt für AI benötigt

  return (
    <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 2 }}>
      <List>
        {messages.map((message) => {
          const isCurrentUser = message.senderId === 'user';
          const isAI = message.senderId === 'ai';
          const isLoading = message.isLoading === true;

          return (
            // Äußeres ListItem für die ganze Zeile (Avatar + Bubble + Timestamp)
            <ListItem key={message.id} sx={{ display: 'flex', flexDirection: 'column', alignItems: isCurrentUser ? 'flex-end' : 'flex-start', mb: 1 }}>
              {/* Box für Avatar und Bubble nebeneinander */}
              <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: isCurrentUser ? 'row-reverse' : 'row', maxWidth: '85%' }}>
                <Avatar 
                  // Verwende das Logo als src, wenn es AI ist
                  src={isAI ? wilmaLogo : undefined} 
                  sx={{
                    // Hintergrund nur noch für User oder als Fallback
                    bgcolor: isCurrentUser ? theme.palette.primary.main : theme.palette.secondary.main,
                    width: 32, 
                    height: 32, 
                    mx: 1,
                    // Evtl. leichte Transparenz für ladende Nachrichten?
                    opacity: isLoading ? 0.7 : 1,
                  }}
                >
                  {/* Initial nur noch für den User anzeigen, wenn kein Logo da ist */} 
                  {!isAI ? 'U' : null}
                </Avatar>
                {/* Paper-Bubble */}
                <Paper 
                  variant="outlined" 
                  sx={{
                    p: 1.5, 
                    bgcolor: isCurrentUser ? theme.palette.primary.light : theme.palette.background.paper,
                    color: isCurrentUser ? theme.palette.primary.contrastText : theme.palette.text.primary,
                    borderRadius: isCurrentUser ? '20px 20px 5px 20px' : '20px 20px 20px 5px',
                    // maxWidth: '70%', // MaxWidth hier entfernen, da die äußere Box es steuert
                    wordBreak: 'break-word',
                    opacity: isLoading ? 0.7 : 1,
                    display: 'flex', 
                    alignItems: 'center',
                    gap: 1,
                  }}
                >
                  {/* Spinner nur anzeigen, wenn isLoading true ist */} 
                  {isLoading && <CircularProgress size={16} color="inherit" />}
                  {/* Nachrichtentext */} 
                  <Typography variant="body2">
                    {message.text}
                  </Typography>
                </Paper>
              </Box>
              {/* Timestamp UNTERHALB der Bubble */}
              {!isLoading && message.timestamp && (
                <Typography 
                  variant="caption" 
                  display="block" 
                  sx={{ 
                    mt: 0.5, // Abstand nach oben zur Bubble
                    mr: isCurrentUser ? 0 : '44px', // Rechter Abstand für AI (Avatar+margin)
                    ml: isCurrentUser ? '44px' : 0, // Linker Abstand für User (Avatar+margin)
                    fontSize: '0.65rem', 
                    color: theme.palette.text.secondary, 
                    opacity: 0.7, 
                    textAlign: isCurrentUser ? 'right' : 'left', 
                  }}
                >
                  { (
                    message.timestamp instanceof Timestamp ? message.timestamp.toDate() :
                    message.timestamp instanceof Date ? message.timestamp : new Date()
                  ).toLocaleTimeString([], { hour: '2-digit', minute:'2-digit' }) }
                </Typography>
              )}
            </ListItem>
          );
        })}
        <div ref={messagesEndRef} />
      </List>
    </Box>
  );
};

export default MessageList; 