import type { ComponentProps } from "react";
import { LocaleConfig, Calendar as ReactNativeCalendar } from "react-native-calendars";
import i18n from "@/i18n";
import { colors } from "@/providers/TamaguiProvider/tamaguiConfig";
import { timePartialsWithoutTimeZone } from "@/utils/date";
import type { CalendarProps } from "./types";

// Setup calendar locales
const setupCalendarLocales = () => {
	const t = i18n.t.bind(i18n);

	LocaleConfig.locales.de = {
		monthNames: [
			t("calendar.monthNames.january"),
			t("calendar.monthNames.february"),
			t("calendar.monthNames.march"),
			t("calendar.monthNames.april"),
			t("calendar.monthNames.may"),
			t("calendar.monthNames.june"),
			t("calendar.monthNames.july"),
			t("calendar.monthNames.august"),
			t("calendar.monthNames.september"),
			t("calendar.monthNames.october"),
			t("calendar.monthNames.november"),
			t("calendar.monthNames.december"),
		],
		monthNamesShort: [
			t("calendar.monthNamesShort.jan"),
			t("calendar.monthNamesShort.feb"),
			t("calendar.monthNamesShort.mar"),
			t("calendar.monthNamesShort.apr"),
			t("calendar.monthNamesShort.may"),
			t("calendar.monthNamesShort.jun"),
			t("calendar.monthNamesShort.jul"),
			t("calendar.monthNamesShort.aug"),
			t("calendar.monthNamesShort.sep"),
			t("calendar.monthNamesShort.oct"),
			t("calendar.monthNamesShort.nov"),
			t("calendar.monthNamesShort.dec"),
		],
		dayNames: [
			t("calendar.dayNames.monday"),
			t("calendar.dayNames.tuesday"),
			t("calendar.dayNames.wednesday"),
			t("calendar.dayNames.thursday"),
			t("calendar.dayNames.friday"),
			t("calendar.dayNames.saturday"),
			t("calendar.dayNames.sunday"),
		],
		dayNamesShort: [
			t("calendar.dayNamesShort.mon"),
			t("calendar.dayNamesShort.tue"),
			t("calendar.dayNamesShort.wed"),
			t("calendar.dayNamesShort.thu"),
			t("calendar.dayNamesShort.fri"),
			t("calendar.dayNamesShort.sat"),
			t("calendar.dayNamesShort.sun"),
		],
		today: t("calendar.today"),
	};

	LocaleConfig.locales.en = {
		monthNames: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
		monthNamesShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
		dayNames: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
		dayNamesShort: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
		today: "today",
	};

	LocaleConfig.defaultLocale = i18n.language;
};

setupCalendarLocales();

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
			headerStyle={{
				height: 50,
			}}
			initialDate={isoDate}
			onDayPress={(data) => {
				onDateSelected(new Date(data.dateString));
			}}
			markedDates={markedDates}
			theme={theme}
		/>
	);
};
