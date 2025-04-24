import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Stepper,
  Step,
  StepLabel,
  Paper,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Checkbox,
  FormControlLabel,
  FormLabel,
  FormGroup,
  Snackbar,
  Alert as MuiAlert,
  CircularProgress
} from '@mui/material';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Schema } from 'yup';

// Typdefinition für die Formulardaten (3 Schritte)
type FormData = {
  // Step 1: Kontaktdaten & Event-Eckdaten
  firstName: string;
  lastName: string;
  email: string;
  emailConfirm: string;
  weddingDate: string;
  guestCount: number;
  budgetRange: string;
  eventType: string;

  // Step 2: Details zur Location
  locationName: string;
  locationStreet: string;
  locationCityZip: string;
  locationContactPerson?: string;

  // Step 3: Wünsche & Anforderungen
  cateringWishes: string;
  drinkWishes: string;
  neededSpaces?: string[];
  equipmentNeeded?: string[];
  accommodationNeeded?: string[];
  notes?: string;
  gdprConsent: boolean;
};

// === Validierungsschemata ===
const validationSchemaStep1 = yup.object({
  firstName: yup.string().required('Vorname ist erforderlich'),
  lastName: yup.string().required('Nachname ist erforderlich'),
  email: yup.string().email('Gültige E-Mail-Adresse eingeben').required('E-Mail ist erforderlich'),
  emailConfirm: yup.string()
    .oneOf([yup.ref('email')], 'E-Mail-Adressen müssen übereinstimmen')
    .required('E-Mail-Bestätigung ist erforderlich'),
  weddingDate: yup.string().required('Hochzeitsdatum ist erforderlich'),
  guestCount: yup.number()
    .typeError('Bitte eine Zahl eingeben')
    .positive('Gästeanzahl muss positiv sein')
    .integer('Gästeanzahl muss eine ganze Zahl sein')
    .required('Gästeanzahl ist erforderlich'),
  budgetRange: yup.string().required('Budgetrahmen ist erforderlich'),
  eventType: yup.string().required('Art der Veranstaltung ist erforderlich'),
});

const validationSchemaStep2 = yup.object({
  locationName: yup.string().required('Name der Location ist erforderlich'),
  locationStreet: yup.string().required('Straße & Hausnummer sind erforderlich.'),
  locationCityZip: yup.string().required('PLZ & Ort sind erforderlich.'),
  locationContactPerson: yup.string().optional().defined(),
});

const validationSchemaStep3 = yup.object({
  cateringWishes: yup.string().required('Catering-Wunsch ist erforderlich'),
  drinkWishes: yup.string().required('Getränke-Wunsch ist erforderlich'),
  neededSpaces: yup.array().of(yup.string()).optional(),
  equipmentNeeded: yup.array().of(yup.string()).optional(),
  accommodationNeeded: yup.array().of(yup.string()).optional(),
  notes: yup.string().optional().defined(),
  gdprConsent: yup.boolean().oneOf([true], 'Sie müssen der Verarbeitung Ihrer Daten zustimmen.').required(),
});

// Kombiniertes Schema mit expliziter Felddefinition (statt Referenzierung)
// Expliziter Typ entfernt, um Inferenz zu erlauben -> löst Resolver-Problem
const combinedSchema = yup.object({
  // Step 1
  firstName: yup.string().required('Vorname ist erforderlich.'),
  lastName: yup.string().required('Nachname ist erforderlich.'),
  email: yup.string().email('Gültige E-Mail-Adresse erforderlich.').required('E-Mail ist erforderlich.'),
  emailConfirm: yup.string()
    .oneOf([yup.ref('email'), undefined], 'E-Mail-Adressen müssen übereinstimmen.') // undefined zulassen, da yup.ref() null zurückgeben kann
    .required('E-Mail Bestätigung ist erforderlich.'),
  weddingDate: yup.string().required('Datum der Hochzeit ist erforderlich.'), // oder yup.date()... je nach Input
  guestCount: yup.number()
    .typeError('Anzahl der Gäste muss eine Zahl sein.')
    .positive('Anzahl der Gäste muss positiv sein.')
    .integer('Anzahl der Gäste muss eine ganze Zahl sein.')
    .required('Anzahl der Gäste ist erforderlich.'),
  budgetRange: yup.string().required('Budgetrahmen ist erforderlich.'),
  eventType: yup.string().required('Art der Veranstaltung ist erforderlich.'),

  // Step 2
  locationName: yup.string().required('Name der Location ist erforderlich.'),
  locationStreet: yup.string().required('Straße & Hausnummer ist erforderlich.'),
  locationCityZip: yup.string().required('PLZ & Ort ist erforderlich.'),
  locationContactPerson: yup.string().optional().defined(),

  // Step 3
  cateringWishes: yup.string().required('Catering-Wünsche sind erforderlich.'),
  drinkWishes: yup.string().required('Getränke-Wünsche sind erforderlich.'),
  neededSpaces: yup.array().of(yup.string().required()).min(1, 'Mindestens ein Raum muss ausgewählt werden.').optional(), // .optional() und .required() für Array-Elemente
  equipmentNeeded: yup.array().of(yup.string().required()).optional(), // .optional() und .required() für Array-Elemente
  accommodationNeeded: yup.array().of(yup.string().required()).optional(), // .optional() und .required() für Array-Elemente
  notes: yup.string().optional().defined(), // .defined() hinzugefügt
  gdprConsent: yup.boolean().oneOf([true], 'Sie müssen der Verarbeitung Ihrer Daten zustimmen.').required(),
});

const steps = ['Kontaktdaten & Event', 'Location-Details', 'Wünsche & Anfrage'];

// Optionen
const eventTypeOptions = ['Empfang & Feier', 'Nur Feier', 'Nur Empfang', 'Zeremonie & Feier', 'Andere...'];
const OTHER_EVENT_TYPE_VALUE = 'Andere...';
const cateringOptions = ['Buffet', 'Menü (bitte Vorschläge)', 'Flying Buffet / Fingerfood', 'Externer Caterer (bitte prüfen)', 'Kein Catering benötigt', 'Andere...'];
const OTHER_CATERING_VALUE = 'Andere...';
const drinkOptions = ['Getränkepauschale bevorzugt', 'Abrechnung nach Verbrauch', 'Eigene Getränke (Korkgeld?)', 'Andere...'];
const OTHER_DRINKS_VALUE = 'Andere...';
const spaceOptions = ['Festsaal', 'Terrasse/Garten', 'Tanzfläche', 'Bar', 'Kinderspielbereich'];
const equipmentOptions = ['Beamer/Leinwand', 'Musikanlage (DJ)', 'Musikanlage (Live-Band)', 'Mikrofon', 'Bestuhlung für Zeremonie'];
const accommodationOptions = ['Zimmer für Brautpaar', 'Zimmer für Gäste (wenige)', 'Zimmer für Gäste (viele)', 'Keine Übernachtung nötig'];

// Definiere den Typ für Alert Severity explizit
type AlertSeverity = 'success' | 'error' | 'info' | 'warning';

const LocationRequestPage: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [showOtherEventType, setShowOtherEventType] = useState(false);
  const [otherEventTypeValue, setOtherEventTypeValue] = useState('');
  const [showOtherCatering, setShowOtherCatering] = useState(false);
  const [otherCateringValue, setOtherCateringValue] = useState('');
  const [showOtherDrinks, setShowOtherDrinks] = useState(false);
  const [otherDrinksValue, setOtherDrinksValue] = useState('');

  // Snackbar State
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<AlertSeverity>('success');

  const {
    control,
    handleSubmit,
    register,
    trigger,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(combinedSchema),
    defaultValues: {
      firstName: '', lastName: '', email: '', emailConfirm: '', weddingDate: '', guestCount: 0,
      budgetRange: '', eventType: '',
      locationName: '', locationStreet: '', locationCityZip: '', locationContactPerson: '',
      cateringWishes: '', drinkWishes: '', neededSpaces: [], equipmentNeeded: [], accommodationNeeded: [],
      notes: '', gdprConsent: false,
    },
    mode: 'onTouched',
  });

  const watchedEventType = watch('eventType');
  const watchedCatering = watch('cateringWishes');
  const watchedDrinks = watch('drinkWishes');

  React.useEffect(() => {
    setShowOtherEventType(watchedEventType === OTHER_EVENT_TYPE_VALUE);
    if (watchedEventType !== OTHER_EVENT_TYPE_VALUE) setOtherEventTypeValue('');
  }, [watchedEventType]);

  React.useEffect(() => {
    setShowOtherCatering(watchedCatering === OTHER_CATERING_VALUE);
    if (watchedCatering !== OTHER_CATERING_VALUE) setOtherCateringValue('');
  }, [watchedCatering]);

  React.useEffect(() => {
    setShowOtherDrinks(watchedDrinks === OTHER_DRINKS_VALUE);
    if (watchedDrinks !== OTHER_DRINKS_VALUE) setOtherDrinksValue('');
  }, [watchedDrinks]);

  const handleNext = async () => {
    const stepFields: Record<number, (keyof FormData)[]> = {
      0: ['firstName','lastName','email','emailConfirm','weddingDate','guestCount','budgetRange','eventType'],
      1: ['locationName','locationStreet','locationCityZip','locationContactPerson'],
    };
    const fieldsToValidate = stepFields[activeStep] || [];
    const isValid = await trigger(fieldsToValidate);
    if (isValid) setActiveStep(prev => prev + 1);
  };

  const handleBack = () => setActiveStep(prev => prev - 1);

  const onSubmit: SubmitHandler<any> = async data => {
    const finalData = {
      ...data,
      eventType: data.eventType === OTHER_EVENT_TYPE_VALUE ? otherEventTypeValue : data.eventType,
      cateringWishes: data.cateringWishes === OTHER_CATERING_VALUE ? otherCateringValue : data.cateringWishes,
      drinkWishes: data.drinkWishes === OTHER_DRINKS_VALUE ? otherDrinksValue : data.drinkWishes,
    };

    const webhookUrl = import.meta.env.VITE_N8N_WEBHOOK_URL;

    if (!webhookUrl) {
      console.error("Fehler: VITE_N8N_WEBHOOK_URL ist nicht in der .env-Datei definiert.");
      setSnackbarMessage('Konfigurationsfehler: Webhook-URL fehlt.');
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
      return; // Verhindert den Fetch-Aufruf
    }

    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(finalData),
      });
      if (response.ok) {
        console.log("Fetch erfolgreich, response.ok ist true");
        setSnackbarMessage('Vielen Dank! Ihre Anfrage wurde erfolgreich übermittelt.');
        setSnackbarSeverity('success');
        console.log("Versuche Snackbar zu öffnen (Erfolg)");
        setSnackbarOpen(true);
        reset(); // Formular zurücksetzen
        setActiveStep(0); // Optional: Zum ersten Schritt zurückkehren
      } else {
        const text = await response.text();
        console.error('Fehler:', response.status, text);
        console.log("Fetch nicht ok, Status:", response.status);
        setSnackbarMessage(`Fehler beim Senden: ${response.status} - ${text}`);
        setSnackbarSeverity('error');
        console.log("Versuche Snackbar zu öffnen (Fetch Fehler)");
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.error('Netzwerkfehler:', error);
      console.log("Fetch catch Block erreicht");
      setSnackbarMessage('Netzwerkfehler: Konnte den Server nicht erreichen.');
      setSnackbarSeverity('error');
      console.log("Versuche Snackbar zu öffnen (Netzwerk Fehler)");
      setSnackbarOpen(true);
    }
  };

  const handleCloseSnackbar = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  return (
    <Container maxWidth="md" sx={{ py: { xs: 4, md: 6 } }}>
      <Paper elevation={3} sx={{ p: { xs: 2, sm: 3, md: 4 } }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600 }}>
            Detaillierte Location-Anfrage
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Beschreibe uns deine Traumlocation – wir helfen dir bei der Suche!
          </Typography>
        </Box>

        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map(label => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          {activeStep === 0 && (
            <Box>
              <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>Schritt 1: Kontaktdaten & Event</Typography>
              <Grid container spacing={2}>
                {/* @ts-ignore - Grid prop type error */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    {...register("firstName")}
                    fullWidth
                    label="Vorname"
                    error={!!errors.firstName}
                    helperText={errors.firstName?.message}
                  />
                </Grid>
                {/* @ts-ignore - Grid prop type error */}
                <Grid item xs={12} sm={6}>
                  <TextField
                    {...register("lastName")}
                    fullWidth
                    label="Nachname"
                    error={!!errors.lastName}
                    helperText={errors.lastName?.message}
                  />
                </Grid>
                {/* @ts-ignore - Grid prop type error */}
                <Grid item xs={12} sm={6}>
                  <TextField {...register("email")} label="E-Mail" type="email" fullWidth required error={!!errors.email} helperText={errors.email?.message} />
                </Grid>
                {/* @ts-ignore - Grid prop type error */}
                <Grid item xs={12} sm={6}>
                  <TextField {...register("emailConfirm")} label="E-Mail bestätigen" type="email" fullWidth required error={!!errors.emailConfirm} helperText={errors.emailConfirm?.message} />
                </Grid>
                {/* @ts-ignore - Grid prop type error */}
                <Grid item xs={12} sm={6}>
                  <TextField {...register("weddingDate")} label="Hochzeitsdatum (ca.)" placeholder="z.B. 08.08.2026" fullWidth required error={!!errors.weddingDate} helperText={errors.weddingDate?.message} />
                </Grid>
                {/* @ts-ignore - Grid prop type error */}
                <Grid item xs={12} sm={6}>
                  <TextField {...register("guestCount")} label="Gästeanzahl (ca.)" type="number" fullWidth required error={!!errors.guestCount} helperText={errors.guestCount?.message} InputProps={{ inputProps: { min: 1 } }} />
                </Grid>
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
                    <TextField
                      sx={{ flexGrow: 1 }}
                      {...register("budgetRange")}
                      label="Budgetrahmen (ca.)"
                      placeholder="z.B. 10.000 - 15.000 €"
                      fullWidth
                      required
                      error={!!errors.budgetRange}
                      helperText={errors.budgetRange?.message}
                    />
                    <FormControl
                      sx={{ flexGrow: 1 }}
                      fullWidth
                      required
                      error={!!errors.eventType}
                      variant="outlined"
                    >
                      <InputLabel id="event-type-label">Art der Veranstaltung</InputLabel>
                      <Controller
                        name="eventType"
                        control={control}
                        render={({ field }) => (
                          <Select
                            labelId="event-type-label"
                            label="Art der Veranstaltung"
                            {...field}
                          >
                            <MenuItem value="" disabled><em>Bitte auswählen...</em></MenuItem>
                            {eventTypeOptions.map(option => (
                              <MenuItem key={option} value={option}>
                                {option}
                              </MenuItem>
                            ))}
                          </Select>
                        )}
                      />
                      {errors.eventType && <FormHelperText>{errors.eventType.message}</FormHelperText>}
                    </FormControl>
                  </Box>
                </Grid>

                {showOtherEventType && (
                  <Grid item xs={12}>
                    <TextField
                      label="Veranstaltungsart (Eigene Angabe)"
                      value={otherEventTypeValue}
                      onChange={e => setOtherEventTypeValue(e.target.value)}
                      fullWidth
                      required
                      sx={{ mt: 2 }}
                    />
                  </Grid>
                )}
              </Grid>
            </Box>
          )}

          {activeStep === 1 && (
            <Box>
              <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>Schritt 2: Location-Details</Typography>
              <Grid container spacing={2}>
                {/* @ts-ignore - Grid prop type error */}
                <Grid item xs={12}>
                  <TextField {...register("locationName")} label="Name der Location" fullWidth required error={!!errors.locationName} helperText={errors.locationName?.message} />
                </Grid>
                {/* @ts-ignore - Grid prop type error */}
                <Grid item xs={12} sm={6}>
                  <TextField {...register("locationStreet")} label="Straße & Hausnummer" fullWidth required error={!!errors.locationStreet} helperText={errors.locationStreet?.message} />
                </Grid>
                {/* @ts-ignore - Grid prop type error */}
                <Grid item xs={12} sm={6}>
                  <TextField {...register("locationCityZip")} label="PLZ & Ort" fullWidth required error={!!errors.locationCityZip} helperText={errors.locationCityZip?.message} />
                </Grid>
                {/* @ts-ignore - Grid prop type error */}
                <Grid item xs={12}>
                  <TextField {...register("locationContactPerson")} label="Ansprechpartner (falls bekannt)" fullWidth error={!!errors.locationContactPerson} helperText={errors.locationContactPerson?.message} />
                </Grid>
              </Grid>
            </Box>
          )}

          {activeStep === 2 && (
            <Box>
              <Typography variant="h6" gutterBottom sx={{ mb: 2 }}>Schritt 3: Wünsche & Anfrage</Typography>
              <Grid container spacing={2}>
                {/* @ts-ignore - Grid prop type error */}
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
                    <FormControl sx={{ flexGrow: 1 }} fullWidth required error={!!errors.cateringWishes} variant="outlined">
                      <InputLabel id="catering-label">Catering-Wünsche</InputLabel>
                      <Controller
                        name="cateringWishes"
                        control={control}
                        render={({ field }) => (
                          <Select labelId="catering-label" label="Catering-Wünsche" {...field}>
                            <MenuItem value="" disabled><em>Bitte auswählen...</em></MenuItem>
                            {cateringOptions.map(option => <MenuItem key={option} value={option}>{option}</MenuItem>)}
                          </Select>
                        )}
                      />
                      {errors.cateringWishes && <FormHelperText>{errors.cateringWishes.message}</FormHelperText>}
                    </FormControl>

                    <FormControl sx={{ flexGrow: 1 }} fullWidth required error={!!errors.drinkWishes} variant="outlined">
                      <InputLabel id="drinks-label">Getränke-Wünsche</InputLabel>
                      <Controller
                        name="drinkWishes"
                        control={control}
                        render={({ field }) => (
                          <Select labelId="drinks-label" label="Getränke-Wünsche" {...field}>
                            <MenuItem value="" disabled><em>Bitte auswählen...</em></MenuItem>
                            {drinkOptions.map(option => <MenuItem key={option} value={option}>{option}</MenuItem>)}
                          </Select>
                        )}
                      />
                      {errors.drinkWishes && <FormHelperText>{errors.drinkWishes.message}</FormHelperText>}
                    </FormControl>
                  </Box>
                </Grid>

                {showOtherCatering && (
                  <Grid item xs={12}>
                    <TextField
                      label="Catering (Eigene Angabe)"
                      value={otherCateringValue}
                      onChange={e => setOtherCateringValue(e.target.value)}
                      fullWidth required sx={{ mt: 1 }}
                    />
                  </Grid>
                )}

                {showOtherDrinks && (
                  <Grid item xs={12}>
                    <TextField
                      label="Getränke (Eigene Angabe)"
                      value={otherDrinksValue}
                      onChange={e => setOtherDrinksValue(e.target.value)}
                      fullWidth required sx={{ mt: 1 }}
                    />
                  </Grid>
                )}

                <Grid item xs={12} md={4}>
                  <FormControl component="fieldset" variant="standard" sx={{ width: '100%' }}>
                    <FormLabel component="legend">Benötigte Räume</FormLabel>
                    <Controller
                      name="neededSpaces"
                      control={control}
                      render={({ field }) => (
                        <FormGroup>
                          {spaceOptions.map(option => (
                            <FormControlLabel
                              key={option}
                              control={
                                <Checkbox
                                  checked={field.value?.includes(option) ?? false}
                                  onChange={e => {
                                    const value = field.value || [];
                                    const newValue = e.target.checked
                                      ? [...value, option]
                                      : value.filter(v => v !== option);
                                    field.onChange(newValue);
                                  }}
                                />
                              }
                              label={option}
                            />
                          ))}
                        </FormGroup>
                      )}
                    />
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={4}>
                   <FormControl component="fieldset" variant="standard" sx={{ width: '100%' }}>
                    <FormLabel component="legend">Ausstattungsbedarf</FormLabel>
                    <Controller
                      name="equipmentNeeded"
                      control={control}
                      render={({ field }) => (
                        <FormGroup>
                          {equipmentOptions.map(option => (
                            <FormControlLabel
                              key={option}
                              control={
                                <Checkbox
                                  checked={field.value?.includes(option) ?? false}
                                  onChange={e => {
                                    const value = field.value || [];
                                    const newValue = e.target.checked
                                      ? [...value, option]
                                      : value.filter(v => v !== option);
                                    field.onChange(newValue);
                                  }}
                                />
                              }
                              label={option}
                            />
                          ))}
                        </FormGroup>
                      )}
                    />
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={4}>
                   <FormControl component="fieldset" variant="standard" sx={{ width: '100%' }}>
                    <FormLabel component="legend">Unterkunft</FormLabel>
                    <Controller
                      name="accommodationNeeded"
                      control={control}
                      render={({ field }) => (
                        <FormGroup>
                          {accommodationOptions.map(option => (
                            <FormControlLabel
                              key={option}
                              control={
                                <Checkbox
                                  checked={field.value?.includes(option) ?? false}
                                  onChange={e => {
                                    const value = field.value || [];
                                    const newValue = e.target.checked
                                      ? [...value, option]
                                      : value.filter(v => v !== option);
                                    field.onChange(newValue);
                                  }}
                                />
                              }
                              label={option}
                            />
                          ))}
                        </FormGroup>
                      )}
                    />
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <TextField {...register("notes")} label="Sonstige Anmerkungen / Fragen" multiline rows={4} fullWidth error={!!errors.notes} helperText={errors.notes?.message} />
                </Grid>

                <Grid item xs={12}>
                   <FormControl required error={!!errors.gdprConsent} component="fieldset" variant="standard">
                     <Controller
                        name="gdprConsent"
                        control={control}
                        rules={{ required: true }}
                        render={({ field }) => (
                           <FormControlLabel
                              control={<Checkbox {...field} checked={field.value} />}
                              label="Ich stimme der Verarbeitung meiner Daten gemäß der Datenschutzerklärung zu."
                            />
                        )}
                      />
                      {errors.gdprConsent && <FormHelperText>{errors.gdprConsent.message}</FormHelperText>}
                   </FormControl>
                 </Grid>
              </Grid>
            </Box>
          )}

          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
            <Button disabled={activeStep === 0 || isSubmitting} onClick={handleBack}>Zurück</Button>
            {activeStep === steps.length - 1 ? (
              <Button
                type="submit"
                variant="contained"
                disabled={isSubmitting}
                startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : null}
              >
                {isSubmitting ? 'Wird gesendet...' : 'Anfrage senden'}
              </Button>
            ) : (
              <Button variant="contained" onClick={handleNext} disabled={isSubmitting}>
                Weiter
              </Button>
            )}
          </Box>
        </form>
      </Paper>

      {/* Snackbar für Feedback */}
      {/* {console.log("Snackbar wird gerendert, open:", snackbarOpen)} */}
      <Snackbar open={snackbarOpen} onClose={handleCloseSnackbar}>
        <MuiAlert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </MuiAlert>
      </Snackbar>

    </Container>
  );
};

export default LocationRequestPage; 