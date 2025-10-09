import { useProfileImageQuery } from "@/api/user/profilePicture";
import { AvatarImagePicker } from "@/components/AvatarImagePicker";

type UserAvatarProps = {
	id: string;
};

export const UserAvatar = ({ id: userId }: UserAvatarProps) => {
	const { data: image } = useProfileImageQuery(userId);
	return <AvatarImagePicker image={image || undefined} />;
};
