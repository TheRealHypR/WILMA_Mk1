import React, { useState } from 'react';
import { Container, Typography, TextField, Button, Box, Alert, Link as MuiLink, Divider, CircularProgress } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../firebaseConfig'; // Importiere auth Instanz
import GoogleIcon from '@mui/icons-material/Google'; // Google Icon importieren

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false); // Loading-Status für Google Login
  const navigate = useNavigate();

  const handleEmailPasswordSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Nach erfolgreichem Login zur Hauptseite weiterleiten
      navigate('/');
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

  // Handler für Google Login (später implementieren)
  const handleGoogleLogin = async () => {
    setError(null);
    setGoogleLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      // Nach erfolgreichem Login zur Hauptseite weiterleiten
      navigate('/');
    } catch (err: any) {
      console.error("Google login error:", err);
       // Benutzerfreundlichere Fehlermeldungen
      if (err.code === 'auth/popup-closed-by-user') {
        setError("Google Login abgebrochen.");
      } else if (err.code === 'auth/account-exists-with-different-credential') {
         setError("Ein Konto existiert bereits mit dieser E-Mail-Adresse unter einer anderen Anmeldemethode.");
      } else {
         setError("Google Login fehlgeschlagen.");
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <Container maxWidth="xs" sx={{ mt: 4, mb: 4 }}> {/* Mehr Platz oben/unten */}
      {/* Optional: WILMA Logo */}
      {/* <Box display="flex" justifyContent="center" mb={2}> */}
      {/*  <img src={logo} alt="WILMA Logo" height="50" /> */}
      {/* </Box> */}
      
      <Typography variant="h4" component="h1" align="center" gutterBottom>
        Willkommen zurück!
      </Typography>
      <Typography variant="body1" align="center" color="text.secondary" sx={{ mb: 3 }}> {/* Slogan/Begrüßung */} 
        Melde dich an, um deine Hochzeitsplanung fortzusetzen.
      </Typography>
      <Box component="form" onSubmit={handleEmailPasswordSubmit} noValidate sx={{ mt: 1 }}>
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
          disabled={loading || googleLoading} // Deaktivieren bei beiden Ladevorgängen
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
          disabled={loading || googleLoading} // Deaktivieren bei beiden Ladevorgängen
        />
        <MuiLink component={RouterLink} to="/forgot-password" variant="body2" sx={{ display: 'block', textAlign: 'right', mt: 1 }}>
          Passwort vergessen?
        </MuiLink>
        <Button
          type="submit"
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
          disabled={loading || googleLoading} // Deaktivieren bei beiden Ladevorgängen
        >
          {loading ? <CircularProgress size={24} /> : 'Anmelden'}
        </Button>
        <Box textAlign="center" sx={{ mb: 2 }}> {/* Mehr Abstand nach unten */} 
          <MuiLink component={RouterLink} to="/register" variant="body2">
            Noch kein Konto? Registrieren
          </MuiLink>
        </Box>
      </Box>

      {/* Divider für Social Logins */}
      <Divider sx={{ my: 2 }}>ODER</Divider>

      {/* Social Login Buttons */}
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
         <Button
           variant="outlined"
           fullWidth
           startIcon={<GoogleIcon />}
           onClick={handleGoogleLogin} // Hier den Handler einfügen
           disabled={loading || googleLoading} // Deaktivieren bei beiden Ladevorgängen
           sx={{ justifyContent: 'center' }} // Sicherstellen, dass Inhalt zentriert ist
         >
           {googleLoading ? <CircularProgress size={24} /> : 'Mit Google anmelden'}
         </Button>
        {/* Hier könnten weitere Social Login Buttons hin (Facebook, Apple etc.) */}
        {/* <Button variant="outlined" fullWidth startIcon={<FacebookIcon />} disabled={loading || googleLoading}>Mit Facebook anmelden</Button> */}
      </Box>
    </Container>
  );
};

export default LoginPage; 