import { Tabs } from 'expo-router';
import { BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';
import { TabBarIcon } from '@/components/TabBarIcon';
import { Home, Plus } from '@tamagui/lucide-icons';
import { ProfileTabBarIcon } from '@/components/ProfileTabBarIcon/ProfileTabBarIcon';
import { useGetUser } from '@/store/user';

const screenOptions: BottomTabNavigationOptions = {
  tabBarStyle: {
    borderTopLeftRadius: 6,
    height: 60,
    borderTopRightRadius: 6,
  },
  headerShown: false,
};

export default function TabsLayout() {
  const user = useGetUser();
  return (
    <>
      <Tabs screenOptions={screenOptions}>
        <Tabs.Screen
          name="index"
          options={{
            title: '',
            tabBarButton: (props) => <TabBarIcon Icon={Home} title="Home" {...props} />,
            ...screenOptions,
          }}
        />
        <Tabs.Screen
          name="add"
          options={{
            title: '',
            tabBarButton: (props) => <TabBarIcon scale={1.6} Icon={(props) => <Plus {...props} />} title="Add" {...props} />,
            ...screenOptions,
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: '',
            tabBarButton: (props) => <ProfileTabBarIcon {...props} />,
            ...screenOptions,
          }}
        />
      </Tabs>
    </>
  );
}
