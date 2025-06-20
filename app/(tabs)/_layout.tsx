import { Tabs } from 'expo-router';
import { BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';
import { TabBarButton } from '@/components/TabBarIcon';
import { Home, Plus, User2 } from '@tamagui/lucide-icons';
import { useState } from 'react';
import { EventCreationSheet } from '@/sheets/EventCreationSheet';

const screenOptions: BottomTabNavigationOptions = {
  tabBarStyle: {
    borderTopLeftRadius: 6,
    height: 60,
    borderTopRightRadius: 6,
  },
  headerShown: false,
};

export default function TabsLayout() {
  const [isEventCreationOpen, setIsEventCreationOpen] = useState<boolean>(false);

  return (
    <>
      <EventCreationSheet open={isEventCreationOpen} onOpenChange={setIsEventCreationOpen} />
      <Tabs screenOptions={screenOptions} initialRouteName="index">
        <Tabs.Screen
          name="index"
          options={{
            title: '',
            tabBarButton: (props) => <TabBarButton Icon={Home} title="Home" {...props} />,
            ...screenOptions,
          }}
        />
        <Tabs.Screen
          name="add"
          listeners={{
            tabPress: (e) => {
              e.preventDefault();
              setIsEventCreationOpen(true);
            },
          }}
          options={{
            title: '',
            tabBarButton: (props) => (
              <TabBarButton
                scale={1.6}
                Icon={(props) => <Plus {...props} />}
                title="Add"
                {...props}
              />
            ),
            ...screenOptions,
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: '',
            tabBarButton: (props) => <TabBarButton Icon={User2} title="Profile" {...props} />,
            ...screenOptions,
          }}
        />
      </Tabs>
    </>
  );
}
