import React from 'react';
import { Container, Typography } from '@mui/material';
import ChatInterface from '../components/chat/ChatInterface';

const DashboardPage: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ height: 'calc(100vh - 64px)',
                                 display: 'flex', 
                                 flexDirection: 'column',
                                 p: 0 }}
    >
      {/* Optional: Titel oder andere Dashboard-Elemente könnten hier sein */}
      {/* <Typography variant="h4" component="h1" gutterBottom>
        Dashboard
      </Typography> */}

      {/* Chat Interface nimmt den verfügbaren Platz ein */}
      <ChatInterface />
    </Container>
  );
};

export default DashboardPage; 