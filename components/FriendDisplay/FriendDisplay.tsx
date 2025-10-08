import { SizableText, XStack } from "tamagui";
import { UserAvatar } from "@/components/UserAvatar";
import type { PropsWithChildren } from "react";
import type { User } from "@/api/user/types";

type FriendDisplayProps = User & PropsWithChildren;

export const FriendDisplay = ({ id, firstName, lastName, children }: FriendDisplayProps) => {
	return (
		<XStack alignItems="center" paddingRight="$2" justifyContent="space-between">
			<XStack gap="$3" alignItems="center">
				<UserAvatar id={id} />
				<SizableText>
					{firstName} {lastName}
				</SizableText>
			</XStack>
			{children}
		</XStack>
	);
};
