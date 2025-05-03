import React, { useState, useEffect } from 'react';
import { 
    Box, Typography, Grid, Accordion, AccordionSummary, AccordionDetails, 
    List, ListItem, ListItemText, Slider, Paper, useTheme, lighten, Tooltip, Divider 
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CheckCircleIcon from '@mui/icons-material/CheckCircle'; 
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'; // Für Budget-Info
import WcIcon from '@mui/icons-material/Wc'; // Guest icon

// NEU: Typ exportieren
export type WeddingSize = 'small' | 'medium' | 'large';

// --- NEU: Erweiterte Daten für Größenoptionen ---
interface SizeOptionDetails {
  id: WeddingSize;
  name: string;
  range: string;
  description: string;
  advantages: string[];
  challenges: string[];
  locations: string[];
  tip: string; // NEU: Spezifischer Tipp
  backgroundImage: string; // NEU: Hintergrundbild URL
}

const sizeDetails: Record<WeddingSize, SizeOptionDetails> = {
  small: {
    id: 'small',
    name: 'Klein & Intim',
    range: 'bis 50 Gäste',
    description: 'Eine gemütliche, persönliche Feier im engsten Kreis.',
    advantages: ['Persönlichere Atmosphäre', 'Geringere Kosten', 'Mehr hochwertige Location-Optionen', 'Mehr Zeit pro Gast'],
    challenges: ['Schwierige Gästeauswahl', 'Mögliche Enttäuschung bei Nicht-Eingeladenen'],
    locations: ['Restaurants (Nebenraum)', 'Kleine Weingüter', 'Boutique-Hotels', 'Eigener Garten'],
    tip: "Bei kleinen Hochzeiten könnt ihr in Qualität statt Quantität investieren. Wie wäre es mit einem besonderen Menü oder einer außergewöhnlichen Location?",
    backgroundImage: 'url("https://placehold.co/400x200/F5EBE0/3D3229?text=Gem%C3%BCtliches+Restaurant")'
  },
  medium: {
    id: 'medium',
    name: 'Mittelgroß & Ausgewogen',
    range: '51-100 Gäste',
    description: 'Die goldene Mitte: Genug Gäste für eine tolle Feier, aber noch überschaubar.',
    advantages: ['Gute Balance: Intimität & Party', 'Breitere Location-Auswahl', 'Gute Stimmung möglich'],
    challenges: ['Sitzordnung braucht Planung', 'Mittleres Budget nötig', 'Balance zwischen Gästegruppen'],
    locations: ['Landgasthöfe', 'Mittelgroße Eventlocations', 'Gemeindesäle', 'Restaurants (ganz)'],
    tip: "Eine gute Gästeliste ist hier entscheidend. Überlegt, ob ihr lieber mehr Gäste oder mehr Budget für andere Dinge (z.B. Deko, Musik) haben wollt.",
    backgroundImage: 'url("https://placehold.co/400x200/D5BDAF/3D3229?text=Landgasthof/Saal")'
  },
  large: {
    id: 'large',
    name: 'Groß & Festlich',
    range: '100+ Gäste',
    description: 'Eine rauschende Party mit allen Freunden und Verwandten.',
    advantages: ['Große Party-Atmosphäre', 'Platz für alle wichtigen Menschen', 'Beeindruckende Feier'],
    challenges: ['Höhere Kosten', 'Eingeschränkte Location-Wahl', 'Komplexere Logistik', 'Weniger Zeit pro Gast'],
    locations: ['Festsäle', 'Große Hotels (Ballsaal)', 'Event-Scheunen', 'Schlösser'],
    tip: "Logistik ist bei großen Hochzeiten das A und O. Plant Pufferzeiten ein und denkt über einen Wedding Planner nach, der euch unterstützt.",
    backgroundImage: 'url("https://placehold.co/400x200/B7A59B/3D3229?text=Gro%C3%9Fer+Festsaal")'
  }
};

// --- NEU: Budget-Schätzungsfunktion (vereinfacht) ---
const getBudgetEstimate = (guestCount: number) => {
  // Sehr grobe Schätzungen, können stark variieren!
  const cateringPerPerson = guestCount <= 75 ? 85 : 100; 
  const locationBase = 1500;
  const locationPerPerson = 20;
  const drinksPerPerson = 35;
  const decorationBase = 300;
  const decorationPerPerson = 10;

  const catering = guestCount * cateringPerPerson;
  const location = locationBase + guestCount * locationPerPerson;
  const drinks = guestCount * drinksPerPerson;
  const decoration = decorationBase + guestCount * decorationPerPerson;
  const total = catering + location + drinks + decoration;

  // Rückgabe als formatierte Strings für einfache Anzeige
  const format = (val: number) => val.toLocaleString('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 });
  
  return {
    catering: `ca. ${format(catering)}`,
    location: `ca. ${format(location)}`,
    drinks: `ca. ${format(drinks)}`,
    decoration: `ca. ${format(decoration)}`,
    total: `Gesamt ca. ${format(total)}`
  };
};

// --- Props Definition ---
interface SizeSelectorProps {
  value: WeddingSize | null; // Bestehende Prop für die Kategorie
  onChange: (newSizeCategory: WeddingSize | null, newCount: number) => void; // NEU: Signatur angepasst, um auch die Zahl zu akzeptieren
}

// --- Hauptkomponente ---
const SizeSelector: React.FC<SizeSelectorProps> = ({ value, onChange }) => {
  const theme = useTheme();
  const [exactGuestCount, setExactGuestCount] = useState<number>(75); // Startwert z.B. Mitte
  const [selectedCategory, setSelectedCategory] = useState<WeddingSize | null>(value); // Interner State für Auswahl

  // Effekt, um externen Wert zu synchronisieren
  useEffect(() => {
    setSelectedCategory(value);
    // Passende Gästezahl für externe Kategorie setzen (optional)
    if (value === 'small' && exactGuestCount > 50) setExactGuestCount(30);
    else if (value === 'medium' && (exactGuestCount <= 50 || exactGuestCount > 100)) setExactGuestCount(75);
    else if (value === 'large' && exactGuestCount <= 100) setExactGuestCount(120);
  }, [value]); // Neu: Abhängigkeit hinzugefügt

  // Slider-Änderung handhaben
  const handleSliderChange = (event: Event, newValue: number | number[]) => {
    const count = newValue as number;
    setExactGuestCount(count);

    // Kategorie basierend auf Slider bestimmen
    let newCategory: WeddingSize | null = null;
    if (count <= 50) newCategory = 'small';
    else if (count <= 100) newCategory = 'medium';
    else newCategory = 'large';

    // Internen State aktualisieren, falls Kategorie wechselt
    if (newCategory !== selectedCategory) {
      setSelectedCategory(newCategory);
    }
    
    // Externen Callback IMMER aufrufen mit aktueller Kategorie und Zahl
    onChange(newCategory, count); 
  };
  
  // Klick auf Accordion handhaben (setzt Kategorie und passende Slider-Zahl)
  const handleAccordionClick = (category: WeddingSize) => {
      setSelectedCategory(category);
      
      // Passende Zahl für die Mitte der Kategorie setzen und speichern
      let defaultCount = 75; // Standard für Medium
      if (category === 'small') defaultCount = 30;
      else if (category === 'large') defaultCount = 120;
      
      setExactGuestCount(defaultCount); // Internen Slider-State auch setzen
      
      // Externen Callback aufrufen mit Kategorie und passender Zahl
      onChange(category, defaultCount); 
  };

  // Budgetberechnung
  const budget = getBudgetEstimate(exactGuestCount);

  return (
    <Box sx={{ my: 2 }}>
      <Typography variant="h6" gutterBottom align="center" sx={{ mb: 3 }}>
        Wie groß möchtet ihr feiern?
      </Typography>

      {/* Accordions für Kategorien */}
      <Box sx={{ mb: 4 }}>
        {(Object.keys(sizeDetails) as WeddingSize[]).map((key) => {
          const details = sizeDetails[key];
          const isSelected = selectedCategory === key;
          
          return (
            <Accordion 
              key={key} 
              expanded={isSelected} 
              onChange={() => handleAccordionClick(key)} // Klick setzt Kategorie
              sx={{ 
                 border: isSelected ? 2 : 1, 
                 borderColor: isSelected ? 'primary.main' : 'divider',
                 '&.Mui-expanded': { // Wichtig, um margin bei Expansion zu steuern
                     margin: '8px 0 !important' 
                 },
                 '&:before': { // Standard-Linie entfernen
                    display: 'none',
                 }
              }}
            >
              <AccordionSummary 
                expandIcon={<ExpandMoreIcon />}
                aria-controls={`${key}-content`}
                id={`${key}-header`}
                sx={{ 
                    backgroundColor: isSelected ? lighten(theme.palette.primary.main, 0.9) : 'transparent',
                    flexDirection: 'row-reverse', // Icon nach links
                     '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
                        transform: 'rotate(180deg)',
                    },
                     '& .MuiAccordionSummary-content': {
                        marginLeft: theme.spacing(1), // Abstand zwischen Icon und Text
                    },
                }}
              >
                 <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                    <Box>
                         <Typography sx={{ fontWeight: isSelected ? 'bold' : 'normal' }}>{details.name}</Typography>
                         <Typography variant="caption" sx={{ color: 'text.secondary' }}>{details.range}</Typography>
                    </Box>
                    {isSelected && <CheckCircleIcon color="primary" sx={{ mr: 1 }} />}
                 </Box>
              </AccordionSummary>
              <AccordionDetails sx={{
                position: 'relative', // Für Overlay
                padding: 0, // Padding wird vom inneren Container übernommen
                backgroundImage: details.backgroundImage, // Hintergrundbild setzen
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                overflow: 'hidden', // Sicherstellen, dass nichts überläuft
                '&:before': { // Optional: Dunkleres Overlay für besseren Kontrast
                    content: '""',
                    position: 'absolute',
                    top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.1)', // Leicht dunkler
                    zIndex: 0
                }
              }}>
                <Box sx={{
                    position: 'relative', 
                    zIndex: 1, 
                    backgroundColor: 'rgba(255, 255, 255, 0.85)', // Weiß mit Transparenz 
                    p: 2, // Innenabstand für den Inhalt
                    borderRadius: 0 // Keine Rundung, füllt Details aus
                }}>
                    <Typography variant="body2" sx={{ mb: 2 }}>{details.description}</Typography>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" sx={{ color: 'success.dark' }}>Vorteile:</Typography>
                        <List dense disablePadding>
                          {details.advantages.map((adv, i) => <ListItem key={i} sx={{ py: 0.2 }}><ListItemText primary={`+ ${adv}`} primaryTypographyProps={{ variant: 'body2' }} /></ListItem>)}
                        </List>
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" sx={{ color: 'error.dark' }}>Herausforderungen:</Typography>
                         <List dense disablePadding>
                          {details.challenges.map((chal, i) => <ListItem key={i} sx={{ py: 0.2 }}><ListItemText primary={`- ${chal}`} primaryTypographyProps={{ variant: 'body2' }} /></ListItem>)}
                        </List>
                      </Grid>
                       <Grid item xs={12}>
                         <Typography variant="subtitle2" sx={{ color: 'info.dark' }}>Typische Locations:</Typography>
                         <Typography variant="body2">{details.locations.join(', ')}</Typography>
                       </Grid>
                    </Grid>
                </Box>
              </AccordionDetails>
            </Accordion>
          );
        })}
      </Box>
      
       {/* Exakter Gästezahl-Slider */}
      <Paper elevation={1} sx={{ p: 3, mb: 4 }}>
          <Typography variant="subtitle1" gutterBottom>Exakte Gästezahl wählen:</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, px: 1 }}>
             <Typography sx={{ whiteSpace: 'nowrap' }}>10</Typography>
             <Slider
                aria-label="Exakte Gästezahl"
                value={exactGuestCount}
                onChange={handleSliderChange}
                min={10}
                max={200}
                step={1}
                valueLabelDisplay="auto" 
              />
             <Typography sx={{ whiteSpace: 'nowrap' }}>200+</Typography>
          </Box>
          <Typography align="center" variant="body2" sx={{ mt: 1, fontWeight: 'medium' }}>
              Gewählt: {exactGuestCount} Gäste ({selectedCategory})
          </Typography>
      </Paper>

       {/* Budget-Schätzung */}
       <Paper elevation={1} sx={{ p: 3, mb: 4, backgroundColor: lighten(theme.palette.secondary.light, 0.8) }}>
          <Box sx={{display: 'flex', alignItems: 'center', mb: 1}}>
            <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>Budget-Vorschau für {exactGuestCount} Gäste</Typography>
            <Tooltip title="Dies sind grobe Schätzungen und können stark variieren!" placement="top" arrow>
               <InfoOutlinedIcon fontSize='small' sx={{ ml: 1, color: 'text.secondary', cursor: 'help' }} />
            </Tooltip>
          </Box>
          <Grid container spacing={1} sx={{ fontSize: '0.9rem' }}>
             <Grid item xs={6}><Typography variant="body2">Catering:</Typography></Grid>
             <Grid item xs={6}><Typography variant="body2" align="right">{budget.catering}</Typography></Grid>
             <Grid item xs={6}><Typography variant="body2">Location:</Typography></Grid>
             <Grid item xs={6}><Typography variant="body2" align="right">{budget.location}</Typography></Grid>
             <Grid item xs={6}><Typography variant="body2">Getränke:</Typography></Grid>
             <Grid item xs={6}><Typography variant="body2" align="right">{budget.drinks}</Typography></Grid>
             <Grid item xs={6}><Typography variant="body2">Deko/Sonstiges:</Typography></Grid>
             <Grid item xs={6}><Typography variant="body2" align="right">{budget.decoration}</Typography></Grid>
             <Grid item xs={12}><Divider sx={{ my: 0.5 }} /></Grid>
             <Grid item xs={6}><Typography variant="body2" sx={{ fontWeight: 'bold' }}>Gesamt:</Typography></Grid>
             <Grid item xs={6}><Typography variant="body2" align="right" sx={{ fontWeight: 'bold' }}>{budget.total}</Typography></Grid>
          </Grid>
       </Paper>

       {/* Spezifischer Tipp */}
       {selectedCategory && (
          <Paper elevation={1} sx={{ p: 2, backgroundColor: lighten(theme.palette.info.light, 0.8) }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', mb: 0.5 }}>Tipp für "{sizeDetails[selectedCategory].name}":</Typography>
              <Typography variant="body2">{sizeDetails[selectedCategory].tip}</Typography>
          </Paper>
       )}

    </Box>
  );
};

export default SizeSelector; 