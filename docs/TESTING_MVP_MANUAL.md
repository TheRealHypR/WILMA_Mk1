# Manueller Testplan & Ergebnisse: WILMA MVP Phase 1

**Ziel:** Überprüfung der Kernfunktionalitäten des MVPs.

**Tester:** [Name des Testers]
**Datum:** [Datum]

**Anleitung:** Bitte führe die folgenden Schritte durch und notiere Beobachtungen oder Fehler.

---

## 1. Registrierung & Login

**Schritte:**
1.  Öffne die Anwendung im Browser.
2.  Klicke auf "Registrieren".
3.  Gib eine gültige E-Mail und ein Passwort (mind. 6 Zeichen) ein. Bestätige das Passwort.
4.  Klicke auf "Registrieren".
5.  *Erwartet:* Erfolgreiche Registrierung, Weiterleitung zum Dashboard.
6.  Prüfe in Firestore (falls Zugang vorhanden), ob ein Dokument unter `/users/{deineUserID}` erstellt wurde.
7.  Logge dich aus (über AppBar).
8.  Versuche dich mit einer falschen E-Mail einzuloggen.
9.  *Erwartet:* Fehlermeldung (z.B. "Ungültige E-Mail...").
10. Versuche dich mit der korrekten E-Mail, aber falschem Passwort einzuloggen.
11. *Erwartet:* Fehlermeldung (z.B. "...falsches Passwort").
12. Logge dich mit korrekten Daten ein.
13. *Erwartet:* Erfolgreicher Login, Weiterleitung zum Dashboard.

**Ergebnis (Basierend auf Feedback):**
*   [x] Funktioniert wie erwartet.
*   [x] Profilerstellung im Frontend scheint zu klappen.

**Tester-Notizen:**


---

## 2. Profilseite (`/profile`)

**Schritte:**
1.  Navigiere zur Profilseite über die AppBar.
2.  Gib Testdaten in die Felder (Datum, Stil, Gästeanzahl) ein.
3.  Klicke auf "Speichern".
4.  *Erwartet:* Erfolgsmeldung oder visuelles Feedback.
5.  Lade die Seite neu (F5 oder Cmd+R).
6.  *Erwartet:* Die gespeicherten Daten werden korrekt angezeigt.

**Ergebnis (Basierend auf Feedback):**
*   [x] Speichern und Laden funktioniert.
*   **Verbesserungsvorschlag:** Feld "Stil" sollte ein Dropdown mit gängigen Optionen + einer "Eigener Stil"-Eingabemöglichkeit sein.

**Tester-Notizen:**


---

## 3. Aufgaben (Navigation)

**Schritte:**
1.  Klicke auf den "Aufgaben"-Button in der AppBar.

**Ergebnis (Basierend auf Feedback):**
*   [ ] **FEHLER:** Link führt aktuell zum Dashboard, nicht zu einer dedizierten Aufgabenseite.

**Tester-Notizen:**


---

## 4. Gästeliste (`/guests`)

**Schritte:**
1.  Navigiere zur Gästeseite.
2.  Füge einen neuen Gast hinzu (teste mit/ohne optionale Felder).
3.  Bearbeite einen vorhandenen Gast (z.B. Name, Status ändern).
4.  Lösche einen Gast (bestätige den Dialog).

**Ergebnis (Basierend auf Feedback):**
*   [x] Hinzufügen, Bearbeiten, Löschen (inkl. Bestätigung) funktioniert.
*   **Verbesserungsvorschlag:** Anzeige/Gruppierung nach Tischnummer wäre wünschenswert.

**Tester-Notizen:**


---

## 5. Budget (`/budget`)

**Schritte:**
1.  Navigiere zur Budgetseite.
2.  Füge einen neuen Budgetposten hinzu (teste mit/ohne optionale Felder).
3.  Füge einen *weiteren* Budgetposten hinzu.
4.  Bearbeite einen Posten (z.B. Beschreibung, Kosten, Status auf "partially-paid" oder "paid").
5.  Lösche einen Posten.
6.  Überprüfe die Summen in der Übersicht.

**Ergebnis (Basierend auf Feedback):**
*   [x] Hinzufügen, Bearbeiten, Löschen funktioniert (nach Regel-Fix).
*   **Verbesserungsvorschlag 1:** Bei Status "partially-paid" fehlt ein Feld zur Eingabe der Anzahlungssumme.
*   **Verbesserungsvorschlag 2:** Die Berechnung der Summe "Bereits bezahlt" muss die Anzahlung berücksichtigen.
*   **Verbesserungsvorschlag 3:** Es fehlt die Möglichkeit, ein Gesamtbudget festzulegen (im Profil/Onboarding?).
*   **Verbesserungsvorschlag 4:** Eine Anzeige "Restbudget" fehlt.
*   **Verbesserungsvorschlag 5:** Anzeige der Top 3 Ausgabenkategorien im Dashboard wäre nützlich.

**Tester-Notizen:**


---

## 6. Chat (im Dashboard `/`)

**Schritte:**
1.  Gib eine Testnachricht ein und sende sie (Enter oder Button).
2.  *Erwartet:* Deine Nachricht erscheint sofort rechtsbündig.
3.  Warte ca. 1-2 Sekunden.
4.  *Erwartet:* Eine simulierte Antwort ("Antwort auf: ...") erscheint linksbündig.
5.  Sende mehrere Nachrichten, um das Scrollverhalten zu testen.

**Ergebnis (Basierend auf Feedback):**
*   [x] Senden und Anzeigen der eigenen Nachricht funktioniert.
*   [ ] **FEHLER:** Die simulierte AI-Antwort erscheint nicht.
*   [x] Auto-Scrollen ist aktiv.
*   **Verbesserungsvorschlag 1:** Zeitstempel (Uhrzeit) bei jeder Nachricht anzeigen.
*   **Verbesserungsvorschlag 2:** Trennlinien oder Gruppierung nach Tagen einfügen.
*   **Verbesserungsvorschlag 3:** Scrollen sollte auf die *letzte* Nachricht zentrieren/fokussieren.
*   **Verbesserungsvorschlag 4:** Hintergrund für das Chatfenster gestalten.

**Tester-Notizen:**


---

## 7. Allgemeine Navigation & Layout

**Schritte:**
1.  Klicke alle Links in der AppBar durch.
2.  Ändere die Größe des Browserfensters (Desktop -> schmaler).

**Ergebnis (Basierend auf Feedback):**
*   [~] Links funktionieren, **außer "Aufgaben"**.
*   [ ] Responsivität wurde nicht explizit genannt, sollte aber geprüft werden.
*   [x] Dashboard-Layout (Chat oben, Übersichten unten) ist umgesetzt.
*   [ ] Dashboard-Übersichten sind aktuell Platzhalter.

**Tester-Notizen (Allgemein):** 