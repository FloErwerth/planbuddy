import { Tabs } from 'expo-router';
import { BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';
import { TabBarButton } from '@/components/TabBarIcon';
import { Home, Plus, User2 } from '@tamagui/lucide-icons';
import { useState } from 'react';
import { Sheet } from '@/components/tamagui/Sheet';
import { EventCreation } from '@/screens/EventCreation';

const screenOptions: BottomTabNavigationOptions = {
  tabBarStyle: {
    borderTopLeftRadius: 6,
    height: 60,
    borderTopRightRadius: 6,
  },
  headerShown: false,
};

export default function TabsLayout() {
  const [isVisible, setIsVisible] = useState<boolean>(false);

  const handleClose = () => {
    setIsVisible(false);
  };

  return (
    <>
      <Sheet
        snapPoints={[97]}
        hideHandle
        snapPointsMode="percent"
        open={isVisible}
        onOpenChange={handleClose}
      >
        <EventCreation />
      </Sheet>
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
              setIsVisible(true);
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
