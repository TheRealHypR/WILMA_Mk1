import React, { useState } from 'react';
import { Outlet, Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Box, Container, Button, alpha, IconButton, Menu, MenuItem } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebaseConfig';
import logo from '../../assets/logo1.png'; // Pfad zu logo1.png geändert
import HomeIcon from '@mui/icons-material/Home'; // HomeIcon hinzufügen
import MenuIcon from '@mui/icons-material/Menu'; // MenuIcon importieren

// TODO: Navigationslinks und Logout-Button hinzufügen

const AppLayout: React.FC = () => {
  const location = useLocation(); // Get current location
  const theme = useTheme(); // Get the theme object
  const navigate = useNavigate(); // Add navigate hook

  // --- State und Handler für das Burger-Menü --- 
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
  // ---------------------------------------------

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

  // Array für die Menüpunkte definieren
  const menuItems = [
    { name: 'Profil', path: '/profile' },
    { name: 'Gäste', path: '/guests' },
    { name: 'Budget', path: '/budget' },
    { name: 'Aufgaben', path: '/tasks' },
    { name: 'Checkliste', path: '/checklist' },
    { name: 'Meine Checkliste', path: '/user-checklist' },
  ];

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
                mr: 1, // Weniger margin rechts
                display: 'flex', 
                alignItems: 'center', 
                textDecoration: 'none'
              }}
            >
              <img src={logo} alt="WILMA Logo" height="40" /> {/* Logo Bild */} 
            </Box>
            
            {/* Home Button Hinzugefügt */}
            <IconButton component={RouterLink} to="/" aria-label="Zur Startseite" color="inherit" sx={{ mr: 2 }}>
              <HomeIcon />
            </IconButton>

            {/* Platzhalter, damit Nav-Links nach rechts rutschen */}
            <Box sx={{ flexGrow: 1 }} /> 

            {/* Dashboard Button (bleibt sichtbar) */}
            <Button variant="text" sx={getActiveStyle('/dashboard')} color="inherit" component={RouterLink} to="/dashboard">Dashboard</Button>

            {/* Burger-Menü Icon Button (Rechts) */}
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar-user"
              aria-haspopup="true"
              onClick={handleOpenUserMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            
            {/* Burger-Menü Inhalt */}
            <Menu
              sx={{ mt: '45px' }} // Etwas Abstand von der AppBar
              id="menu-appbar-user"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {menuItems.map((item) => (
                <MenuItem 
                  key={item.name} 
                  onClick={handleCloseUserMenu} 
                  component={RouterLink} 
                  to={item.path}
                  // Wende aktiven Stil auch hier an
                  sx={getActiveStyle(item.path)}
                >
                  <Typography textAlign="center">{item.name}</Typography>
                </MenuItem>
              ))}
            </Menu>

            {/* Logout-Button */}
            <Button color="inherit" onClick={handleLogout} sx={{ ml: 1 /* Kleiner Abstand zum Menü */}}> 
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
        <Typography variant="body2" color="text.secondary" sx={{textAlign: "center"}}>
          © {new Date().getFullYear()} WILMA - Dein KI Hochzeitsplaner
        </Typography>
      </Box>
    </Box>
  );
};

export default AppLayout; 