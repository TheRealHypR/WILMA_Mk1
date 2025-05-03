import React from 'react';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/de';
import isBetween from 'dayjs/plugin/isBetween';

dayjs.extend(isBetween);
dayjs.locale('de');

const seasons: { [key: string]: number[] } = {
  'Frühling': [2, 3, 4],
  'Sommer': [5, 6, 7],
  'Herbst': [8, 9, 10],
  'Winter': [11, 0, 1]
};

const getSeason = (date: Dayjs): string => {
  const month = date.month();
  for (const season in seasons) {
    if (seasons[season].includes(month)) {
      return season;
    }
  }
  return '';
};

export const getDateInsights = (date: Dayjs): string => {
  const today = dayjs();
  const diffDays = date.diff(today, 'day');
  const season = getSeason(date);
  const dayOfWeek = date.format('dddd');

  let insights = `Das ist ein ${dayOfWeek}. (${season})
`;

  if (diffDays < 0) {
    insights += ' Das Datum liegt in der Vergangenheit.';
  } else if (diffDays < 30) {
    insights += ' Sehr sportlich! Nur noch weniger als ein Monat.';
  } else if (diffDays < 180) {
    insights += ' Die heiße Planungsphase steht bevor!';
  } else {
    insights += ' Genug Zeit für eine entspannte Planung.';
  }

  if (date.month() === 1 && date.date() === 14) {
    insights += ' Valentinstag! Romantisch, aber potenziell teurer.';
  }
  if (date.month() === 11 && date.date() === 31) {
    insights += ' Silvester! Party-Stimmung, aber hohe Nachfrage.';
  }
  if ((dayOfWeek === 'Freitag' || dayOfWeek === 'Montag') && diffDays > 0) {
      insights += ' Liegt an einem Brückentag-Wochenende!';
  }

  return insights;
};

interface DatePickerComponentProps {
  value: Dayjs | null;
  onChange: (newValue: Dayjs | null) => void;
}

const DatePickerComponent: React.FC<DatePickerComponentProps> = ({ value, onChange }) => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="de">
      <StaticDatePicker
        displayStaticWrapperAs="desktop"
        value={value}
        onChange={onChange}
        orientation="portrait"
        dayOfWeekFormatter={(day) => dayjs(day).format('dd')}
        minDate={dayjs()}
        slotProps={{ actionBar: { actions: [] } }}
      />
    </LocalizationProvider>
  );
};

export default DatePickerComponent; 