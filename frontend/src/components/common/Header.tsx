import React, { useState, useRef } from 'react';
import {
  AppBar, Toolbar, Typography, Button, Box, Container,
  IconButton, Menu, MenuItem
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebaseConfig';
import logo from '../../assets/logo1.png'; // Pfad zu logo1.png geändert
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'; // Icon for dropdown
// import Logo from './Logo'; // Auskommentiert wegen Fehler

// Struktur für die Navigationslinks - erweitert für Submenüs
interface NavItem {
  name: string;
  path?: string; // Pfad, wenn es ein direkter Link ist
  subItems?: { name: string; path: string }[]; // Unterpunkte für Dropdowns
}

const pages: NavItem[] = [
  { name: 'Trends', path: '/trends' },
  {
    name: 'Ressourcen',
    subItems: [
      { name: 'Hochzeitsplanung Checkliste', path: '/ressourcen/hochzeitsplanung-checkliste' },
      { name: 'Hochzeitsbudget-Rechner', path: '/ressourcen/hochzeitsbudget-rechner' },
      { name: 'Hochzeitslocation-Finder', path: '/ressourcen/hochzeitslocation-finder' },
      // Füge hier weitere Ressourcen hinzu
    ]
  },
  { name: 'Über WILMA', path: '/about' },
];

const Header: React.FC = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  // State für das mobile Menü
  const [anchorElNav, setAnchorElNav] = useState<null | HTMLElement>(null);
  // State für das Ressourcen-Dropdown (Desktop)
  const [anchorElResources, setAnchorElResources] = useState<null | HTMLElement>(null);
  // State für den Hover-Schließ-Timeout
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null); 

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleOpenResourcesMenu = (event: React.MouseEvent<HTMLElement>) => {
    // Vorheriges Schließ-Timeout löschen, falls vorhanden
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setAnchorElResources(event.currentTarget);
  };

  const handleCloseResourcesMenu = () => {
    setAnchorElResources(null);
  };

  // Schließt das Menü mit Verzögerung
  const handleCloseResourcesMenuWithDelay = () => {
    // Bereits laufendes Timeout löschen
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
    }
    // Neues Timeout starten (jetzt 750ms)
    closeTimeoutRef.current = setTimeout(() => {
      handleCloseResourcesMenu();
    }, 750); // Changed delay to 750ms
  };

  // Löscht das Schließ-Timeout (wenn Maus über Menü oder Button)
  const handleClearCloseTimeout = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
  };

  // TODO: Später Auth-Status prüfen, um Login/Signup vs. Dashboard/Logout anzuzeigen
  // const isLoggedIn = false; // Ersetzt durch currentUser

  // Logout-Funktion
  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error("Logout Error:", error);
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
                <MenuItem key={page.name} onClick={handleCloseNavMenu} component={RouterLink} to={page.path!}>
                  <Typography textAlign="center">{page.name}</Typography>
                </MenuItem>
              ))}
              {/* Auth Links im mobilen Menü */}
              {currentUser ? (
                <>
                  <MenuItem onClick={handleCloseNavMenu} component={RouterLink} to="/dashboard" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
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
              page.subItems ? (
                // --- Button für Hover-Dropdown --- 
                <Box key={page.name} 
                  onMouseLeave={handleCloseResourcesMenuWithDelay}
                >
                  <Button
                    aria-owns={Boolean(anchorElResources) ? 'resources-menu' : undefined}
                    aria-haspopup="true"
                    onMouseEnter={handleOpenResourcesMenu}
                    onMouseLeave={handleCloseResourcesMenuWithDelay}
                    onClick={handleOpenResourcesMenu}
                    endIcon={<KeyboardArrowDownIcon />}
                    sx={{ mx: 1, my: 2, color: 'text.primary' }}
                  >
                    {page.name}
                  </Button>
                  <Menu
                    id="resources-menu"
                    anchorEl={anchorElResources}
                    open={Boolean(anchorElResources)}
                    onClose={handleCloseResourcesMenu} 
                    MenuListProps={{ 
                      'aria-labelledby': 'resources-button', 
                      onMouseEnter: handleClearCloseTimeout, 
                      onMouseLeave: handleCloseResourcesMenuWithDelay, 
                    }}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                    transformOrigin={{ vertical: 'top', horizontal: 'center' }}
                    disableScrollLock={true} 
                    PaperProps={{
                       // Style, um sicherzustellen, dass das Menü über anderen Elementen liegt
                       // und um die Ecken abzurunden
                       sx: {
                         pointerEvents: 'auto',
                         borderRadius: '12px' // Add border radius
                       }
                     }}
                  >
                    {page.subItems.map((subItem) => (
                      <MenuItem 
                        key={subItem.name} 
                        onClick={() => { handleCloseResourcesMenu(); }}
                        component={RouterLink} 
                        to={subItem.path}
                      >
                        {subItem.name}
                      </MenuItem>
                    ))}
                  </Menu>
                </Box>
              ) : (
                 // --- Normaler Navigations-Button --- 
                 <Button
                   key={page.name}
                   component={RouterLink}
                   to={page.path!} 
                   onClick={handleCloseNavMenu} 
                   variant="textBubble"
                   sx={{ mx: 1, my: 2, display: 'block' }}
                 >
                   {page.name}
                 </Button>
              )
            ))}
          </Box>

          {/* Desktop Auth Buttons & CTA */}
          <Box sx={{ flexGrow: 0, display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}>
            {currentUser ? (
              <>
                <Button 
                  variant="contained"
                  color="primary"
                  component={RouterLink} 
                  to="/dashboard"
                  sx={{ mr: 2 }}
                >
                  Dashboard
                </Button>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    mr: 2,
                    color: 'text.secondary',
                    display: { xs: 'none', sm: 'inline' }
                  }}
                >
                   Hallo, {currentUser.displayName || currentUser.email}
                </Typography>
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
                  color="secondary"
                  component={RouterLink} 
                  to="/register"
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