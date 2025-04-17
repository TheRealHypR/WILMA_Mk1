import React from 'react';
import { Outlet, Link as RouterLink } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Box, Container, Button } from '@mui/material';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebaseConfig';
import logo from '../../assets/logo1.png'; // Pfad zu logo1.png geändert

// TODO: Navigationslinks und Logout-Button hinzufügen

const AppLayout: React.FC = () => {

  // Logout-Funktion
  const handleLogout = async () => {
    try {
      await signOut(auth);
      // Automatische Weiterleitung zur Login-Seite sollte durch den AuthContext erfolgen
      console.log("Logout erfolgreich");
    } catch (error) {
      console.error("Fehler beim Logout:", error);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static">
        <Toolbar>
          {/* Logo/Brand (ersetzt durch Bild) */}
          <Box 
            component={RouterLink} 
            to="/dashboard" // oder "/"? Linkziel für App-Logo überlegen
            sx={{ 
              mr: 2, 
              display: 'flex', 
              alignItems: 'center', 
              textDecoration: 'none'
            }}
          >
            <img src={logo} alt="WILMA Logo" height="40" /> {/* Logo Bild */} 
          </Box>
          {/* Platzhalter, damit Nav-Links nach rechts rutschen */}
          <Box sx={{ flexGrow: 1 }} /> 

          {/* Navigationsbuttons */}
          <Button color="inherit" component={RouterLink} to="/dashboard">Dashboard</Button>
          <Button color="inherit" component={RouterLink} to="/profile">Profil</Button>
          <Button color="inherit" component={RouterLink} to="/guests">Gäste</Button>
          <Button color="inherit" component={RouterLink} to="/budget">Budget</Button>
          <Button color="inherit" component={RouterLink} to="/tasks">Aufgaben</Button>

          {/* Logout-Button */}
          <Button color="inherit" onClick={handleLogout}> 
            Logout
          </Button>
        </Toolbar>
      </AppBar>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}> {/* Padding für den Hauptinhalt */}
        {/* Container optional, je nachdem ob der Inhalt zentriert sein soll */}
        <Container maxWidth="lg">
          <Outlet /> {/* Hier wird die aktuelle Seite (Dashboard, Profile etc.) gerendert */}
        </Container>
      </Box>
      {/* Einfacher Footer für den App-Bereich */}
      <Box 
        component="footer" 
        sx={{ 
          py: 2, // Weniger Padding als im Public Footer
          px: 2, 
          mt: 'auto', // Schiebt den Footer nach unten
          bgcolor: 'grey.200', // Gleiche Farbe wie Public Footer für Konsistenz
          textAlign: 'center'
        }}
      >
        <Typography variant="body2" color="text.secondary">
          © {new Date().getFullYear()} WILMA - Dein KI Hochzeitsplaner
        </Typography>
      </Box>
    </Box>
  );
};

export default AppLayout; 