import React from 'react';
import { Box, Paper } from '@mui/material';
import TaskList from '../components/TaskList';
import PageHeader from '../components/common/PageHeader';

const TasksPage: React.FC = () => {
  return (
    <Box>
      <PageHeader title="Aufgabenverwaltung" />
      
      <Paper sx={{ p: { xs: 2, md: 3 }, mt: 2 }}>
        <TaskList />
      </Paper>
    </Box>
  );
};

export default TasksPage; 