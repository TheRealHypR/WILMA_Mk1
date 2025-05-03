import React from 'react';
import { Box, Typography, Container, Button } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import ChatIcon from '@mui/icons-material/Chat';
import ChecklistIcon from '@mui/icons-material/Checklist';
import PeopleIcon from '@mui/icons-material/People';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import Paper from '@mui/material/Paper';
import Avatar from '@mui/material/Avatar';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import DownloadIcon from '@mui/icons-material/Download';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

// Importiere das Bild, damit Vite den Pfad korrekt auflöst
import heroImage from '../../assets/hero-background.jpg.jpg'; // Korrigierter Dateiname mit doppelter Endung
import dividerOrnament from '../../assets/divider-ornament.png'; // Import the divider

const MainLandingPage: React.FC = () => {
  const theme = useTheme();

  return (
    <Box>
      {/* === Hero Section === */}
      <Box 
        sx={{ 
          position: 'relative', // Für Overlay Positionierung
          minHeight: 'calc(100vh - 64px)', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          py: 10, 
          // Hintergrundbild setzen
          backgroundImage: `url(${heroImage})`,
          backgroundSize: 'cover', 
          backgroundPosition: 'center',
          // Sicherstellen, dass der Text standardmäßig weiß ist
          color: '#ffffff', 
        }}
      >
        {/* Dunkler Overlay für bessere Textlesbarkeit */}
        <Box 
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)', // Schwarz mit 50% Transparenz
            zIndex: 1, // Unter dem Inhalt
          }}
        />
        {/* Inhalt muss über dem Overlay liegen */}
        <Container maxWidth="md" sx={{ textAlign: 'center', position: 'relative', zIndex: 2 }}>
          <Typography 
            variant="h1"
            component="h1" 
            gutterBottom
            sx={{ fontWeight: 700 }}
          >
            Plane deine Traumhochzeit mit KI
          </Typography>

          <Typography 
            variant="h4"
            component="p" 
            sx={{ 
              mb: 3,
              fontWeight: 400,
              color: 'inherit'
            }}
          >
            WILMA plant. Du liebst.
          </Typography>
          
          <Typography 
            variant="h5" 
            component="p" 
            paragraph 
            sx={{ mb: 4 }}
          >
            WILMA, dein persönlicher Hochzeitsassistent, nimmt dir den Stress ab und hilft dir, jeden Schritt perfekt zu organisieren.
          </Typography>

          <Button 
            variant="contained" 
            size="large"
            color="secondary"
            component={RouterLink}
            to="/register" 
            sx={{
              py: 1.5, 
              px: 4, 
              fontSize: '1.1rem',
            }}
          >
            Jetzt kostenlos starten
          </Button>

          <Button 
            variant="contained" 
            size="large" 
            component={RouterLink} 
            to="/tools"
            endIcon={<ArrowForwardIcon />}
            sx={{ 
              py: 1.5, 
              px: 4, 
              borderRadius: 30,
              fontWeight: 'bold',
              ml: 2
            }}
          >
            Kostenlose Tools entdecken
          </Button>
        </Container>
      </Box>

      {/* === Feature Showcase Section (mit Flexbox) === */}
      <Box sx={{ py: { xs: 6, md: 10 }, bgcolor: 'background.paper' }}> {/* Padding oben/unten, Hintergrundfarbe */} 
        <Container maxWidth="lg">
          <Typography 
            variant="h3" 
            component="h2" 
            align="center" 
            gutterBottom
            sx={{ fontWeight: 600, mb: 6 }} // Überschrift Styling
          >
            Alles was du für deine Planung brauchst
          </Typography>
          
          {/* Flexbox Container für die Features */}
          <Box 
            sx={{
              display: 'flex',
              flexWrap: 'wrap', // Umbruch auf kleineren Bildschirmen
              gap: theme.spacing(5), // Abstand zwischen den Boxen (entspricht spacing={5} im Grid)
              justifyContent: 'center', // Zentriert die Items, falls sie nicht die volle Breite ausfüllen
            }}
          >
            
            {/* Feature 1: Chat */}
            <Box sx={{ textAlign: 'center', width: { xs: '100%', sm: `calc(50% - ${theme.spacing(2.5)})`, md: `calc(25% - ${theme.spacing(3.75)})` } }}> {/* Breite anpassen, Gap berücksichtigen */} 
              <ChatIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
              <Typography variant="h6" component="h3" gutterBottom sx={{ fontWeight: 500 }}>
                KI Chat Assistenz
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Stelle Fragen, erhalte Vorschläge und plane im Dialog mit deiner persönlichen KI.
              </Typography>
            </Box>

            {/* Feature 2: ToDos */}
            <Box sx={{ textAlign: 'center', width: { xs: '100%', sm: `calc(50% - ${theme.spacing(2.5)})`, md: `calc(25% - ${theme.spacing(3.75)})` } }}> 
              <ChecklistIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
              <Typography variant="h6" component="h3" gutterBottom sx={{ fontWeight: 500 }}>
                Aufgaben & Checklisten
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Behalte den Überblick über alle Aufgaben mit anpassbaren Checklisten und Erinnerungen.
              </Typography>
            </Box>

            {/* Feature 3: Gäste */}
            <Box sx={{ textAlign: 'center', width: { xs: '100%', sm: `calc(50% - ${theme.spacing(2.5)})`, md: `calc(25% - ${theme.spacing(3.75)})` } }}> 
              <PeopleIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
              <Typography variant="h6" component="h3" gutterBottom sx={{ fontWeight: 500 }}>
                Gästemanagement
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Verwalte deine Gästeliste, Zu-/Absagen und Sitzordnungen einfach online.
              </Typography>
            </Box>

            {/* Feature 4: Budget */}
            <Box sx={{ textAlign: 'center', width: { xs: '100%', sm: `calc(50% - ${theme.spacing(2.5)})`, md: `calc(25% - ${theme.spacing(3.75)})` } }}> 
              <AccountBalanceWalletIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
              <Typography variant="h6" component="h3" gutterBottom sx={{ fontWeight: 500 }}>
                Budgetplaner
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Behalte deine Ausgaben im Blick und plane dein Hochzeitsbudget effizient.
              </Typography>
            </Box>

          </Box>
        </Container>
      </Box>

      {/* === Divider 1 === */}
      <Box sx={{ textAlign: 'center', my: 2 }}> {/* Reduced margin */}
        <Box
           component="img"
           src={dividerOrnament}
           alt="" // Decorative image, empty alt
           sx={{
             maxWidth: '50%', // Adjust width as needed
             height: 'auto', // Maintain aspect ratio
             opacity: 0.6, // Make it subtle
           }}
        />
      </Box>

      {/* === Testimonials Section === */}
      <Box sx={{ py: { xs: 6, md: 10 }, bgcolor: 'primary.light' }}> {/* Hintergrundfarbe wechseln für Abwechslung */} 
        <Container maxWidth="lg">
          <Typography 
            variant="h3" 
            component="h2" 
            align="center" 
            gutterBottom
            sx={{ fontWeight: 600, mb: 6, color: 'primary.contrastText' }} // Textfarbe an Hintergrund anpassen
          >
            Was glückliche Paare sagen
          </Typography>

          {/* Flexbox Container für die Testimonials */}
          <Box 
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: theme.spacing(4),
              justifyContent: 'center',
            }}
          >
            {/* Beispiel Testimonial 1 */}
            <Paper 
              elevation={3} 
              sx={{
                p: 3, 
                textAlign: 'center',
                width: { xs: '100%', sm: `calc(50% - ${theme.spacing(2)})`, md: `calc(33.33% - ${theme.spacing(2.66)})` }, // 3 Spalten auf md
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                borderRadius: '16px'
              }}
            >
              <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56, mb: 2 }}>
                <FormatQuoteIcon />
              </Avatar>
              <Typography variant="body1" paragraph sx={{ fontStyle: 'italic' }}>
                "WILMA hat uns so viel Stress bei der Planung abgenommen! Die KI war super hilfreich bei der Ideensuche."
              </Typography>
              <Typography variant="subtitle2" color="text.secondary">
                - Anna & Max Mustermann
              </Typography>
            </Paper>

            {/* Beispiel Testimonial 2 */}
            <Paper 
              elevation={3} 
              sx={{
                p: 3, 
                textAlign: 'center',
                width: { xs: '100%', sm: `calc(50% - ${theme.spacing(2)})`, md: `calc(33.33% - ${theme.spacing(2.66)})` },
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                borderRadius: '16px'
              }}
            >
              <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56, mb: 2 }}>
                <FormatQuoteIcon />
              </Avatar>
              <Typography variant="body1" paragraph sx={{ fontStyle: 'italic' }}>
                "Besonders das Budget-Tool und die Gästelisten-Verwaltung waren Gold wert. Alles an einem Ort!"
              </Typography>
              <Typography variant="subtitle2" color="text.secondary">
                - Julia & Thomas Beispiel
              </Typography>
            </Paper>

            {/* Beispiel Testimonial 3 */}
            <Paper 
              elevation={3} 
              sx={{
                p: 3, 
                textAlign: 'center',
                width: { xs: '100%', sm: `calc(50% - ${theme.spacing(2)})`, md: `calc(33.33% - ${theme.spacing(2.66)})` },
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                borderRadius: '16px'
              }}
            >
              <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56, mb: 2 }}>
                <FormatQuoteIcon />
              </Avatar>
              <Typography variant="body1" paragraph sx={{ fontStyle: 'italic' }}>
                "Endlich eine moderne Lösung für die Hochzeitsplanung. Der Chatbot ist genial!"
              </Typography>
              <Typography variant="subtitle2" color="text.secondary">
                - Sophie & Ben Test
              </Typography>
            </Paper>

          </Box>
        </Container>
      </Box>

      {/* === Divider 2 === */}
      <Box sx={{ textAlign: 'center', my: 2 }}> {/* Removed bgcolor */}
         <Box
           component="img"
           src={dividerOrnament}
           alt=""
           sx={{
             maxWidth: '50%',
             height: 'auto',
             opacity: 0.6,
           }}
        />
      </Box>

      {/* === Resource Lead Magnet Section === */}
      <Box sx={{ py: { xs: 6, md: 10 }, bgcolor: 'background.paper' }}> {/* Wieder heller Hintergrund */}
        <Container maxWidth="md"> {/* Schmalerer Container für Fokus */}
          <Typography 
            variant="h3" 
            component="h2" 
            align="center" 
            gutterBottom
            sx={{ fontWeight: 600, mb: 3 }} 
          >
            Deine ultimative Hochzeits-Checkliste
          </Typography>
          <Typography 
            variant="h6" 
            component="p" 
            align="center" 
            color="text.secondary" 
            paragraph
            sx={{ mb: 5 }} 
          >
            Vergiss keinen wichtigen Schritt! Lade unsere detaillierte Checkliste herunter und starte stressfrei in die Planung deiner Traumhochzeit.
          </Typography>
          <Box sx={{ textAlign: 'center' }}>
            <Button 
              variant="contained" 
              size="large"
              color="secondary"
              component={RouterLink}
              to="/ressourcen/hochzeitsplanung-checkliste" // Link zur spezifischen Ressource
              startIcon={<DownloadIcon />} // Icon hinzufügen
              sx={{
                py: 1.5, 
                px: 5, 
                fontSize: '1.1rem',
              }}
            >
              Checkliste jetzt ansehen
            </Button>
            {/* Optional: Hinweis wie "PDF Download" oder "Online Tool" */}
          </Box>
        </Container>
      </Box>

      {/* === Nächste Sektion (z.B. finaler CTA) === */}
      {/* ... */}

    </Box>
  );
};

export default MainLandingPage; 