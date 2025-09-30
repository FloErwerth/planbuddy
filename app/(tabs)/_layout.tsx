import { PendingFriendRequestsDot } from "@/components/PendingFriendRequestsDot/PendingFriendRequestsDot";
import { colors } from "@/providers/TamaguiProvider/tamaguiConfig";
import { Home, Plus, User } from "@tamagui/lucide-icons";
import { Tabs } from "expo-router";
import { ComponentProps } from "react";
import { View } from "tamagui";

const screenOptions: ComponentProps<typeof Tabs>["screenOptions"] = {
	tabBarStyle: {
		height: 60,
	},
	tabBarLabelStyle: { height: 0 },
	tabBarActiveTintColor: colors.primary,
	headerShown: false,
};

export default function TabsLayout() {
	return (
		<>
			<Tabs screenOptions={screenOptions}>
				<Tabs.Screen
					name="index"
					options={{
						title: undefined,
						tabBarIcon: ({ focused }) => <Home top="$2" scale={1.1} color={focused ? "$primary" : undefined} />,
						...screenOptions,
					}}
				/>
				<Tabs.Screen
					name="eventCreation"
					options={{
						title: "",
						popToTopOnBlur: true,
						tabBarIcon: ({ focused }) => <Plus top="$2" scale={1.5} color={focused ? "$primary" : undefined} />,
						...screenOptions,
					}}
				/>
				<Tabs.Screen
					name="profile"
					options={{
						title: "",
						popToTopOnBlur: true,
						tabBarIcon: ({ focused }) => (
							<View>
								<PendingFriendRequestsDot top="$1" left="55%" />
								<User top="$2" scale={1.1} color={focused ? "$primary" : undefined} />
							</View>
						),
						...screenOptions,
					}}
				/>
			</Tabs>
		</>
	);
}
