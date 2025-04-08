import React from 'react';
import { Typography, Box, Paper } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import ChatInterface from '../components/chat/ChatInterface';
import TaskList from '../components/TaskList';

const DashboardPage: React.FC = () => {
  const { currentUser } = useAuth();

  return (
    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2 }}>
      {/* Aufgabenbereich */}
      <Paper sx={{ flex: 1, p: 2, overflowY: 'auto' }}>
        <Typography variant="h5" gutterBottom>
          Aufgaben
        </Typography>
        <TaskList />
      </Paper>

      {/* Chatbereich (nimmt mehr Platz auf größeren Bildschirmen) */}
      <Paper sx={{ flex: { xs: 1, md: 2 }, p: 2, display: 'flex', flexDirection: 'column' }}>
        <Typography variant="h5" gutterBottom>
          Chat mit WILMA
        </Typography>
        <ChatInterface />
      </Paper>
    </Box>
  );
};

export default DashboardPage; 