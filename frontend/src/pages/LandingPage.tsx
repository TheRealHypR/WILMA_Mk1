import React from 'react';
import { Box, Paper, Typography, Button, Avatar, useTheme } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

// Platzhalter für die importierten Grafiken
// import wilmaAvatar from '../assets/wilma-avatar.svg';
// import floralPattern from '../assets/floral-pattern.svg'; // Ggf. separate Grafiken

const LandingPage: React.FC = () => {
  const theme = useTheme();

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: 'calc(100vh - 64px)', // Höhe unter AppBar
        bgcolor: theme.palette.background.default, // Haupt-Hintergrund
        p: 2 // Padding um die Karte
      }}
    >
      <Paper 
        elevation={3} 
        sx={{
          maxWidth: 380, // Breite der Karte anpassen
          borderRadius: '24px', // Stärkere Rundung
          overflow: 'hidden', // Wichtig für geschwungene Form
          position: 'relative', // Für absolute Positionierung der Grafiken
          bgcolor: theme.palette.background.default // Innerer Hintergrund
        }}
      >
        {/* Geschwungener oberer Hintergrund (vereinfacht) */}
        <Box 
          sx={{
            height: 180, // Höhe des oberen Bereichs
            bgcolor: '#D3E4CD', // Heller Grünton aus Mockup (ungefähr)
            borderBottomLeftRadius: '50% 40px', // Geschwungene Form (CSS-Trick)
            borderBottomRightRadius: '50% 40px', // Kann angepasst werden
            position: 'relative', // Für Avatar-Positionierung
            mb: -8 // Negativer Margin, um Avatar überlappen zu lassen
          }}
        />
        
        {/* Avatar */}
        <Avatar 
          // src={wilmaAvatar} // Später ersetzen
          alt="WILMA Avatar"
          sx={{
            width: 80,
            height: 80,
            bgcolor: theme.palette.primary.light, // Avatar-Hintergrund
            position: 'relative', // Oder absolute, je nach Layout
            mx: 'auto', // Zentrieren
            mb: 2, // Abstand nach unten
            border: `4px solid ${theme.palette.background.default}` // Rand wie im Mockup
          }}
        >
           {/* Fallback-Icon */}
           W
        </Avatar>
        
        {/* Inhalt */}
        <Box sx={{ p: 3, textAlign: 'center' }}>
          <Typography 
            variant="h2" 
            component="h1" 
            sx={{ 
              fontFamily: 'serif', // Explizit Serif
              color: theme.palette.primary.main, // Haupt-Grün
              fontWeight: 'bold'
            }}
          >
            WILMA
          </Typography>
          <Typography 
            variant="h6" 
            component="p" 
            sx={{ 
              color: '#E07A5F', // Rosé/Lachs-Ton (ungefähr)
              mb: 4 
            }}
          >
            Deine persönliche Hochzeitsplanerin
          </Typography>

          {/* Platzhalter für florale Muster (später per img/CSS positionieren) */}
          {/* <img src={floralPattern} alt="" style={{ position: 'absolute', bottom: 0, left: 0, width: '100%' }} /> */}

          <Button 
            variant="contained"
            color="secondary" // Verwendet die goldgelbe Farbe
            component={RouterLink}
            to="/register" // Oder /login ?
            sx={{
              borderRadius: '20px',
              px: 5, // Mehr Padding
              py: 1,
              fontWeight: 'bold',
              color: theme.palette.secondary.contrastText // Textfarbe aus Theme
            }}
          >
            Starten
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default LandingPage; 