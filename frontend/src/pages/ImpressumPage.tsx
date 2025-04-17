import React from 'react';
import { Typography, Container, Box } from '@mui/material';

const ImpressumPage: React.FC = () => {
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Impressum
      </Typography>
      
      <Typography variant="h6" component="h2" gutterBottom sx={{ mt: 3 }}>
        WILMA – Dein digitaler Hochzeitsplaner
      </Typography>
      <Typography variant="body1" paragraph>
        Inhaber: Jonas Behrmann<br />
        Seilergasse 4<br />
        2221 Groß-Schweinbarth<br />
        Österreich
      </Typography>

      <Typography variant="h6" component="h2" gutterBottom sx={{ mt: 3 }}>
        Kontakt
      </Typography>
      <Typography variant="body1" paragraph>
        Telefon: +43 664 1383800<br />
        E-Mail: wanna@beautomated.at<br />
        Website: www.beautomated.at
      </Typography>

      <Typography variant="h6" component="h2" gutterBottom sx={{ mt: 3 }}>
        Umsatzsteuer-Identifikationsnummer
      </Typography>
      <Typography variant="body1" paragraph>
        [Hier ggf. UID einfügen, falls vorhanden und erforderlich]
      </Typography>

      <Typography variant="h6" component="h2" gutterBottom sx={{ mt: 3 }}>
        Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV
      </Typography>
      <Typography variant="body1" paragraph>
        Jonas Behrmann<br />
        (Anschrift wie oben)
      </Typography>

      {/* Optional: Hinweis zur Streitbeilegung etc. hier einfügen */}

    </Container>
  );
};

export default ImpressumPage; 