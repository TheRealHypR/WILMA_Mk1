import React from 'react';
import { Box, Typography, Container, Divider, Paper, Link as MuiLink, IconButton } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';

interface FunnelLayoutProps {
  children: React.ReactNode;
  hideLayout?: boolean; // Option, um Header/Footer auszublenden
}

const FunnelLayout: React.FC<FunnelLayoutProps> = ({ children, hideLayout = false }) => {
  if (hideLayout) {
    return <>{children}</>; // Nur den Inhalt rendern, wenn hideLayout true ist
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Header */}
      <Paper 
        component="header" 
        square 
        elevation={1} 
        sx={{ 
          py: 1.5, 
          px: 2, 
          bgcolor: 'background.paper',
          borderBottom: '1px solid',
          borderColor: 'divider' 
        }}
      >
        <Container maxWidth="md"> 
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
             <IconButton component={RouterLink} to="/" size="small" aria-label="Zur Startseite">
                <HomeIcon />
             </IconButton>
            <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
              WILMA
            </Typography>
          </Box>
        </Container>
      </Paper>

      {/* Hauptinhalt */}
      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1, 
          py: 3, // Vertikaler Abstand für den Inhalt
          // Hintergrund evtl. anpassen, wenn gewünscht
          // bgcolor: '#f9f4ef' // Beispiel Hintergrund wie Success Page
        }}
      >
        {/* Hier wird der eigentliche Seiteninhalt (Stepper, Formulare etc.) gerendert */}
        {children}
      </Box>

      {/* Footer */}
      <Box 
        component="footer" 
        sx={{ 
          py: 2, 
          px: 2, 
          mt: 'auto', // Footer nach unten schieben
          bgcolor: 'background.paper',
          borderTop: '1px solid',
          borderColor: 'divider'
        }}
      >
        <Container maxWidth="md">
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap', gap: 1 }}>
            <Typography variant="body2" color="text.secondary" >
              {'© '}
              {new Date().getFullYear()}
              {' WILMA by beautomated.'}
            </Typography>
            {/* Trenner */} 
            <Divider orientation="vertical" flexItem sx={{ mx: 0.5, height: 14, alignSelf: 'center' }} /> 
            {/* Links zu den Legal Pages */} 
            <MuiLink component={RouterLink} to="/impressum" variant="body2" color="text.secondary" sx={{ textDecoration: 'underline' }}>
              Impressum
            </MuiLink>
             <Divider orientation="vertical" flexItem sx={{ mx: 0.5, height: 14, alignSelf: 'center' }} />
            <MuiLink component={RouterLink} to="/privacy-policy" variant="body2" color="text.secondary" sx={{ textDecoration: 'underline' }}>
              Datenschutz
            </MuiLink>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default FunnelLayout; 