import { colors } from "@/providers/TamaguiProvider/tamaguiConfig";
import { timePartialsWithoutTimeZone } from "@/utils/date";
import React, { ComponentProps } from "react";
import { LocaleConfig, Calendar as ReactNativeCalendar } from "react-native-calendars";
import { CalendarProps } from "./types";

LocaleConfig.locales["de"] = {
	monthNames: ["Januar", "Februar", "März", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Dezember"],
	monthNamesShort: ["Jan", "Feb", "Mär", "Apr", "Mai", "Jun", "Jul", "Aug", "Sep", "Okt", "Nov", "Dez"],
	dayNames: ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag", "Sonntag"],
	dayNamesShort: ["Mo", "Di", "Mi", "Do", "Fr", "Sa", "So"],
	today: "heute",
};
LocaleConfig.defaultLocale = "de";

export const Calendar = ({ date, onDateSelected, minimumDate, maximumDate }: CalendarProps) => {
	const isoDate = date.toISOString();
	const minimumIsoDate = minimumDate?.toISOString();
	const maximumIsoDate = maximumDate?.toISOString();

	const markedDates: ComponentProps<typeof ReactNativeCalendar>["markedDates"] = {
		[timePartialsWithoutTimeZone(date).date]: { selected: true },
	};

	const theme: ComponentProps<typeof ReactNativeCalendar>["theme"] = {
		backgroundColor: "transparent",
		calendarBackground: "transparent",
		textSectionTitleColor: colors.accent2,
		selectedDayBackgroundColor: colors.primary,
		selectedDayTextColor: colors.background,
		todayTextColor: "#00adf5",
		dayTextColor: colors.color,
		textDisabledColor: colors.disabled.toString(),
		arrowColor: colors.primary,
	};

	return (
		<ReactNativeCalendar
			minDate={minimumIsoDate}
			maxDate={maximumIsoDate}
			initialDate={isoDate}
			onDayPress={(data) => {
				onDateSelected(new Date(data.dateString));
			}}
			markedDates={markedDates}
			theme={theme}
		/>
	);
};
