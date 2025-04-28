import React from 'react';
import { Typography, Paper } from '@mui/material';
import TaskList from '../components/TaskList';

const TasksPage: React.FC = () => {
  return (
    <Paper sx={{ p: { xs: 2, md: 3 }, mt: 2 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Aufgabenverwaltung
      </Typography>
      <TaskList />
    </Paper>
  );
};

export default TasksPage; 