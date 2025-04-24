import { createTheme } from '@mui/material/styles';

// Definierte Farbpalette aus dem Design System
const warmRose = '#FF6B88';
const warmRoseLight = '#FFACBC'; // Hellere Variante für primary.light
const softSage = '#94A89A';
const softSageLight = '#CAD5CE'; // Hellere Variante für secondary.light
const softSageDark = '#7E9082'; // Dunklere Variante für secondary.dark hover
const cream = '#FFF8EA';
const goldAccent = '#D4AF37';
const deepBurgundy = '#800020';
const textPrimary = '#3C2A21'; // Beibehalten oder anpassen?
const textSecondary = '#8E806A'; // Beibehalten oder anpassen?

const theme = createTheme({
  palette: {
    primary: {
      main: warmRose, // Hauptfarbe für UI-Akzente
      light: warmRoseLight, // Definieren
      contrastText: '#FFFFFF', // Weißer Text auf Rose
    },
    secondary: {
      main: softSage, // Für Hintergründe, Chatblasen etc.
      light: softSageLight, // Definieren
      dark: softSageDark, // Definieren dark
      contrastText: '#FFFFFF', // Weißer Text auf Salbei
    },
    background: {
      default: cream, // Hauptseitenhintergrund
      paper: '#FFFFFF', // Weiß für Karten, Menüs etc. (oder Soft Sage für Chat?)
    },
    text: {
      primary: textPrimary,
      secondary: textSecondary,
    },
    error: {
      main: deepBurgundy, // Verwende Burgundy für Fehler?
    },
    // Benutzerdefinierte Farben für direkten Zugriff
    custom: {
      gold: goldAccent,
      burgundy: deepBurgundy,
      // Chat-Blasen-Farben explizit
      userMessageBg: warmRose,
      aiMessageBg: softSage,
      appBarButtonBg1: softSage, // Beispiel: Salbei für einige AppBar Buttons
      appBarButtonBg2: deepBurgundy, // Beispiel: Burgundy für andere AppBar Buttons
      appBarButtonText: '#FFFFFF',
    }
  },
  typography: {
    // Standard-Schriftart (Fließtext)
    fontFamily: '"Open Sans", "Helvetica", "Arial", sans-serif',
    // Überschriften
    h1: { fontFamily: '"Playfair Display", Georgia, serif' },
    h2: { fontFamily: '"Playfair Display", Georgia, serif' },
    h3: { fontFamily: '"Playfair Display", Georgia, serif' },
    h4: { fontFamily: '"Playfair Display", Georgia, serif' },
    h5: { fontFamily: '"Playfair Display", Georgia, serif' },
    h6: { fontFamily: '"Playfair Display", Georgia, serif' },
    // Buttons/UI
    button: {
      fontFamily: '"Montserrat", "Helvetica", "Arial", sans-serif',
      textTransform: 'none', // Wie bereits definiert
      fontWeight: 600, // Etwas fetter für Buttons
    },
    // Optional: Standard-Textvarianten auch auf Open Sans setzen
    body1: { fontFamily: '"Open Sans", "Helvetica", "Arial", sans-serif' },
    body2: { fontFamily: '"Open Sans", "Helvetica", "Arial", sans-serif' },
    caption: { fontFamily: '"Open Sans", "Helvetica", "Arial", sans-serif' },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: cream, // AppBar Hintergrund = Haupt-Hintergrund
          color: textPrimary, // Textfarbe in AppBar
          boxShadow: 'none',
          borderBottom: `1px solid ${softSage}` // Salbei als Trennlinie
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '12px', 
          padding: '8px 20px', // Etwas mehr Padding?
        },
        // Styling für Primär-Button (Gold)
        containedPrimary: {
          backgroundColor: goldAccent,
          color: '#FFFFFF', // Weißer Text auf Gold
          '&:hover': {
            backgroundColor: '#c8a031', // Etwas dunkleres Gold
          },
        },
        // Styling für Sekundär-Button (Outline Rose)
        outlinedSecondary: {
          borderColor: warmRose,
          color: warmRose,
          '&:hover': {
            backgroundColor: 'rgba(255, 107, 136, 0.08)', // Leichter Rose-Hintergrund
            borderColor: warmRose,
          },
        },
        // Styling für Text-Buttons (z.B. in AppBar)
        textInherit: {
          fontFamily: '"Montserrat", "Helvetica", "Arial", sans-serif', // Eigene Schriftart für AppBar Buttons?
          color: textPrimary, 
          '&:hover': {
             backgroundColor: 'rgba(148, 168, 154, 0.1)' // Leichter Salbei-Hover
          }
        },
        // Styling für Contained Secondary Button (Sage)
        containedSecondary: {
           backgroundColor: softSage, // theme.palette.secondary.main
           color: '#FFFFFF', // theme.palette.secondary.contrastText
           '&:hover': {
             backgroundColor: softSageDark, // theme.palette.secondary.dark
           },
         },
      },
      variants: [
        {
          props: { variant: 'textBubble' },
          style: ({ theme }) => ({
             fontFamily: '"Montserrat", "Helvetica", "Arial", sans-serif',
             padding: '6px 16px',
             borderRadius: '20px',
             color: theme.palette.text.primary,
             transition: 'background-color 0.3s ease, color 0.3s ease',
             '&:hover': {
               backgroundColor: theme.palette.secondary.main,
               color: theme.palette.secondary.contrastText,
             },
          }),
        },
      ],
    },
    // Beispiel: Input-Styling
    MuiTextField: {
      defaultProps: {
        variant: 'outlined'
      },
      styleOverrides: {
         root: {
           '& .MuiOutlinedInput-root': {
             borderRadius: '12px',
             backgroundColor: '#FFFFFF', // Weißer Hintergrund für Inputs
             '& fieldset': {
               // Standard-Rand (optional)
             },
             '&:hover fieldset': {
               // Hover-Rand (optional)
             },
             '&.Mui-focused fieldset': {
               borderColor: goldAccent, // Goldener Rand bei Fokus
             },
           },
           '& .MuiInputLabel-root': {
             // Placeholder-Styling wird oft über inputProps gemacht
           },
         }
      }
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: '16px', // Rundere Chips
          backgroundColor: softSage,
          color: '#FFFFFF',
        }
      }
    },
    MuiLink: {
      styleOverrides: {
        root: ({ theme }) => ({
          display: 'inline-block',
          padding: '4px 12px',
          borderRadius: '20px',
          textDecoration: 'none',
          color: theme.palette.text.secondary,
          transition: 'background-color 0.3s ease, color 0.3s ease',
          '&:hover': {
            backgroundColor: theme.palette.secondary.main,
            color: theme.palette.secondary.contrastText,
            textDecoration: 'none',
          },
        }),
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: ({ theme }) => ({
          margin: '4px',
          borderRadius: '16px',
          transition: 'background-color 0.2s ease, color 0.2s ease',
          '&:hover': {
            backgroundColor: theme.palette.secondary.light,
            color: theme.palette.secondary.contrastText,
          },
        }),
      },
    }
  }
});

// Erweitere das Theme-Interface
declare module '@mui/material/styles' {
  interface Palette {
    custom?: {
      gold?: string;
      burgundy?: string;
      userMessageBg?: string;
      aiMessageBg?: string;
      appBarButtonBg1?: string;
      appBarButtonBg2?: string;
      appBarButtonText?: string;
    };
  }
  interface PaletteOptions {
    custom?: {
      gold?: string;
      burgundy?: string;
      userMessageBg?: string;
      aiMessageBg?: string;
      appBarButtonBg1?: string;
      appBarButtonBg2?: string;
      appBarButtonText?: string;
    };
  }
}

// Erweitere das Theme-Interface für Button-Varianten
declare module '@mui/material/Button' {
  interface ButtonPropsVariantOverrides {
    textBubble: true;
  }
}

export default theme; 