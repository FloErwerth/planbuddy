import { config } from "@tamagui/config";
import { color } from "@tamagui/themes";
import { createFont, createTamagui } from "tamagui";

export const colors = {
	...color,
	color: "#171614",
	disabled: color.gray8Light,
	background: "#F9F7F7",
	accent: "#DBE2EF",
	accent2: "#2c2a26",
	primary: "#19a1e6",
};

const font = createFont({
	family: "Normal",
	size: {
		1: 8,
		2: 10,
		3: 12,
		4: 14,
		5: 16,
		6: 18,
		7: 20,
		8: 24,
		9: 28,
		10: 32,
		11: 38,
		12: 50,
	},
	lineHeight: {
		1: 10,
		2: 12,
		3: 14,
		4: 16,
		5: 20,
		6: 24,
		7: 28,
		8: 32,
		9: 38,
		10: 42,
		11: 48,
		12: 64,
	},
	weight: {
		400: 400,
		500: 500,
		700: 700,
	},
	face: {
		400: {
			normal: "Normal",
			italic: "Italic",
		},
		500: {
			normal: "SemiBold",
			italic: "SemiBoldItalic",
		},
		700: {
			normal: "Bold",
			italic: "BoldItalic",
		},
	},
});

export const tamaguiConfig = createTamagui({
	...config,
	fonts: {
		body: font,
		heading: font,
	},

	tokens: {
		...config.tokens,
		color: {
			...config.tokens.color,
			color: colors.color,
			primary: colors.primary,
			background: colors.background,
			accent: colors.accent,
			accent2: colors.accent2,
		},
	},

	themes: {
		default: {
			disabled: colors.disabled,
			color: colors.color,
			borderColor: "#656565",
			focusColor: "#354173",
			placeholderColor: color.gray10Light,
			primary: colors.primary,
			background: colors.background,
			accent: colors.accent,
		},
		error: {
			placeholderColor: color.red7Light,

			primary: color.red9Light,
			background: color.red4Light,
			color: color.red9Light,
			borderColor: color.red10Light,
			fill: color.red9Light,
			colorFocus: color.red9Light,
			colorActive: color.red9Light,
			backgroundColorFocus: color.red3Light,
			backgroundColorActive: color.red3Light,
			placeholderTextColor: color.red9Light,
			accent: color.red4Light,
		},
		dark: {
			bg: "#111",
			color: "#000",
		},
	},
});
