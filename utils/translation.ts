import { getCalendars, getLocales } from "expo-localization";

export const getLocale = () => {
	return getLocales()[0].languageTag;
};

export const getIs24HourFormat = () => {
	return getCalendars()[0].uses24hourClock;
};
