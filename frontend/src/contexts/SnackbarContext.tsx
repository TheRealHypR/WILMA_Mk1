import React, { createContext, useContext, useState, ReactNode, SyntheticEvent } from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert, { AlertColor } from '@mui/material/Alert';

interface SnackbarContextType {
  showSnackbar: (message: string, severity?: AlertColor) => void;
}

const SnackbarContext = createContext<SnackbarContextType | undefined>(undefined);

export const useSnackbar = () => {
  const context = useContext(SnackbarContext);
  if (!context) {
    throw new Error('useSnackbar must be used within a SnackbarProvider');
  }
  return context;
};

interface SnackbarProviderProps {
  children: ReactNode;
}

// Provider-Komponente, die den State hält und die Snackbar rendert
export const SnackbarProvider: React.FC<SnackbarProviderProps> = ({ children }) => {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<AlertColor>('info');

  const showSnackbar = (message: string, severity: AlertColor = 'info') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  // Parameter _event beibehalten, aber als ungenutzt markieren
  const handleClose = (_event?: SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  const value = { showSnackbar };

  return (
    <SnackbarContext.Provider value={value}>
      {children}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000} // Snackbar schließt nach 6 Sekunden
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }} // Position
      >
        {/* Verwende severity, um den Alert-Typ zu steuern */}
        <Alert onClose={handleClose} severity={snackbarSeverity} sx={{ width: '100%' }} variant="filled">
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </SnackbarContext.Provider>
  );
}; 