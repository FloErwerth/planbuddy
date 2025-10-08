import { Avatar, type AvatarProps } from "tamagui";
import { User2 } from "@tamagui/lucide-icons";
import { useProfileImageQuery } from "@/api/user/profilePicture";
import type { User } from "@/api/user/types";

type UserAvatarProps = Partial<Pick<User, "id">> & AvatarProps;
export const UserAvatar = ({ id, ...props }: UserAvatarProps) => {
	const { data: image } = useProfileImageQuery(id);

	return (
		<Avatar circular size={props.size ?? "$5"} {...props}>
			{image !== null && <Avatar.Image source={{ uri: image }} />}
			<Avatar.Fallback backgroundColor="$background" alignItems="center" justifyContent="center">
				<User2 />
			</Avatar.Fallback>
		</Avatar>
	);
};
