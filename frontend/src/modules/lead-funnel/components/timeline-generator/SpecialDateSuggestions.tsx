import React, { useState, useEffect } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { Box, Typography, Paper, CircularProgress, Chip } from '@mui/material';
import CakeIcon from '@mui/icons-material/Cake';
import { useTheme } from '@mui/material/styles';

// Funktion zum Prüfen, ob ein Datum "besonders" ist (ANGEPASSTE KRITERIEN v3)
const isSpecialDate = (date: Dayjs): boolean => {
  const day = date.date();
  const month = date.month() + 1; // 1-12
  const yearShort = date.year() % 100; // 0-99

  // Kriterium 1: dd.mm.yy Muster (Tag == Jahr (kurz)) - HÖCHSTE PRIORITÄT
  if (day === yearShort) {
    // Spezifische Wunschdaten
    if (month === 5 && day === 25) return true; // 25.05.25
    if (month === 6 && day === 26) return true; // 26.06.26
    if (month === 7 && day === 27) return true; // 27.07.27
    if (month === 8 && day === 28) return true; // 28.08.28
    if (month === 9 && day === 29) return true; // 29.09.29
    if (month === 10 && day === 30) return true; // 30.10.30 
    if (month === 12 && day === 25) return true; // 25.12.25 (Weihnachten)

    // Zusätzliches Muster: dd == mm == yy (für yy <= 12)
    if (day === month) return true; // Trifft z.B. auf 07.07.07, ..., 12.12.12
  }

  // Kriterium 2: Tag == Monat (aber nur für Monate Juli-Dezember)
  if (day === month && month >= 7) return true; // 07.07.xx, 08.08.xx, ..., 12.12.xx

  // Kriterium 3: Explizit der 11.11.
  if (month === 11 && day === 11) return true;

  // Kriterium 4 (ALT - entfernt): Tag ist 11 oder 22
  // if (day === 11 || day === 22) return true; 

  // Weitere spezifische Muster könnten hier hinzugefügt werden

  return false; // Wenn keines der Kriterien zutrifft
};

// Erweitere Props um den onChange Handler
interface SpecialDateSuggestionsProps {
  onDateSelect: (newDate: Dayjs) => void; // Callback, wenn ein Datum geklickt wird
}

const SpecialDateSuggestions: React.FC<SpecialDateSuggestionsProps> = ({ onDateSelect }) => {
  const [suggestedDates, setSuggestedDates] = useState<Dayjs[]>([]);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();

  useEffect(() => {
    const findDates = () => {
      const dates: Dayjs[] = [];
      let currentDate = dayjs().add(6, 'month'); // Startet 6 Monate in der Zukunft
      const endDate = dayjs().add(10, 'year'); 
      const maxDates = 20; 

      while (dates.length < maxDates && currentDate.isBefore(endDate)) {
        if (isSpecialDate(currentDate)) {
          // Optional: Vermeide Duplikate, falls verschiedene Kriterien dasselbe Datum treffen könnten
          // Obwohl bei diesen Kriterien unwahrscheinlich
          if (!dates.some(d => d.isSame(currentDate, 'day'))) { 
             dates.push(currentDate);
          }
        }
        currentDate = currentDate.add(1, 'day');
      }
      setSuggestedDates(dates);
      setLoading(false);
    };

    findDates();
  }, []);

  return (
    <Paper elevation={1} sx={{ mt: 3, p: { xs: 2, sm: 3 }, bgcolor: 'secondary.light', color: 'secondary.contrastText' }}>
      <Typography variant="h6" gutterBottom align="center">
        ✨ Besondere Hochzeitsdaten ✨
      </Typography>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 2 }}>
           <CircularProgress color="inherit" size={30} />
        </Box>
      ) : suggestedDates.length === 0 ? (
        <Typography variant="body2" align="center">
          Keine besonderen Daten in den nächsten 10 Jahren gefunden (mit aktuellen Kriterien).
        </Typography>
      ) : (
        <Box 
          sx={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            justifyContent: 'center', 
            gap: theme.spacing(1.5) 
          }}
        >
          {suggestedDates.map((date, index) => (
            <Chip
              key={index}
              icon={<CakeIcon fontSize="small" sx={{ ml: 0.5 }}/>}
              label={date.format('DD.MM.YYYY')} 
              variant="filled" 
              color="primary" 
              clickable // Macht den Chip klickbar (visuell + semantisch)
              onClick={() => onDateSelect(date)} // Ruft den Handler mit dem Datum auf
              sx={{ 
                p: 1,
                height: 'auto',
                '& .MuiChip-label': {
                   display: 'block',
                   whiteSpace: 'normal',
                   paddingLeft: 0.5,
                   paddingRight: 0.5
                 },
                 cursor: 'pointer' // Fügt Cursor hinzu
              }}
            />
          ))}
        </Box>
      )}
    </Paper>
  );
};

export default SpecialDateSuggestions; 