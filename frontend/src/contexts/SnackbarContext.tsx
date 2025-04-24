import React, { createContext, useContext, useState, ReactNode, SyntheticEvent } from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert, { AlertColor } from '@mui/material/Alert';

interface SnackbarContextType {
  showSnackbar: (message: string, severity?: AlertColor) => void;
}

// Default-Wert für den Context (eine Funktion, die nichts tut)
const SnackbarContext = createContext<SnackbarContextType>({
  showSnackbar: () => {},
});

// Hook zum einfachen Zugriff auf den Context
export const useSnackbar = () => {
  return useContext(SnackbarContext);
};

interface SnackbarProviderProps {
  children: ReactNode;
}

// Provider-Komponente, die den State hält und die Snackbar rendert
export const SnackbarProvider: React.FC<SnackbarProviderProps> = ({ children }) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState<AlertColor>('info'); // Default severity

  const showSnackbar = (newMessage: string, newSeverity: AlertColor = 'success') => {
    setMessage(newMessage);
    setSeverity(newSeverity);
    setOpen(true);
  };

  const handleClose = (event?: SyntheticEvent | Event, reason?: string) => {
    // Verhindert das Schließen bei Klick außerhalb der Snackbar
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  const contextValue = {
    showSnackbar,
  };

  return (
    <SnackbarContext.Provider value={contextValue}>
      {children}
      <Snackbar
        open={open}
        autoHideDuration={6000} // Snackbar schließt nach 6 Sekunden
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }} // Position
      >
        {/* Verwende severity, um den Alert-Typ zu steuern */}
        <Alert onClose={handleClose} severity={severity} sx={{ width: '100%' }} variant="filled">
          {message}
        </Alert>
      </Snackbar>
    </SnackbarContext.Provider>
  );
}; 