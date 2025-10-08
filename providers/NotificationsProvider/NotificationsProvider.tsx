import { registerForPushNotificationsAsync } from "@/utils/notifications";
import { createContext, type PropsWithChildren, useContext, useEffect, useState } from "react";
import * as Notifications from "expo-notifications";
import z from "zod";
import { useUpdateUserMutation } from "@/api/user/updateUser";
import { useGetUser } from "@/store/authentication";

export const NotificationChannelEnumDefinition = z.enum(["GUEST_INVITE", "GUEST_UPDATE", "GUEST_START", "HOST_INVITATION_ANSWERED"]);
export const NotificationChannelEnum = NotificationChannelEnumDefinition.Enum;
type NotificationChannel = z.infer<typeof NotificationChannelEnumDefinition>;

type NotificationContextType = {
	token?: string;
	channels: {
		isChannelActive: (channel: NotificationChannel) => boolean;
		add: (channel: NotificationChannel) => void;
		remove: (channel: NotificationChannel) => void;
		toggle: (channel: NotificationChannel) => void;
	};
	register: () => Promise<void>;
	notification: Notifications.Notification | undefined;
};

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotificationContext = () => {
	const context = useContext(NotificationContext);
	if (!context) {
		throw new Error("The useNotificationContext must be within the notification context provider");
	}
	return context;
};

export const NotificationsProvider = ({ children }: PropsWithChildren) => {
	const user = useGetUser();
	const [notification, setNotification] = useState<Notifications.Notification | undefined>();
	const { mutateAsync } = useUpdateUserMutation();

	const registerForPushNotifications = async () => {
		registerForPushNotificationsAsync().then(async (token) => {
			await mutateAsync({ updatedUser: { pushToken: token } });
		});
	};

	const checkRegistrationStatus = async (success: () => void, error?: () => void) => {
		try {
			if (!user?.pushToken) {
				const token = await registerForPushNotificationsAsync();
				if (token) {
					await mutateAsync({ updatedUser: { pushToken: token } });
					success();
				} else {
					error?.();
				}
			} else {
				success();
			}
		} catch (e) {
			error?.();
		}
	};

	useEffect(() => {
		const notificationListener = Notifications.addNotificationReceivedListener((notification) => {
			setNotification(notification);
		});

		const responseListener = Notifications.addNotificationResponseReceivedListener((response) => {
			// todo: wenn deep link vorhanden dahin leiten
			console.log(response);
		});

		return () => {
			notificationListener.remove();
			responseListener.remove();
		};
	}, []);

	const addNotificationChannel = async (channel: NotificationChannel) => {
		checkRegistrationStatus(async () => {
			if (user) {
				const channels = user.pushChannels ?? [];
				await mutateAsync({ updatedUser: { pushChannels: [...channels, channel] } });
			}
		});
	};

	const removeNotificationChannel = async (channel: NotificationChannel) => {
		if (user) {
			const channels = user.pushChannels ?? [];
			if (channel.length > 0) {
				const newChannels = channels.filter((currentChannel) => currentChannel !== channel);
				await mutateAsync({ updatedUser: { pushChannels: newChannels } });
			}
		}
	};

	const isChannelActive = (channel: NotificationChannel) => {
		return Boolean(user?.pushChannels?.includes(channel));
	};

	const toggleNotificationChannel = async (channel: NotificationChannel) => {
		if (isChannelActive(channel)) {
			await removeNotificationChannel(channel);
		} else {
			await addNotificationChannel(channel);
		}
	};

	return (
		<NotificationContext.Provider
			value={{
				channels: { add: addNotificationChannel, toggle: toggleNotificationChannel, remove: removeNotificationChannel, isChannelActive },
				token: user?.pushToken ?? undefined,
				register: registerForPushNotifications,
				notification,
			}}
		>
			{children}
		</NotificationContext.Provider>
	);
};
