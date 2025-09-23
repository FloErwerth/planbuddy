import { SizableText, View } from "tamagui";
import { ParticipantStatus, ParticipantStatusEnum } from "@/api/participants/types";

type AcceptanceStatusProps = {
	status: ParticipantStatus;
};

export const ParticipantsAcceptanceStatus = ({ status }: AcceptanceStatusProps) => {
	if (status === ParticipantStatusEnum.ACCEPTED) {
		return (
			<View padding="$2" borderRadius="$12" backgroundColor="$color.green8Light">
				<SizableText size="$1">Befreundet</SizableText>
			</View>
		);
	}

	if (status === ParticipantStatusEnum.PENDING) {
		return (
			<View padding="$2" borderRadius="$12" backgroundColor="$color.yellow7Light">
				<SizableText size="$1">Ausstehend</SizableText>
			</View>
		);
	}

	if (status === ParticipantStatusEnum.DECLINED) {
		return (
			<View padding="$1.5" borderRadius="$12" backgroundColor="$color.red8Light">
				<SizableText size="$2">Abgelehnt</SizableText>
			</View>
		);
	}
};
