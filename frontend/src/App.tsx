import React from 'react'; // Sicherstellen, dass React importiert ist für React.ReactNode
import { Routes, Route, Link as RouterLink, Navigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Container, CircularProgress, Box } from '@mui/material';
import { signOut } from 'firebase/auth';
import { useAuth } from './contexts/AuthContext'; // useAuth importieren
import { auth } from './firebaseConfig'; // auth importieren für Logout
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import './App.css';

// Hilfskomponente für geschützte Routen
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { currentUser } = useAuth();
  return currentUser ? children : <Navigate to="/login" replace />;
};

// Hilfskomponente für öffentliche Routen (verhindert Zugriff auf Login/Register wenn eingeloggt)
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { currentUser } = useAuth();
  return !currentUser ? children : <Navigate to="/dashboard" replace />;
};

function App() {
  const { currentUser, loading } = useAuth(); // Auth-Status und Ladezustand holen

  const handleLogout = async () => {
    try {
      await signOut(auth);
      // Navigation zur Login-Seite wird durch den AuthStateChange im Context erledigt
    } catch (error) {
      console.error("Fehler beim Logout:", error);
    }
  };

  // Zeigt einen Ladeindikator, während der Auth-Status geprüft wird
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            WILMA
          </Typography>
          {currentUser ? (
            <Button color="inherit" onClick={handleLogout}>Logout</Button> // Logout Button
          ) : (
            <>
              <Button color="inherit" component={RouterLink} to="/login">
                Login
              </Button>
              <Button color="inherit" component={RouterLink} to="/register">
                Registrieren
              </Button>
            </>
          )}
        </Toolbar>
      </AppBar>

      <Container sx={{ mt: 4 }}>
        <Routes>
          {/* Öffentliche Routen (nur zugänglich, wenn nicht eingeloggt) */}
          <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />

          {/* Geschützte Routen (nur zugänglich, wenn eingeloggt) */}
          <Route
            path="/dashboard"
            element={<ProtectedRoute><DashboardPage /></ProtectedRoute>}
          />
          <Route
            path="/"
            element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} // Startseite ist jetzt das Dashboard
          />

          {/* Fallback Route */}
          <Route path="*" element={<Typography>Seite nicht gefunden (404)</Typography>} />
        </Routes>
      </Container>
    </>
  );
}

export default App;
