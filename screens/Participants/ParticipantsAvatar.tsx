import { Avatar, SizableText } from 'tamagui';
import { useProfileImageQuery } from '@/api/images';
import { User } from '@/api/types';

type UserAvatarProps = Pick<User, 'id' | 'firstName' | 'lastName'>;
export const UserAvatar = ({ firstName, lastName, id }: UserAvatarProps) => {
  const { data: image } = useProfileImageQuery(id);

  const kuerzel =
    firstName?.charAt(0).toUpperCase() + '. ' + lastName?.charAt(0).toUpperCase() + '.';

  return (
    <Avatar circular size="$4" elevationAndroid="$1">
      {image && <Avatar.Image source={{ uri: image }} />}
      <Avatar.Fallback backgroundColor="$background" alignItems="center" justifyContent="center">
        <SizableText>{kuerzel}</SizableText>
      </Avatar.Fallback>
    </Avatar>
  );
};
