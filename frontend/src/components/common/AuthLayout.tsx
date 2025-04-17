import React from 'react';
import { Outlet, Link as RouterLink } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Box, Container } from '@mui/material';
import logo from '../../assets/logo1.png'; // Pfad zu logo1.png geändert

const AuthLayout: React.FC = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static" color="default" elevation={0} sx={{ bgcolor: 'background.paper' }}>
        <Container maxWidth="lg">
          <Toolbar disableGutters>
            {/* Logo/Brand (ersetzt durch Bild) */}
            <Box 
              component={RouterLink} 
              to="/" // Link zur Hauptseite
              sx={{ 
                mr: 2, 
                display: 'flex', 
                alignItems: 'center', 
                textDecoration: 'none',
                flexGrow: 1, // Nimmt Platz ein
              }}
            >
              <img src={logo} alt="WILMA Logo" height="40" /> {/* Logo Bild */} 
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
      {/* Hauptinhalt (Login/Register Formular) */}
      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1, 
          display: 'flex', 
          alignItems: 'center', // Vertikal zentrieren
          justifyContent: 'center', // Horizontal zentrieren
          p: 3 
        }}
      >
        <Outlet /> {/* Hier wird LoginPage oder RegisterPage gerendert */}
      </Box>
    </Box>
  );
};

export default AuthLayout; 