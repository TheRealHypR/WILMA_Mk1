import React from 'react';
import { Typography, Container, Box, Link } from '@mui/material'; // Link importieren

const CookiePolicyPage: React.FC = () => {
  return (
    <Container maxWidth="md" sx={{ py: 4 }}> {/* Padding hinzugefügt */}
      <Typography variant="h4" component="h1" gutterBottom>
        Cookie-Richtlinie
      </Typography>

      <Typography variant="body1" paragraph>
        Diese Website verwendet Cookies. Cookies sind kleine Textdateien, die auf Ihrem Endgerät gespeichert werden und die Ihr Browser speichert. 
        Die meisten der von uns verwendeten Cookies sind sogenannte "Session-Cookies". Sie werden nach Ende Ihres Besuchs automatisch gelöscht.
      </Typography>

      <Typography variant="body1" paragraph>
        Sie können Ihren Browser so einstellen, dass Sie über das Setzen von Cookies informiert werden und Cookies nur im Einzelfall erlauben, 
        die Annahme von Cookies für bestimmte Fälle oder generell ausschließen sowie das automatische Löschen der Cookies beim Schließen des Browsers aktivieren.
      </Typography>

      <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 4 }}>
        Hinweis zur Online-Streitbeilegung gemäß Art. 14 Abs. 1 ODR-VO
      </Typography>
      <Typography variant="body1" paragraph>
        Die Europäische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit, die Sie unter 
        <Link href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer">
          https://ec.europa.eu/consumers/odr
        </Link> finden.
      </Typography>
      <Typography variant="body1" paragraph>
        Unsere E-Mail-Adresse finden Sie oben im Impressum.
      </Typography>

      <Typography variant="body2" color="text.secondary" sx={{ mt: 5 }}>
        Letzte Aktualisierung: [TT.MM.JJJJ]
      </Typography>

    </Container>
  );
};

export default CookiePolicyPage; 