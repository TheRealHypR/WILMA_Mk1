# 🎀 WILMA Design System

## 1. Brand Basics

| Element      | Beschreibung                                                                 |
|--------------|-------------------------------------------------------------------------------|
| **Name**     | WILMA – Wedding Impulse Lovely Management Assistant                          |
| **Tagline**  | Deine persönliche Hochzeitsplanerin                                           |
| **Stimme**   | Freundlich, empathisch, organisiert, wie eine gute Freundin                  |
| **Ton**      | Unterstützend, beruhigend, nie belehrend, leicht verspielt                   |

---

## 2. Farbpalette

### 🎨 Primärfarben
| Name          | Farbcode   | Verwendung                          |
|---------------|------------|-------------------------------------|
| Warm Rose     | `#FF6B88`  | User-Interface, Buttons, Highlights |
| Soft Sage     | `#94A89A`  | Hintergrund, Chatblasen             |
| Cream         | `#FFF8EA`  | Haupt-Hintergrundfarbe              |

### ✨ Akzentfarben
| Name            | Farbcode   | Verwendung                       |
|-----------------|------------|----------------------------------|
| Gold Accent     | `#D4AF37`  | Call-to-Action, Icons, Linien     |
| Deep Burgundy   | `#800020`  | Wichtiges hervorheben             |

---

## 3. Typografie

| Einsatzgebiet       | Font Family       | Eigenschaften                        |
|---------------------|-------------------|--------------------------------------|
| Headings / Titel    | *Playfair Display*| Elegant, klassisch, mit Serifen      |
| Fließtext / Inhalte | *Open Sans*       | Modern, lesbar, neutral              |
| UI / Buttons        | *Montserrat*      | Präzise, klar, strukturiert          |

---

## 4. UI-Komponenten

### Buttons
- **Primär**: Gold Accent mit weißem Text, sanfte Schatten, abgerundet (`border-radius: 12px`)
- **Sekundär**: Outline mit Warm Rose, Text in Warm Rose
- **Hover**: leichte Schatten-Intensivierung oder goldener Glanz
- **Disabled**: Hellgrau mit 50% Opazität

### Input-Felder
- Abgerundet, leicht erhöhter Schatten
- Placeholder in Soft Sage: „Wie kann ich dir helfen?“
- Fokus-Zustand mit Gold-Rahmen

### Chips
- Rounded: Soft Sage mit weißer Schrift
- Optional: Burgundy für Priorisierung

### Badges / Status
- RSVP:  
  - Zugesagt: Soft Sage  
  - Abgelehnt: Warm Rose  
  - Offen: Cream mit Outline

---

## 5. Layout-Guidelines

| Gerät         | Layout-Typ                          |
|---------------|--------------------------------------|
| **Mobile**    | Mobile-First, untere Tab-Navigation |
| **Tablet**    | Zwei-Spalten-Layout                 |
| **Desktop**   | Linke Sidebar + Contentbereich      |

**Spacing & Sizing**
- Grid: 8pt-Grid
- Border-Radius: 12–16px
- Schatten: `0 2px 10px rgba(0,0,0,0.05)`

---

## 6. Komponentenübersicht

| Komponente         | Beschreibung                                                   |
|--------------------|----------------------------------------------------------------|
| **Chat Bubble**     | User: rechts in Warm Rose / WILMA: links in Soft Sage          |
| **Avatar**          | Abstrakt, rund, Soft Sage mit Gold-Akzenten                    |
| **Typing-Indicator**| Drei pulisierende Punkte in Sage                              |
| **Gästeliste-Card** | Name, RSVP-Status, Edit-Button (Burgundy), Filter-Chips       |
| **To-Do-Karte**     | Abhaken mit Animation, Kategoriefarbe, Fortschrittsindikator  |
| **Budget Widget**   | Donut-Chart, farbcodierte Kategorien                          |

---

## 7. Iconography & Illustrationen

- **Stil**: Sanfte Outline, mit gelegentlichen gefüllten Flächen
- **Themen**: Hochzeit (Ringe, Blumen, Herzen, Kalender)
- **Strichstärke**: Einheitlich (ca. 1.5px bei 24px Icons)
- **Verwendung**: Immer links oder mittig zentriert

---

## 8. Interaktion & Animation

| Element             | Animation                                             |
|---------------------|-------------------------------------------------------|
| Buttons             | Leichtes Pulsieren beim Klick                         |
| Chat-Eingang        | Subtiles Einblenden von unten                         |
| Typing-Indicator    | Wellenartige Punkte                                   |
| Listenübergänge     | Gleiten und weich ein- / ausblenden                   |
| Modal/Dialog        | Fade-In + Background Blur                             |

---

## 9. Beispiel-Assets (Visual Style)

- 🖼 **Startscreen**: Wilma-Logo + Blumenrahmen + „Starten“-Button
- 🗨 **Chat-UI**: Cream Background + farbcodierte Blasen + goldener Send-Button
- 📝 **To-Do-Card**: Karte mit Icon, Check-Marker, sanfte Schatten
- 💌 **Gästeliste**: Name + RSVP-Badge + kleine florale Trennung
- 🌹 **Florale Elemente**: Rosen & Blätter als Zierelemente in UI integriert

---

## 10. Export für Developer / Cursor

Was du weitergeben kannst:

✅ Farbpalette in Hex  
✅ Fonts + Links zu Google Fonts  
✅ SVG-Icons + Illustrationen  
✅ PNG / SVG Assets aus Mockups (bereits generiert)  
✅ Figma oder Canva File (optional) 