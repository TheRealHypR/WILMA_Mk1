import React, { useState, useEffect } from 'react';
import { Box, Typography, Container, CircularProgress, Alert } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import TrendCard from '../../components/trends/TrendCard';

// Firebase imports für Firestore
import { db } from '../../firebaseConfig'; // Importiere die Firebase-Konfiguration
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  Timestamp, // Wichtig für Typisierung
  DocumentData,
  doc,
  getDoc
} from 'firebase/firestore';

// Interface für Trend-Daten (ggf. in eigene Datei auslagern: src/types/trends.ts)
// Sicherstellen, dass es mit Firestore-Daten übereinstimmt (insb. Timestamps)
interface Trend {
  id: string;
  title: string;
  slug: string;
  category: string;
  imageUrl: string;
  source: string;
  sourceUrl: string;
  shortDescription: string;
  fullContent?: string; // Optional hier, wird auf Detailseite gebraucht
  createdAt?: Timestamp; // Firestore Timestamp
  published?: boolean;
  // Füge hier ggf. weitere Felder hinzu (tags, popularity etc.)
}

// Mock-Daten entfernt
// const mockTrends = [...];

const TrendsOverviewPage: React.FC = () => {
  const theme = useTheme();
  const [trends, setTrends] = useState<Trend[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // useEffect Hook zum Laden der Trends aus Firestore
  useEffect(() => {
    const fetchTrends = async () => {
      setLoading(true);
      setError(null);
      try {
        // Logge die db Instanz
        console.log("Using db instance:", db);

        // --- Direkten Dokumentenabruf testen (mit korrigiertem Collection-Namen) --- 
        const docIdToTest = "5TboIIyAKSzwFoWAwp8a";
        try {
            console.log(`Firestore Direct Fetch TEST: Fetching document /tends/${docIdToTest}`);
            const docRef = doc(db, "tends", docIdToTest);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                console.log("Firestore Direct Fetch TEST: Document found!", docSnap.data());
            } else {
                console.log("Firestore Direct Fetch TEST: Document NOT found!");
            }
        } catch (directFetchErr) {
             console.error("Fehler beim direkten Laden des Dokuments:", directFetchErr);
        }
        // --- Ende Direkter Abruf --- 

        // --- Query mit where('published', '==', true) (mit korrigiertem Collection-Namen) --- 
        console.log("Firestore Query: Fetching published documents from /tends (NO orderBy)");
        const trendsCollectionRef = collection(db, 'tends');
        const qTrends = query(
          trendsCollectionRef, 
          where('published', '==', true)
        );
        const trendsSnapshot = await getDocs(qTrends);
        console.log(`Firestore Query Result (where only): Found ${trendsSnapshot.size} documents.`); 
        const fetchedTrends: Trend[] = [];
        trendsSnapshot.forEach((doc: DocumentData) => {
          const data = doc.data() as Omit<Trend, 'id'>; 
          console.log("Processing document (where only):", doc.id, data);
          fetchedTrends.push({ id: doc.id, ...data });
        });
        setTrends(fetchedTrends);

      } catch (err) {
        console.error("Fehler beim Laden der Trends (where only Query):", err);
        setError("Trends konnten nicht geladen werden. Bitte versuchen Sie es später erneut.");
      } finally {
        setLoading(false);
      }
    };

    fetchTrends();
  }, []);

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 4, md: 6 } }}> 
      <Typography variant="h2" component="h1" align="center" gutterBottom sx={{ fontWeight: 600, mb: 4 }}>
        Aktuelle Hochzeitstrends
      </Typography>
      <Typography variant="h6" component="p" align="center" color="text.secondary" paragraph sx={{ mb: 6 }}>
        Inspiration für euren großen Tag: Entdeckt die neuesten Ideen für Dekoration, Mode, Locations und mehr.
      </Typography>

      {/* TODO: Filter-Bar hier einfügen */}

      {/* Ladezustand und Fehleranzeige */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      )}
      {error && (
        <Alert severity="error" sx={{ my: 2 }}>{error}</Alert>
      )}

      {/* Flexbox Container für die Trend-Karten */}
      {!loading && !error && (
        <Box 
          sx={{
            display: 'flex',
            flexWrap: 'wrap', 
            gap: theme.spacing(4),
            justifyContent: 'center',
          }}
        >
          {trends.length > 0 ? (
            trends.map((trend) => (
              <Box 
                key={trend.id} 
                sx={{ 
                  width: { xs: '100%', sm: `calc(50% - ${theme.spacing(2)})`, md: `calc(33.33% - ${theme.spacing(2.66)})` },
                  display: 'flex'
                }} 
              >
                <TrendCard trend={trend} />
              </Box>
            ))
          ) : (
            <Typography sx={{ mt: 4, width: '100%', textAlign: 'center' }}>
              {/* Wieder die ursprüngliche Meldung */}
              Momentan sind keine Trends verfügbar.
            </Typography>
          )}
        </Box>
      )}

      {/* TODO: Paginierung oder "Mehr laden" Button hier einfügen */}

    </Container>
  );
};

export default TrendsOverviewPage; 