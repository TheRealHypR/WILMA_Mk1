import React, { useEffect, useState, useRef } from 'react';
import { Box, List, ListItem, Paper, Typography, CircularProgress, Avatar, useTheme } from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import { format } from 'date-fns'; // Zur Datumsformatierung
import { Message } from '../../types/chat'; // Importieren des zentralen Typs
import PersonIcon from '@mui/icons-material/Person';
import SmartToyIcon from '@mui/icons-material/SmartToy';

interface MessageListProps {
  messages: Message[];
  currentUserId: string; // ID des aktuell eingeloggten Nutzers
}

const MessageList: React.FC<MessageListProps> = ({ messages, currentUserId }) => {
  // Hinzugefügtes Log, um die empfangenen Props zu prüfen
  console.log("MessageList received messages:", messages);

  const messagesEndRef = useRef<null | HTMLDivElement>(null); // Ref für Autoscroll
  const theme = useTheme(); // Theme holen für Zugriff auf custom colors

  // Effekt zum automatischen Scrollen zum Ende
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]); // Immer scrollen, wenn sich Nachrichten ändern

  const formatTimestamp = (timestamp: Message['timestamp']): string => {
    try {
      if (timestamp && 'toDate' in timestamp && typeof timestamp.toDate === 'function') {
        // Es ist ein Firestore Timestamp
        return format(timestamp.toDate(), 'HH:mm');
      } else if (timestamp instanceof Date) {
        // Es ist ein JavaScript Date Objekt
        return format(timestamp, 'HH:mm');
      }
      return '--:--'; // Fallback für null oder andere unerwartete Typen
    } catch (error) {
      console.error("Error formatting timestamp:", timestamp, error);
      return '--:--';
    }
  };

  return (
    <List sx={{ p: 0 }}>
      {messages.map((message) => {
        const isUserMessage = message.senderId === 'user';
        const alignment = isUserMessage ? 'flex-end' : 'flex-start';
        const bgColor = isUserMessage ? theme.palette.custom?.userMessageBg || '#FADCD9' : theme.palette.custom?.aiMessageBg || '#FFFFFF';
        const textColor = theme.palette.text.primary;
        const avatarBgColor = isUserMessage ? theme.palette.secondary.light : theme.palette.primary.light;
        const AvatarIcon = isUserMessage ? PersonIcon : SmartToyIcon;

        return (
          <ListItem 
            key={message.id} 
            sx={{
              display: 'flex',
              mb: 2,
              flexDirection: isUserMessage ? 'row-reverse' : 'row',
              alignItems: 'flex-start'
            }}
          >
            <Avatar sx={{ bgcolor: avatarBgColor, width: 32, height: 32, mx: 1 }}>
              <AvatarIcon fontSize="small" />
            </Avatar>
            <Box sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: alignment,
              ml: isUserMessage ? 'auto' : 0,
              mr: !isUserMessage ? 'auto' : 0,
              maxWidth: '75%',
            }}>
              <Paper
                elevation={1}
                sx={{
                  p: 1.5,
                  borderRadius: '16px',
                  bgcolor: bgColor,
                  color: textColor,
                  wordBreak: 'break-word',
                  minWidth: 0,
                }}
              >
                <Typography variant="body1">
                  {message.text}
                </Typography>
              </Paper>
              <Typography 
                variant="caption" 
                sx={{ 
                  display: 'block', 
                  textAlign: alignment, 
                  opacity: 0.6, 
                  mt: 0.5, 
                  px: 0.5 
                }}
              >
                {formatTimestamp(message.timestamp)}
              </Typography>
            </Box>
          </ListItem>
        );
      })}
      <div ref={messagesEndRef} />
    </List>
  );
};

export default MessageList; 