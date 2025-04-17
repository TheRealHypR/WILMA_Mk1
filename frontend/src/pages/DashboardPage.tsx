import React from 'react';
// Grid wird nur noch für die Übersichten benötigt
import { Box, Paper, Typography, Link as MuiLink, Button, Grid } from '@mui/material'; 
import { Link as RouterLink } from 'react-router-dom';
import ChatLayout from '../components/chat/ChatLayout';

// TODO: Später Platzhalter durch echte Übersichtskomponenten ersetzen
const PlaceholderOverview: React.FC<{ title: string, linkTo: string }> = ({ title, linkTo }) => (
  <Paper sx={{ p: 2 }}> {/* Weniger margin bottom, da Grid spacing übernimmt */}
    <Typography variant="h6" gutterBottom>{title}</Typography>
    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
      Übersichtsdaten kommen hierher...
    </Typography>
    <Button component={RouterLink} to={linkTo} size="small">Details anzeigen</Button>
  </Paper>
);

const DashboardPage: React.FC = () => {
  return (
    // Hauptcontainer mit Flexbox für vertikale Anordnung
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      // Höhe anpassen, um den verfügbaren Platz unter der AppBar zu füllen
      // Die genaue Berechnung (minus AppBar-Höhe und Container-Padding) kann angepasst werden
      height: 'calc(100vh - 64px - 32px * 2)', // Annahme: 64px AppBar, 32px Padding oben/unten vom Container in App.tsx
    }}> 
      {/* Chat-Bereich (wächst, um Platz zu füllen) */}
      <Paper sx={{ 
        flexGrow: 1, // Nimmt verfügbaren vertikalen Platz ein
        display: 'flex', 
        flexDirection: 'column', 
        mb: 2, // Abstand nach unten zu den Übersichten
        overflow: 'hidden' // Verhindert Überlauf der Paper, ChatLayout scrollt intern
      }}> 
        <ChatLayout />
      </Paper>

      {/* Übersichts-Bereich (unten) */}
      <Box>
        <Typography variant="h6" gutterBottom>Übersichten</Typography>
        {/* Grid für horizontale Anordnung der Übersichten */}
        <Grid container spacing={2}> 
          <Grid item xs={12} sm={4}> 
            <PlaceholderOverview title="Aufgaben" linkTo="/tasks" />
          </Grid>
          <Grid item xs={12} sm={4}> 
            <PlaceholderOverview title="Gäste" linkTo="/guests" />
          </Grid>
          <Grid item xs={12} sm={4}> 
            <PlaceholderOverview title="Budget" linkTo="/budget" />
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default DashboardPage; 