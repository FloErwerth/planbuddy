import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import de from "../locales/de.json";
import en from "../locales/en.json";

export const defaultNS = "translation";
export const resources = {
	de: { translation: de },
	en: { translation: en },
};

// Get device language (you can use expo-localization for this)
const getDeviceLanguage = (): string => {
	// Default to German for now
	// You can integrate expo-localization later to detect device language
	return "de";
};

export const defaultLocale = "de";
export const resourceDe = de;

i18n.use(initReactI18next).init({
	resources,
	defaultNS,
	lng: getDeviceLanguage(),
	fallbackLng: "de",
	interpolation: {
		escapeValue: false,
	},
	compatibilityJSON: "v4",
});

export default i18n;
