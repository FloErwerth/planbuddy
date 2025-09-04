import { Platform } from "react-native";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import { type Status } from "@/api/types";

export const registerForPushNotificationsAsync = async () => {
	if (Platform.OS === "android") {
		await Notifications.setNotificationChannelAsync("default", {
			name: "default",
			importance: Notifications.AndroidImportance.MAX,
			vibrationPattern: [0, 250, 250, 250],
			lightColor: "#FF231F7C",
		});
	}

	if (Device.isDevice) {
		const { status: existingStatus } = await Notifications.getPermissionsAsync();
		let finalStatus = existingStatus;
		if (existingStatus !== "granted") {
			const { status } = await Notifications.requestPermissionsAsync();
			finalStatus = status;
		}
		if (finalStatus !== "granted") {
			return;
		}
		const projectId = Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
		if (!projectId) {
			return;
		}
		try {
			const pushTokenString = (
				await Notifications.getExpoPushTokenAsync({
					projectId,
				})
			).data;
			return pushTokenString;
		} catch (e: unknown) {
			console.error(e);
		}
	} else {
		return "mockNotifiationToken";
	}
};

export type PushNotificationData = {
	title: string;
	body: string;
	data?: Record<string, unknown>;
};

const sendPushNotification = async (expoPushToken: string, data: PushNotificationData) => {
	const message = {
		to: expoPushToken,
		sound: "default",
		...data,
	};
	await fetch("https://exp.host/--/api/v2/push/send", {
		method: "POST",
		headers: {
			Accept: "application/json",
			"Accept-encoding": "gzip, deflate",
			"Content-Type": "application/json",
		},
		body: JSON.stringify(message),
	});
};

export const sendGuestInviteNotification = async (expoPushToken: string, inviterName?: string, eventName?: string) => {
	const data = { title: "Neue Einladung!", body: "" };
	if (!eventName) {
		data.body = `${inviterName ?? "Jemand"} hat dich zu einem Event eingeladen.`;
	} else {
		data.body = `${inviterName ?? "Jemand"} hat dich zum Event ${eventName} eingeladen.`;
	}
	await sendPushNotification(expoPushToken, data);
};

export const sendGuestHasAnsweredInviteNotification = async (expoPushToken: string, newStatus: Status, guestName?: string, eventName?: string) => {
	if (newStatus === "PENDING") {
		return;
	}

	const data = {
		title: "Deine Einladung wurde angenommen",
		body: `${guestName ?? "Jemand"} hat deine Einladung ${eventName ? `zum Event ${eventName}` : "zu einem Event"} ${newStatus === "ACCEPTED" ? "angenommen" : "abgelehnt"}.`,
	};

	await sendPushNotification(expoPushToken, data);
};
