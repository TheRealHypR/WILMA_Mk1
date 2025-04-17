import React from 'react';
import { Box, Typography } from '@mui/material';
import { useParams } from 'react-router-dom';

const TrendDetailPage: React.FC = () => {
  const { category, slug } = useParams<{ category: string; slug: string }>();

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Trend Detail: {slug} (Kategorie: {category}) (Platzhalter)
      </Typography>
      <Typography>
        Hier wird der detaillierte Inhalt für den Trend '{slug}' aus der Kategorie '{category}' angezeigt.
      </Typography>
    </Box>
  );
};

export default TrendDetailPage; 