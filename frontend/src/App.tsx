import React from 'react'; // Sicherstellen, dass React importiert ist für React.ReactNode
import { Routes, Route, Link as RouterLink, Navigate, Outlet } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Container, CircularProgress, Box } from '@mui/material';
import { signOut } from 'firebase/auth';
import { useAuth } from './contexts/AuthContext'; // useAuth importieren
import { auth } from './firebaseConfig'; // auth importieren für Logout
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage'; // Importieren
import GuestPage from './pages/GuestPage'; // GuestPage importieren
import BudgetPage from './pages/BudgetPage'; // BudgetPage importieren
import './App.css';
import { useTheme } from '@mui/material/styles'; // useTheme importieren
// @ts-ignore - Typdefinitionen nicht verfügbar
import CookieConsent from "react-cookie-consent"; // CookieConsent importieren

// Neue Seiten-Imports
import MainLandingPage from './pages/landing/MainLandingPage';
import TrendsOverviewPage from './pages/trends/TrendsOverviewPage';
import TrendCategoryPage from './pages/trends/TrendCategoryPage';
import TrendDetailPage from './pages/trends/TrendDetailPage';
import ResourcesOverviewPage from './pages/landing/ResourcesOverviewPage';
import ThematicLandingPage from './pages/landing/ThematicLandingPage';

// Neu hinzugefügte Seiten importieren
import AboutPage from './pages/AboutPage';
import ImpressumPage from './pages/ImpressumPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import TasksPage from './pages/TasksPage';
import CookiePolicyPage from './pages/CookiePolicyPage'; // CookiePolicyPage importieren

// Layout Import
import PublicLayout from './components/common/PublicLayout';
import AppLayout from './components/common/AppLayout'; // AppLayout importieren
import AuthLayout from './components/common/AuthLayout'; // AuthLayout importieren

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
  const theme = useTheme(); // Theme holen für Zugriff auf custom colors

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
    // Wrapper-Fragment benötigt, da Routes und CookieConsent Geschwister sind
    <>
      <Routes>
        {/* === Öffentliche Routen mit PublicLayout === */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<MainLandingPage />} />
          <Route path="/trends" element={<TrendsOverviewPage />} />
          <Route path="/trends/:category" element={<TrendCategoryPage />} />
          <Route path="/trends/:category/:slug" element={<TrendDetailPage />} />
          <Route path="/ressourcen" element={<ResourcesOverviewPage />} />
          <Route path="/ressourcen/:slug" element={<ThematicLandingPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/impressum" element={<ImpressumPage />} />
          <Route path="/datenschutz" element={<PrivacyPolicyPage />} />
          <Route path="/cookie-richtlinie" element={<CookiePolicyPage />} />
        </Route>

        {/* === Authentifizierungs-Routen (jetzt mit AuthLayout) === */}
        {/* Wenn Nutzer eingeloggt ist -> Redirect, sonst zeige Layout mit Login/Register Seite */}
        <Route 
          element={currentUser ? <Navigate to="/dashboard" replace /> : <AuthLayout />}
        >
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>
        
        {/* === Geschützte App-Routen (mit AppLayout) === */}
        <Route 
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          {/* Kind-Routen, die im <Outlet> von AppLayout gerendert werden */}
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/guests" element={<GuestPage />} />
          <Route path="/tasks" element={<TasksPage />} />
          <Route path="/budget" element={<BudgetPage />} />
          {/* --- Ende geschützte Kind-Routen --- */}
        </Route>

        {/* === Fallback / Not Found === */}
        <Route 
          path="*" 
          element={<Navigate to={currentUser ? "/dashboard" : "/"} replace />} 
        />
      </Routes>
      
      {/* Cookie Consent Banner */}
      <CookieConsent
        location="bottom"
        buttonText="Verstanden"
        cookieName="wilmaCookieConsent"
        style={{ background: "#2B373B" }} // Beispiel-Hintergrund
        buttonStyle={{ color: "#4e503b", fontSize: "13px", background: "#f1f1f1" }}
        expires={150} // Gültigkeit in Tagen
      >
        Diese Website verwendet Cookies, um die Nutzererfahrung zu verbessern. {" "}
        <RouterLink 
          to="/cookie-richtlinie" 
          style={{ color: "#f1f1f1", textDecoration: "underline" }} // Stil für den Link
        >
          Mehr erfahren
        </RouterLink>
      </CookieConsent>
    </>
  );
}

export default App;
