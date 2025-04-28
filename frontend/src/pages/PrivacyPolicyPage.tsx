import React from 'react';
import { Typography, Container } from '@mui/material';

const PrivacyPolicyPage: React.FC = () => {
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Datenschutzerklärung
      </Typography>

      <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 4 }}>
        1. Datenschutz auf einen Blick
      </Typography>
      <Typography variant="body1" paragraph>
        Die folgenden Hinweise geben einen einfachen Überblick darüber, was mit Ihren personenbezogenen Daten passiert, wenn Sie unsere Website besuchen.
      </Typography>

      <Typography variant="h6" component="h3" gutterBottom sx={{ mt: 3 }}>
        1.1 Datenerfassung auf unserer Website
      </Typography>
      <Typography variant="body1" paragraph>
        <strong>Wer ist verantwortlich für die Datenerfassung auf dieser Website?</strong><br />
        Die Datenverarbeitung auf dieser Website erfolgt durch den Websitebetreiber. Dessen Kontaktdaten können Sie dem Impressum entnehmen.
      </Typography>
      <Typography variant="body1" paragraph>
        <strong>Wie erfassen wir Ihre Daten?</strong><br />
        Ihre Daten werden zum einen dadurch erhoben, dass Sie uns diese mitteilen. Hierbei kann es sich z. B. um Daten handeln, die Sie in ein Kontaktformular eingeben.
        Andere Daten werden automatisch beim Besuch der Website durch unsere IT-Systeme erfasst. Das sind vor allem technische Daten (z. B. Internetbrowser, Betriebssystem oder Uhrzeit des Seitenaufrufs).
      </Typography>
      <Typography variant="body1" paragraph>
        <strong>Wofür nutzen wir Ihre Daten?</strong><br />
        Ein Teil der Daten wird erhoben, um eine fehlerfreie Bereitstellung der Website zu gewährleisten. Andere Daten können zur Analyse Ihres Nutzerverhaltens verwendet werden.
      </Typography>

      <Typography variant="h6" component="h3" gutterBottom sx={{ mt: 3 }}>
        1.2 Ihre Rechte
      </Typography>
      <Typography variant="body1" paragraph>
        Sie haben jederzeit das Recht auf unentgeltliche Auskunft über Herkunft, Empfänger und Zweck Ihrer gespeicherten personenbezogenen Daten. Sie haben außerdem ein Recht, die Berichtigung, Sperrung oder Löschung dieser Daten zu verlangen.
      </Typography>

      <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 4 }}>
        2. Hosting und Content Delivery Networks (CDN)
      </Typography>
      <Typography variant="body1" paragraph>
        Unsere Website wird über [Hosting-Anbieter eintragen] gehostet. Personenbezogene Daten, die auf dieser Website erfasst werden, werden auf den Servern des Hosters gespeichert.
      </Typography>

      <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 4 }}>
        3. Allgemeine Hinweise und Pflichtinformationen
      </Typography>
      <Typography variant="h6" component="h3" gutterBottom sx={{ mt: 3 }}>
        Datenschutz
      </Typography>
      <Typography variant="body1" paragraph>
        Wir behandeln Ihre personenbezogenen Daten vertraulich und entsprechend der gesetzlichen Datenschutzvorschriften sowie dieser Datenschutzerklärung.
      </Typography>
      <Typography variant="h6" component="h3" gutterBottom sx={{ mt: 3 }}>
        Hinweis zur verantwortlichen Stelle
      </Typography>
      <Typography variant="body1" paragraph>
        Verantwortliche Stelle ist die natürliche oder juristische Person, die allein oder gemeinsam mit anderen über die Zwecke und Mittel der Verarbeitung von personenbezogenen Daten entscheidet.
        <br />
        Verantwortlich für den Datenschutz:<br />
        [Vorname Nachname, E-Mail-Adresse, Telefonnummer]
      </Typography>

      <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 4 }}>
        4. Datenerfassung auf unserer Website
      </Typography>
      <Typography variant="h6" component="h3" gutterBottom sx={{ mt: 3 }}>
        Cookies
      </Typography>
      <Typography variant="body1" paragraph>
        Unsere Website verwendet teilweise sogenannte Cookies. Cookies richten auf Ihrem Rechner keinen Schaden an und enthalten keine Viren. Sie dienen dazu, unser Angebot nutzerfreundlicher, effektiver und sicherer zu machen.
      </Typography>
      <Typography variant="h6" component="h3" gutterBottom sx={{ mt: 3 }}>
        Server-Log-Dateien
      </Typography>
      <Typography variant="body1" paragraph>
        Der Provider der Seiten erhebt und speichert automatisch Informationen in sogenannten Server-Log-Dateien, die Ihr Browser automatisch an uns übermittelt.
      </Typography>

      <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 4 }}>
        5. Plugins und Tools
      </Typography>
      <Typography variant="h6" component="h3" gutterBottom sx={{ mt: 3 }}>
        Google Fonts (lokal eingebunden)
      </Typography>
      <Typography variant="body1" paragraph>
        Diese Seite nutzt zur einheitlichen Darstellung von Schriftarten sogenannte Google Fonts, die lokal installiert sind. Eine Verbindung zu Servern von Google findet dabei nicht statt.
      </Typography>

    </Container>
  );
};

export default PrivacyPolicyPage; 