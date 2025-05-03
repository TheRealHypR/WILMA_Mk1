import React from 'react';
import {
  Box, Typography, Container, Grid, Card, CardContent, CardActions, Button
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
// Icons (Beispiele, können angepasst werden)
import ChecklistIcon from '@mui/icons-material/Checklist';
import CalculateIcon from '@mui/icons-material/Calculate';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import BuildIcon from '@mui/icons-material/Build'; // Icon für Tools
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'; // Icon für Button

// Beispiel-Datenstruktur für die Ressourcen
const resources = [
  {
    title: "Hochzeitsplanung Checkliste",
    description: "Behalte den Überblick über alle Aufgaben und Termine mit unserer umfassenden Checkliste.",
    icon: <ChecklistIcon fontSize="large" color="secondary" />,
    link: "/ressourcen/hochzeitsplanung-checkliste"
  },
  {
    title: "Hochzeitsbudget-Rechner",
    description: "Plane dein Budget detailliert und behalte alle Kosten im Blick.",
    icon: <CalculateIcon fontSize="large" color="secondary" />,
    link: "/ressourcen/hochzeitsbudget-rechner"
  },
  {
    title: "Hochzeitslocation-Finder",
    description: "Tipps und Kriterien, um die perfekte Location für deinen großen Tag zu finden.",
    icon: <LocationOnIcon fontSize="large" color="secondary" />,
    link: "/ressourcen/hochzeitslocation-finder"
  },
  // Hier könnten weitere Ressourcen hinzugefügt werden
];

const ResourcesOverviewPage: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" align="center" gutterBottom sx={{ mb: 2 }}>
        Unsere Ressourcen für deine perfekte Planung
      </Typography>
      <Typography variant="h6" component="p" align="center" color="text.secondary" sx={{ mb: 6 }}>
        Von Checklisten über Budgetplaner bis hin zu Location-Tipps – hier findest du alles, was dir die Hochzeitsplanung erleichtert.
      </Typography>

      <Grid container spacing={4} justifyContent="center">
        {/* NEU: Karte für Interaktive Tools */}
        <Grid item component="div" xs={12} sm={6} md={4}>
            <Card sx={{ 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column',
              borderRadius: '16px',
              backgroundColor: 'secondary.light' // Hervorhebung
            }}>
              <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                <Box sx={{ mb: 2 }}>
                  <BuildIcon fontSize="large" color="primary" /> {/* Tools Icon */}
                </Box>
                <Typography gutterBottom variant="h5" component="h2">
                  Interaktive Tools
                </Typography>
                <Typography color="text.secondary">
                  Nutze unsere Generatoren (Timeline, etc.), um deine Planung noch einfacher zu gestalten.
                </Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
                <Button 
                  size="small" 
                  variant="contained" // Auffälliger Button
                  component={RouterLink} 
                  to="/tools"
                  endIcon={<ArrowForwardIcon />}
                >
                  Tools entdecken
                </Button>
              </CardActions>
            </Card>
          </Grid>

        {resources.map((resource) => (
          // @ts-ignore - Linter erkennt 'item'-Prop hier fälschlicherweise nicht
          <Grid item component="div" key={resource.title} xs={12} sm={6} md={4}>
            <Card sx={{ 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column',
              borderRadius: '16px'
            }}>
              <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                <Box sx={{ mb: 2 }}>
                  {resource.icon} {/* Icon oben zentriert */}
                </Box>
                <Typography gutterBottom variant="h5" component="h2">
                  {resource.title}
                </Typography>
                <Typography color="text.secondary">
                  {resource.description}
                </Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
                <Button 
                  size="small" 
                  variant="outlined" 
                  component={RouterLink} 
                  to={resource.link}
                >
                  Mehr erfahren
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default ResourcesOverviewPage; 