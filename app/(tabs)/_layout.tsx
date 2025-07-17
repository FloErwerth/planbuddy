import { Tabs } from 'expo-router';
import { BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';
import { Home, Plus, User } from '@tamagui/lucide-icons';
import { colors } from '@/providers/TamaguiProvider/tamaguiConfig';

const screenOptions: BottomTabNavigationOptions = {
  tabBarStyle: {
    borderTopLeftRadius: 6,
    height: 60,
    borderTopRightRadius: 6,
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
            tabBarIcon: ({ focused }) => <Home top="$2" scale={1.1} color={focused ? '$primary' : undefined} />,
            ...screenOptions,
          }}
        />
        <Tabs.Screen
          name="add"
          options={{
            title: '',
            tabBarIcon: ({ focused }) => <Plus top="$2" scale={1.5} color={focused ? '$primary' : undefined} />,
            ...screenOptions,
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: '',
            tabBarIcon: ({ focused }) => <User top="$2" scale={1.1} color={focused ? '$primary' : undefined} />,
            ...screenOptions,
          }}
        />
      </Tabs>
    </>
  );
}
