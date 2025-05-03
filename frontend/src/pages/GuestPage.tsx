import React from 'react';
import { Typography, Container, Paper } from '@mui/material';
import GuestList from '../components/GuestList'; // Importiere die Gästelisten-Komponente
import PageHeader from '../components/common/PageHeader'; // NEU: Import

const GuestPage: React.FC = () => {
  return (
    <Container maxWidth="lg"> {/* Begrenzt die maximale Breite */} 
      <PageHeader title="Gästeliste" />
      
      <Paper sx={{ p: 3, mt: 2 }}> {/* Paper für einen schönen Hintergrund und Padding */} 
        <GuestList /> {/* Rendere die Gästelisten-Komponente */} 
      </Paper>
    </Container>
  );
};

export default GuestPage; 