import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Container, 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText, 
  Divider, 
  Button, 
  ListItemButton, 
  Grid, 
  TextField, 
  CircularProgress, 
  Alert,
  Paper
} from '@mui/material';
import { Link as RouterLink, useParams } from 'react-router-dom';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'; // Icon für CTA
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank'; // Für Checkliste
import CheckBoxIcon from '@mui/icons-material/CheckBox'; // Für Checkliste
import DownloadIcon from '@mui/icons-material/Download'; // Import für Download-Button
import TipsAndUpdatesIcon from '@mui/icons-material/TipsAndUpdates'; // Import für Tipps
import LightbulbIcon from '@mui/icons-material/Lightbulb'; // Import für Bonus-Hacks
import LocationCityIcon from '@mui/icons-material/LocationCity'; // Beispiel-Icon für Location

// Firebase imports für Cloud Function
import { getFunctions, httpsCallable } from "firebase/functions";

// Beispiel-Checklistendaten (später dynamisch oder aus CMS)
const checklistItems = {
  '12-18 Monate vorher': [
    'Budget festlegen',
    'Gästeliste erstellen (Entwurf)',
    'Hochzeitsdatum & -ort wählen',
    'Wichtige Dienstleister buchen (Location, Fotograf, Catering)',
  ],
  '9-11 Monate vorher': [
    'Hochzeitskleid/Anzug auswählen',
    'Save-the-Date Karten versenden',
    'Musik auswählen (Band/DJ)',
    'Trauzeugen auswählen',
  ],
  '6-8 Monate vorher': [
    'Einladungen gestalten & bestellen',
    'Hochzeitstorte auswählen & bestellen',
    'Eheringe aussuchen',
    'Flitterwochen planen & buchen',
  ],
  // ... weitere Kategorien ...
};

// --- Budget Daten & Tipps --- 
const budgetTips = [
  { title: "Prioritäten­liste anlegen", text: "Definiert gemeinsam, was euch am wichtigsten ist: Location, Fotos, Essen, Stimmung? Gebt diesen 2–3 Punkten bewusst den größten Budget­anteil und spart an Positionen, die euch weniger bedeuten." },
  { title: "Realistischen Gesamt­rahmen festsetzen", text: "Ermittelt zuerst, wie viel ihr insgesamt ausgeben könnt oder möchtet – erst danach verteilt ihr die Summe auf Kategorien. So verhindert ihr, dass sich Einzel­posten heimlich addieren." },
  { title: "Puffer von 5–10 % einplanen", text: "Preis­steigerungen, spontane Ideen, Korkgeld … kleine Kostenfallen kommen immer. Ein fester Puffer erspart Stress und Nachfinanzierung." },
  { title: "Früh buchen = sparen", text: "Viele Locations & Dienstleister bieten Frühbucher­rabatte oder halten ihre Preise konstant, d. h. wer 12–18 Monate vorher fixiert, sichert sich oft den aktuellen Tarif." },
  { title: "Nebensaison & Wochentage prüfen", text: "Freitag oder Sonntag statt Samstag, April statt Juni: Selbst Top‑Locations sind dann günstiger oder bieten Zusatz­leistungen inklusive." },
  { title: "Pakete vs. Einzel­leistungen vergleichen", text: "„All‑inclusive“-Pakete klingen teuer, beinhalten aber oft Dinge, die ihr sonst separat buchen (und doppelt zahlen) würdet. Rechnet beides durch." },
  { title: "Verhandeln – aber fair und früh", text: "Dienstleister kalkulieren Spielräume ein. Fragt freundlich nach Kombi‑Rabatten (z. B. Foto + Video) oder kostenfreien Upgrades – nicht am Tag vor Vertrags­schluss, sondern gleich beim ersten Gespräch." },
  { title: "Eigen­leistung clever einsetzen", text: "DIY‑Deko, Spotify‑Playlists oder selbst gebackene Gast­geschenke sparen Geld – aber nur, wenn ihr Zeit, Talent und Helfer habt. Kalkuliert Material‑ und Stress­kosten ehrlich." },
  { title: "Alle Zahlungen & Deadlines tracken", text: "Hinterlegt in der Budget­vorlage Fälligkeit und Überweisungs­status. WILMA oder ein Kalender erinnert euch an Zahlungen – so vermeidet ihr Mahn­gebühren und Zins­kosten bei verspäteten Rest­zahlungen." },
  { title: "Nach der Hochzeit Bilanz ziehen", text: "Tragt die tatsächlichen Kosten ein, behaltet Rechnungen und Verträge. Gut für den Überblick – und hilfreich für Freunde, die als Nächstes heiraten (oder für euer zweites Fest zum Jubiläum 😉)." }
];
const bonusHacks = [
  "Cashback & Bonuspunkte: Bezahlt größere Posten...",
  "Versteckte Nebenkosten checken: Service­gebühren...",
  "Gemeinsam mit anderen Paaren einkaufen: Deko‑Artikel...",
  "Digitale Einladungen: Spart Porto & Papier..."
];
// ---------------------------

// --- Location Finder Guide Daten ---
const locationGuideSteps = [
  { nr: 1, title: "Vision klarziehen", text: "Stellt euch zuerst euren Tag bildlich vor: Elegant im Palais? Boho‑Scheune? Rooftop City‑Vibes? Schreibt 3 Schlag­wörter (Stil, Stimmung, Setting) auf – sie filtern alles Weitere." },
  { nr: 2, title: "Gästezahl definieren", text: "Grobe Liste erstellen, +10 % Sicherheits­puffer. Sucht nur Locations, deren Komfort­kapazität zu eurer Zahl passt – nicht nur maximal, sondern bei Regen & Dinner (!)." },
  { nr: 3, title: "Budget­rahmen festlegen", text: "Rechnet Location­miete + Pflicht­catering + Getränke­pauschale zusammen. Prüft auch versteckte Kosten: End­reinigung, Technik, Strom, Kork­geld, Verlängerung nach 0 Uhr, Auf‑ & Abbau." },
  { nr: 4, title: "Saison & Wetter bedenken", text: "Lieblings­monat ausgebucht oder teuer? Off‑Season (Jan–März, Nov) spart Geld. Bei Outdoor‑Trauung immer Plan B: überdachter Bereich, Zelt, Saal." },
  { nr: 5, title: "Region & Erreich­barkeit", text: "80 % eurer Gäste aus einer Gegend? Spart Anfahrts­stress. Prüft Parkplätze, ÖPNV, Hotels in Lauf­weite. Bei Destination‑Wedding: Shuttles/Kontingente organisieren." },
  { nr: 6, title: "Besichtigung immer live", text: "Macht Fotos & Videos aus eurer Perspektive. Achtet auf Licht­verhältnisse (Foto!), Wege (Toiletten, Bar, Tanz­fläche), Raum­akustik und Barriere­freiheit." },
  { nr: 7, title: "Fragen‑Checkliste nutzen", text: "Muss geklärt sein: • Exklusive Nutzung? • Eigener Caterer erlaubt? • Sperr­stunde & Dezibel‑Limit? • Möblierung im Preis? • Auf‑/Abbau­zeiten? • Freie Trauung draußen gestattet? • Backup bei Regen?" },
  { nr: 8, title: "Dienstleister‑Vorgaben prüfen", text: "Viele Häuser haben Preferred Vendors (Catering, Technik). Fragt nach Preis­listen & Kork­geld. Eigene Partner können Mehrkosten oder Aufschläge auslösen – früh klären!" },
  { nr: 9, title: "Vertrag & Optionen sichern", text: "Favorit gefunden? Optionieren lassen (7–14 Tage) – genug Zeit für Budget & Eltern‑Check. Bei Buchung nach Extras suchen: Sekt­empfang, Suites, Bühnen­licht. Alles schriftlich fixieren, inklusive Zeit­plan & Zahlungs­etappen." },
  { nr: 10, title: "Gesamt­erlebnis testen", text: "Stellt euch einmal den Flow durch: Empfang → Zeremonie → Dinner → Party. Gibt es Um­bau‑Pausen? Genug Platz für Tanz & Candy‑Bar? Kurze Wege bedeuten relaxed feiern – das spürt ihr schon beim Rundgang." }
];
const locationHelperTools = [
  "Location‑Vergleichs‑Tabelle: Nutzt die kostenlose Excel‑/Sheets‑Vorlage von WILMA (Spalten: Kriterien, 5 Favoriten, Ranking). Vergleicht objektiv: Kosten, Kapazität, Stil‑Match, Plan‑B, Extras.",
  "Entscheidungs‑Score: Gebt jeder Location pro Kriterium 1–5 Punkte → WILMA addiert automatisch & zeigt den Gewinner.",
  "Foto‑Moodboard: Macht bei jeder Besichtigung 5 Schlüssel‑Fotos (Eingang, Zeremonie‑Spot, Dinner‑Raum, Dancefloor, Außen). Ladet sie in WILMA hoch – der Vergleich wird visuell.",
  "Route‑Planer für Gäste: In WILMA könnt ihr Entfernung zur Kirche, zu Hotels oder zur After‑Party hinterlegen – die App schlägt automatisch Shuttle‑Zeiten vor.",
  "Regeln & Deadlines: WILMA erinnert euch 7 Tage vor Options‑Ablauf und 3 Tage vor Anzahlung, damit euch keiner den Traum‑Ort wegschnappt."
];
// ---------------------------

type ChecklistCategory = keyof typeof checklistItems;

const ThematicLandingPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();

  // State für die Checkliste (nur wenn Checklisten-Slug aktiv ist)
  const [checkedTasks, setCheckedTasks] = useState<Record<string, Set<string>>>({});

  // State für E-Mail Formular (nur im Budget-Kontext)
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isSubmittingEmail, setIsSubmittingEmail] = useState(false);
  const [showDownload, setShowDownload] = useState(false); // Steuert Anzeige des Download-Buttons

  // Handler für Checkliste
  const handleToggleCheck = (category: ChecklistCategory, task: string) => {
    if (slug !== 'hochzeitsplanung-checkliste') return; // Nur für Checkliste aktiv
    setCheckedTasks(prev => {
      const newChecked = { ...prev };
      const categoryChecked = new Set(newChecked[category] || []);
      if (categoryChecked.has(task)) {
        categoryChecked.delete(task);
      } else {
        categoryChecked.add(task);
      }
      newChecked[category] = categoryChecked;
      return newChecked;
    });
  };

  // Handler für E-Mail-Submit
  const handleEmailSubmit = async () => {
    console.log("Versuche Cloud Function aufzurufen..."); // DEBUG
    setIsSubmittingEmail(true);
    try {
      const functions = getFunctions(); // Firebase Functions Instanz holen
      const subscribeToNewsletter = httpsCallable(functions, 'subscribeToNewsletter');
      
      // Daten an die Callable Function senden
      const result = await subscribeToNewsletter({ email: email });

      // Erfolg!
      // @ts-ignore // Zugriff auf 'data', da Typ von result nicht spezifisch ist
      console.log("Cloud Function erfolgreich aufgerufen. Antwort:", result.data); // DEBUG
      setShowDownload(true);

    } catch (error: any) {
      // Fehler von httpsCallable (oft HttpsError)
      console.error("Fehler beim Aufruf der subscribeToNewsletter Cloud Function:", error);
      // Versuche, eine spezifischere Fehlermeldung zu geben
      const message = error?.details?.message || "Ein Fehler ist aufgetreten. Bitte versuchen Sie es später erneut.";
      setEmailError(message);
    } finally {
      setIsSubmittingEmail(false);
    }
  };

  // === Checklisten-Inhalt rendern ===
  if (slug === 'hochzeitsplanung-checkliste') {
    return (
      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
        <Typography variant="h2" component="h1" align="center" gutterBottom sx={{ fontWeight: 600, mb: 4 }}>
          Die ultimative Hochzeits-Checkliste
        </Typography>
        <Typography variant="h6" component="p" align="center" color="text.secondary" paragraph sx={{ mb: 6 }}>
          Von 18 Monaten bis zum großen Tag – behalte mit dieser detaillierten Checkliste jeden Schritt im Blick. 
          Hake die Punkte hier ab oder verwalte sie digital mit WILMA!
        </Typography>

        {/* Checkliste */}
        {Object.keys(checklistItems).map((category) => (
          <Box key={category} sx={{ mb: 4 }}>
            <Typography variant="h5" component="h3" gutterBottom sx={{ fontWeight: 500 }}>
              {category}
            </Typography>
            <List sx={{ bgcolor: 'background.paper', borderRadius: 1 }}>
              {(checklistItems[category as ChecklistCategory]).map((item, index) => {
                const isChecked = checkedTasks[category as ChecklistCategory]?.has(item) ?? false;
                return (
                  <React.Fragment key={item}> 
                    <ListItemButton onClick={() => handleToggleCheck(category as ChecklistCategory, item)} sx={{ pl: 0 }}>
                      <ListItemIcon sx={{ minWidth: 40 }}>
                        {isChecked ? 
                          <CheckBoxIcon color="primary" /> : 
                          <CheckBoxOutlineBlankIcon sx={{ color: 'text.secondary'}} />
                        }
                      </ListItemIcon>
                      <ListItemText 
                        primary={item} 
                        sx={{ textDecoration: isChecked ? 'line-through' : 'none', color: isChecked ? 'text.disabled' : 'inherit'}}
                      />
                    </ListItemButton>
                    {index < checklistItems[category as ChecklistCategory].length - 1 && <Divider component="li" variant="inset"/>}
                  </React.Fragment>
                );
              })}
            </List>
          </Box>
        ))}

        {/* Call to Action Sektion */}
        <Box 
          sx={{ 
            mt: 8, 
            p: 4, 
            bgcolor: 'secondary.light', // Auffällige Hintergrundfarbe
            color: 'secondary.contrastText', // Passende Textfarbe
            borderRadius: 2, 
            textAlign: 'center' 
          }}
        >
          <Typography variant="h4" component="p" gutterBottom sx={{ fontWeight: 600 }}>
            Bereit, deine Planung zu digitalisieren?
          </Typography>
          <Typography variant="body1" paragraph sx={{ mb: 3 }}>
            Verwalte diese Checkliste, dein Budget, deine Gäste und kommuniziere mit deiner persönlichen KI – alles in WILMA.
          </Typography>
          <Button 
            variant="contained" 
            color="primary" // Primärfarbe für den Button hier
            size="large"
            component={RouterLink}
            to="/register"
            startIcon={<CheckCircleOutlineIcon />}
            sx={{ py: 1.5, px: 5, fontSize: '1.1rem' }}
          >
            Jetzt kostenlos bei WILMA anmelden
          </Button>
        </Box>
      </Container>
    );
  }

  // === Budget-Inhalt rendern ===
  else if (slug === 'hochzeitsbudget-rechner') {
    return (
      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
        <Typography variant="h2" component="h1" align="center" gutterBottom sx={{ fontWeight: 600, mb: 4 }}>
          Hochzeitsbudget leicht gemacht
        </Typography>
        <Typography variant="h6" component="p" align="center" color="text.secondary" paragraph sx={{ mb: 6 }}>
          Plane deine Ausgaben clever und behalte die Kosten im Griff – mit unserer Vorlage und praktischen Tipps.
        </Typography>

        {/* Download Box - Jetzt mit E-Mail Formular */}
        <Paper elevation={2} sx={{ p: 3, mb: 6, textAlign: 'center', bgcolor: 'grey.100' }}>
          <Typography variant="h5" component="h3" gutterBottom>
            Deine Budgetplanungsvorlage für WILMA
          </Typography>
          
          {!showDownload ? (
            <Box component="form" noValidate autoComplete="off" onSubmit={(e) => { e.preventDefault(); handleEmailSubmit(); }}>
              <Typography variant="body1" paragraph color="text.secondary">
                Trage deine E-Mail-Adresse ein, um die kostenlose Excel-Vorlage herunterzuladen.
              </Typography>
              <TextField
                label="E-Mail Adresse"
                variant="outlined"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={!!emailError}
                helperText={emailError}
                disabled={isSubmittingEmail}
                required
                fullWidth
                sx={{ mb: 2, maxWidth: 400, mx: 'auto' }} // Zentriert und begrenzt Breite
              />
              <Button 
                type="submit" // Wichtig für Formular-Handling (Enter-Taste)
                variant="contained" 
                disabled={isSubmittingEmail}
                startIcon={isSubmittingEmail ? <CircularProgress size={20} color="inherit" /> : <DownloadIcon />}
                sx={{ mt: 1 }}
              >
                {isSubmittingEmail ? 'Wird gesendet...' : 'Vorlage erhalten'}
              </Button>
            </Box>
          ) : (
            <Box>
              <Alert severity="success" sx={{ mb: 2, justifyContent: 'center' }}>
                Vielen Dank! Dein Download ist jetzt verfügbar.
              </Alert>
              <Button 
                variant="contained" 
                startIcon={<DownloadIcon />} 
                href="/WILMA_Budgetplanung_Vorlage.xlsx"
                download
                sx={{ mt: 1 }}
              >
                WILMA_Budgetplanung_Vorlage.xlsx herunterladen
              </Button>
            </Box>
          )}
        </Paper>

        {/* Erklärung der Tabelle */}
        <Typography variant="h4" component="h2" gutterBottom sx={{ mt: 6, mb: 3 }}>
          So ist die Tabelle aufgebaut
        </Typography>
        {/* Hier könnte eine kleine Beispiel-Tabelle oder eine Liste hin */}
        <List dense>
          <ListItem><ListItemText primary="Kategorie: 14 typische Kostenblöcke (Location, Catering … inkl. Puffer)" /></ListItem>
          <ListItem><ListItemText primary="Budget (€): Dein geplanter Richtwert pro Kategorie" /></ListItem>
          <ListItem><ListItemText primary="Angebot / Quote (€): Kosten laut Angebot des Dienstleisters" /></ListItem>
          <ListItem><ListItemText primary="Einzahlung / Deposit (€): bereits gezahlte Anzahlung" /></ListItem>
          <ListItem><ListItemText primary="Restzahlung (€): automatisch kalkulierbar oder manuell eintragen" /></ListItem>
          <ListItem><ListItemText primary="Tatsächliche Kosten (€): Endbetrag nach der Hochzeit" /></ListItem>
          <ListItem><ListItemText primary="Notizen: Platz für Liefertermine, Ansprechpartner, Fristen" /></ListItem>
        </List>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 4 }}>
          Am Ende summieren Formeln (Zeile "GESAMT") alle Beträge aus den Spalten B–F.
        </Typography>
        <Typography variant="body1" paragraph>
          Tipp: Lade die Datei in Google Sheets hoch, um sie gemeinsam mit deiner/m Partner:in oder Trauzeug:innen live zu bearbeiten – oder importiere die Werte direkt in WILMA, damit die App dich automatisch erinnert, wenn sich dein Budget ändert.
        </Typography>

        {/* Budget Tipps */}
        <Typography variant="h4" component="h2" gutterBottom sx={{ mt: 6, mb: 3 }}>
          10 praktische Tipps für deine Budgetplanung
        </Typography>
        <Grid 
          container 
          spacing={3} 
          alignItems="stretch" 
          sx={{ display: 'flex', flexWrap: 'wrap' }}
        >
          {budgetTips.map((tip, index) => (
            // @ts-ignore - Linter erkennt 'item'-Prop hier fälschlicherweise nicht
            <Grid item xs={12} md={6} key={index} sx={{ display: 'flex' }}>
              <Paper elevation={1} sx={{ 
                  p: 2, 
                  display: 'flex', 
                  alignItems: 'flex-start', 
                  width: '100%',
                  height: '100%'
              }}>
                <Typography variant="h5" component="span" color="secondary.main" sx={{ mr: 2, fontWeight: 600 }}>{index + 1}</Typography>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" component="h3" sx={{ fontWeight: 500 }}>{tip.title}</Typography>
                  <Typography variant="body2" color="text.secondary">{tip.text}</Typography>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>

        {/* Bonus Hacks */}
        <Typography variant="h4" component="h2" gutterBottom sx={{ mt: 6, mb: 3 }}>
          Bonus-Hacks
        </Typography>
        <List dense>
          {bonusHacks.map((hack, index) => (
            <ListItem key={index}>
              <ListItemIcon sx={{ minWidth: 32 }}>
                <LightbulbIcon fontSize="small" color="warning"/>
              </ListItemIcon>
              <ListItemText primary={hack} />
            </ListItem>
          ))}
        </List>

        {/* Abschluss */}
        <Typography variant="body1" paragraph sx={{ mt: 6 }}>
          Setzt ihr diese Tipps konsequent um, bleibt euer Budget nicht nur im Rahmen – ihr schafft euch auch mentalen Freiraum, um das zu genießen, was wirklich zählt: Vorfreude auf euren Tag!
        </Typography>
        <Typography variant="h6" component="p" align="center" sx={{ mt: 4, fontWeight: 600 }}>
          WILMA plant.&nbsp;Du&nbsp;liebst.
        </Typography>

        {/* Optional: CTA wie auf der Checklisten-Seite */}

      </Container>
    );
  }

  // === Location Finder Inhalt rendern ===
  else if (slug === 'hochzeitslocation-finder') {
    return (
      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
        <Typography variant="h2" component="h1" align="center" gutterBottom sx={{ fontWeight: 600, mb: 4 }}>
          10‑Schritt‑Guide: So findet ihr die perfekte Hochzeits­location
        </Typography>
        <Typography variant="h6" component="p" align="center" color="text.secondary" paragraph sx={{ mb: 6 }}>
          Mit System zur Traumlocation: Dieser Guide führt euch sicher durch den Prozess – von der ersten Vision bis zur Buchung.
        </Typography>

        {/* 10 Steps List */}
        <Grid container spacing={4} sx={{ mb: 6 }}>
          {locationGuideSteps.map((step) => (
            // @ts-ignore - Linter erkennt 'item'-Prop hier fälschlicherweise nicht
            <Grid item xs={12} md={6} key={step.nr} sx={{ display: 'flex' }}>
               <Paper elevation={1} sx={{ p: 2.5, display: 'flex', alignItems: 'flex-start', width: '100%', height: '100%' }}>
                <Typography variant="h4" component="span" color="primary.main" sx={{ mr: 2.5, fontWeight: 700 }}>{step.nr}</Typography>
                <Box>
                  <Typography variant="h6" component="h3" sx={{ fontWeight: 500 }}>{step.title}</Typography>
                  <Typography variant="body2" color="text.secondary">{step.text}</Typography>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>

        {/* --- NEUER CTA für detaillierte Anfrage --- */}
        <Box 
          sx={{ 
            my: 8, // Mehr vertikaler Abstand
            p: { xs: 3, md: 4 }, 
            bgcolor: 'secondary.light', // Auffällige Hintergrundfarbe
            color: 'secondary.contrastText', // Passende Textfarbe
            borderRadius: 2, 
            textAlign: 'center' 
          }}
        >
          <Typography variant="h4" component="p" gutterBottom sx={{ fontWeight: 600 }}>
            Benötigt ihr persönliche Unterstützung?
          </Typography>
          <Typography variant="body1" paragraph sx={{ mb: 3 }}>
            Füllt unser detailliertes Formular aus, beschreibt eure Wünsche, und erhaltet eine individuelle Zusammenfassung als PDF per E-Mail – kostenlos!
          </Typography>
          <Button 
            variant="contained" 
            color="primary" // Primärfarbe für den Button hier
            size="large"
            component={RouterLink}
            to="/location-anfrage" // Link zur neuen Seite
            startIcon={<CheckCircleOutlineIcon />} // Oder ein passenderes Icon, z.B. SendIcon
            sx={{ py: 1.5, px: 5, fontSize: '1.1rem' }}
          >
            Jetzt Details zur Location-Anfrage senden
          </Button>
        </Box>
        {/* --- Ende NEUER CTA --- */}

        {/* Hilfreiche Werkzeuge (Bonus) */}
        <Typography variant="h4" component="h2" gutterBottom sx={{ mt: 6, mb: 3 }}>
          Hilfreiche Werkzeuge von WILMA
        </Typography>
        <List dense>
          {locationHelperTools.map((tool, index) => (
            <ListItem key={index}>
              <ListItemIcon sx={{ minWidth: 32 }}>
                <TipsAndUpdatesIcon fontSize="small" color="success"/>
              </ListItemIcon>
              <ListItemText primary={tool} />
            </ListItem>
          ))}
        </List>

        {/* Abschluss */}
        <Typography variant="body1" paragraph sx={{ mt: 6 }}>
          Merke: Erst wenn Vision, Gäste­anzahl und Budget harmonieren, wird die Location Liebe auf den ersten Blick. WILMA plant. Du liebst. Viel Erfolg bei der Suche!
        </Typography>

        {/* Optional: CTA wie auf der Checklisten-Seite */}
        <Box 
            sx={{ mt: 6, p: 4, bgcolor: 'secondary.light', color: 'secondary.contrastText', borderRadius: 2, textAlign: 'center' }}
          >
            <Typography variant="h4" component="p" gutterBottom sx={{ fontWeight: 600 }}>
              Bereit, deine Traumlocation zu finden?
            </Typography>
            <Typography variant="body1" paragraph sx={{ mb: 3 }}>
              Nutze WILMA, um deine Suche zu organisieren, Favoriten zu speichern und mit Dienstleistern zu kommunizieren.
            </Typography>
            <Button 
              variant="contained" color="primary" size="large" component={RouterLink} to="/register"
              startIcon={<LocationCityIcon />}
              sx={{ py: 1.5, px: 5, fontSize: '1.1rem' }}
            >
              Jetzt mit WILMA starten
            </Button>
        </Box>
      </Container>
    );
  }

  // === Fallback für andere/unbekannte Slugs ===
  // ... unverändert ...

  // Prüfen, ob es die Checklisten-Seite ist
  if (slug !== 'hochzeitsplanung-checkliste') {
    // Optional: Weiterleitung zu einer 404-Seite oder Ressourcen-Übersicht
    // Fürs Erste zeigen wir eine einfache Meldung oder leiten zur Hauptseite um
    // return <Navigate to="/ressourcen" replace />;
    return (
      <Container sx={{ py: 4 }}>
        <Typography variant="h5">Ressource nicht gefunden.</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}>
      <Typography variant="h2" component="h1" align="center" gutterBottom sx={{ fontWeight: 600, mb: 4 }}>
        Die ultimative Hochzeits-Checkliste
      </Typography>
      <Typography variant="h6" component="p" align="center" color="text.secondary" paragraph sx={{ mb: 6 }}>
        Von 18 Monaten bis zum großen Tag – behalte mit dieser detaillierten Checkliste jeden Schritt im Blick. 
        Hake die Punkte hier ab oder verwalte sie digital mit WILMA!
      </Typography>

      {/* Checkliste */}
      {Object.keys(checklistItems).map((category) => (
        <Box key={category} sx={{ mb: 4 }}>
          <Typography variant="h5" component="h3" gutterBottom sx={{ fontWeight: 500 }}>
            {category}
          </Typography>
          <List sx={{ bgcolor: 'background.paper', borderRadius: 1 }}>
            {(checklistItems[category as ChecklistCategory]).map((item, index) => {
              const isChecked = checkedTasks[category as ChecklistCategory]?.has(item) ?? false;
              return (
                <React.Fragment key={item}> 
                  <ListItemButton onClick={() => handleToggleCheck(category as ChecklistCategory, item)} sx={{ pl: 0 }}>
                    <ListItemIcon sx={{ minWidth: 40 }}>
                      {isChecked ? 
                        <CheckBoxIcon color="primary" /> : 
                        <CheckBoxOutlineBlankIcon sx={{ color: 'text.secondary'}} />
                      }
                    </ListItemIcon>
                    <ListItemText 
                      primary={item} 
                      sx={{ textDecoration: isChecked ? 'line-through' : 'none', color: isChecked ? 'text.disabled' : 'inherit'}}
                    />
                  </ListItemButton>
                  {index < checklistItems[category as ChecklistCategory].length - 1 && <Divider component="li" variant="inset"/>}
                </React.Fragment>
              );
            })}
          </List>
        </Box>
      ))}

      {/* Call to Action Sektion */}
      <Box 
        sx={{ 
          mt: 8, 
          p: 4, 
          bgcolor: 'secondary.light', // Auffällige Hintergrundfarbe
          color: 'secondary.contrastText', // Passende Textfarbe
          borderRadius: 2, 
          textAlign: 'center' 
        }}
      >
        <Typography variant="h4" component="p" gutterBottom sx={{ fontWeight: 600 }}>
          Bereit, deine Planung zu digitalisieren?
        </Typography>
        <Typography variant="body1" paragraph sx={{ mb: 3 }}>
          Verwalte diese Checkliste, dein Budget, deine Gäste und kommuniziere mit deiner persönlichen KI – alles in WILMA.
        </Typography>
        <Button 
          variant="contained" 
          color="primary" // Primärfarbe für den Button hier
          size="large"
          component={RouterLink}
          to="/register"
          startIcon={<CheckCircleOutlineIcon />}
          sx={{ py: 1.5, px: 5, fontSize: '1.1rem' }}
        >
          Jetzt kostenlos bei WILMA anmelden
        </Button>
      </Box>
    </Container>
  );
};

export default ThematicLandingPage; 