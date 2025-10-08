import { UserPlus } from "@tamagui/lucide-icons";
import { memo, useState } from "react";
import { SizableText, Spinner, View, XStack } from "tamagui";
import { useAddFriendMutation } from "@/api/friends/addFriend/useAddFriendMutation";
import { type Friend, FriendRequestStatusEnum } from "@/api/friends/types";
import { Button } from "@/components/tamagui/Button";
import { Card } from "@/components/tamagui/Card";
import { UserAvatar } from "@/components/UserAvatar";

type SearchAcceptanceStatusProps = { friend: Friend };
const SearchAcceptanceStatus = ({ friend: { status } }: SearchAcceptanceStatusProps) => {
	if (status === FriendRequestStatusEnum.PENDING) {
		return (
			<View padding="$1.5" borderRadius="$12" backgroundColor="$color.green8Light">
				<SizableText size="$1">hinzugefügt!</SizableText>
			</View>
		);
	}
	if (status === FriendRequestStatusEnum.DECLINED) {
		return (
			<View padding="$1.5" borderRadius="$12" backgroundColor="$color.red8Light">
				<SizableText size="$1">abgelehnt</SizableText>
			</View>
		);
	}

	if (status === FriendRequestStatusEnum.ACCEPTED) {
		return (
			<View padding="$1.5" borderRadius="$12" backgroundColor="$color.green8Light">
				<SizableText size="$1">bereits Freunde</SizableText>
			</View>
		);
	}
};

export const FriendEntry = memo(({ friend }: { friend: Friend }) => {
	const { mutateAsync: addFriend } = useAddFriendMutation();
	const { id, status, firstName, lastName, email } = friend;
	const [isRequesting, setIsRequesting] = useState(false);
	const doAddFriend = async () => {
		if (!id) {
			return;
		}
		setIsRequesting(true);
		await addFriend(id);
		setIsRequesting(false);
	};

	const renderedButton = (() => {
		if (status) {
			return <SearchAcceptanceStatus friend={friend} />;
		}

		if (isRequesting) {
			return (
				<View animation="bouncy" width="$5" borderRadius="$12" backgroundColor="$primary" enterStyle={{ scale: 0.5 }}>
					<View scale={0.7}>
						<Spinner animation="bouncy" enterStyle={{ scale: 1.1 }} color="$background" />
					</View>
				</View>
			);
		}

		return (
			<Button disabled={isRequesting} borderRadius="$12" size="$2" onPress={doAddFriend}>
				<UserPlus color="white" scale={0.7} />
			</Button>
		);
	})();

	return (
		<Card key={id}>
			<XStack justifyContent="space-between" paddingRight="$2" alignItems="center">
				<XStack alignItems="center" gap="$4">
					<UserAvatar id={id} />
					<SizableText>{firstName || lastName ? `${firstName} ${lastName}` : email}</SizableText>
				</XStack>
				{renderedButton}
			</XStack>
		</Card>
	);
});

FriendEntry.displayName = "FriendEntry";
