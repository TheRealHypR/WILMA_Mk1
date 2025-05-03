import React from 'react';
import { Box, Typography, TextField, Button, CircularProgress } from '@mui/material';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'; // Icon für Achievements/Punkte

// Props Definition
interface EmailCaptureFormProps {
  email: string;
  onChange: (newEmail: string) => void;
  onSubmit: (event?: React.FormEvent<HTMLFormElement>) => void;
  isLoading: boolean; // isLoading Prop hinzufügen
}

const EmailCaptureForm: React.FC<EmailCaptureFormProps> = ({ email, onChange, onSubmit, isLoading }) => {
  // Einfache E-Mail-Validierung (nur zur Anzeige des Error-Status)
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const showError = email.length > 0 && !isEmailValid;

  // Beispiel-Punkte und Achievement-Name
  const pointsReward = 150;
  const achievementName = "Timeline Gestartet";

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.value);
  };

  return (
    <Box 
      component="form" // Form-Tag verwenden
      onSubmit={onSubmit} // onSubmit an das Formular binden
      sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', // Zentriert Elemente horizontal
        gap: 2, // Abstand zwischen Elementen
        mt: 3 // Abstand nach oben
      }} 
      noValidate // Browser-Validierung deaktivieren (wir machen unsere eigene)
      autoComplete="off"
    >
      <Typography variant="h6" gutterBottom align="center">
        Deine persönliche Timeline wartet!
      </Typography>
      <Typography variant="body2" color="text.secondary" align="center" sx={{ mb: 2 }}>
        Gib deine E-Mail ein, um deine **maßgeschneiderte Timeline** basierend auf deinen Angaben zu erhalten.
        Als Bonus gibt's <strong>{pointsReward} WPP</strong> und das <strong>"{achievementName}"</strong>-Achievement!
      </Typography>
      <TextField
        required
        fullWidth
        id="funnel-email"
        label="Deine E-Mail-Adresse"
        name="email"
        type="email"
        autoComplete="email"
        value={email}
        onChange={handleInputChange}
        error={showError} // Zeigt Fehlerstatus bei ungültiger Eingabe
        helperText={showError ? "Bitte gib eine gültige E-Mail ein." : ""}
        sx={{ mb: 2 }}
        disabled={isLoading} // Deaktivieren während Ladevorgang
      />
      <Button
        type="submit" // Wichtig für Formular-Submit
        variant="contained"
        color="primary"
        fullWidth
        disabled={isLoading || !isEmailValid} // Deaktiviert, wenn E-Mail ungültig oder Ladevorgang läuft
        startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : <EmojiEventsIcon />} // Ladeanzeige oder Icon
      >
        {isLoading ? 'Timeline wird erstellt...' : 'Timeline sichern & 150 WPP erhalten!'}
      </Button>
      <Typography variant="caption" display="block" color="text.secondary" align="center" sx={{ mt: 1 }}>
         Wir verwenden deine E-Mail nur für deine Planung mit WILMA.
      </Typography>
    </Box>
  );
};

export default EmailCaptureForm; 