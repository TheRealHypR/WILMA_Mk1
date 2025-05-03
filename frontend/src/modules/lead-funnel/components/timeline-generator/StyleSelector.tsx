import React, { useState } from 'react';
import { Box, Typography, Grid, Card, CardActionArea, CardMedia, CardContent, Tooltip, Collapse, IconButton, List, ListItem, ListItemText, Dialog, DialogTitle, DialogContent, DialogActions, Button, Chip, useTheme, lighten } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle'; // Icon für ausgewählten Status
import CloseIcon from '@mui/icons-material/Close'; // Wird wieder benötigt

// --- Erweiterte Datenstruktur für Stile ---
export interface StyleInfo {
  key: string;
  name: string;
  image: string;
  description: string;
  colorPalette: string[]; // Array von Hex-Farbcodes
  keyElements: string[];
  locationTypes: string[];
  bestSeasons: string[];
}

// Beispielstile mit erweiterten Daten - JETZT EXPORTIEREN
export const styles: StyleInfo[] = [
  {
    key: 'klassisch',
    name: 'Klassisch & Elegant',
    image: 'https://placehold.co/150x100/E0E0E0/000000?text=Klassisch',
    description: 'Zeitlose Eleganz mit Fokus auf Tradition, oft in Weiß, Creme oder Pastelltönen.',
    colorPalette: ['#FFFFFF', '#F8F0E3', '#D4AF37', '#5A5A5A'], // Weiß, Creme, Gold, Dunkelgrau
    keyElements: ['Üppige Blumenarrangements', 'Formelle Kleidung', 'Mehrgängiges Menü', 'Streichquartett'],
    locationTypes: ['Schloss', 'Ballsaal', 'Historisches Gebäude', 'Herrenhaus'],
    bestSeasons: ['Ganzjährig', 'besonders Winter & Frühling']
  },
  {
    key: 'modern',
    name: 'Modern & Minimalistisch',
    image: 'https://placehold.co/150x100/B0BEC5/000000?text=Modern',
    description: 'Klare Linien, schlichte Deko und oft eine monochrome Farbpalette. Weniger ist mehr.',
    colorPalette: ['#FFFFFF', '#B0BEC5', '#424242', '#757575'], // Weiß, Hellgrau, Dunkelgrau, Grau
    keyElements: ['Geometrische Formen', 'Klare Linien', 'Wenige, ausgewählte Deko-Objekte', 'Moderne Kunst'],
    locationTypes: ['Loft', 'Museum', 'Moderne Eventlocation', 'Architektenhaus'],
    bestSeasons: ['Ganzjährig']
  },
  {
    key: 'boho',
    name: 'Boho & Natürlich',
    image: 'https://placehold.co/150x100/D7CCC8/000000?text=Boho',
    description: 'Lässig, unkonventionell, mit viel Natur, Makramee, Federn und warmen Erdtönen.',
    colorPalette: ['#D7CCC8', '#A1887F', '#FFECB3', '#8D6E63'], // Beige, Braun, Hellgelb, Erdbraun
    keyElements: ['Makramee', 'Federn', 'Trockenblumen', 'Lichterketten', 'Vintage-Teppiche'],
    locationTypes: ['Scheune', 'Strand', 'Waldlichtung', 'Gewächshaus'],
    bestSeasons: ['Sommer', 'Herbst']
  },
  {
    key: 'rustikal',
    name: 'Rustikal & Ländlich',
    image: 'https://placehold.co/150x100/A1887F/FFFFFF?text=Rustikal',
    description: 'Gemütlich, bodenständig, oft in Scheunen oder im Freien, mit Holzelementen und Wildblumen.',
    colorPalette: ['#A1887F', '#FFFFFF', '#8BC34A', '#795548'], // Braun, Weiß, Grün, Dunkelbraun
    keyElements: ['Holz', 'Jute', 'Wildblumen', 'Kerzenlicht', 'DIY-Elemente'],
    locationTypes: ['Scheune', 'Bauernhof', 'Weingut', 'Berghütte'],
    bestSeasons: ['Herbst', 'Sommer']
  },
  {
    key: 'vintage',
    name: 'Vintage & Retro',
    image: 'https://placehold.co/150x100/d4b483/3D3229?text=Vintage',
    description: 'Der Vintage-Hochzeitsstil lässt den Charme vergangener Epochen wieder aufleben...',
    colorPalette: ['#d4b483', '#c17767', '#8e8358', '#f5efe0'], // Goldbeige, Altrosa, Olivgrün, Cremeweiß
    keyElements: ['Antiquitäten', 'Spitzendetails', 'Retro-Typografie', 'Teekessel/Koffer'],
    locationTypes: ['Historische Villen', 'Alte Theater', 'Vintage Cafés', 'Herrenhäuser'],
    bestSeasons: ['Frühling', 'Sommer', 'Herbst']
  },
  {
    key: 'fairytale',
    name: 'Romantisch & Märchenhaft',
    image: 'https://placehold.co/150x100/f0b5cd/3D3229?text=M%C3%A4rchen',
    description: 'Der romantisch-märchenhafte Stil verwandelt die Hochzeit in ein zauberhaftes Ereignis wie aus einem Märchenbuch...',
    colorPalette: ['#f0b5cd', '#c3e8f8', '#d1b0f0', '#ffffff'], // Zartrosa, Himmelblau, Lavendel, Weiß
    keyElements: ['Üppige Blumen', 'Lichterketten/Kerzen', 'Kristall-Elemente', 'Zarte Stoffe (Tüll)'],
    locationTypes: ['Schlösser', 'Burgen', 'Märchenhafte Gärten', 'Ballsäle'],
    bestSeasons: ['Frühling', 'Sommer']
  },
  {
    key: 'industrial',
    name: 'Industrial & Urban',
    image: 'https://placehold.co/150x100/2f2f2f/FFFFFF?text=Industrial',
    description: 'Der Industrial-Stil vereint urbanen Chic mit rohen Materialien und unverputzten Oberflächen...',
    colorPalette: ['#2f2f2f', '#c27d38', '#8ab0ab', '#e8e8e8'], // Dunkelgrau, Kupfer/Rost, Jadegrün, Hellgrau
    keyElements: ['Metall', 'Edison-Glühbirnen', 'Backsteinwände', 'Geometrische Formen'],
    locationTypes: ['Fabriken/Lagerhallen', 'Lofts', 'Dachterrassen', 'Moderne Galerien'],
    bestSeasons: ['Herbst', 'Winter']
  },
  {
    key: 'mediterranean',
    name: 'Mediterran & Südländisch',
    image: 'https://placehold.co/150x100/84a98c/3D3229?text=Mediterran',
    description: 'Der mediterrane Hochzeitsstil transportiert das entspannte, sonnige Lebensgefühl Südeuropas...',
    colorPalette: ['#84a98c', '#d1a080', '#f4d35e', '#f6f4e6'], // Olivgrün, Terrakotta, Zitronengelb, Sandfarben
    keyElements: ['Olivenzweige', 'Zitrusfrüchte', 'Terrakotta', 'Lavendel', 'Lichterketten'],
    locationTypes: ['Weingüter', 'Olivenhaine', 'Terrassen', 'Strandlocations'],
    bestSeasons: ['Spätfrühling', 'Sommer', 'Früher Herbst']
  },
  {
    key: 'minimalist',
    name: 'Elegant & Minimalistisch',
    image: 'https://placehold.co/150x100/eeeeee/000000?text=Minimal',
    description: 'Der elegant-minimalistische Stil konzentriert sich auf das Wesentliche und verzichtet auf überflüssige Dekoration...',
    colorPalette: ['#ffffff', '#eeeeee', '#cccccc', '#000000'], // Weiß, Leichtes Grau, Mittleres Grau, Schwarz
    keyElements: ['Monochrom', 'Statement-Blumen', 'Klare Linien', 'Qualitätsmaterialien'],
    locationTypes: ['Kunstgalerien', 'Design-Hotels', 'Minimalistische Villen', 'Lofts'],
    bestSeasons: ['Ganzjährig']
  },
  {
    key: 'oriental',
    name: 'Orientalisch & Exotisch',
    image: 'https://placehold.co/150x100/9c2542/FFFFFF?text=Oriental',
    description: 'Der orientalische Hochzeitsstil entführt in die farbenprächtige Welt des Nahen und Mittleren Ostens...',
    colorPalette: ['#9c2542', '#d4af37', '#1e488f', '#7851a9'], // Rubinrot, Gold, Kobaltblau, Violett
    keyElements: ['Reiche Textilien', 'Laternen', 'Mosaikmuster', 'Bodenkissen'],
    locationTypes: ['Oriental. Restaurants', 'Innenhöfe (Riad)', 'Botanische Gärten', 'Zelte'],
    bestSeasons: ['Frühling', 'Sommer']
  },
  {
    key: 'greenery',
    name: 'Greenery & Botanical',
    image: 'https://placehold.co/150x100/4d724d/FFFFFF?text=Greenery',
    description: 'Der Greenery-Stil stellt die Schönheit von Pflanzen und üppigem Grün in den Mittelpunkt...',
    colorPalette: ['#4d724d', '#a4c3a2', '#f9f9f1', '#555555'], // Dunkelgrün, Hellgrün, Cremeweiß, Dunkelgrau
    keyElements: ['Blattwerk', 'Hängende Pflanzen', 'Farne/Eukalyptus', 'Terrarien'],
    locationTypes: ['Gewächshäuser', 'Botanische Gärten', 'Waldlichtungen', 'Dachgärten'],
    bestSeasons: ['Frühling', 'Sommer', 'Herbst']
  },
  {
    key: 'tropical',
    name: 'Tropisch & Exotisch',
    image: 'https://placehold.co/150x100/ea526f/3D3229?text=Tropical',
    description: 'Der tropische Hochzeitsstil bringt Urlaubsstimmung und exotisches Flair in die Feier...',
    colorPalette: ['#ea526f', '#25cef7', '#ffd166', '#2a9d8f'], // Koralle/Flamingo, Türkis, Sonnengelb, Tropengrün
    keyElements: ['Exotische Blumen', 'Palmblätter', 'Tropische Früchte', 'Bambus'],
    locationTypes: ['Strand', 'Poolbereiche', 'Tropengewächshäuser', 'Open-Air'],
    bestSeasons: ['Sommer']
  },
];

// Props Definition
interface StyleSelectorProps {
  value: string | null;
  onChange: (newStyle: string | null) => void;
}

const StyleSelector: React.FC<StyleSelectorProps> = ({ value, onChange }) => {
  // State für Dialog wieder eingeführt
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [selectedStyleForDialog, setSelectedStyleForDialog] = useState<StyleInfo | null>(null);
  const theme = useTheme(); // Theme für Farbzugriff

  const handleSelect = (styleKey: string) => {
    onChange(styleKey);
  };

  // Handler für Dialog öffnen
  const handleOpenDialog = (style: StyleInfo) => {
    setSelectedStyleForDialog(style);
    setDialogOpen(true);
  };

  // Handler für Dialog schließen
  const handleCloseDialog = () => {
    setDialogOpen(false);
  };

  return (
    <Box sx={{ my: 2 }}>
      <Typography variant="h6" gutterBottom align="center">
        Welchen Stil bevorzugt ihr?
      </Typography>
      <Grid container spacing={2} justifyContent="center"> {/* Grid für responsives Layout */} 
        {styles.map((style) => {
           const isSelected = value === style.key;

           return (
            <Grid item key={style.key} xs={6} sm={3}> {/* 2 Spalten auf xs, 4 auf sm */} 
              <Card 
                sx={{ 
                  position: 'relative', // Für das Icon Overlay
                  border: isSelected ? 3 : 1, // Dickerer Rand wenn ausgewählt
                  borderColor: isSelected ? 'primary.main' : 'divider', // Farbiger Rand wenn ausgewählt
                  transition: 'border-color 0.3s ease, border-width 0.3s ease',
                  height: '100%', // Sorgt für gleiche Höhe der Karten
                  display: 'flex', // Ermöglicht flexibles Wachstum des Inhalts
                  flexDirection: 'column' // Stellt sicher, dass Inhalt untereinander ist
                }}
              >
                <CardActionArea 
                   onClick={() => handleSelect(style.key)} 
                   sx={{ 
                      height: '100%', 
                      display: 'flex', 
                      flexDirection: 'column', 
                      justifyContent: 'flex-start' // Inhalt oben ausrichten
                   }}
                >
                  {/* Check Icon Overlay wenn ausgewählt */}
                  {isSelected && (
                    <Box 
                      sx={{ 
                        position: 'absolute', top: 8, right: 8, color: 'success.main',
                        backgroundColor: 'rgba(255, 255, 255, 0.8)', borderRadius: '50%', 
                        display: 'flex', alignItems: 'center', justifyContent: 'center', p: 0.3, zIndex: 2
                      }}
                    >
                      <CheckCircleIcon fontSize="medium" />
                    </Box>
                  )}
                  <CardMedia
                    component="img"
                    height="100" // Feste Höhe für Bilder
                    image={style.image}
                    alt={style.name}
                    sx={{ objectFit: 'cover' }} // Bild zuschneiden, nicht verzerren
                  />
                  {/* CardContent jetzt innerhalb der CardActionArea */}
                  <CardContent sx={{ 
                    textAlign: 'center', 
                    pt: 1, 
                    pb: 1, // Normales Padding unten
                    width: '100%',
                    flexGrow: 1,
                    display: 'flex', 
                    flexDirection: 'column'
                  }}>
                    <Typography variant="body2" component="div" sx={{ fontWeight: 'medium' }}>
                      {style.name}
                    </Typography>
                    {/* Farbpalette */}
                    <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.5, my: 0.5 }}>
                      {style.colorPalette.map((color, index) => (
                        <Tooltip key={index} title={color} placement="bottom">
                          <Box sx={{ width: 16, height: 16, bgcolor: color, borderRadius: '2px', border: '1px solid rgba(0,0,0,0.1)' }} />
                        </Tooltip>
                      ))}
                    </Box>
                  </CardContent>
                </CardActionArea>
                
                {/* NEU: Chip statt Button */}
                <Box sx={{ display: 'flex', justifyContent: 'center', pb: 1, mt: 'auto' }}>
                     <Chip 
                         label="Mehr entdecken"
                         size="small"
                         clickable
                         onClick={() => handleOpenDialog(style)}
                         sx={{
                             cursor: 'pointer',
                             // Geändert: Neutraler Grauton statt Grün
                             backgroundColor: theme.palette.grey[200], // Heller Grauton
                             color: theme.palette.grey[700], // Dunklere graue Schrift für Kontrast
                             fontSize: '0.7rem',
                             fontWeight: 'normal',
                             '&:hover': {
                                 // Geändert: Etwas dunkleres Grau bei Hover
                                 backgroundColor: theme.palette.grey[300], 
                             }
                         }}
                     />
                  </Box>

              </Card>
            </Grid>
           );
        })}
      </Grid>

      {/* Dialog wieder hinzugefügt */}
       <Dialog 
        open={dialogOpen} 
        onClose={handleCloseDialog} 
        aria-labelledby="style-dialog-title"
        maxWidth="sm"
        fullWidth
      >
        {selectedStyleForDialog && (
          <>
            <DialogTitle id="style-dialog-title">
              {selectedStyleForDialog.name}
              <IconButton
                aria-label="close"
                onClick={handleCloseDialog}
                sx={{
                  position: 'absolute',
                  right: 8,
                  top: 8,
                  color: (theme) => theme.palette.grey[500],
                }}
              >
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            <DialogContent dividers>
              <Typography gutterBottom variant="body1">{selectedStyleForDialog.description}</Typography>
              
              <Box sx={{ display: 'flex', justifyContent: 'flex-start', gap: 0.5, my: 1 }}>
                {selectedStyleForDialog.colorPalette.map((color, index) => (
                    <Tooltip key={`dialog-${index}`} title={color} placement="bottom">
                        <Box sx={{ width: 20, height: 20, bgcolor: color, borderRadius: '3px', border: '1px solid rgba(0,0,0,0.2)' }} />
                    </Tooltip>
                ))}
              </Box>

              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mt: 2 }}>Schlüsselelemente:</Typography>
              <Typography variant="body2">{selectedStyleForDialog.keyElements.join(', ')}</Typography>

              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mt: 2 }}>Typische Locations:</Typography>
              <Typography variant="body2">{selectedStyleForDialog.locationTypes.join(', ')}</Typography>

              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mt: 2 }}>Beste Jahreszeiten:</Typography>
              <Typography variant="body2">{selectedStyleForDialog.bestSeasons.join(', ')}</Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Schließen</Button>
            </DialogActions>
          </>
        )}
      </Dialog>

    </Box>
  );
};

export default StyleSelector; 