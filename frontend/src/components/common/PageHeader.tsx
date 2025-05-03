import React from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

interface PageHeaderProps {
  title: string;
  // Optional: Prop, um den Button auf bestimmten Seiten auszublenden (falls nötig)
  // showBackButton?: boolean; 
}

const PageHeader: React.FC<PageHeaderProps> = ({ title /*, showBackButton = true */ }) => {
  return (
    <Box 
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between', // Space between title and potential future actions
        mb: 4, // Margin bottom for spacing
        borderBottom: '1px solid', // Optional: Add a divider
        borderColor: 'divider',
        pb: 1 // Padding below the divider
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        {/* {showBackButton && ( // Conditionally render based on prop */}
          <IconButton component={RouterLink} to="/dashboard" aria-label="Zurück zum Dashboard" sx={{ mr: 1.5 }}>
            <ArrowBackIcon />
          </IconButton>
        {/* )} */}
        <Typography variant="h4" component="h1">
          {title}
        </Typography>
      </Box>
      {/* Optional: Platz für weitere Aktionen rechts (z.B. "Neuen Gast hinzufügen" Button) */}
      {/* <Box>...</Box> */}
    </Box>
  );
};

export default PageHeader; 