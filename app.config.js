const packageJson = require("./package.json");

export default {
	expo: {
		extra: {
			eas: {
				projectId: "ddcf8e81-e61c-4947-81a1-527ddc53e685",
			},
		},
		name: "planbuddy",
		slug: "planbuddy",
		version: packageJson.version,
		orientation: "portrait",
		scheme: "planbuddy",
		userInterfaceStyle: "automatic",
		ios: {
			bundleIdentifier: "de.florian.erwerth.planbuddy",
			supportsTablet: false,
			infoPlist: {
				ITSAppUsesNonExemptEncryption: false,
			},
			icon: {
				light: "./assets/images/ios-light.png",
				dark: "./assets/images/ios-dark.png",
				tinted: "./assets/images/ios-tinted.png",
			},
		},
		android: {
			package: "de.florian.erwerth.planbuddy",
			edgeToEdgeEnabled: true,
			adaptiveIcon: {
				backgroundColor: "#ffffff",
				foregroundImage: "./assets/images/adaptive-icon.png",
				monochromeImage: "./assets/images/adaptive-icon.png",
			},
			intentFilters: [
				{
					action: "VIEW",
					autoVerify: true,
					data: [
						{
							scheme: "https",
							host: "events-with-friends-9e33b.web.app",
							pathPrefix: "/joinEvent/*",
						},
					],
					category: ["BROWSABLE", "DEFAULT"],
				},
			],
			googleServicesFile: "./google-services.json",
		},
		plugins: [
			"expo-router",
			[
				"expo-image-picker",
				{
					photosPermission: "The app accesses your photos to let you share them with your friends.",
				},
			],
			"expo-font",
			[
				"@sentry/react-native/expo",
				{
					url: "https://sentry.io/",
					project: "planbuddy-app",
					organization: "florian-erwerth",
				},
			],
			"expo-build-properties",
			"react-native-compressor",
			"expo-notifications",
			[
				"expo-splash-screen",
				{
					backgroundColor: "#F9F7F7",
					image: "./assets/images/splash-icon.png",
					dark: {
						image: "./assets/images/splash-icon.png",
						backgroundColor: "#000000",
					},
					imageWidth: 200,
				},
			],
		],
		experiments: {
			reactCompiler: true,
			typedRoutes: true,
		},
	},
};
