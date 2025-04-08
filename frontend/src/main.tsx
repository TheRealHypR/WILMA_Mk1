import React from 'react'
import ReactDOM from 'react-dom/client'
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext.tsx'
import './index.css'
import App from './App.tsx'

// Erstelle ein einfaches Theme (optional, kann angepasst werden)
const theme = createTheme({
  palette: {
    mode: 'light', // Oder 'dark'
    // Weitere Theme-Anpassungen hier...
  },
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline /> {/* Normalisiert CSS und wendet Hintergrundfarbe an */}
      <BrowserRouter>
        <AuthProvider>
          <App />
        </AuthProvider>
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>,
)
