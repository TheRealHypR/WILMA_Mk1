import React from 'react';
import { Box, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';

const TrendCategoryPage: React.FC = () => {
  const { category } = useParams<{ category: string }>();

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Trends für Kategorie: {category} (Platzhalter)
      </Typography>
      <Typography>
        Hier werden die Trends für die spezifische Kategorie '{category}' angezeigt.
      </Typography>
    </Box>
  );
};

export default TrendCategoryPage; 