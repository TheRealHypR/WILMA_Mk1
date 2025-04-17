import React from 'react';
import { Box, Container, Typography, Link, TextField, Button } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <Box 
      component="footer" 
      sx={{ 
        bgcolor: 'grey.200', // Beispiel-Hintergrundfarbe
        py: 6, // Padding oben/unten
        mt: 'auto' // Schiebt den Footer nach unten, wenn der Seiteninhalt kurz ist
      }}
    >
      <Container maxWidth="lg">
        {/* Flexbox Container für die Spalten */}
        <Box 
          sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', sm: 'row' }, // Spalten auf kleinen Screens, Zeile auf größeren
            justifyContent: 'space-between', // Verteilt den Platz zwischen den Spalten
            gap: 4 // Abstand zwischen den Spalten
          }}
        >
          {/* Spalte 1: Ressourcen */}
          <Box sx={{ flex: 1 }}> {/* Nimmt verfügbaren Platz ein */}
            <Typography variant="h6" gutterBottom>Ressourcen</Typography>
            <Link component={RouterLink} to="/ressourcen/hochzeitsplanung-checkliste" display="block" variant="body2" color="text.secondary" sx={{ mb: 1 }}>Hochzeitsplanung Checkliste</Link>
            <Link component={RouterLink} to="/ressourcen/hochzeitsbudget-rechner" display="block" variant="body2" color="text.secondary" sx={{ mb: 1 }}>Hochzeitsbudget-Rechner</Link>
            <Link component={RouterLink} to="/ressourcen/hochzeitslocation-finder" display="block" variant="body2" color="text.secondary" sx={{ mb: 1 }}>Hochzeitslocation-Finder</Link>
            {/* Weitere Links hier... */}
          </Box>

          {/* Spalte 2: Rechtliches & Über uns */}
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" gutterBottom>WILMA</Typography>
            <Link component={RouterLink} to="/about" display="block" variant="body2" color="text.secondary" sx={{ mb: 1 }}>Über WILMA</Link> {/* TODO: /about Route */}
            <Link component={RouterLink} to="/impressum" display="block" variant="body2" color="text.secondary" sx={{ mb: 1 }}>Impressum</Link> {/* TODO: /impressum Route */}
            <Link component={RouterLink} to="/datenschutz" display="block" variant="body2" color="text.secondary" sx={{ mb: 1 }}>Datenschutz</Link> {/* TODO: /datenschutz Route */}
            <Link component={RouterLink} to="/cookie-richtlinie" display="block" variant="body2" color="text.secondary" sx={{ mb: 1 }}>Cookie-Richtlinie</Link> {/* Neuer Link */}
          </Box>

          {/* Spalte 3: Newsletter */}
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" gutterBottom>Newsletter</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Bleib auf dem Laufenden mit den neuesten Hochzeitstrends!
            </Typography>
            {/* TODO: Newsletter Formular Logik implementieren */}
            <TextField 
              label="E-Mail Adresse" 
              variant="outlined" 
              size="small" 
              fullWidth 
              sx={{ mb: 1 }} 
            />
            <Button variant="contained" color="primary" fullWidth>
              Anmelden
            </Button>
          </Box>
        </Box>

        {/* Copyright & Social Media */}
        <Box sx={{ mt: 4, pt: 2, borderTop: 1, borderColor: 'divider', textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            © {new Date().getFullYear()} WILMA - Dein KI Hochzeitsplaner
          </Typography>
          {/* TODO: Social Media Icons/Links hinzufügen */}
        </Box>
      </Container>
    </Box>
  );
};

export default Footer; 