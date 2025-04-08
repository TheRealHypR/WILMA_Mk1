import { Routes, Route, Link as RouterLink } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Container } from '@mui/material';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import './App.css';

function App() {
  // Einfache Navigation hinzufügen (wird später durch Auth-Status ersetzt)
  const isLoggedIn = false; // Platzhalter

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            WILMA
          </Typography>
          {isLoggedIn ? (
            <Button color="inherit">Logout</Button> // Platzhalter
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

      <Container sx={{ mt: 4 }}> {/* Margin Top für Inhalt unter AppBar */}
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          {/* Später werden wir hier Protected Routes für eingeloggte User hinzufügen */}
          <Route path="/" element={isLoggedIn ? <DashboardPage /> : <LoginPage />} /> {/* Startseite: Dashboard oder Login */}
          <Route path="/dashboard" element={isLoggedIn ? <DashboardPage /> : <LoginPage />} /> {/* Explizite Dashboard-Route */}

          {/* Fallback Route für unbekannte Pfade */}
          <Route path="*" element={<Typography>Seite nicht gefunden (404)</Typography>} />
        </Routes>
      </Container>
    </>
  );
}

export default App;
