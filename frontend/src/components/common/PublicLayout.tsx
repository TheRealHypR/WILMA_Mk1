import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box, Container } from '@mui/material';
import Header from './Header'; // Annahme: Header ist im selben Ordner oder Pfad anpassen
import Footer from './Footer'; // Annahme: Footer ist im selben Ordner oder Pfad anpassen

const PublicLayout: React.FC = () => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      {/* Wrap Outlet in Container for centering and max-width */}
      <Box component="main" sx={{ flexGrow: 1 }}>
        <Container maxWidth="lg"> {/* Adjust maxWidth as needed (lg, md, xl...) */}
          <Outlet /> 
        </Container>
      </Box>
      <Footer />
    </Box>
  );
};

export default PublicLayout; 