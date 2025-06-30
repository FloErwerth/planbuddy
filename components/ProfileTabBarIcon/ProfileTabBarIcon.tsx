import { TabBarIcon, TabBarIconProps } from '@/components/TabBarIcon';
import { User } from '@tamagui/lucide-icons';
import { PendingFriendRequestsDot } from '@/components/PendingFriendRequestsDot/PendingFriendRequestsDot';

export const ProfileTabBarIcon = (props: Omit<TabBarIconProps, 'Icon' | 'title'>) => {
  return (
    <>
      <TabBarIcon
        Icon={User}
        title="Profil"
        Notification={<PendingFriendRequestsDot top="$1" left="50%" />}
        {...props}
      ></TabBarIcon>
    </>
  );
};
