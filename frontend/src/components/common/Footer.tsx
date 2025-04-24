import React, { useState } from 'react';
import { Box, Container, Typography, Link, TextField, Button, CircularProgress } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useSnackbar } from '../../contexts/SnackbarContext';

const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const { showSnackbar } = useSnackbar();

  const handleNewsletterSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email) {
      showSnackbar('Bitte geben Sie eine E-Mail-Adresse ein.', 'warning');
      return;
    }
    setLoading(true);

    // TODO: Adapt URL if needed for production environment
    const functionUrl = 'http://127.0.0.1:5003/wilma-mk1/us-central1/subscribeToNewsletter';

    try {
      const response = await fetch(functionUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data: { email } }),
      });

      // Check if the response is JSON, otherwise handle plain text
      const contentType = response.headers.get('content-type');
      let responseData;
      if (contentType && contentType.includes('application/json')) {
         responseData = await response.json();
      } else {
         responseData = { message: await response.text() }; // Treat plain text as a message
      }

      if (!response.ok) {
        // Throw error with message from backend if available
        throw new Error(responseData.message || `HTTP error! status: ${response.status}`);
      }

      showSnackbar(responseData.message || 'Erfolgreich zum Newsletter angemeldet!', 'success');
      setEmail(''); // Clear input field on success
    } catch (error) {
      console.error('Fehler bei der Newsletter-Anmeldung:', error);
      showSnackbar(`Fehler: ${error instanceof Error ? error.message : 'Unbekannter Fehler'}`, 'error');
    } finally {
      setLoading(false);
    }
  };

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
            <Link 
              component={RouterLink} 
              to="/ressourcen/hochzeitsplanung-checkliste" 
              display="inline-block"
            >
              Hochzeitsplanung Checkliste
            </Link>
            <Link 
              component={RouterLink} 
              to="/ressourcen/hochzeitsbudget-rechner" 
              display="inline-block" 
            >
              Hochzeitsbudget-Rechner
            </Link>
            <Link 
              component={RouterLink} 
              to="/ressourcen/hochzeitslocation-finder" 
              display="inline-block" 
            >
              Hochzeitslocation-Finder
            </Link>
            {/* Weitere Links hier... */}
          </Box>

          {/* Spalte 2: Rechtliches & Über uns */}
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" gutterBottom>WILMA</Typography>
            <Link 
              component={RouterLink} 
              to="/about" 
              display="inline-block" 
            >
              Über WILMA
            </Link> {/* TODO: /about Route */}
            <Link 
              component={RouterLink} 
              to="/impressum" 
              display="inline-block" 
            >
              Impressum
            </Link> {/* TODO: /impressum Route */}
            <Link 
              component={RouterLink} 
              to="/datenschutz" 
              display="inline-block" 
            >
              Datenschutz
            </Link> {/* TODO: /datenschutz Route */}
            <Link 
              component={RouterLink} 
              to="/cookie-richtlinie" 
              display="inline-block" 
            >
              Cookie-Richtlinie
            </Link> {/* Neuer Link */}
          </Box>

          {/* Spalte 3: Newsletter */}
          <Box sx={{ flex: 1 }}>
            <Typography variant="h6" gutterBottom>Newsletter</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Bleib auf dem Laufenden mit den neuesten Hochzeitstrends!
            </Typography>
            {/* Implementiertes Newsletter Formular */}
            <Box component="form" onSubmit={handleNewsletterSubmit} noValidate>
              <TextField
                label="E-Mail Adresse"
                type="email"
                variant="outlined"
                size="small"
                fullWidth
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                sx={{ mb: 1 }}
              />
              <Button 
                type="submit" 
                variant="contained" 
                color="primary" 
                fullWidth 
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Anmelden'}
              </Button>
            </Box>
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