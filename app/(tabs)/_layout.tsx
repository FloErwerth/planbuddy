import { Tabs } from 'expo-router';
import { BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';

const screenOptions: BottomTabNavigationOptions = {
  tabBarStyle: {
    borderTopLeftRadius: 6,
    height: 60,
    borderTopRightRadius: 6,
  },
  freezeOnBlur: true,
  headerShown: false,
  sceneStyle: { backgroundColor: 'transparent' },
};
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
          ...screenOptions,
        }}
      />
    </Tabs>
  );
}
