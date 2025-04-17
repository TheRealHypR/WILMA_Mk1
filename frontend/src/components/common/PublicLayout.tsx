import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import Header from './Header'; // Annahme: Header ist im selben Ordner oder Pfad anpassen
import Footer from './Footer'; // Annahme: Footer ist im selben Ordner oder Pfad anpassen

const PublicLayout: React.FC = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      {/* Der Hauptinhalt der Seite wird hier durch Outlet gerendert */}
      {/* Kein Container hier, damit Seiten Full-Width sein können */}
      <Box component="main" sx={{ flexGrow: 1 }}>
        <Outlet /> 
      </Box>
      <Footer />
    </Box>
  );
};

export default PublicLayout; 