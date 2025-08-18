import { PendingFriendRequestsDot } from '@/components/PendingFriendRequestsDot/PendingFriendRequestsDot';
import { colors } from '@/providers/TamaguiProvider/tamaguiConfig';
import { BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';
import { Home, Plus, User } from '@tamagui/lucide-icons';
import { Tabs } from 'expo-router';
import { View } from 'tamagui';

const screenOptions: BottomTabNavigationOptions = {
    tabBarStyle: {
        borderTopLeftRadius: 6,
        height: 60,
        borderTopRightRadius: 6,
    },
    tabBarLabelStyle: { height: 0 },
    tabBarActiveTintColor: colors.primary,
    headerShown: false,
    animation: 'shift',
    transitionSpec: {
        config: {
            duration: 100,
        },
        animation: 'timing',
    },
};

export default function TabsLayout() {
    return (
        <>
            <Tabs screenOptions={screenOptions}>
                <Tabs.Screen
                    name="index"
                    options={{
                        animation: 'none',
                        title: undefined,
                        tabBarIcon: ({ focused }) => <Home top="$2" scale={1.1} color={focused ? '$primary' : undefined} />,
                        ...screenOptions,
                    }}
                />
                <Tabs.Screen
                    name="eventCreation"
                    options={{
                        animation: 'none',

                        title: '',
                        popToTopOnBlur: true,
                        tabBarIcon: ({ focused }) => <Plus top="$2" scale={1.5} color={focused ? '$primary' : undefined} />,
                        ...screenOptions,
                    }}
                />
                <Tabs.Screen
                    name="profile"
                    options={{
                        animation: 'none',
                        title: '',
                        popToTopOnBlur: true,
                        tabBarIcon: ({ focused }) => (
                            <View>
                                <PendingFriendRequestsDot top="$1" left="55%" />
                                <User top="$2" scale={1.1} color={focused ? '$primary' : undefined} />
                            </View>
                        ),
                        ...screenOptions,
                    }}
                />
            </Tabs>
        </>
    );
}
