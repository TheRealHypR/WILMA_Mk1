import React, { useState } from 'react';
import {
  AppBar, Toolbar, Typography, Button, Box, Container,
  IconButton, Menu, MenuItem
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Link as RouterLink } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import { useAuth } from '../../contexts/AuthContext';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebaseConfig';
import logo from '../../assets/logo1.png'; // Pfad zu logo1.png geändert

// Struktur für die Navigationslinks
const pages = [
  { name: 'Trends', path: '/trends' },
  { name: 'Ressourcen', path: '/ressourcen' },
  { name: 'Über WILMA', path: '/about' },
];

const Header: React.FC = () => {
  const theme = useTheme();
  const { currentUser } = useAuth();

  // State für das mobile Menü
  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  // TODO: Später Auth-Status prüfen, um Login/Signup vs. Dashboard/Logout anzuzeigen
  // const isLoggedIn = false; // Ersetzt durch currentUser

  // Logout-Funktion
  const handleLogout = async () => {
    handleCloseNavMenu(); // Menü schließen nach Klick
    try {
      await signOut(auth);
      // Automatische Weiterleitung zur Login-Seite sollte durch den AuthContext erfolgen
      console.log("Logout erfolgreich");
    } catch (error) {
      console.error("Fehler beim Logout:", error);
    }
  };

  return (
    <AppBar position="static" color="default" elevation={1} sx={{ bgcolor: 'background.paper' }}>
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          {/* Logo/Brand (ersetzt durch Bild) */}
          <Box 
            component={RouterLink} 
            to="/" 
            sx={{ 
              mr: 2, 
              display: 'flex', 
              alignItems: 'center', 
              textDecoration: 'none'
            }}
          >
            <img src={logo} alt="WILMA Logo" height="40" /> {/* Logo Bild */} 
          </Box>

          {/* Mobile Navigation (Hamburger Menu) */}
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{ display: { xs: 'block', md: 'none' } }}
            >
              {pages.map((page) => (
                <MenuItem key={page.name} onClick={handleCloseNavMenu} component={RouterLink} to={page.path}>
                  <Typography textAlign="center">{page.name}</Typography>
                </MenuItem>
              ))}
              {/* Auth Links im mobilen Menü */}
              {currentUser ? (
                <>
                  <MenuItem onClick={handleCloseNavMenu} component={RouterLink} to="/dashboard">
                    <Typography textAlign="center">Dashboard</Typography>
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>
                    <Typography textAlign="center">Logout</Typography>
                  </MenuItem>
                </>
              ) : (
                <>
                  <MenuItem onClick={handleCloseNavMenu} component={RouterLink} to="/login">
                    <Typography textAlign="center">Login</Typography>
                  </MenuItem>
                  <MenuItem onClick={handleCloseNavMenu} component={RouterLink} to="/register">
                    <Typography textAlign="center">Registrieren</Typography>
                  </MenuItem>
                </>
              )}
            </Menu>
          </Box>

          {/* Desktop Hauptnavigation */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, justifyContent: 'center' }}>
            {pages.map((page) => (
              <Button
                key={page.name}
                component={RouterLink}
                to={page.path}
                sx={{ mx: 1, my: 2, color: 'text.primary', display: 'block' }}
              >
                {page.name}
              </Button>
            ))}
          </Box>

          {/* Desktop Auth Buttons & CTA */}
          <Box sx={{ flexGrow: 0, display: { xs: 'none', md: 'flex' } }}> {/* Auf XS ausblenden */}
            {currentUser ? (
              <>
                <Button color="inherit" component={RouterLink} to="/dashboard">
                  Dashboard
                </Button>
                <Button color="inherit" onClick={handleLogout}> 
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button color="inherit" component={RouterLink} to="/login" sx={{ mr: 1 }}>
                  Login
                </Button>
                <Button 
                  variant="contained" 
                  color="primary" 
                  component={RouterLink} 
                  to="/register"
                  sx={{ 
                    bgcolor: theme.palette.secondary.main,
                    '&:hover': {
                      bgcolor: theme.palette.secondary.dark,
                    }
                  }}
                >
                  Hochzeit planen starten
                </Button>
              </>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header; 