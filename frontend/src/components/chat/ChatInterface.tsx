import React from 'react';
import { Box, Paper, Typography } from '@mui/material';

// Später importieren wir die echten Komponenten
import MessageList from './MessageList';
import MessageInput from './MessageInput';

const ChatInterface: React.FC = () => {
  return (
    <Paper elevation={3} sx={{ height: 'calc(100vh - 120px)', // Beispielhöhe (Viewport - AppBar - Padding)
                            display: 'flex', 
                            flexDirection: 'column' }}>
      {/* Platzhalter für Nachrichtenliste */}
      <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 2 }}>
        <MessageList />
      </Box>

      {/* Platzhalter für Nachrichteneingabe */}
      <Box sx={{ p: 2, borderTop: '1px solid', borderColor: 'divider' }}>
        <MessageInput />
      </Box>
    </Paper>
  );
};

export default ChatInterface; 