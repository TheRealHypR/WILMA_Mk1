import React from 'react';
import { Container, Typography } from '@mui/material';

const DashboardPage: React.FC = () => {
  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        Dashboard
      </Typography>
      <Typography>Willkommen! Du bist eingeloggt.</Typography>
      {/* Hauptinhalt der App kommt hier */}
    </Container>
  );
};

export default DashboardPage; 