import React from 'react';
import { Card, CardActionArea, CardMedia, CardContent, Typography, Box, Link } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

// Interface für die Trend-Daten (später auslagern)
interface Trend {
  id: string;
  title: string;
  slug: string; // Für die URL
  category: string; // Für die URL
  imageUrl: string;
  source: string;
  sourceUrl: string;
  shortDescription: string;
}

interface TrendCardProps {
  trend: Trend;
}

const TrendCard: React.FC<TrendCardProps> = ({ trend }) => {
  const trendUrl = `/trends/${trend.category}/${trend.slug}`;

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardActionArea component={RouterLink} to={trendUrl} sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <CardMedia
          component="img"
          // Höhe oder Aspect Ratio für Konsistenz
          sx={{ height: 180 }} 
          image={trend.imageUrl || 'https://via.placeholder.com/300x180.png?text=Trendbild'} // Placeholder bei fehlendem Bild
          alt={trend.title}
        />
        <CardContent sx={{ flexGrow: 1 }}> {/* Nimmt verfügbaren Platz im flex container ein */}
          <Typography gutterBottom variant="h6" component="h3" sx={{ fontWeight: 500 }}>
            {trend.title}
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            {trend.shortDescription}
          </Typography>
        </CardContent>
      </CardActionArea>
       {/* Quelle separat anzeigen, nicht Teil des Links zur Detailseite */}
       <Box sx={{ p: 2, pt: 0 }}>
            <Typography variant="caption" color="text.secondary">
              Quelle: {' '}
              <Link href={trend.sourceUrl} target="_blank" rel="noopener noreferrer">
                {trend.source}
              </Link>
            </Typography>
        </Box>
    </Card>
  );
};

export default TrendCard; 