import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useState } from 'react';

import { Button } from '@/components/tamagui/Button';
import { View, XStack } from 'tamagui';
import { formatToDate, formatToTime } from '@/components/Calendar/utils';

type CalendarProps = {
  onDateSelected: (date: Date) => void;
  date: Date;
};

export const Calendar = ({ date, onDateSelected }: CalendarProps) => {
  const [calendarMode, setCalendarMode] = useState<'date' | 'time'>('date');
  const [showCalendar, setShowCalendar] = useState(false);

  const handleShowCalendar = () => {
    setCalendarMode('date');
    setShowCalendar(true);
  };

  const handleShowTime = () => {
    setCalendarMode('time');
    setShowCalendar(true);
  };

  const handleSelectDate = (event: DateTimePickerEvent, date?: Date) => {
    setShowCalendar(false);
    if (event.type === 'set' && date !== undefined) {
      onDateSelected(date);
    }
  };

  return (
    <View>
      <XStack gap="$2">
        <Button flex={1} borderColor="transparent" onPress={handleShowCalendar}>
          {formatToDate(date) ?? 'Zeitpunkt auswählen'}
        </Button>
        <Button flex={1} borderColor="transparent" onPress={handleShowTime}>
          {formatToTime(date)}
        </Button>
      </XStack>
      {showCalendar && (
        <DateTimePicker
          locale="de-DE"
          is24Hour
          onChange={handleSelectDate}
          mode={calendarMode}
          value={date}
        />
      )}
    </View>
  );
};
