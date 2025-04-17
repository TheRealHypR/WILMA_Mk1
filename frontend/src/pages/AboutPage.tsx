import React from 'react';
import { Typography, Container, Box, Link, Button } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';

const AboutPage: React.FC = () => {
  const theme = useTheme();

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom align="center" sx={{ mb: 2 }}>
        Über uns – WILMA
      </Typography>
      <Typography variant="h5" component="p" align="center" sx={{ mb: 4, color: 'text.secondary' }}>
        Wir machen deine Hochzeitsplanung einfach&nbsp;…&nbsp;und magisch ✨
      </Typography>

      <Typography variant="body1" paragraph sx={{ mb: 4 }}>
        Du träumst von einem Fest voller Liebe, Individualität und Leichtigkeit – ohne Excel‑Albträume, Zettelwirtschaft oder endlose To‑Do‑Listen? Willkommen bei WILMA, deinem digitalen Hochzeitsplaner.
      </Typography>

      <Typography variant="h4" component="h2" gutterBottom sx={{ mt: 5 }}>
        Unsere Mission
      </Typography>
      <Typography variant="body1" paragraph>
        Wir glauben, dass Hochzeitsplanung Freude machen soll. Deshalb vereint WILMA smartes Design, KI‑gestützte Organisation und echte Hochzeits‑Expertise in einer benutzerfreundlichen App. WILMA plant. Du liebst. – so einfach ist das.
      </Typography>

      <Typography variant="h4" component="h2" gutterBottom sx={{ mt: 5 }}>
        Unsere Werte
      </Typography>
      <Box sx={{ ml: 2 }}>
        <Typography variant="body1" paragraph>
          <strong>Einfachheit</strong> – Komplexes reduzieren wir auf einen Fingertipp.
        </Typography>
        <Typography variant="body1" paragraph>
          <strong>Individualität</strong> – Jede Liebe ist anders. WILMA passt sich deinem Stil, Budget und Zeitplan an.
        </Typography>
        <Typography variant="body1" paragraph>
          <strong>Nachhaltigkeit</strong> – Von digitalen Einladungen bis zu lokalen Dienstleister‑Empfehlungen: wir denken an morgen.
        </Typography>
        <Typography variant="body1" paragraph>
          <strong>Datenschutz</strong> – Deine Daten gehören dir. Punkt.
        </Typography>
        <Typography variant="body1" paragraph>
          <strong>Herz & Hightech</strong> – Wir kombinieren Warmherzigkeit mit modernster Technologie, weil beides zusammengehört.
        </Typography>
      </Box>

      <Typography variant="h4" component="h2" gutterBottom sx={{ mt: 5 }}>
        Was WILMA für dich tut
      </Typography>
      <Box sx={{ ml: 2 }}>
        <Typography variant="body1" paragraph>
          <strong>Budget im Blick</strong> – Automatischer Kostenplan, der mitdenkt.
        </Typography>
        <Typography variant="body1" paragraph>
          <strong>Aufgaben, die sich selbst sortieren</strong> – Dein persönlicher Zeitstrahl erinnert dich genau dann, wenn etwas zu erledigen ist.
        </Typography>
        <Typography variant="body1" paragraph>
          <strong>Gästelisten‑Magie</strong> – RSVPs, Essenswünsche und Sitzplan: ein Ort, null Stress.
        </Typography>
        <Typography variant="body1" paragraph>
          <strong>Location & Dienstleister</strong> – Kuratierte Empfehlungen oder eigene Favoriten – immer perfekt gefiltert nach Stil und Region.
        </Typography>
        <Typography variant="body1" paragraph>
          <strong>Inspiration, die inspiriert</strong> – Wöchentliche Trend‑Feeds, Moodboards und Farbpalletten, damit deine Ideen fliegen lernen.
        </Typography>
      </Box>

      <Typography variant="h4" component="h2" gutterBottom sx={{ mt: 5 }}>
        Unser Team
      </Typography>
      <Typography variant="body1" paragraph>
        Wir sind Designer, Entwicklerinnen, Wedding‑Planner und Tech‑Enthusiasten aus dem Herzen Europas. Uns verbindet der Wunsch, die schönste Feier deines Lebens digital leichter zu machen – mit Stil, Humor und Liebe zum Detail.
      </Typography>

      <Typography variant="h4" component="h2" align="center" sx={{ mt: 6, mb: 2 }}>
        Komm mit auf die Reise
      </Typography>
      <Typography variant="body1" paragraph align="center" sx={{ mb: 4 }}>
        Bereit, aus Planung pure Vorfreude zu machen? Starte jetzt kostenlos und lass WILMA den Rest erledigen.
      </Typography>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Button 
          variant="contained" 
          size="large"
          component={RouterLink}
          to="/register" 
          sx={{ 
            py: 1.5, px: 4, fontSize: '1.1rem',
            bgcolor: theme.palette.secondary.main,
            '&:hover': { bgcolor: theme.palette.secondary.dark }
          }}
        >
          Jetzt kostenlos starten
        </Button>
      </Box>

      <Typography variant="h5" component="p" align="center" sx={{ fontWeight: 600, mb: 4 }}>
        WILMA plant. Du liebst.
      </Typography>

      <Box sx={{ textAlign: 'center', mt: 5 }}>
        <Typography variant="body2" color="text.secondary">
          Folge uns auf
          <Link href="#" target="_blank" rel="noopener noreferrer">Instagram</Link> • {" "}
          <Link href="#" target="_blank" rel="noopener noreferrer">Pinterest</Link> • {" "}
          <Link href="#" target="_blank" rel="noopener noreferrer">TikTok</Link>
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          Schreibe uns: <Link href="mailto:hello@wilma-hochzeitsplaner.de">hello@wilma-hochzeitsplaner.de</Link>
        </Typography>
      </Box>

    </Container>
  );
};

export default AboutPage; 