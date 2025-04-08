import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebaseConfig'; // Pfad zu deiner Firebase Config

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
}

// Default-Wert für den Context
const AuthContext = createContext<AuthContextType>({ currentUser: null, loading: true });

// Hook zum einfachen Zugriff auf den Context
export const useAuth = () => {
  return useContext(AuthContext);
};

interface AuthProviderProps {
  children: ReactNode;
}

// Provider-Komponente, die den State hält und auf Änderungen hört
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true); // Startet als true, bis der erste Check abgeschlossen ist

  useEffect(() => {
    // Diese Funktion wird aufgerufen, wenn sich der Auth-Status ändert (Login, Logout)
    // oder wenn sie zum ersten Mal initialisiert wird.
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user); // Setzt den User oder null
      setLoading(false); // Auth-Status ist jetzt bekannt, Loading beenden
    });

    // Cleanup-Funktion, die beim Unmounten der Komponente aufgerufen wird
    return unsubscribe;
  }, []); // Leeres Array sorgt dafür, dass der Effect nur einmal beim Mounten läuft

  const value = {
    currentUser,
    loading,
  };

  // Stellt den Context für Kind-Komponenten bereit
  // Wir rendern die Kinder erst, wenn der Ladezustand abgeschlossen ist,
  // um ein Flackern zwischen Login/Logout-Ansichten zu vermeiden.
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}; 