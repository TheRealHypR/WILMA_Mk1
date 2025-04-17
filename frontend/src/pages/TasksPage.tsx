import React from 'react';
import { Typography, Container } from '@mui/material';

const TasksPage: React.FC = () => {
  return (
    // Kein Container hier, da das AppLayout bereits einen Container hat
    <>
      <Typography variant="h4" component="h1" gutterBottom>
        Aufgaben
      </Typography>
      <Typography variant="body1">
        Inhalt folgt...
      </Typography>
      {/* Hier kommt die Aufgabenverwaltung hin */}
    </>
  );
};

export default TasksPage; 