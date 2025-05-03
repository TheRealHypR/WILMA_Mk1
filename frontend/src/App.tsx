import React, { useState } from 'react';
import { Routes, Route, Link as RouterLink, Navigate, Outlet } from 'react-router-dom';
import { CircularProgress, Box, Typography, Button, Alert, Container } from '@mui/material';
import { useAuth } from './contexts/AuthContext';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import AppLayout from './components/common/AppLayout';
import PublicLayout from './components/common/PublicLayout';
import ResourcesOverviewPage from './pages/landing/ResourcesOverviewPage';
import ThematicLandingPage from './pages/landing/ThematicLandingPage';
import ImpressumPage from './pages/ImpressumPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import CookiePolicyPage from './pages/CookiePolicyPage';
import LocationRequestPage from './pages/LocationRequestPage';
import TasksPage from './pages/TasksPage';
import GuestPage from './pages/GuestPage';
import BudgetPage from './pages/BudgetPage';
import TrendsOverviewPage from './pages/trends/TrendsOverviewPage';
import CookieConsent from "react-cookie-consent";

// Neue Seiten-Imports
import MainLandingPage from './pages/landing/MainLandingPage';
import TrendCategoryPage from './pages/trends/TrendCategoryPage';
import TrendDetailPage from './pages/trends/TrendDetailPage';
import AboutPage from './pages/AboutPage';

// NEU: Imports für Checklist-Seiten
import ChecklistPage from './pages/ChecklistPage';
import UserChecklistPage from './pages/UserChecklistPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
// import TermsOfServicePage from './pages/TermsOfServicePage'; // Auskommentiert, da anscheinend fehlend

// Import sendEmailVerification, signOut
import { sendEmailVerification, signOut } from 'firebase/auth';
import { auth } from './firebaseConfig'; // Import auth
import { useSnackbar } from './contexts/SnackbarContext'; // Import Snackbar for feedback
import LeadFunnelRoutes from './modules/lead-funnel/routes'; // Import LeadFunnelRoutes

// NEU: Import für Tools-Seite
import ToolsOverviewPage from './pages/ToolsOverviewPage';

// Hilfskomponente für geschützte Routen
// Verwende die einfachere Typisierung direkt in der Signatur
const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { currentUser, loading } = useAuth();
  const [resendLoading, setResendLoading] = useState(false);
  const { showSnackbar } = useSnackbar(); // Use Snackbar

  const handleResendVerificationEmail = async () => {
    if (!currentUser) return;
    setResendLoading(true);
    try {
      await sendEmailVerification(currentUser);
      showSnackbar('Verifizierungs-E-Mail erneut gesendet!', 'success');
    } catch (error) {
      console.error("Error resending verification email:", error);
      showSnackbar('Fehler beim Senden der E-Mail.', 'error');
    } finally {
      setResendLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      // Navigate to login or home might be handled by AuthContext listener
    } catch (error) {
      console.error("Error signing out:", error);
       showSnackbar('Fehler beim Abmelden.', 'error');
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (currentUser) {
    if (currentUser.emailVerified) {
      return <>{children}</>; // User logged in and verified
    } else {
      // User logged in but email not verified
      return (
        <Container maxWidth="sm" sx={{ textAlign: 'center', mt: 8 }}>
          <Alert severity="warning">
            <Typography variant="h5" gutterBottom>
              Bitte bestätigen Sie Ihre E-Mail-Adresse
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              Wir haben Ihnen eine E-Mail an <strong>{currentUser.email}</strong> gesendet. Bitte klicken Sie auf den Link in der E-Mail, um Ihr Konto zu aktivieren.
            </Typography>
            <Typography variant="body2" sx={{ mb: 3 }}>
              Wenn Sie keine E-Mail erhalten haben, überprüfen Sie bitte Ihren Spam-Ordner oder senden Sie die E-Mail erneut.
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
              <Button
                variant="contained"
                onClick={handleResendVerificationEmail}
                disabled={resendLoading}
              >
                {resendLoading ? 'Senden...' : 'E-Mail erneut senden'}
              </Button>
               <Button variant="outlined" onClick={handleLogout}>
                Abmelden
              </Button>
            </Box>
          </Alert>
        </Container>
      );
    }
  } else {
    // User not logged in
    return <Navigate to="/login" replace />;
  }
};

// A wrapper for routes that should redirect if the user is already logged in
// Verwende die einfachere Typisierung direkt in der Signatur
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
    const { currentUser, loading } = useAuth();

    if (loading) {
        return <div>Loading...</div>; // Or some loading indicator
    }

    return !currentUser ? <>{children}</> : <Navigate to="/dashboard" replace />;
};

function App() {
  return (
    <>
      <Routes>
        {/* Diese Routen werden nun durch PublicLayout verwaltet */}
        {/* <Route path="/login" element={<LoginPage />} /> */}
        {/* <Route path="/register" element={<RegisterPage />} /> */}
        {/* <Route path="/forgot-password" element={<ForgotPasswordPage />} /> */}

        <Route path="/impressum" element={<ImpressumPage />} />
        <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
        <Route path="/cookie-policy" element={<CookiePolicyPage />} />
        {/* <Route path="/terms-of-service" element={<TermsOfServicePage />} /> */}

        {/* Lead Funnel Route - Publicly accessible */}
        <Route path="/funnel/*" element={<LeadFunnelRoutes />} />

        <Route element={<PublicLayout />}>
          {/* Bestehende PublicLayout-Routen */}
          <Route path="/" element={<MainLandingPage />} />
          <Route path="/trends" element={<TrendsOverviewPage />} />
          <Route path="/trends/:category" element={<TrendCategoryPage />} />
          <Route path="/trends/:category/:slug" element={<TrendDetailPage />} />
          <Route path="/ressourcen" element={<ResourcesOverviewPage />} />
          <Route path="/ressourcen/:slug" element={<ThematicLandingPage />} />
          <Route path="/location-anfrage" element={<LocationRequestPage />} />
          <Route path="/about" element={<AboutPage />} />

          {/* NEU: Route für die Tools-Übersicht */}
          <Route path="/tools" element={<ToolsOverviewPage />} />

          {/* NEU: Login, Register, Forgot Password unter PublicLayout */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        </Route>

        {/* === TEST: Private Routen temporär deaktivieren === */}
        <Route
          element={
            <PrivateRoute>
              <AppLayout />
            </PrivateRoute>
          }
        >
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="guests" element={<GuestPage />} />
          <Route path="tasks" element={<TasksPage />} />
          <Route path="budget" element={<BudgetPage />} />
          <Route path="checklist" element={<ChecklistPage />} />
          <Route path="user-checklist" element={<UserChecklistPage />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>
        {/* =============================================== */}

        {/* Fallback route for unmatched paths */}
        {/* Da PrivateRoute weg ist, muss die Logik hier angepasst werden */}
        {/* Wir leiten einfach immer zu '/' bei unbekannter Route */}
        <Route
          path="*"
          element={<Navigate to="/" replace />}
          // Optional: Oder eine dedizierte 404-Seite anzeigen
          // element={<NotFoundPage />} 
        />
      </Routes>

      <CookieConsent
        location="bottom"
        buttonText="Verstanden"
        cookieName="wilmaCookieConsent"
        style={{ background: "#2B373B" }}
        buttonStyle={{ color: "#4e503b", fontSize: "13px", background: "#f1f1f1" }}
        expires={150}
      >
        Diese Website verwendet Cookies, um die Nutzererfahrung zu verbessern. {" "}
        <RouterLink
          to="/cookie-richtlinie"
          style={{ color: "#f1f1f1", textDecoration: "underline" }}
        >
          Mehr erfahren
        </RouterLink>
      </CookieConsent>
    </>
  );
}

export default App;
