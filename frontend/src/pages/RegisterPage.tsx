import React, { useState } from 'react';
import { Container, Typography, TextField, Button, Box, Alert, Link as MuiLink } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { auth, db } from '../firebaseConfig'; // Korrigierter Importpfad
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'; // Firestore Funktionen importieren

const RegisterPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false); // State for success message
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setRegistrationSuccess(false); // Reset success state on new submission

    if (password !== confirmPassword) {
      setError("Passwörter stimmen nicht überein.");
      return;
    }

    setLoading(true);
    try {
      // 1. Benutzer erstellen
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      if (user) {
        // 2. Firestore-Dokument erstellen
        const userDocRef = doc(db, "users", user.uid);
        await setDoc(userDocRef, {
          email: user.email,
          // user.displayName und user.photoURL sind bei E-Mail-Registrierung meist null
          displayName: user.displayName || null,
          photoURL: user.photoURL || null,
          createdAt: serverTimestamp(), // Server-Zeitstempel verwenden
          emailVerified: user.emailVerified, // Store initial verification status
          // Initialisiere leeres weddingProfile, falls gewünscht
          // weddingProfile: { date: '', style: '', guestEstimate: '' }
        });
        console.log("Firestore user document created for UID:", user.uid);

        // 3. Verifizierungs-E-Mail senden
        await sendEmailVerification(user);
        console.log("Verification email sent to:", user.email);

        // Set success state instead of navigating
        setRegistrationSuccess(true);
        navigate('/');
      } else {
        // Should not happen if createUserWithEmailAndPassword succeeds, but handle defensively
        throw new Error("User creation succeeded but user object is null.");
      }

    } catch (err: any) {
      // Firebase Fehlercodes menschenlesbar machen (optional)
      console.error("Firebase registration error:", err);
      if (err.code === 'auth/email-already-in-use') {
        setError("Diese E-Mail-Adresse wird bereits verwendet.");
      } else if (err.code === 'auth/weak-password') {
        setError("Das Passwort ist zu schwach (mindestens 6 Zeichen benötigt).");
      } else {
        setError("Registrierung fehlgeschlagen. Bitte versuchen Sie es erneut.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="xs">
      <Typography variant="h4" component="h1" align="center" gutterBottom>
        Registrierung
      </Typography>

      {/* Show form or success message */}
      {!registrationSuccess ? (
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
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="confirmPassword"
            label="Passwort bestätigen"
            type="password"
            id="confirmPassword"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            error={password !== confirmPassword && confirmPassword !== ''} // Fehler anzeigen, wenn nicht übereinstimmend und nicht leer
            helperText={password !== confirmPassword && confirmPassword !== '' ? "Passwörter stimmen nicht überein" : ""}
            disabled={loading}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
          >
            {loading ? 'Registriere...' : 'Registrieren'}
          </Button>
          <Box textAlign="center">
            <MuiLink component={RouterLink} to="/login" variant="body2">
              Bereits ein Konto? Login
            </MuiLink>
          </Box>
        </Box>
      ) : (
        <Alert severity="success" sx={{ mt: 3 }}>
          Registrierung erfolgreich! Bitte überprüfen Sie Ihr E-Mail-Postfach ({email}) und klicken Sie auf den Bestätigungslink, um Ihr Konto zu aktivieren. Danach können Sie sich einloggen.
          <Box textAlign="center" sx={{ mt: 2 }}>
            <Button component={RouterLink} to="/login" variant="outlined">
              Zum Login
            </Button>
          </Box>
        </Alert>
      )}
    </Container>
  );
};

export default RegisterPage; 