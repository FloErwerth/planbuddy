import { Avatar, AvatarProps } from "tamagui";
import { User2 } from "@tamagui/lucide-icons";
import { useProfileImageQuery } from "@/api/user/profilePicture";
import { User } from "@/api/user/types";

type UserAvatarProps = Pick<User, "id"> & AvatarProps;
export const UserAvatar = ({ id, ...props }: UserAvatarProps) => {
	const { data: image } = useProfileImageQuery(id);

	return (
		<Avatar circular size={props.size ?? "$5"} elevationAndroid="$1" {...props}>
			{image && <Avatar.Image source={{ uri: image }} />}
			<Avatar.Fallback backgroundColor="$background" alignItems="center" justifyContent="center">
				<User2 />
			</Avatar.Fallback>
		</Avatar>
	);
};
