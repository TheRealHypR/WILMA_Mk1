# WILMA: Wedding Impulse Lovely Management Assistant
## Project Requirement Document (PRD)

### 1. Projektübersicht
- **Einführung:** WILMA ist ein KI-gestützter, chat-basierter Assistent, der Paare bei der Planung ihrer Hochzeit unterstützt. Ziel ist es, den Planungsprozess durch eine intuitive, konversationelle Schnittstelle zu vereinfachen und zu personalisieren.
- **Vision:** Eine nahtlose, natürliche Planungserfahrung, bei der Paare ihre Bedürfnisse und Wünsche einfach im Chat äußern können und WILMA proaktiv hilft, organisiert und inspiriert.
- **Hauptprojektziele:**
    - Reduzierung des Planungsstresses für Paare.
    - Zentralisierung aller Hochzeitsplanungsaufgaben an einem Ort.
    - Bereitstellung personalisierter Empfehlungen und Erinnerungen.
    - Effiziente Verwaltung von Aufgaben, Gästen, Budget und Dienstleistern.

### 2. Nutzerpersonas und Anwendungsfälle
- **Zielgruppen:**
    - **Verlobte Paare:** Die Hauptzielgruppe, die Unterstützung bei der gesamten Planung benötigt, von der ersten Idee bis zum Hochzeitstag. Oft Erstplaner ohne Erfahrung.
    - **Detailorientierte Planer:** Nutzer, die bereits klare Vorstellungen haben, aber ein Werkzeug zur Organisation, Verfolgung und Verwaltung von Details suchen.
    - **Technikaffine Nutzer:** Paare, die eine moderne, digitale Lösung für ihre Hochzeitsplanung bevorzugen.
- **Hauptanwendungsfälle:**
    - **Setup:** Erstellung eines Hochzeitsprofils (Datum, Ort, Stil, Gästeanzahl, Budgetrahmen).
    - **Aufgabenmanagement:** Erstellung, Zuweisung und Verfolgung von Aufgabenlisten (automatisch generiert oder manuell hinzugefügt).
    - **Gästemanagement:** Erstellung und Verwaltung der Gästeliste, Versand von Einladungen (optional), RSVP-Tracking, Verwaltung von Sitzordnungen und Sonderwünschen (z.B. Diäten).
    - **Standort-/Dienstleistersuche (RAGLLM):** Suche nach und Vorschläge für Locations, Fotografen, Caterer etc. basierend auf Kriterien wie Budget, Stil, Ort und Verfügbarkeit.
    - **Budgetplanung:** Festlegen eines Gesamtbudgets, Verfolgung von Ausgaben, Kategorisierung von Kosten, Warnungen bei Budgetüberschreitung.
    - **Kommunikation:** Führen von Dialogen mit WILMA zur Abfrage von Informationen, Erteilung von Anweisungen und Erhalt von Ratschlägen.
    - **Erinnerungen & Benachrichtigungen:** Proaktive Erinnerungen an anstehende Aufgaben, Zahlungstermine oder wichtige Fristen.

### 3. Funktionale Anforderungen
- **Chat-Schnittstelle:**
    - Intuitive Benutzeroberfläche für Texteingabe und Anzeige von Antworten.
    - Unterstützung für Rich-Text-Antworten (Bilder, Links, Listen).
    - Verlauf der Konversation.
- **NLP-Funktionen:**
    - Verstehen natürlicher Sprache (Absichtserkennung, Entitätsextraktion).
    - Verarbeitung von Anfragen zu allen Planungsaspekten (Aufgaben, Budget, Gäste etc.).
    - Kontextverständnis über mehrere Gesprächsrunden hinweg.
- **Datenextraktion aus Konversationen:**
    - Automatische Extraktion relevanter Informationen aus dem Chat (z.B. Namen von Dienstleistern, Kosten, Termine, Gästedetails) und Zuordnung zu den entsprechenden Modulen (Aufgaben, Budget, Gäste).
- **Aufgabenmanagement:**
    - Erstellen, Bearbeiten, Löschen, Zuweisen und Markieren von Aufgaben als erledigt.
    - Generierung von Standard-Aufgabenlisten basierend auf dem Hochzeitsdatum.
    - Fälligkeitsdaten und Erinnerungen.
- **Gästemanagement:**
    - Import/manuelle Eingabe von Gästen.
    - RSVP-Status-Tracking.
    - Verwaltung von Kontaktdaten, Adressen, Beziehungen, Essenspräferenzen.
    - Sitzplanungsunterstützung (optional).
- **Budgetplanung:**
    - Einrichten des Gesamtbudgets und von Kategoriebudgets.
    - Erfassung und Kategorisierung von Ausgaben.
    - Visuelle Übersicht über Budgetauslastung.
    - Warnmeldungen bei drohender Überschreitung.
- **RAGLLM für Locations/Dienstleister:**
    - Integration eines Retrieval-Augmented Generation Large Language Models (RAGLLM).
    - Zugriff auf eine kuratierte Wissensdatenbank (Orte, Dienstleister, Preise, Bewertungen).
    - Generierung von personalisierten Empfehlungen basierend auf Nutzerpräferenzen und Gesprächskontext.
- **Proaktive Dienste:**
    - Automatische Erinnerungen an Deadlines.
    - Vorschläge für nächste Planungsschritte basierend auf dem Fortschritt.
    - Personalisierte Tipps und Inspirationen.
- **Gedächtnissystem:**
    - Speicherung wichtiger Details über die Hochzeit und Nutzerpräferenzen (Stil, Farben, Prioritäten).
    - Nutzung des Gedächtnisses zur Personalisierung von Antworten und Vorschlägen.

### 4. Nicht-funktionale Anforderungen
- **Performance:**
    - Schnelle Antwortzeiten der Chat-Schnittstelle (< 2 Sekunden für die meisten Anfragen).
    - Effiziente Verarbeitung von NLP-Aufgaben.
    - Skalierbare Datenbankzugriffe.
- **Sicherheit und Datenschutz:**
    - Sichere Speicherung aller Nutzerdaten (Verschlüsselung im Ruhezustand und bei der Übertragung).
    - Einhaltung der Datenschutzgrundverordnung (DSGVO) und anderer relevanter Datenschutzgesetze.
    - Authentifizierung und Autorisierung zum Schutz der Nutzerkonten.
- **Benutzerfreundlichkeit (Usability):**
    - Intuitive und leicht erlernbare Benutzeroberfläche.
    - Natürliche und fehlerverzeihende Sprachverarbeitung.
    - Klares Feedback an den Nutzer.
    - Barrierefreiheit (optional, je nach Zielmarkt).
- **Zuverlässigkeit:**
    - Hohe Verfügbarkeit des Dienstes (> 99.5%).
    - Konsistente Datenspeicherung und -verarbeitung.
    - Regelmäßige Backups.
- **Skalierbarkeit:**
    - Fähigkeit, eine wachsende Anzahl von Nutzern und Datenmengen zu bewältigen.
    - Modulare Architektur zur einfachen Erweiterung von Funktionen.

### 5. Technische Anforderungen
- **Frontend:**
    - Web-App: React.js
    - Mobile App (optional): React Native (für Code-Sharing)
    - UI-Bibliothek: z.B. Material UI, Ant Design
- **Backend:**
    - Cloud-Plattform: Firebase (Authentication, Firestore, Functions) oder alternative Cloud-Anbieter (AWS, Google Cloud).
    - Workflow-Automatisierung/Integrations: n8n oder vergleichbare Tools (z.B. Zapier, Make) für Hintergrundprozesse und Integrationen.
    - Programmiersprache: Node.js (TypeScript) für Firebase Functions / Backend-Logik.
- **Datenmanagement:**
    - Datenbank: Firestore (NoSQL) für flexible Datenspeicherung.
    - Speicherung von Konversationsverläufen und Nutzerdaten.
    - Vektor-Datenbank (für RAGLLM): z.B. Pinecone, Weaviate oder eine integrierte Lösung.
- **NLP/LLM:**
    - Nutzung von Cloud-basierten LLMs (z.B. OpenAI GPT-4, Google Gemini) via API.
    - Feinabstimmung oder spezifische Prompt-Engineering-Techniken für Hochzeitsplanung.
- **Integrationen:**
    - Kalender-Integration (Google Calendar, Outlook Calendar) (optional).
    - Karten-API für Locations (Google Maps).
    - Potenzielle APIs von Hochzeitsdienstleister-Plattformen (optional).

### 6. Implementierungsphasen
- **Phase 1: Kernfunktionalität (MVP)**
    - Basis-Chat-Interface.
    - Einfache NLP (Absichtserkennung für Kernfunktionen).
    - Manuelles Aufgabenmanagement.
    - Manuelles Gästemanagement (Liste, RSVP).
    - Manuelles Budgettracking.
    - Nutzerauthentifizierung und Profilerstellung.
    - Dauer: ca. 3 Monate.
- **Phase 2: Erweiterte Intelligenz**
    - Verbesserte NLP und Datenextraktion aus Chats.
    - Automatisierte Aufgabenvorschläge.
    - Erweitertes Budgetmanagement mit Kategorisierung und Berichten.
    - Einführung des Gedächtnissystems.
    - Proaktive Erinnerungen.
    - Dauer: ca. 3 Monate.
- **Phase 3: RAGLLM und erweiterte Funktionen**
    - Integration des RAGLLM für Location- und Dienstleistersuche.
    - Aufbau der Wissensdatenbank.
    - Erweiterte Gästemanagement-Funktionen (z.B. Sitzordnung).
    - Erste Integrationen (z.B. Kalender).
    - Dauer: ca. 4 Monate.
- **Phase 4: Skalierung und Erweiterung**
    - Entwicklung der Mobile App (React Native).
    - Performance-Optimierungen.
    - Erweiterung der Wissensdatenbank und RAG-Fähigkeiten.
    - Hinzufügen weiterer Integrationen.
    - Internationalisierung/Lokalisierung (optional).
    - Dauer: Laufend.

### 7. Testanforderungen
- **NLP-Tests:**
    - Testen der Intent-Erkennung und Entity-Extraktion mit diversen Nutzereingaben.
    - Bewertung der Gesprächsqualität und des Kontexterhalts.
- **Funktionale Tests:**
    - End-to-End-Tests für alle Anwendungsfälle (Setup, Aufgaben, Gäste, Budget, RAG).
    - Unit-Tests für Backend- und Frontend-Komponenten.
    - Integrationstests für Modulinteraktionen und externe APIs.
- **Performance-Tests:**
    - Lasttests zur Simulation vieler gleichzeitiger Nutzer.
    - Messung der Antwortzeiten unter Last.
- **Sicherheitstests:**
    - Penetrationstests zur Identifizierung von Schwachstellen.
    - Überprüfung der Einhaltung von Datenschutzrichtlinien.
    - Code-Reviews mit Fokus auf Sicherheit.
- **Benutzertests (Usability):**
    - Tests mit echten Paaren (Zielgruppe) zur Bewertung der Benutzerfreundlichkeit.
    - Sammeln von Feedback zur Verbesserung der UX und der Chat-Interaktion.

### 8. Deployment und Betrieb
- **Umgebungen:**
    - Entwicklungsumgebung (lokal/cloud).
    - Staging-Umgebung (für Tests vor dem Release).
    - Produktionsumgebung (live für Nutzer).
- **Deployment-Prozesse:**
    - CI/CD-Pipeline (z.B. GitHub Actions, GitLab CI, Firebase CLI) für automatisierte Builds, Tests und Deployments.
    - Strategien für Zero-Downtime-Deployments.
- **Monitoring:**
    - Logging von Anwendungsereignissen und Fehlern (z.B. Sentry, Firebase Logging).
    - Performance-Monitoring (z.B. Google Cloud Monitoring, Datadog).
    - Uptime-Monitoring.
    - Alerting bei kritischen Fehlern oder Performance-Problemen.
- **Dokumentation:**
    - Technische Dokumentation (Architektur, APIs).
    - Benutzerhandbuch / FAQ.
    - Betriebs- und Wartungsanleitungen.

### 9. Erfolgsmetriken
- **Key Performance Indicators (KPIs):**
    - Tägliche/Monatliche Aktive Nutzer (DAU/MAU).
    - Nutzerbindung (Retention Rate).
    - Durchschnittliche Sitzungsdauer / Anzahl Nachrichten pro Sitzung.
    - Aufgaben-Abschlussrate.
    - Konversionsrate (falls Premium-Features geplant sind).
    - NLP-Genauigkeit / User-Query-Success-Rate.
- **Geschäftsmetriken:**
    - Nutzerzufriedenheit (NPS, Umfragen, App-Store-Bewertungen).
    - Reduzierung der Support-Anfragen (durch verbesserte proaktive Hilfe).
    - Marktanteil (langfristig).

### 10. Team und Ressourcen
- **Benötigte Rollen:**
    - Projektmanager/Product Owner
    - Frontend-Entwickler (React/React Native)
    - Backend-Entwickler (Firebase/Node.js)
    - KI/NLP-Ingenieur (LLM-Integration, Prompt Engineering, RAG)
    - UI/UX-Designer
    - QA-Tester
- **Externe Ressourcen:**
    - Cloud-Hosting (Firebase/GCP/AWS).
    - LLM API-Zugang (OpenAI, Google AI).
    - Vektor-Datenbank-Dienst (falls nicht selbst gehostet).
    - Externe Datenquellen für Dienstleister/Locations (ggf. Lizenzkosten).
    - n8n Cloud oder selbst gehostete Instanz.

### 11. Zeitplan und Meilensteine
- **Phase 1 (MVP):** Monat 1-3
    - Meilenstein 1 (Monat 1): Grundgerüst Frontend/Backend, Authentifizierung.
    - Meilenstein 2 (Monat 2): Kernfunktionen Chat, Aufgaben, Gäste, Budget (manuell).
    - Meilenstein 3 (Monat 3): MVP-Release für erste Testnutzer.
- **Phase 2 (Erweiterte Intelligenz):** Monat 4-6
    - Meilenstein 4 (Monat 5): Verbesserte NLP, Gedächtnis implementiert.
    - Meilenstein 5 (Monat 6): Proaktive Features, Release Phase 2.
- **Phase 3 (RAGLLM):** Monat 7-10
    - Meilenstein 6 (Monat 8): Wissensdatenbank-Aufbau, RAG-Backend.
    - Meilenstein 7 (Monat 10): RAGLLM-Integration im Chat, Release Phase 3.
- **Phase 4 (Skalierung):** Ab Monat 11
    - Meilenstein 8 (Monat 12): Mobile App Beta.
    - Laufende Weiterentwicklung und Optimierung.
*(Hinweis: Dies ist ein grober Zeitplan und muss detaillierter ausgearbeitet werden)*

### 12. Risiken und Mitigation
- **Technische Risiken:**
    - **NLP/LLM-Ungenauigkeit:** Falsches Verständnis oder unpassende Antworten.
        - *Mitigation:* Kontinuierliches Prompt-Engineering, Feinabstimmung, Nutzung spezifischer Modelle, Nutzerfeedback-Schleife, Fallback-Strategien.
    - **Skalierungsprobleme:** Performance-Engpässe bei hoher Nutzerzahl.
        - *Mitigation:* Skalierbare Cloud-Architektur (Firebase), Performance-Tests, Optimierung von Datenbankabfragen.
    - **Integration von RAGLLM:** Komplexität bei Aufbau und Wartung der Wissensdatenbank und des Retrieval-Systems.
        - *Mitigation:* Auswahl geeigneter Technologien, schrittweise Implementierung, Fokus auf Datenqualität.
- **Geschäftliche Risiken:**
    - **Geringe Nutzerakzeptanz:** Nutzer bevorzugen traditionelle Methoden oder Konkurrenzprodukte.
        - *Mitigation:* Starker Fokus auf UX/Usability, Beta-Tests, Marketing, klare Kommunikation des Mehrwerts.
    - **Datenschutzbedenken:** Nutzer zögern, sensible Hochzeitsdaten preiszugeben.
        - *Mitigation:* Transparente Datenschutzrichtlinien, robuste Sicherheitsmaßnahmen, DSGVO-Konformität.
    - **Monetarisierung:** Schwierigkeiten bei der Findung eines nachhaltigen Geschäftsmodells (falls geplant).
        - *Mitigation:* Marktanalyse, Testen verschiedener Modelle (Freemium, Premium-Features).
- **Projektrisiken:**
    - **Scope Creep:** Unkontrollierte Erweiterung des Funktionsumfangs.
        - *Mitigation:* Klares Anforderungsmanagement, Priorisierung nach Phasen, agiles Vorgehen.
    - **Verzögerungen im Zeitplan:** Unterschätzung der Komplexität, Ressourcenengpässe.
        - *Mitigation:* Realistische Planung, Pufferzeiten, agiles Projektmanagement, regelmäßige Fortschrittskontrolle.
    - **Abhängigkeit von externen APIs/Diensten:** Änderungen oder Ausfälle bei LLM-Providern etc.
        - *Mitigation:* Auswahl etablierter Anbieter, flexible Architektur für möglichen Wechsel, Monitoring der Abhängigkeiten. 