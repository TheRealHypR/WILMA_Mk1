import React from 'react';
import { Typography, Box, Container, Paper } from '@mui/material';
import GuestList from '../components/GuestList'; // Importiere die Gästelisten-Komponente

const GuestPage: React.FC = () => {
  return (
    <Container maxWidth="lg"> {/* Begrenzt die maximale Breite */} 
      <Paper sx={{ p: 3, mt: 2 }}> {/* Paper für einen schönen Hintergrund und Padding */} 
        <Typography variant="h4" component="h1" gutterBottom>
          Gästeliste verwalten
        </Typography>
        <GuestList /> {/* Rendere die Gästelisten-Komponente */} 
      </Paper>
    </Container>
  );
};

export default GuestPage; 