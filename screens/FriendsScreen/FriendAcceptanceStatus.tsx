import { SizableText, View } from "tamagui";
import { Ellipsis } from "@tamagui/lucide-icons";
import { Pressable } from "react-native";
import { type ParticipantStatus, ParticipantStatusEnum } from "@/api/participants/types";

type AcceptanceStatusProps = {
	status: ParticipantStatus | undefined;
	openOptions: () => void;
};

export const FriendAcceptanceStatus = ({ status, openOptions }: AcceptanceStatusProps) => {
	if (status === ParticipantStatusEnum.ACCEPTED) {
		return (
			<View>
				<Pressable onPress={openOptions}>
					<Ellipsis />
				</Pressable>
			</View>
		);
	}

	if (status === ParticipantStatusEnum.PENDING) {
		return (
			<View padding="$2" borderRadius="$12" backgroundColor="$color.yellow8Light">
				<SizableText size="$2">Ausstehend</SizableText>
			</View>
		);
	}

	if (status === ParticipantStatusEnum.DECLINED) {
		return (
			<View padding="$2" borderRadius="$12" backgroundColor="$color.red8Light">
				<SizableText size="$2">Abgelehnt</SizableText>
			</View>
		);
	}
};
