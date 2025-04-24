import React, { useState } from 'react';
import { Container, Typography, TextField, Button, Box, Alert } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { useSnackbar } from '../contexts/SnackbarContext'; // Use Snackbar for feedback

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null); // Success message
  const { showSnackbar } = useSnackbar();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);

    try {
      await sendPasswordResetEmail(auth, email);
      setMessage('Eine E-Mail zum Zurücksetzen des Passworts wurde gesendet (falls ein Konto mit dieser Adresse existiert).');
      showSnackbar('E-Mail zum Zurücksetzen gesendet!', 'success');
      setEmail(''); // Clear input after success
    } catch (err: any) {
      console.error("Password reset error:", err);
      // Provide a generic error message for security
      setError("Fehler beim Senden der E-Mail. Bitte versuchen Sie es erneut.");
      showSnackbar("Fehler beim Senden der E-Mail.", 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="xs">
      <Typography variant="h4" component="h1" align="center" gutterBottom>
        Passwort zurücksetzen
      </Typography>
      <Typography variant="body2" align="center" sx={{ mb: 3 }}>
        Geben Sie Ihre E-Mail-Adresse ein. Wir senden Ihnen einen Link, um Ihr Passwort zurückzusetzen.
      </Typography>
      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {message && <Alert severity="success" sx={{ mb: 2 }}>{message}</Alert>}
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
          type="email"
        />
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
          disabled={loading}
        >
          {loading ? 'Senden...' : 'Passwort zurücksetzen Link senden'}
        </Button>
        <Box textAlign="center">
          <Button component={RouterLink} to="/login" variant="text">
            Zurück zum Login
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default ForgotPasswordPage; 