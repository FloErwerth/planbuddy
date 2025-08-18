import { colors } from '@/providers/TamaguiProvider/tamaguiConfig';
import React from 'react';
import { LocaleConfig, Calendar as ReactNativeCalendar } from 'react-native-calendars';
import { CalendarProps } from './types';

LocaleConfig.locales['de'] = {
    monthNames: ['Januar', 'Februar', 'März', 'April', 'Mai', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember'],
    monthNamesShort: ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'],
    dayNames: ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag', 'Sonntag'],
    dayNamesShort: ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'],
    today: 'heute',
};
LocaleConfig.defaultLocale = 'de';

export const Calendar = ({ date, onDateSelected, minimumDate, maximumDate }: CalendarProps) => {
    const calendarTheme = {
        backgroundColor: 'transparent',
        calendarBackground: 'transparent',
        textSectionTitleColor: '#b6c1cd',
        selectedDayBackgroundColor: '#00adf5',
        selectedDayTextColor: '#ffffff',
        todayTextColor: colors.accent2,
        dayTextColor: '#2d4150',
        textDisabledColor: colors.disabled,
    } as const;

    return (
        <ReactNativeCalendar
            date={date?.toISOString()}
            minDate={minimumDate?.toISOString()}
            maxDate={maximumDate?.toISOString()}
            onDayPress={(data) => onDateSelected(new Date(data.dateString))}
            current={date?.toISOString()}
            theme={calendarTheme}
        />
    );
};
