# WILMA Onboarding Integration Plan

## 1. Zielsetzung

Ziel ist die Implementierung eines kapitelbasierten, gamifizierten Onboarding-Prozesses für neue WILMA-Benutzer. Das Onboarding soll Benutzer durch die wichtigsten initialen Planungsschritte führen und die dabei gesammelten Daten im `weddingProfile`-Objekt des Benutzers in Firestore speichern. Diese Daten können anschließend auf der `/profile`-Seite (`ProfilePage.tsx`) bearbeitet werden.

Dieser Plan beschreibt die **Integration** des Onboardings in das **bestehende System** unter Wiederverwendung vorhandener Komponenten und Logik.

## 2. Wichtige Entscheidungen & Ansatz

*   **Integration statt Neubau:** Wir bauen den Onboarding-Prozess nicht von Grund auf neu, sondern integrieren ihn in die bestehende Frontend-Struktur.
*   **Styling mit MUI:** Um Konsistenz zu gewährleisten, wird das Onboarding mit Material UI (MUI) implementiert, analog zum Rest des Frontends. Das visuelle Konzept des Tailwind-Mockups dient als Inspiration und wird mit MUI-Komponenten nachgebaut.
*   **Datenbank:** Die Interaktion erfolgt direkt mit **Firestore** (via `getDoc`, `setDoc` etc.), wie bereits in `ProfilePage.tsx` etabliert. Es wird keine separate REST API benötigt.
*   **Wiederverwendung von Komponenten:** Die Formular-Input-Felder (gewrappt mit `react-hook-form`-`Controller`), die in `ProfilePage.tsx` definiert wurden, werden für die Dateneingabe im Onboarding wiederverwendet.

## 3. Architektur & Komponenten

*   **`OnboardingContext` (`src/contexts/OnboardingContext.tsx`):** React Context zum Halten der temporären `weddingProfile`-Daten während des Onboarding-Prozesses.
*   **`OnboardingPage` (`src/pages/OnboardingPage.tsx`):** Haupt-Wrapper-Komponente für das Onboarding.
    *   Stellt den `OnboardingContext` bereit.
    *   Verwaltet den aktuellen Schritt/Kapitel.
    *   Lädt initial vorhandene `weddingProfile`-Daten in den Context (falls Onboarding unterbrochen wurde).
    *   Rendert die aktuelle Schritt-Komponente.
    *   Löst das Speichern der Daten in Firestore aus.
*   **`OnboardingStepLayout` (`src/components/onboarding/common/OnboardingStepLayout.tsx`):** Layout für einzelne Onboarding-Schritte. Enthält Platz für Titel, Inhalt (die Schritt-Komponente), Fortschrittsanzeige und Navigationsbuttons.
*   **`ProgressBar` (`src/components/onboarding/common/ProgressBar.tsx`):** Zeigt den Gesamtfortschritt an (z.B. MUI `LinearProgress` oder `Stepper`).
*   **`NavigationButtons` (`src/components/onboarding/common/NavigationButtons.tsx`):** Enthält "Weiter"- und "Zurück"-Buttons.
*   **Schritt-Komponenten (`src/components/onboarding/steps/Step_*.tsx`):** Komponenten für jeden einzelnen logischen Schritt (z.B. `Step_CoupleNames.tsx`, `Step_WeddingDate.tsx`, `Step_StyleTheme.tsx`).
    *   Importieren und verwenden die relevanten `Controller`-basierten MUI-Input-Felder.
    *   Lesen und schreiben Werte aus/in den `OnboardingContext`.
    *   Nutzen ggf. das Yup-Schema für die Validierung des Schritts.
*   **(Optional) `ChapterSelection` (`src/components/onboarding/ChapterSelection.tsx`):** Eine Startseite (ähnlich dem Mockup, mit MUI gebaut), falls Benutzer Kapitel wählen können sollen.

## 4. Datenfluss

1.  Beim Start von `/onboarding`: `OnboardingPage` prüft Firestore (`users/{userId}.weddingProfile`) auf vorhandene Daten.
2.  Falls Daten vorhanden: `OnboardingContext` wird initialisiert.
3.  Benutzer interagiert mit Schritt-Komponenten: Daten werden im `OnboardingContext` aktualisiert.
4.  Beim Wechseln des Schritts/Kapitels oder am Ende: `OnboardingPage` löst die Speicherfunktion aus.
5.  Speicherfunktion: Liest die Daten aus dem `OnboardingContext` und schreibt sie mittels `setDoc(userDocRef, { weddingProfile: contextData }, { merge: true })` nach Firestore.

## 5. Routing & User Flow

1.  **Prüfung nach Login/Registrierung:** In `App.tsx` oder `PrivateRoute` wird nach erfolgreichem Login/Verifizierung geprüft, ob das `onboardingCompleted`-Flag im User-Dokument in Firestore `true` ist.
2.  **Umleitung:**
    *   Wenn `onboardingCompleted` nicht `true` ist (oder fehlt): Umleitung zu `/onboarding`.
    *   Wenn `onboardingCompleted` `true` ist: Umleitung zum `/dashboard`.
3.  **Abschluss:** Am Ende des Onboardings wird das Flag `onboardingCompleted` in Firestore auf `true` gesetzt.
4.  **Speicherung:** Der Fortschritt (aktueller Schritt/Kapitel) kann ebenfalls im User-Dokument gespeichert werden, um das Onboarding fortsetzen zu können.

## 6. Entwicklungsphasen & Aufgaben

**Phase 1: Setup & Grundstruktur (ca. 1-2 Tage)**

*   [ ] `OnboardingContext.tsx` erstellen (State-Struktur basierend auf `WeddingProfileData`).
*   [ ] Route `/onboarding` in `frontend/src/App.tsx` hinzufügen.
*   [ ] Logik zur Umleitung basierend auf `onboardingCompleted`-Flag implementieren (`App.tsx` oder `PrivateRoute`).
*   [ ] Grundgerüst für `OnboardingPage.tsx` erstellen (Context Provider, Laden initialer Daten).
*   [ ] `OnboardingStepLayout.tsx` erstellen (MUI `Box`, `Container`, `Typography`).
*   [ ] `ProgressBar.tsx` erstellen (MUI `LinearProgress` oder `Stepper`).
*   [ ] `NavigationButtons.tsx` erstellen (MUI `Button`).

**Phase 2: Kapitel-Logik & Eingabe-Integration (ca. 4-6 Tage)**

*   [ ] State-Management für aktuellen Schritt/Kapitel in `OnboardingPage.tsx` implementieren.
*   [ ] Logik zum Rendern der korrekten `Step_*.tsx`-Komponente basierend auf dem aktuellen Schritt.
*   [ ] **Wiederverwendbare Input-Komponenten extrahieren/refaktorieren:** Die `Controller`-basierten Inputs aus `ProfilePage.tsx` so vorbereiten, dass sie leicht in den Onboarding-Schritten wiederverwendet werden können.
*   [ ] Einzelne `Step_*.tsx`-Komponenten erstellen:
    *   [ ] `Step_CoupleNames.tsx`
    *   [ ] `Step_WeddingDate.tsx`
    *   [ ] `Step_LocationVenue.tsx`
    *   [ ] `Step_GuestBudget.tsx`
    *   [ ] `Step_CeremonyReception.tsx`
    *   [ ] `Step_StyleTheme.tsx`
    *   [ ] `Step_StyleFormalityAtmosphere.tsx`
    *   [ ] `Step_MusicFoodPrefs.tsx`
    *   [ ] *...(weitere Schritte für Arrays/Objekte nach Bedarf)*
*   [ ] In jeder Schritt-Komponente: Inputs einbinden, Werte mit `OnboardingContext` verknüpfen.
*   [ ] Validierung pro Schritt oder Kapitel implementieren (Wiederverwendung des Yup-Schemas).

**Phase 3: Speichern & Abschluss (ca. 1 Tag)**

*   [ ] Funktion in `OnboardingPage.tsx` implementieren, die Context-Daten nach Firestore (`weddingProfile`) schreibt.
*   [ ] Logik zum Setzen des `onboardingCompleted`-Flags in Firestore implementieren.
*   [ ] Einfache Abschluss-Komponente erstellen.
*   [ ] Navigation zum `/dashboard` nach Abschluss.

**Phase 4: Styling & Politur (ca. 1-2 Tage)**

*   [ ] Visuelles Design der Onboarding-Komponenten mit MUI an das Mockup annähern (Farben, Typografie, Layouts, `Card`-Elemente für Kapitel etc.).
*   [ ] (Optional) Einfache Übergänge zwischen Schritten hinzufügen.
*   [ ] Responsivität auf verschiedenen Bildschirmgrößen sicherstellen.

**Phase 5: Testen (ca. 1-2 Tage)**

*   [ ] Manueller Durchlauf des gesamten Onboardings.
*   [ ] Überprüfung der Datenkonsistenz zwischen Onboarding, Firestore und `ProfilePage.tsx`.
*   [ ] Testen der Umleitungslogik.
*   [ ] Testen der Fortsetzungslogik (Onboarding unterbrechen und wieder aufnehmen).

## 7. Geschätzte Gesamtdauer

*   **Ca. 8 - 13 Arbeitstage** (abhängig von der Komplexität der Input-Komponenten für Arrays/Objekte und dem gewünschten Styling-Grad).

## 8. Mögliche Herausforderungen

*   **Komplexität des `OnboardingContext`:** Sicherstellen, dass der Context übersichtlich bleibt und korrekt aktualisiert wird.
*   **Styling:** Das visuelle Mockup-Konzept mit MUI exakt nachzubauen, kann herausfordernd sein.
*   **Validierung:** Sinnvolle Validierung für jeden Schritt definieren.
*   **Komponenten-Wiederverwendung:** Die Inputs aus `ProfilePage` sauber für die Wiederverwendung zu extrahieren.

## 9. Nächste Schritte

*   Beginn mit Phase 1: Setup & Grundstruktur. 