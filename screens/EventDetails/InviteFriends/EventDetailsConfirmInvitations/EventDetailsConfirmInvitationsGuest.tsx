import { User } from "@/api/user/types";
import { Button } from "@/components/tamagui/Button";
import { Card } from "@/components/tamagui/Card";
import { SizeableText } from "@/components/tamagui/SizeableText";
import { UserAvatar } from "@/components/UserAvatar";
import { X } from "@tamagui/lucide-icons";
import { View, XStack } from "tamagui";

export type EventDetailsConfirmInvitationsGuestProps = User & { onPress: () => void };
export const EventDetailsConfirmInvitationsGuest = ({ id, onPress, firstName, lastName, email }: EventDetailsConfirmInvitationsGuestProps) => {
	return (
		<Card key={id}>
			<XStack alignItems="center" paddingRight="$2" justifyContent="space-between">
				<XStack gap="$3" alignItems="center">
					<UserAvatar id={id} />
					<View gap="$1">
						<SizeableText size="$5" fontWeight="bold">
							{firstName} {lastName}
						</SizeableText>
						<SizeableText size="$3">{email}</SizeableText>
					</View>
				</XStack>
				<Button variant="transparent" onPress={onPress}>
					<X />
				</Button>
			</XStack>
		</Card>
	);
};
