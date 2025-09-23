import { SizableText, View, XStack } from "tamagui";
import { UserAvatar } from "@/components/UserAvatar";
import { useIsMe } from "@/screens/Participants/useIsMe";
import { ParticipantsAcceptanceStatus } from "@/screens/Participants/ParticipantsAcceptanceStatus";
import { Pressable } from "react-native";
import { Ellipsis } from "@tamagui/lucide-icons";
import { Card } from "@/components/tamagui/Card";
import { Participant } from "@/api/participants/types";
import { User } from "@/api/user/types";

type ParticipantProps = {
	onOpenOptions?: () => void;
	participatingUser: Participant & User;
	showStatus?: boolean;
	showEllipsis?: boolean;
};
export const ParticipantRow = ({ participatingUser, onOpenOptions, showStatus = true, showEllipsis = true }: ParticipantProps) => {
	const isMe = useIsMe(participatingUser.userId);

	return (
		<Pressable onPress={onOpenOptions}>
			<Card flexDirection="row" justifyContent="space-between" backgroundColor={isMe ? "$color.blue4Light" : "$background"} alignItems="center">
				<XStack gap="$4" alignItems="center" justifyContent="space-evenly">
					<UserAvatar id={participatingUser.userId} />
					<View>
						<SizableText size="$5">
							{participatingUser.firstName} {participatingUser.lastName}
						</SizableText>
						<SizableText size="$2">{participatingUser.role}</SizableText>
					</View>
				</XStack>
				<XStack alignItems="center" gap="$4">
					<View>
						{isMe ? <SizableText marginRight="$2">Du</SizableText> : showStatus ? <ParticipantsAcceptanceStatus status={participatingUser.status} /> : null}
					</View>
					{showEllipsis && onOpenOptions && <Ellipsis />}
				</XStack>
			</Card>
		</Pressable>
	);
};
