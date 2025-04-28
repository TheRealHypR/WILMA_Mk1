import React, { useState, useEffect } from 'react';
// Grid wird nur noch für die Übersichten benötigt
import { Box, Paper, Typography, /* Link as MuiLink, */ /* Button, */ /* Grid, */ CircularProgress, /* Chip, */ List, ListItem, ListItemText, LinearProgress, SvgIconTypeMap } from '@mui/material'; 
import { useNavigate } from 'react-router-dom';
import ChatLayout from '../components/chat/ChatLayout';
import { useAuth } from '../contexts/AuthContext';
import { doc, getDoc, collection, getCountFromServer, query, where, getDocs, Timestamp, orderBy, limit } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import { OverridableComponent } from '@mui/material/OverridableComponent';
import GroupIcon from '@mui/icons-material/Group';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import ChecklistIcon from '@mui/icons-material/Checklist';
import AccessTimeIcon from '@mui/icons-material/AccessTime'; // For countdown

// Define Task interface
interface Task {
    id: string;
    title: string;
    dueDate?: Timestamp; // Optional, falls nicht alle Tasks ein Datum haben
    // Füge hier bei Bedarf weitere Felder hinzu
}

// NEU: ChecklistItem Interface
interface ChecklistItem {
    id: string;
    description: string; // Annahme: Feld heißt 'description'
    createdAt: Timestamp; // Für Info, falls benötigt
    isCompleted: boolean;
}

// Countdown interface
interface Countdown {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
}

// Placeholder für rechte Spalten-Widgets
const DashboardWidget: React.FC<{
    title: string;
    linkTo: string;
    icon?: OverridableComponent<SvgIconTypeMap<{}, "svg">> & { muiName: string };
    children?: React.ReactNode;
}> = ({ title, linkTo, icon: IconComponent, children }) => {
    const navigate = useNavigate();
    return (
        <Paper
            onClick={() => navigate(linkTo)}
            sx={{ p: 2, width: '100%', mb: 2, cursor: 'pointer', '&:hover': { boxShadow: 3 }, borderRadius: '16px' }}
        >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                {IconComponent && <IconComponent sx={{ mr: 1, color: 'text.secondary' }} />}
                <Typography variant="h6" sx={{ mb: 0 }}>{title}</Typography>
            </Box>
    {children || (
      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Keine Daten verfügbar.
      </Typography>
    )}
  </Paper>
);
};

// Helper to format currency
const formatCurrency = (value: number | null | undefined) => {
  if (value === null || value === undefined) return '--';
  return value.toLocaleString('de-DE', { style: 'currency', currency: 'EUR' });
};

// Helper to format date
const formatDate = (timestamp: Timestamp | undefined): string => {
    if (!timestamp) return '';
    return timestamp.toDate().toLocaleDateString('de-DE', { weekday: 'short', day: '2-digit', month: '2-digit' });
};

const DashboardPage: React.FC = () => {
  const { currentUser, loading: authLoading } = useAuth();
  const [weddingDate, setWeddingDate] = useState<string | null>(null);
  const [loadingDate, setLoadingDate] = useState<boolean>(true);
  const [totalGuestCount, setTotalGuestCount] = useState<number | null>(null);
  const [toInviteCount, setToInviteCount] = useState<number | null>(null);
  const [invitedCount, setInvitedCount] = useState<number | null>(null);
  const [acceptedCount, setAcceptedCount] = useState<number | null>(null);
  const [declinedCount, setDeclinedCount] = useState<number | null>(null);
  const [loadingGuestData, setLoadingGuestData] = useState<boolean>(true);
  const [totalEstimatedCost, setTotalEstimatedCost] = useState<number | null>(null);
  const [totalActualCost, setTotalActualCost] = useState<number | null>(null);
  const [loadingBudget, setLoadingBudget] = useState<boolean>(true);
  const [tasksDueThisWeek, setTasksDueThisWeek] = useState<Task[]>([]);
  const [loadingTasksThisWeek, setLoadingTasksThisWeek] = useState<boolean>(true);
  // Updated Checklist State
  const [recentOpenChecklistItems, setRecentOpenChecklistItems] = useState<ChecklistItem[]>([]);
  const [totalChecklistItemsCount, setTotalChecklistItemsCount] = useState<number | null>(null);
  const [completedChecklistItemsCount, setCompletedChecklistItemsCount] = useState<number | null>(null);
  const [loadingChecklist, setLoadingChecklist] = useState<boolean>(true);
  // NEU: State für Countdown
  const [countdown, setCountdown] = useState<Countdown | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!currentUser) return;

      setLoadingDate(true);
      const userDocRef = doc(db, 'users', currentUser.uid);
      try {
        const docSnap = await getDoc(userDocRef);
        const fetchedWeddingDateStr = docSnap.exists() ? docSnap.data().weddingProfile?.date || null : null;
        setWeddingDate(fetchedWeddingDateStr);
        // DEBUG LOG: Log the fetched wedding date string
        console.log('Fetched wedding date for countdown:', fetchedWeddingDateStr);
      } catch (error) {
        console.error("Error fetching wedding date for dashboard:", error);
        setWeddingDate(null);
      }
      setLoadingDate(false);

      setLoadingGuestData(true);
      try {
        const guestsColRef = collection(db, 'users', currentUser.uid, 'guests');

        const totalQuery = query(guestsColRef);
        const toInviteQuery = query(guestsColRef, where('status', '==', 'to-invite'));
        const invitedQuery = query(guestsColRef, where('status', '==', 'invited'));
        const acceptedQuery = query(guestsColRef, where('status', '==', 'confirmed'));
        const declinedQuery = query(guestsColRef, where('status', '==', 'declined'));

        const [totalSnap, toInviteSnap, invitedSnap, acceptedSnap, declinedSnap] = await Promise.all([
          getCountFromServer(totalQuery),
          getCountFromServer(toInviteQuery),
          getCountFromServer(invitedQuery),
          getCountFromServer(acceptedQuery),
          getCountFromServer(declinedQuery),
        ]);

        setTotalGuestCount(totalSnap.data().count);
        setToInviteCount(toInviteSnap.data().count);
        setInvitedCount(invitedSnap.data().count);
        setAcceptedCount(acceptedSnap.data().count);
        setDeclinedCount(declinedSnap.data().count);

        // DEBUG LOG: Log fetched counts
        console.log('Fetched Guest Counts:', {
          total: totalSnap.data().count,
          toInvite: toInviteSnap.data().count,
          invited: invitedSnap.data().count,
          accepted: acceptedSnap.data().count,
          declined: declinedSnap.data().count,
        });

      } catch (error) {
        console.error("Error fetching guest counts:", error);
        setTotalGuestCount(null);
        setToInviteCount(null);
        setInvitedCount(null);
        setAcceptedCount(null);
        setDeclinedCount(null);
      }
      setLoadingGuestData(false);

      // --- NEU: Budget-Daten holen und summieren ---
      setLoadingBudget(true);
      try {
          // Annahme: Subkollektion heißt 'budgetItems'
          const budgetColRef = collection(db, 'users', currentUser.uid, 'budgetItems');
          const budgetSnapshot = await getDocs(budgetColRef);
          let estimatedSum = 0;
          let actualSum = 0;
          budgetSnapshot.forEach((doc) => {
              const data = doc.data();
              // Annahme: Feldnamen sind 'estimatedCost' und 'actualCost'
              if (typeof data.estimatedCost === 'number') {
                  estimatedSum += data.estimatedCost;
              }
              if (typeof data.actualCost === 'number') {
                  actualSum += data.actualCost;
              }
          });
          setTotalEstimatedCost(estimatedSum);
          setTotalActualCost(actualSum);
          console.log('Fetched Budget Sums:', { estimated: estimatedSum, actual: actualSum });
      } catch (error) {
          console.error("Error fetching budget data:", error);
          setTotalEstimatedCost(null);
          setTotalActualCost(null);
      }
      setLoadingBudget(false);

      // --- NEU: Top 5 offene Aufgaben DIESER WOCHE holen ---
      setLoadingTasksThisWeek(true);
      try {
        const now = new Date();
        const dayOfWeek = now.getDay();
        const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() + diffToMonday);
        startOfWeek.setHours(0, 0, 0, 0);
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        endOfWeek.setHours(23, 59, 59, 999);
        const startOfWeekTimestamp = Timestamp.fromDate(startOfWeek);
        const endOfWeekTimestamp = Timestamp.fromDate(endOfWeek);

        const tasksColRef = collection(db, 'users', currentUser.uid, 'tasks');
        // Query für Top 5 offene Aufgaben (status == 'open') DIESER WOCHE, sortiert nach Fälligkeit
        // WICHTIG: Benötigt Firestore Index: status ASC, dueDate ASC
        const openTasksThisWeekQuery = query(
          tasksColRef,
          where('status', '==', 'open'),
          where('dueDate', '>=', startOfWeekTimestamp),
          where('dueDate', '<=', endOfWeekTimestamp),
          orderBy('dueDate', 'asc'), // Sortieren nach Fälligkeit
          limit(5) // Nur die nächsten 5
        );

        const tasksSnapshot = await getDocs(openTasksThisWeekQuery); // getDocs statt getCountFromServer
        const tasksList = tasksSnapshot.docs.map(doc => ({
            id: doc.id,
            // Verwende das korrekte Feld 'description' für den Titel
            title: doc.data().description || 'Unbenannte Aufgabe', 
            dueDate: doc.data().dueDate as Timestamp | undefined,
            // Füge hier ggf. weitere benötigte Felder hinzu
        }));

        setTasksDueThisWeek(tasksList);
        console.log('Fetched Tasks This Week:', tasksList);

      } catch (error) {
        console.error("Error fetching open tasks for this week:", error);
        if (error instanceof Error && error.message.includes('indexes')) {
             console.warn("Firestore Index fehlt wahrscheinlich für die Aufgaben-Wochenansicht (status ASC, dueDate ASC). Bitte erstellen Sie den Index gemäß der Fehlermeldung.");
        }
        setTasksDueThisWeek([]); // Leere Liste bei Fehler
      }
      setLoadingTasksThisWeek(false);

      // --- Checkliste: Fortschritt UND nächste Punkte holen ---
      setLoadingChecklist(true);
      try {
          const checklistColRef = collection(db, 'users', currentUser.uid, 'checklistItems');

          // 1. Query: Neueste 5 offene Punkte
          const recentOpenQuery = query(
              checklistColRef,
              where('isCompleted', '==', false),
              orderBy('createdAt', 'desc'),
              limit(5)
          );
          // 2. Query: Gesamtzahl
          const totalQuery = query(checklistColRef);
          // 3. Query: Anzahl Erledigter
          const completedQuery = query(checklistColRef, where('isCompleted', '==', true));

          // Alle Abfragen parallel ausführen
          const [recentOpenSnapshot, totalSnapshot, completedSnapshot] = await Promise.all([
              getDocs(recentOpenQuery),
              getCountFromServer(totalQuery),
              getCountFromServer(completedQuery)
          ]);

          // Neueste offene Punkte verarbeiten
          const checklistItems = recentOpenSnapshot.docs.map(doc => ({
              id: doc.id,
              description: doc.data().description || 'Unbenannter Punkt',
              createdAt: doc.data().createdAt as Timestamp,
              isCompleted: doc.data().isCompleted as boolean,
          }));
          setRecentOpenChecklistItems(checklistItems);

          // Zählungen speichern
          setTotalChecklistItemsCount(totalSnapshot.data().count);
          setCompletedChecklistItemsCount(completedSnapshot.data().count);

          console.log('Fetched checklist data:', { 
              recentOpen: checklistItems, 
              total: totalSnapshot.data().count, 
              completed: completedSnapshot.data().count 
          });

      } catch (error) {
          console.error("Error fetching checklist items:", error);
           if (error instanceof Error && error.message.includes('indexes')) {
               console.warn("Firestore Index fehlt wahrscheinlich für die Checklisten-Ansicht (isCompleted ASC, createdAt DESC). Bitte erstellen Sie den Index gemäß der Fehlermeldung.");
           }
          setRecentOpenChecklistItems([]);
          setTotalChecklistItemsCount(null);
          setCompletedChecklistItemsCount(null);
      }
      setLoadingChecklist(false);

      // TODO: Hier weitere Daten für Budget, Aufgaben etc. abrufen
    };

    // DEBUG LOG: Log state variables before render
    console.log('Guest Data State:', {
      loadingGuestData,
      totalGuestCount,
      toInviteCount,
      invitedCount,
      acceptedCount,
      declinedCount,
    });

    if (currentUser && !authLoading) {
      fetchData();
    }

    // --- Countdown-Logik --- 
    let intervalId: NodeJS.Timeout | null = null;
    if (weddingDate) {
        try {
            // Parse "DD.MM.YYYY" string manually
            const parts = weddingDate.split('.');
            if (parts.length !== 3) {
                throw new Error('Invalid date format. Expected DD.MM.YYYY');
            }
            const day = parseInt(parts[0], 10);
            const monthIndex = parseInt(parts[1], 10) - 1; // JS months are 0-indexed
            const year = parseInt(parts[2], 10);

            if (isNaN(day) || isNaN(monthIndex) || isNaN(year)) {
                 throw new Error('Invalid date components after parsing');
            }

            const targetDate = new Date(year, monthIndex, day);
            // Set time to the beginning of the wedding day for consistent countdown
            targetDate.setHours(0, 0, 0, 0);

            // Validate the created date
            if (isNaN(targetDate.getTime())) {
                 throw new Error('Resulting targetDate is invalid');
            }

            intervalId = setInterval(() => {
                const now = new Date();
                const difference = targetDate.getTime() - now.getTime();

                if (difference <= 0) {
                    setCountdown(null); // Wedding day reached or passed
                    if (intervalId) clearInterval(intervalId);
                } else {
                    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
                    const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
                    const minutes = Math.floor((difference / 1000 / 60) % 60);
                    const seconds = Math.floor((difference / 1000) % 60);
                    setCountdown({ days, hours, minutes, seconds });
                }
            }, 1000);

        } catch (e) {
             console.error("Error parsing wedding date for countdown:", e);
             setCountdown(null);
        }
    } else {
        setCountdown(null);
    }

    // Cleanup interval on component unmount or when weddingDate changes
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [currentUser, weddingDate]); // Trigger neu, wenn weddingDate gesetzt wird

  // --- Berechne Checklisten-Prozentsatz --- 
  const checklistProgress = totalChecklistItemsCount !== null && completedChecklistItemsCount !== null && totalChecklistItemsCount > 0
     ? (completedChecklistItemsCount / totalChecklistItemsCount) * 100
     : 0;

  if (authLoading || loadingDate || loadingGuestData || loadingBudget || loadingTasksThisWeek || loadingChecklist) {
    return <CircularProgress />;
  }

  if (!currentUser) {
    return <Typography>Bitte einloggen, um das Dashboard zu sehen.</Typography>;
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3, width: '100%' }}>
      {/* Linke Spalte: Chat */}
      <Box sx={{ flex: { xs: 1, md: 3 } }}>
          <ChatLayout />
      </Box>

      {/* Rechte Spalte: Übersichten */}
      <Box sx={{ flex: { xs: 1, md: 1 }, display: 'flex', flexDirection: 'column' }}>

        {/* Countdown Widget */}
        {countdown && (
          <DashboardWidget title="Countdown zur Hochzeit" linkTo="/profile" icon={AccessTimeIcon}>
            <Box sx={{ display: 'flex', justifyContent: 'space-around', textAlign: 'center', my: 1 }}>
              <Box>
                <Typography variant="h4">{countdown.days}</Typography>
                <Typography variant="caption">Tage</Typography>
              </Box>
              <Box>
                <Typography variant="h4">{countdown.hours}</Typography>
                <Typography variant="caption">Stunden</Typography>
              </Box>
              <Box>
                <Typography variant="h4">{countdown.minutes}</Typography>
                <Typography variant="caption">Minuten</Typography>
              </Box>
              {/* Optional: Sekunden hinzufügen */}
              {/* <Box>
                <Typography variant="h4">{countdown.seconds}</Typography>
                <Typography variant="caption">Sekunden</Typography>
              </Box> */}
            </Box>
          </DashboardWidget>
        )}

        {/* Gästeübersicht Widget */}
        <DashboardWidget title="Gästeübersicht" linkTo="/guests" icon={GroupIcon}>
            {loadingGuestData ? (
                <CircularProgress size={20} />
            ) : (
                <>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography variant="body2">Gesamt:</Typography>
                        <Typography variant="body2">{totalGuestCount ?? '--'}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography variant="body2">Ausstehend:</Typography>
                        <Typography variant="body2">{toInviteCount ?? '--'}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography variant="body2">Eingeladen:</Typography>
                        <Typography variant="body2">{invitedCount ?? '--'}</Typography>
                    </Box>
                     <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography variant="body2">Zugesagt:</Typography>
                        <Typography variant="body2">{acceptedCount ?? '--'}</Typography>
                    </Box>
                     <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography variant="body2">Abgesagt:</Typography>
                        <Typography variant="body2">{declinedCount ?? '--'}</Typography>
                    </Box>
                </>
            )}
        </DashboardWidget>

        {/* Budgetübersicht Widget */}
        <DashboardWidget title="Budgetübersicht" linkTo="/budget" icon={AccountBalanceWalletIcon}>
             {loadingBudget ? (
                <CircularProgress size={20} />
            ) : (
                 <>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography variant="body2">Geschätzt:</Typography>
                        <Typography variant="body2">{formatCurrency(totalEstimatedCost)}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                        <Typography variant="body2">Tatsächlich:</Typography>
                        <Typography variant="body2">{formatCurrency(totalActualCost)}</Typography>
                    </Box>
                </>
            )}
        </DashboardWidget>

         {/* Aufgaben dieser Woche Widget */}
        <DashboardWidget title="Nächste Aufgaben (diese Woche)" linkTo="/tasks" icon={TaskAltIcon}>
            {loadingTasksThisWeek ? (
                <CircularProgress size={20} />
            ) : tasksDueThisWeek.length > 0 ? (
                <List dense disablePadding>
                    {tasksDueThisWeek.map(task => (
                        <ListItem key={task.id} sx={{ py: 0.5 }}>
                            <ListItemText
                                primary={task.title}
                                secondary={task.dueDate ? `Fällig: ${formatDate(task.dueDate)}` : 'Kein Datum'}
                            />
                        </ListItem>
                    ))}
                </List>
            ) : (
                <Typography variant="body2" color="text.secondary">Keine Aufgaben diese Woche fällig.</Typography>
            )}
        </DashboardWidget>

        {/* Nächste Checklistenpunkte Widget */}
        <DashboardWidget title="Nächste Checklistenpunkte" linkTo="/user-checklist" icon={ChecklistIcon}>
            {loadingChecklist ? (
                 <CircularProgress size={20} />
            ) : (
                <>
                    <List dense disablePadding sx={{ mb: 1 }}>
                         {recentOpenChecklistItems.length > 0 ? (
                            recentOpenChecklistItems.map(item => (
                                <ListItem key={item.id} sx={{ py: 0.5 }}>
                                    <ListItemText primary={item.description} />
                                </ListItem>
                            ))
                        ) : (
                            <ListItem sx={{ py: 0.5 }}>
                                <ListItemText primary="Alle Punkte erledigt!" />
                            </ListItem>
                        )}
                    </List>
                    {totalChecklistItemsCount !== null && completedChecklistItemsCount !== null && (
                        <Box sx={{ width: '100%', mt: 1 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                <Typography variant="body2">Fortschritt:</Typography>
                                <Typography variant="body2">{completedChecklistItemsCount} / {totalChecklistItemsCount}</Typography>
                            </Box>
                            <LinearProgress variant="determinate" value={checklistProgress} />
                        </Box>
                    )}
                 </>
            )}
        </DashboardWidget>

      </Box>
    </Box>
  );
};

export default DashboardPage; 