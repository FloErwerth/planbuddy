import { Tabs } from 'expo-router';

const screenOptions = {
  tabBarStyle: { borderTopLeftRadius: 6, borderTopRightRadius: 6 },
  headerShown: false,
} as const;
export default function TabsLayout() {
  return (
    <Tabs screenOptions={screenOptions} initialRouteName="index">
      <Tabs.Screen
        name="index"
        options={{
          title: 'Events',
        }}
      />

      <Tabs.Screen
        name="settings"
        options={{
          title: 'Profile',
        }}
      />
    </Tabs>
  );
}
