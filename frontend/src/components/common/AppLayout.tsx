import React from 'react';
import { Outlet, Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Box, Container, Button, alpha } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebaseConfig';
import logo from '../../assets/logo1.png'; // Pfad zu logo1.png geändert

// TODO: Navigationslinks und Logout-Button hinzufügen

const AppLayout: React.FC = () => {
  const location = useLocation(); // Get current location
  const theme = useTheme(); // Get the theme object
  const navigate = useNavigate(); // Add navigate hook

  // Logout-Funktion
  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log("Logout erfolgreich - signOut abgeschlossen.");
      // Explicitly navigate to the main landing page after logout
      // Add a small delay to allow auth state to propagate
      setTimeout(() => {
        console.log("Navigiere jetzt zu / ...");
        navigate('/');
      }, 50); // 50ms delay
    } catch (error) {
      console.error("Fehler beim Logout:", error);
    }
  };

  // Helper function to determine active style
  const getActiveStyle = (path: string) => {
    const isActive = location.pathname === path;
    return {
      fontWeight: isActive ? 'bold' : 'normal',
      backgroundColor: isActive ? alpha(theme.palette.primary.main, 0.15) : 'transparent', // Light primary background for active
      borderRadius: theme.shape.borderRadius * 2, // Rounded corners
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(2),
      marginLeft: theme.spacing(0.5),
      marginRight: theme.spacing(0.5),
      transition: 'background-color 0.3s ease', // Smooth transition
      '&:hover': {
          backgroundColor: isActive ? alpha(theme.palette.primary.main, 0.25) : alpha(theme.palette.common.white, 0.1), // Slightly darker on hover if active
      }
    };
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar 
        position="static" 
        elevation={0} // Remove shadow
        sx={{ borderBottom: '1px solid', borderColor: 'divider' }} // Add bottom border
      >
        {/* Wrap Toolbar in a Container to center it */}
        <Container maxWidth="md">
          <Toolbar disableGutters> {/* disableGutters removes default padding if Container handles it */}
            {/* Logo/Brand (ersetzt durch Bild) */}
            <Box 
              component={RouterLink} 
              to="/dashboard" // oder "/"? Linkziel für App-Logo überlegen
              sx={{ 
                mr: 2, 
                display: 'flex', 
                alignItems: 'center', 
                textDecoration: 'none'
              }}
            >
              <img src={logo} alt="WILMA Logo" height="40" /> {/* Logo Bild */} 
            </Box>
            {/* Platzhalter, damit Nav-Links nach rechts rutschen */}
            <Box sx={{ flexGrow: 1 }} /> 

            {/* Navigationsbuttons with active styling and text variant (removed mx: 1) */}
            <Button variant="text" sx={getActiveStyle('/dashboard')} color="inherit" component={RouterLink} to="/dashboard">Dashboard</Button>
            <Button variant="text" sx={getActiveStyle('/profile')} color="inherit" component={RouterLink} to="/profile">Profil</Button>
            <Button variant="text" sx={getActiveStyle('/guests')} color="inherit" component={RouterLink} to="/guests">Gäste</Button>
            <Button variant="text" sx={getActiveStyle('/budget')} color="inherit" component={RouterLink} to="/budget">Budget</Button>
            <Button variant="text" sx={getActiveStyle('/tasks')} color="inherit" component={RouterLink} to="/tasks">Aufgaben</Button>
            <Button variant="text" sx={getActiveStyle('/checklist')} color="inherit" component={RouterLink} to="/checklist">Checkliste</Button>
            <Button variant="text" sx={getActiveStyle('/user-checklist')} color="inherit" component={RouterLink} to="/user-checklist">Meine Checkliste</Button>

            {/* Logout-Button */}
            <Button color="inherit" onClick={handleLogout}> 
              Logout
            </Button>
          </Toolbar>
        </Container>
      </AppBar>
      {/* Main content Box still grows and is a flex container */}
      <Box component="main" sx={{ flexGrow: 1, p: 3, display: 'flex', flexDirection: 'column', width: '100%' }}> 
          {/* Re-add Container to center content and limit width, keeping flex properties for height */}
          <Container 
            maxWidth="md" 
            sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              flexGrow: 1,
              mx: 'auto'
            }}
          >
            <Outlet />
          </Container> 
      </Box>
      {/* Footer */}
      <Box 
        component="footer" 
        sx={{ 
          py: 2, // Weniger Padding als im Public Footer
          px: 2, 
          mt: 'auto', // Schiebt den Footer nach unten
          bgcolor: 'grey.200', // Gleiche Farbe wie Public Footer für Konsistenz
          textAlign: 'center'
        }}
      >
        <Typography variant="body2" color="text.secondary">
          © {new Date().getFullYear()} WILMA - Dein KI Hochzeitsplaner
        </Typography>
      </Box>
    </Box>
  );
};

export default AppLayout; 