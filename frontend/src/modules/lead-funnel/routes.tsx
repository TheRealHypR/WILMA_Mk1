import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Routes, Route } from 'react-router-dom';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import 'dayjs/locale/de';
import { Dayjs } from 'dayjs';
import { Box, Button, Typography, Stepper, Step, StepLabel, CircularProgress, Collapse, List, ListItem, ListItemText, Divider, Chip, Card, Paper, Tooltip, LinearProgress } from '@mui/material';
import ReactConfetti from 'react-confetti';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import duration from 'dayjs/plugin/duration';
import isBetween from 'dayjs/plugin/isBetween';
import { getFunctions, httpsCallable } from "firebase/functions";
import { useSnackbar } from '../../contexts/SnackbarContext';

// Importiere die Eingabe-Komponenten
import DatePickerComponent, { getDateInsights } from './components/timeline-generator/DatePickerComponent';
import SizeSelector, { WeddingSize } from './components/timeline-generator/SizeSelector';
import StyleSelector, { styles as weddingStylesData, StyleInfo } from './components/timeline-generator/StyleSelector';
import EmailCaptureForm from './components/timeline-generator/EmailCaptureForm';
import SpecialDateSuggestions from './components/timeline-generator/SpecialDateSuggestions';

// Icons für Timeline Preview (nicht mehr verwendet in diesem Scope)
// import EventIcon from '@mui/icons-material/Event';
// import PeopleIcon from '@mui/icons-material/People';
// import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
// import PaletteIcon from '@mui/icons-material/Palette';
// import LocationOnIcon from '@mui/icons-material/LocationOn';
// import TaskIcon from '@mui/icons-material/Task'; // Fallback Icon

// Importiere das neue Layout
import FunnelLayout from './components/layout/FunnelLayout';

dayjs.extend(relativeTime);
dayjs.extend(duration);
dayjs.extend(isBetween);
dayjs.locale('de');

// --- TypeScript Interface für Timeline Items ---
interface TimelineItem {
  id: number; // Zurück zu number ID
  title: string;
  dueDate: string; 
  category: 'date' | 'guest' | 'budget' | 'style' | 'location' | 'other'; 
  description?: string; 
}

// --- Typdefinitionen ---
// FormData ohne planningChallenge
interface FormData {
    weddingDate: Dayjs | null;
    guestSize: WeddingSize | null;
    guestCount: number; 
    weddingStyle: string | null;
    email: string;
}

// GamificationData Interface (erneut hinzufügen)
interface GamificationData {
    points: number;
    achievements: string[];
    pointsAnimationTrigger: number; 
}

// Enum FunnelStep beibehalten
enum FunnelStep {
    Date,
    Size,
    Style,
    Email,
    Success,
}

// --- Beispiel-Generator-Funktion ---
const generateTimelineItems = (formData: FormData): TimelineItem[] => {
  const items: TimelineItem[] = [];
  const weddingDate = formData.weddingDate;

  if (!weddingDate) return items;

  let taskId = 0;

  // Helper zum Berechnen relativer Daten (sehr vereinfacht)
  const getDateMinusMonths = (months: number) => weddingDate.subtract(months, 'month').format('DD.MM.YYYY');

  // Basis-Aufgaben
  items.push({ id: taskId++, title: 'Top Locations recherchieren', dueDate: getDateMinusMonths(11), category: 'location' });
  items.push({ id: taskId++, title: 'Vorläufige Gästeliste erstellen', dueDate: getDateMinusMonths(10), category: 'guest' });
  items.push({ id: taskId++, title: 'Budgetrahmen festlegen', dueDate: getDateMinusMonths(10), category: 'budget' });
  items.push({ id: taskId++, title: 'Location besichtigen & buchen', dueDate: getDateMinusMonths(9), category: 'location' });
  items.push({ id: taskId++, title: 'Catering-Optionen prüfen', dueDate: getDateMinusMonths(8), category: 'other' });

  // Bedingte Aufgaben
  if (formData.guestSize === 'large') {
    items.push({ id: taskId++, title: 'Save-the-Date Karten für große Runde planen', dueDate: getDateMinusMonths(8), category: 'guest' });
  }
  if (formData.weddingStyle === 'boho' || formData.weddingStyle === 'rustikal') {
    items.push({ id: taskId++, title: 'DIY Deko-Elemente recherchieren', dueDate: getDateMinusMonths(7), category: 'style' });
  }
  items.push({ id: taskId++, title: 'Fotograf*in anfragen/buchen', dueDate: getDateMinusMonths(7), category: 'other' });
  
  // Sortieren nach Fälligkeit (optional, aber sinnvoll)
  // Da wir die Daten als Strings haben, ist ein direkter Vergleich schwierig.
  // Für eine echte Sortierung bräuchten wir Dayjs-Objekte.
  // Vorerst lassen wir die Reihenfolge, wie sie hinzugefügt wurden.

  console.log(`Generated ${items.length} timeline items for ${weddingDate.format('DD.MM.YYYY')}, Size: ${formData.guestSize}, Style: ${formData.weddingStyle}`);
  return items;
};

// --- Hauptkomponente für den Single Page Funnel ---
const TimelineGeneratorPage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<FunnelStep>(FunnelStep.Date);
  const [isLoading, setIsLoading] = useState<boolean>(false); // Für Lade-/Animationszustand

  // Daten-State
  const [formData, setFormData] = useState<FormData>({
    weddingDate: null,
    guestSize: null,
    guestCount: 50,
    weddingStyle: null,
    email: '',
  });

  // Gamification-State
  const [gamification, setGamification] = useState<GamificationData>({
    points: 0,
    achievements: [],
    pointsAnimationTrigger: 0,
  });

  // Stelle sicher, dass error und setError hier definiert sind
  const [error, setError] = useState<string | null>(null);

  const [generatedTimeline, setGeneratedTimeline] = useState<TimelineItem[]>([]);

  // Fehlende States hinzufügen
  const [showConfetti, setShowConfetti] = useState<boolean>(false);
  const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });

  const steps = ['Datum', 'Größe', 'Stil', 'E-Mail'];
  const totalSteps = steps.length;

  const confettiTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const confettiSource = useRef<HTMLDivElement>(null);

  const { showSnackbar } = useSnackbar();

  // Effekt zum Erfassen der Fenstergröße (für Konfetti)
  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener('resize', handleResize);
    // Cleanup-Funktion
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // useEffect für Success Confetti anpassen (Abhängigkeit entfernen)
  useEffect(() => {
    if (currentStep === totalSteps) { // totalSteps ist 4 (Index des Success Steps)
      setShowConfetti(true); 
      const timer = setTimeout(() => {
        setShowConfetti(false); 
      }, 5000); 
      return () => clearTimeout(timer);
    } else {
        // Einfach sicherstellen, dass Konfetti aus ist, wenn nicht Success
        setShowConfetti(false);
    }
    // Abhängigkeit entfernt
  }, [currentStep, totalSteps]);

  // NEU: Effekt zum Setzen eines Standard-guestSize, wenn Schritt 1 erreicht wird
  useEffect(() => {
    if (currentStep === 1 && formData.guestSize === null) {
      setFormData((prev: FormData) => ({ ...prev, guestSize: 'medium' })); // Standardwert auf Englisch ändern
    }
  }, [currentStep, formData.guestSize]);

  // --- Handler für Datenänderungen ---
  const handleDateChange = (newDate: Dayjs | null) => {
    setFormData((prev: FormData) => ({ ...prev, weddingDate: newDate })); 
     if (newDate && error === "Bitte wähle ein gültiges Hochzeitsdatum.") {
       setError(null);
     }
  };

  const handleSizeChange = (newSize: WeddingSize | null, newCount: number) => {
    setFormData((prev: FormData) => ({ 
         ...prev,
         guestSize: newSize,
         guestCount: newCount,
     }));
     if (newSize && error === "Bitte wähle eine Hochzeitsgröße aus.") {
         setError(null);
     }
  };

  const handleStyleChange = (newStyle: string | null) => {
    setFormData((prev: FormData) => ({ ...prev, weddingStyle: newStyle })); 
     if (newStyle && error === "Bitte wähle einen Hochzeitsstil.") {
       setError(null);
     }
  };

  const handleEmailChange = (newEmail: string) => {
    setFormData((prev: FormData) => ({ ...prev, email: newEmail })); 
    if (error === "Bitte gib eine gültige E-Mail-Adresse ein.") {
       setError(null);
     }
  };

  // --- Animations- und Navigationslogik ---
  const triggerPointsAnimation = useCallback(() => {
    console.log("Triggering confetti");
    setShowConfetti(true);
    if (confettiTimeoutRef.current) {
      clearTimeout(confettiTimeoutRef.current);
    }
    confettiTimeoutRef.current = setTimeout(() => {
       console.log("Stopping confetti");
       setShowConfetti(false);
     }, 3000); // Konfetti nach 3 Sekunden stoppen
  }, []);

  // --- Navigationshandler ---
  const handleNext = () => {
    let pointsToAdd = 0;
    let canProceed = false;

    // Prüfen, ob der aktuelle Schritt valide ist und Punkte vergeben
    switch (currentStep) {
      case 0: // Von Datum zu Größe
        if (formData.weddingDate) {
          pointsToAdd = 10;
          canProceed = true;
        }
        break;
      case 1: // Von Größe zu Stil
        if (formData.guestSize) {
          pointsToAdd = 25;
          canProceed = true;
        }
        break;
      case 2: // Von Stil zu E-Mail
        if (formData.weddingStyle) {
          pointsToAdd = 25;
          canProceed = true;
        }
        break;
      default: // Sollte nicht passieren, aber zur Sicherheit
          canProceed = true; 
          break;
    }

    if (canProceed) {
      setGamification(prev => ({ ...prev, points: prev.points + pointsToAdd }));
      triggerPointsAnimation();
      setCurrentStep(prev => prev + 1); // Zum nächsten Schritt wechseln
    } else {
        // Optional: Feedback geben, dass eine Auswahl nötig ist
        console.log("Bitte Auswahl treffen, um fortzufahren.");
    }
  };

  const handleBack = () => {
    // Abhängigkeit von showPointsAnimation entfernen
    if (currentStep > 0) { 
      setCurrentStep(prev => prev - 1);
    }
  };

  // --- Submit Handler für E-Mail-Schritt ---
  const handleFormSubmit = async (event?: React.FormEvent<HTMLFormElement>) => {
     console.log("[handleFormSubmit] Triggered"); // Log 1
     if (event) event.preventDefault();
     setError(null); // Reset error
     
     // Email Validation (Keep existing validation)
     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
     if (!formData.email || !emailRegex.test(formData.email)) {
         setError("Bitte gib eine gültige E-Mail-Adresse ein.");
         console.log("[handleFormSubmit] Invalid email:", formData.email);
         return;
     }

     setIsLoading(true);
     setError(null); // Reset error before calling function

     // --- NEU: Cloud Function Aufruf --- 
     try {
        const functions = getFunctions();

        const saveTimelineLead = httpsCallable(functions, 'saveTimelineLead');
        
        // Daten für die Funktion vorbereiten
        const pointsForCompletion = 150;
        const achievementForCompletion = "Timeline Gestartet";
        const currentAchievements = gamification.achievements;
        const newAchievements = currentAchievements.includes(achievementForCompletion)
            ? currentAchievements
            : [...currentAchievements, achievementForCompletion];

        const dataToSend = {
            email: formData.email,
            weddingDate: formData.weddingDate ? formData.weddingDate.toISOString() : null, // Datum als ISO String
            guestSize: formData.guestSize,
            guestCount: formData.guestCount,
            weddingStyle: formData.weddingStyle,
            pointsEarned: pointsForCompletion, // Übergebe die Punkte für diesen Schritt
            achievements: newAchievements // Übergebe die (potenziell) neuen Achievements
        };

        console.log("[handleFormSubmit] Calling saveTimelineLead with data:", dataToSend);
        const result = await saveTimelineLead(dataToSend);
        console.log("[handleFormSubmit] saveTimelineLead successful:", result.data);
        showSnackbar("Timeline-Daten erfolgreich gespeichert!", "success");

        // --- Bestehende Logik NACH erfolgreichem Speichern --- 
        // Update lokalen Gamification State (jetzt, da Speichern erfolgreich war)
        setGamification(prev => ({
            ...prev,
            points: prev.points + pointsForCompletion,
            achievements: newAchievements,
            pointsAnimationTrigger: prev.pointsAnimationTrigger + 1 
        }));

        // Timeline generieren (nur lokal, wird nicht gespeichert)
        if (formData.weddingDate) {
          const timeline = generateTimelineItems(formData);
          setGeneratedTimeline(timeline); 
        }

        triggerPointsAnimation(); 
        setCurrentStep(FunnelStep.Success);
        // ------------------------------------------------------

     } catch (error: any) {
        console.error("[handleFormSubmit] Error calling saveTimelineLead:", error);
        // Firebase Functions Fehler haben oft eine message-Eigenschaft
        const errorMessage = error.message || "Fehler beim Speichern der Daten.";
        setError(errorMessage);
        showSnackbar(errorMessage, "error");
     } finally {
        setIsLoading(false); 
     }

     // --- Alte Logik entfernt (wird jetzt im try/catch nach Erfolg ausgeführt) ---
     /*
     console.log("[handleFormSubmit] Updating gamification and generating timeline..."); 
     // ... (alte gamification/timeline logic) ...
     triggerPointsAnimation(); 
     setCurrentStep(FunnelStep.Success);
     setIsLoading(false); 
     */
  };

  // --- Rendering-Logik ---

  // Farbpalette für Success-View
  const colors = {
    primary: '#8e6c54',
    secondary: '#b89e8a',
    accent: '#d2b48c',
    backgroundPage: '#f9f4ef', // Umbenannt, da background.paper von MUI kommt
    text: '#3d3229',
    success: '#5a8467',
    white: '#ffffff',
  };

  // Reset Funktion für Success-View
  const handleResetFunnel = () => {
      setCurrentStep(0);
      setFormData({
        weddingDate: null,
        guestSize: null,
        guestCount: 50,
        weddingStyle: null,
        email: '',
      });
      setGamification({
        points: 0,
        achievements: [],
        pointsAnimationTrigger: 0,
      });
      setGeneratedTimeline([]);
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0: {
        return (
          <>
            <DatePickerComponent value={formData.weddingDate} onChange={handleDateChange} />
            <SpecialDateSuggestions onDateSelect={handleDateChange} />
            {/* NEU: Datumshinweise anzeigen */} 
            {formData.weddingDate && (
              <Collapse in={!!formData.weddingDate} timeout="auto">
                <Box sx={{ mt: 2, p: 1.5, display: 'flex', alignItems: 'center', bgcolor: '#f0f0f0', borderRadius: 1 }}>
                   <InfoOutlinedIcon sx={{ mr: 1, color: 'text.secondary' }} />
                   <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                       {getDateInsights(formData.weddingDate)}
                   </Typography>
                </Box>
               </Collapse>
            )}
          </>
        );
      }
      case 1: {
        return (
          <>
            <Typography variant="h6" gutterBottom align="center">Wie groß wird eure Hochzeit?</Typography>
            <SizeSelector 
                value={formData.guestSize} 
                onChange={handleSizeChange} 
             />
          </>
        );
      }
      case 2: {
        return (
          <StyleSelector value={formData.weddingStyle} onChange={handleStyleChange} />
        );
      }
      case 3: {
        return (
          <>
            <Typography variant="h5" gutterBottom align="center">Fast geschafft! Deine persönliche Hochzeits-Timeline wartet.</Typography>
            {/* ... (Countdown display) ... */}
             <Typography variant="body1" align="center" sx={{ mb: 2 }}>
              Gib deine E-Mail-Adresse ein, um deine maßgeschneiderte Timeline zu erhalten und direkt mit der Planung zu starten.
            </Typography>

            {/* Timeline Preview mit Icons */}
            <Box sx={{ my: 3, p: 2, border: '1px dashed', borderColor: 'grey.300', borderRadius: 1 }}>
               {/* ... (Timeline preview content) ... */}
            </Box>

           <EmailCaptureForm
             email={formData.email}
             onChange={handleEmailChange}
             onSubmit={handleFormSubmit}
             isLoading={isLoading}
           />

           {/* Fortschrittsanzeige */}
           <Box sx={{ width: '100%', mt: 3 }}>
              {/* ... (progress bar content) ... */}
           </Box>
          </>
        );
      }
      case 4: {
        console.log("[renderCurrentStep] Rendering Success Step (Case 4)");
        const daysUntilWeddingSuccess = formData.weddingDate ? dayjs().diff(formData.weddingDate, 'day') * -1 : null;
        // Finde die Details zum ausgewählten Stil - Typ für `s` hinzufügen
        const selectedStyleDetails = weddingStylesData.find((s: StyleInfo) => s.key === formData.weddingStyle);

        return (
          <Box sx={{ bgcolor: colors.backgroundPage, py: 5, px: 2 }}>
            {/* Konfetti - Wird jetzt durch den neuen useEffect gesteuert */}
            {showConfetti && 
              <ReactConfetti 
                width={windowSize.width} 
                height={windowSize.height} 
                recycle={false}
                numberOfPieces={200} 
                gravity={0.1} 
                initialVelocityY={5} 
                confettiSource={confettiSource.current ? { 
                    x: confettiSource.current.getBoundingClientRect().left + confettiSource.current.offsetWidth / 2, 
                    y: confettiSource.current.getBoundingClientRect().top + confettiSource.current.offsetHeight / 2, 
                    w: confettiSource.current.offsetWidth, 
                    h: confettiSource.current.offsetHeight 
                } : undefined}
                style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 9999 }}
              />
            }
            <Box sx={{ maxWidth: 800, mx: 'auto', color: colors.text }}>
                {/* 1. Header */}
                <Box sx={{ textAlign: 'center', mb: 5 }}>
                  <Typography variant="h3" component="div" sx={{ fontWeight: 'bold', color: colors.primary, mb: 1 }}>
                    WILMA
                  </Typography>
                  <Typography variant="body1">Wedding Impulse Lovely Management Assistant</Typography>
                </Box>

                {/* 2. Wedding Details Card */}
                <Paper elevation={2} sx={{ p: 2, mb: 3, display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: 'center', gap: 2 }}>
                    <Box sx={{ flex: 1, textAlign: 'left' }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Deine Hochzeitsdetails:</Typography>

                        {/* Datum mit Insights */}
                        {formData.weddingDate && (
                            <Box sx={{ my: 1 }}>
                                <Typography variant="body1" sx={{ fontWeight: 'medium' }}>Datum: {formData.weddingDate.format('dddd, DD. MMMM YYYY')}</Typography>
                                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                                    {getDateInsights(formData.weddingDate)}
                                </Typography>
                            </Box>
                        )}

                        {/* Größe */}
                        {formData.guestSize && (
                            <Typography variant="body2" sx={{ mb: 1 }}>Größe: {formData.guestSize.charAt(0).toUpperCase() + formData.guestSize.slice(1)} ({formData.guestCount} Gäste)</Typography>
                        )}

                        {/* Stil - Hervorgehoben */}
                        {selectedStyleDetails && (
                             <Box sx={{ mt: 1 }}>
                                 <Typography variant="body1" sx={{ fontWeight: 'medium' }}>Stil: {selectedStyleDetails.name}</Typography>
                                 <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
                                    {selectedStyleDetails.description}
                                </Typography>
                                {/* Farbpalette - Angepasstes Styling */}
                                <Box sx={{ display: 'flex', justifyContent: 'flex-start', gap: 0.8, mt: 1, alignItems: 'center' }}>
                                    <Typography variant="caption" sx={{ mr: 0.5, alignSelf: 'center' }}>Farbpalette:</Typography>
                                    {selectedStyleDetails.colorPalette.map((color, index) => (
                                        <Tooltip key={`summary-color-${index}`} title={color} placement="bottom">
                                            <Box sx={{ 
                                                width: 22, // Etwas größer
                                                height: 22, // Etwas größer
                                                bgcolor: color, 
                                                // Organischerer Radius
                                                borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%', 
                                                // Leichter Schatten für Moodboard-Effekt
                                                boxShadow: '1px 1px 2px rgba(0,0,0,0.2)',
                                                border: '1px solid rgba(0,0,0,0.1)' 
                                            }} />
                                        </Tooltip>
                                    ))}
                                </Box>
                            </Box>
                        )}
                    </Box>
                    {/* Countdown bleibt gleich */}
                    {daysUntilWeddingSuccess !== null && daysUntilWeddingSuccess >= 0 && (
                         <Box sx={{ textAlign: 'center', borderLeft: { sm: '1px solid' }, borderColor: { sm: 'divider' }, pl: { sm: 2 }, alignSelf: 'center' }}>
                             <Typography variant="h4" color="secondary" sx={{ fontWeight: 'bold' }}>{daysUntilWeddingSuccess}</Typography>
                             <Typography variant="caption">Tage bis zur Hochzeit</Typography>
                         </Box>
                     )}
                </Paper>

                {/* 3. Divider */}
                <Divider sx={{ 
                    my: 4, 
                    height: '2px', 
                    background: `linear-gradient(to right, transparent, ${colors.secondary}, transparent)`,
                    border: 'none'
                }} />

                {/* 4. Titel und Intro */}
                <Typography variant="h4" component="h2" sx={{ color: colors.primary, mb: 1, fontWeight: 'bold' }}>
                  Deine personalisierte Hochzeits-Timeline
                </Typography>
                <Typography paragraph sx={{ mb: 4 }}>
                  Basierend auf deinem Hochzeitsdatum und Stil haben wir diese Timeline erstellt, um dir bei der Planung deiner Traumhochzeit zu helfen.
                </Typography>

                {/* 5. Angezeigte Timeline */}
                {generatedTimeline && generatedTimeline.length > 0 ? (
                    <List sx={{ bgcolor: colors.white /* Hintergrund für Liste */, borderRadius: 1, mb: 2, textAlign: 'left' }}>
                      {generatedTimeline.map((item, index) => (
                          <React.Fragment key={item.id}>
                            <ListItem>
                                <ListItemText 
                                    primary={item.title}
                                    secondary={`Fällig ca.: ${item.dueDate}${item.category ? ' - Kategorie: ' + item.category : ''}`}
                                />
                            </ListItem>
                            {index < generatedTimeline.length - 1 && <Divider component="li" />}
                         </React.Fragment>
                      ))}
                    </List>
                ) : (
                    <Typography color="text.secondary">Timeline wird geladen oder konnte nicht erstellt werden.</Typography>
                )}

                {/* 6. Footer Card */}
                <Card sx={{ borderRadius: 3, boxShadow: '0 4px 12px rgba(0,0,0,0.08)', textAlign: 'center', p: 3 }}>
                  <Typography variant="h5" sx={{ color: colors.primary, fontWeight: 'bold' }}>
                    Das ist nur ein kleiner Ausschnitt!
                  </Typography>
                  <Typography paragraph sx={{ mt: 1 }}>
                    Mit WILMA erhältst du:
                  </Typography>
                  {/* TODO: Liste schöner formatieren */}
                  <List dense sx={{ maxWidth: 400, mx: 'auto', textAlign: 'left', mb: 3 }}>
                      <ListItem><ListItemText primary="Eine vollständige Timeline mit allen wichtigen Meilensteinen" /></ListItem>
                      <ListItem><ListItemText primary="Automatische Erinnerungen an anstehende Aufgaben" /></ListItem>
                      <ListItem><ListItemText primary="Personalisierte Empfehlungen passend zu deinem Stil" /></ListItem>
                      <ListItem><ListItemText primary="Gästemanagement und Budgetverfolgung" /></ListItem>
                      <ListItem><ListItemText primary="Chatbasierte Planung ohne komplizierte Formulare" /></ListItem>
                  </List>

                  {/* NEU: Nächste Schritte basierend auf Timeline */}
                  {generatedTimeline && generatedTimeline.length > 0 && (
                      <Box sx={{ mt: 3, mb: 3, textAlign: 'left', maxWidth: 400, mx: 'auto' }}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: colors.primary, mb: 1 }}>
                              Deine nächsten Schritte könnten sein:
                          </Typography>
                          <List dense disablePadding>
                              {generatedTimeline.slice(0, 3).map((item) => (
                                  <ListItem key={`next-${item.id}`} sx={{ pl: 0 }}>
                                     <ListItemText 
                                        primary={`- ${item.title}`}
                                        primaryTypographyProps={{ variant: 'body2' }}
                                    />
                                  </ListItem>
                              ))}
                          </List>
                      </Box>
                  )}

                  {/* Angepasste Gamification-Anzeige */}
                  {gamification.achievements.length > 0 && (
                    <Box sx={{ 
                      display: 'flex', // Use flex for alignment
                      alignItems: 'center', 
                      justifyContent: 'center', // Center items horizontally
                      p: 1.5, 
                      bgcolor: colors.backgroundPage, 
                      borderRadius: 2, 
                      mb: 2, 
                      mt: 2, // Add some margin top
                      border: `1px solid ${colors.secondary}`,
                      maxWidth: '90%', // Limit width
                      mx: 'auto' // Center the box itself
                    }}>
                      <CheckCircleOutlineIcon sx={{ fontSize: '2.5rem', mr: 1.5, color: colors.success }} />
                      <Box sx={{ textAlign: 'left' }}>
                        <Typography variant="body1" sx={{ fontWeight: 'bold', color: colors.primary, lineHeight: 1.3 }}>
                          Achievement freigeschaltet:
                        </Typography>
                        <Typography variant="h6" sx={{ fontWeight: 'bold', color: colors.success, lineHeight: 1.2 }}>
                          {gamification.achievements[0]} 
                        </Typography>
                        {/* <Typography variant="body2">Du hast deine personalisierte Hochzeits-Timeline erstellt!</Typography> */}
                      </Box>
                    </Box>
                  )}
                  <Box>
                      <Chip label={`+${gamification.points} WPP`} sx={{ bgcolor: colors.primary, color: colors.white, fontWeight: 'bold', fontSize: '1rem', px: 1.5, py: 2.5 }}/>
                  </Box>

                  {/* NEU: Sozialer Beweis */}
                  <Typography variant="caption" display="block" sx={{ mt: 3, color: colors.secondary, fontWeight: 'medium' }}>
                      🚀 Über 500 Paare planen bereits mit WILMA!
                  </Typography>

                  {/* Angepasster Haupt-CTA */}
                  <Button 
                    href="#" // Später zum echten Produktlink ändern
                    variant="contained" 
                    size="large"
                    sx={{ 
                        bgcolor: colors.primary, 
                        color: colors.white, 
                        borderRadius: 30, 
                        fontWeight: 'bold', 
                        px: 4, 
                        py: 1.5, 
                        mt: 3, 
                        '&:hover': { bgcolor: '#79593f' }
                    }}
                  >
                    Vollständige Timeline in WILMA ansehen
                  </Button>
                  <Typography sx={{ mt: 2, fontSize: '0.9rem' }}>
                    Schalte alle Funktionen frei und mache deine Hochzeitsplanung zum Kinderspiel!
                  </Typography>
                </Card>
                <Box sx={{ mt: 3, textAlign: 'center' }}>
                     {/* Angepasster Sekundär-Button */}
                     <Button 
                        onClick={handleResetFunnel}
                        variant="outlined" // Geändert zu outlined
                        sx={{ color: colors.primary, borderColor: colors.primary }} // Passende Farben
                     >
                        Die Planung neu angehen
                     </Button>
                </Box>
            </Box>
          </Box>
        );
      }
      default: 
        console.warn("[renderCurrentStep] Unexpected step value:", currentStep);
        return <Typography>Ungültiger Schritt...</Typography>; 
    }
  };

  // --- Wrap main return with FunnelLayout --- 
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="de">
      {/* FunnelLayout umschließt alles, wird aber für Success Step ausgeblendet */}
      <FunnelLayout hideLayout={currentStep === FunnelStep.Success}>
          {/* Erfolgsseite wird direkt von renderCurrentStep gerendert (hat eigenes Layout) */} 
          {currentStep === FunnelStep.Success ? (
             renderCurrentStep() // Rufe renderCurrentStep für Success auf
          ) : ( 
            /* Für Schritte 0-3: Normale Box mit Stepper etc. */
            <Box sx={{ maxWidth: 600, mx: 'auto', my: 4, p: 3, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 3, position: 'relative', overflow: 'hidden' }}>
              
              {showConfetti && 
                 <ReactConfetti 
                    width={windowSize.width} 
                    height={windowSize.height} 
                    recycle={false}
                    numberOfPieces={200} 
                    gravity={0.1} 
                    initialVelocityY={5} 
                    confettiSource={confettiSource.current ? { 
                        x: confettiSource.current.getBoundingClientRect().left + confettiSource.current.offsetWidth / 2, 
                        y: confettiSource.current.getBoundingClientRect().top + confettiSource.current.offsetHeight / 2, 
                        w: confettiSource.current.offsetWidth, 
                        h: confettiSource.current.offsetHeight 
                    } : undefined}
                    style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 9999 }}
                 />
              }
              {/* Ref Div für Konfetti Quelle */} 
              <div ref={confettiSource} style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 0, height: 0 }} />

              <Stepper activeStep={currentStep} alternativeLabel sx={{ mb: 4 }}>
                {steps.map((label, index) => (
                  <Step key={label} completed={currentStep > index}> 
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>

              {/* Bedingtes Rendern der Schritte (0-3) */} 
              <Box sx={{ minHeight: 300 }}>
                {renderCurrentStep()} 
              </Box>

              {/* Navigationsbuttons (nur für Schritte 0-2) */} 
              {currentStep < 3 && (
                 <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                  <Button 
                    variant="outlined" 
                    onClick={handleBack} 
                    disabled={currentStep === 0 || isLoading} 
                  >
                    Zurück
                  </Button>
                  <Button 
                    variant="contained" 
                    onClick={handleNext} 
                    disabled={isLoading || 
                             (currentStep === 0 && !formData.weddingDate) || 
                             (currentStep === 1 && !formData.guestSize) || 
                             (currentStep === 2 && !formData.weddingStyle)}
                  >
                    Weiter {isLoading && <CircularProgress size={20} sx={{ ml: 1}}/>}
                  </Button>
                 </Box>
              )}
              {/* Separater Zurück-Button für E-Mail-Schritt (Schritt 3) */} 
              {currentStep === 3 && (
                  <Box sx={{ display: 'flex', justifyContent: 'flex-start', mt: 4 }}>
                   <Button 
                     variant="outlined" 
                     onClick={handleBack} 
                     disabled={isLoading}
                   >
                     Zurück
                   </Button>
                 </Box>
              )}

              {/* Gamification-Status anzeigen */} 
              <Box sx={{ mt: 3, textAlign: 'right' }}>
                <Typography variant="caption">WPP: {gamification.points} | Achievements: {gamification.achievements.join(', ') || '-'}</Typography>
              </Box>

              {/* Fortschrittsanzeige */} 
              <Box sx={{ width: '100%', mt: 3 }}>
                  <Typography variant="body2" align="center" sx={{ mb: 1 }}>
                     Du bist bereits {Math.round(((currentStep) / (totalSteps -1)) * 100)}% auf dem Weg zu deiner perfekten Hochzeitsplanung!
                   </Typography>
                  <LinearProgress variant="determinate" value={((currentStep) / (totalSteps -1)) * 100} />
              </Box>
            </Box>
          )}
      </FunnelLayout>
    </LocalizationProvider>
  );
};

// --- Routing-Setup (vereinfacht) ---
const LeadFunnelRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Die Hauptroute für den Timeline Generator */}
      <Route path="timeline-generator" element={<TimelineGeneratorPage />} />
      
      {/* Index-Route für /funnel (optional, zeigt evtl. Auswahl an) */}
      {/* <Route index element={<div>Wähle einen Funnel!</div>} /> */}

      {/* Fallback oder andere Funnels hier */}
       {/* <Route path="budget-calculator" element={...} /> */}
    </Routes>
  );
};

export default LeadFunnelRoutes; 