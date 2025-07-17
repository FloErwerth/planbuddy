import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useState } from 'react';

import { Button } from '@/components/tamagui/Button';
import { SizableText, View, XStack } from 'tamagui';
import { formatToDate, formatToTime } from '@/utils/date';

type CalendarProps = {
    onDateSelected: (date: Date) => void;
    date: Date;
    minimumDate?: Date;
    maximumDate?: Date;
};

export const Calendar = ({ date, onDateSelected, minimumDate, maximumDate }: CalendarProps) => {
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
        <View flex={1}>
            <XStack gap="$2">
                <Button flex={1} size="$2" variant="transparent" onPress={handleShowCalendar}>
                    <SizableText>{formatToDate(date) ?? 'Zeitpunkt auswählen'}</SizableText>
                </Button>
                <Button flex={1} size="$2" variant="transparent" onPress={handleShowTime}>
                    <SizableText>{formatToTime(date)}</SizableText>
                </Button>
            </XStack>
            {showCalendar && (
                <DateTimePicker
                    locale="de-DE"
                    onChange={handleSelectDate}
                    is24Hour
                    mode={calendarMode}
                    value={date}
                    minimumDate={minimumDate}
                    maximumDate={maximumDate}
                />
            )}
        </View>
    );
};
