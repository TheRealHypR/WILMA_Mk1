import React, { useEffect, useRef } from 'react';
import { Box, List, ListItem, Paper, Typography, Avatar, useTheme } from '@mui/material';
import { Message } from '../../types/chat';
import { Timestamp } from 'firebase/firestore';

interface MessageListProps {
  messages: Message[];
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

  return (
    <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 2 }}>
      <List>
        {messages.map((message) => {
          const isCurrentUser = message.senderId === 'user';
          return (
            <ListItem key={message.id} sx={{ display: 'flex', justifyContent: isCurrentUser ? 'flex-end' : 'flex-start', mb: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: isCurrentUser ? 'row-reverse' : 'row' }}>
                <Avatar sx={{ bgcolor: isCurrentUser ? theme.palette.primary.main : theme.palette.secondary.main, width: 32, height: 32, mx: 1 }}>
                  {message.senderId === 'ai' ? 'AI' : 'U'}
                </Avatar>
                <Paper 
                  variant="outlined" 
                  sx={{
                    p: 1.5, 
                    bgcolor: isCurrentUser ? theme.palette.primary.light : theme.palette.background.paper,
                    color: isCurrentUser ? theme.palette.primary.contrastText : theme.palette.text.primary,
                    borderRadius: isCurrentUser ? '20px 20px 5px 20px' : '20px 20px 20px 5px',
                    maxWidth: '70%',
                    wordBreak: 'break-word',
                  }}
                >
                  <Typography variant="body2">
                    {message.text}
                  </Typography>
                  <Typography variant="caption" display="block" sx={{ mt: 0.5, fontSize: '0.65rem', color: isCurrentUser ? theme.palette.primary.contrastText : theme.palette.text.secondary, opacity: 0.7, textAlign: isCurrentUser ? 'right' : 'left' }}>
                    {message.timestamp ? 
                      (message.timestamp instanceof Timestamp 
                        ? message.timestamp.toDate() 
                        : message.timestamp instanceof Date 
                          ? message.timestamp 
                          : new Date() // Fallback
                      ).toLocaleTimeString([], { hour: '2-digit', minute:'2-digit' }) 
                      : ''}
                  </Typography>
                </Paper>
              </Box>
            </ListItem>
          );
        })}
        <div ref={messagesEndRef} />
      </List>
    </Box>
  );
};

export default MessageList; 