import React, { useState } from 'react';
import { Container, Typography, TextField, Button, Box, Alert, Link as MuiLink } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseConfig'; // Importiere auth Instanz

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Nach erfolgreichem Login zum Dashboard weiterleiten
      navigate('/dashboard');
    } catch (err: any) {
      // Firebase Fehlercodes menschenlesbar machen (optional)
      console.error("Firebase login error:", err);
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setError("Ungültige E-Mail-Adresse oder falsches Passwort.");
      } else {
        setError("Login fehlgeschlagen. Bitte versuchen Sie es erneut.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="xs">
      <Typography variant="h4" component="h1" align="center" gutterBottom>
        Login
      </Typography>
      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <TextField
          margin="normal"
          required
          fullWidth
          id="email"
          label="E-Mail-Adresse"
          name="email"
          autoComplete="email"
          autoFocus
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          name="password"
          label="Passwort"
          type="password"
          id="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
        />
        {/* Passwort vergessen Link */}
        <MuiLink component={RouterLink} to="/forgot-password" variant="body2" sx={{ display: 'block', textAlign: 'right', mt: 1 }}>
          Passwort vergessen?
        </MuiLink>
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
          disabled={loading}
        >
          {loading ? 'Anmelden...' : 'Anmelden'}
        </Button>
        <Box textAlign="center">
          <MuiLink component={RouterLink} to="/register" variant="body2">
            Noch kein Konto? Registrieren
          </MuiLink>
        </Box>
      </Box>
    </Container>
  );
};

export default LoginPage; 