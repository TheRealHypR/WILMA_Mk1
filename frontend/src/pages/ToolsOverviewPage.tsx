import React from 'react';
import { Box, Typography, Container, Grid, Paper, Card, CardContent, CardActions, Button } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import TimelineIcon from '@mui/icons-material/Timeline'; // Passendes Icon
import ArticleIcon from '@mui/icons-material/Article'; // Icon für andere Ressourcen

const ToolsOverviewPage: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ py: { xs: 4, md: 8 } }}>
      <Typography 
        variant="h3" 
        component="h1" 
        align="center" 
        gutterBottom
        sx={{ fontWeight: 600, mb: 2 }} // Weniger margin bottom für Text
      >
        Planungshilfen & Ressourcen {/* Titel angepasst */}
      </Typography>
      <Typography 
        variant="h6"
        component="p"
        align="center"
        color="text.secondary"
        sx={{ mb: 6 }}
      >
        Nutze unsere interaktiven Tools oder stöbere in Artikeln und Checklisten, um deine Hochzeit perfekt zu planen.
      </Typography>
      
      <Grid container spacing={4} justifyContent="center">
        {/* --- Timeline Generator Card --- */}
        <Grid item xs={12} sm={6} md={4}> 
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flexGrow: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TimelineIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h5" component="div" sx={{ fontWeight: 500 }}>
                  Timeline Generator
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Erstelle in wenigen Schritten deine persönliche Hochzeits-Timeline basierend auf deinem Datum, Stil und der Größe deiner Feier.
              </Typography>
            </CardContent>
            <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
              <Button 
                variant="contained" 
                component={RouterLink} 
                to="/funnel/timeline-generator" 
                endIcon={<ArrowForwardIcon />}
              >
                Timeline starten
              </Button>
            </CardActions>
          </Card>
        </Grid>

         {/* --- Card für andere Ressourcen --- */}
        <Grid item xs={12} sm={6} md={4}> 
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flexGrow: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <ArticleIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h5" component="div" sx={{ fontWeight: 500 }}>
                  Artikel & Checklisten
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Finde hilfreiche Tipps, detaillierte Checklisten und inspirierende Artikel in unserer Ressourcen-Sammlung.
              </Typography>
            </CardContent>
            <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
              <Button 
                variant="outlined" // Anderer Stil zur Unterscheidung
                component={RouterLink} 
                to="/ressourcen" // Link zur Haupt-Ressourcen-Seite
                endIcon={<ArrowForwardIcon />}
              >
                Zu den Ressourcen
              </Button>
            </CardActions>
          </Card>
        </Grid>

        {/* --- Platzhalter für zukünftige Tools --- */}
        {/* 
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', border: '1px dashed grey', p: 2 }}>
            <Typography variant="h6" color="text.secondary">Budget Rechner</Typography>
            <Typography variant="body2" color="text.secondary">(Demnächst verfügbar)</Typography>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', border: '1px dashed grey', p: 2 }}>
             <Typography variant="h6" color="text.secondary">Sitzplan Helfer</Typography>
             <Typography variant="body2" color="text.secondary">(Demnächst verfügbar)</Typography>
          </Card>
        </Grid>
        */}
      </Grid>
    </Container>
  );
};

export default ToolsOverviewPage; 