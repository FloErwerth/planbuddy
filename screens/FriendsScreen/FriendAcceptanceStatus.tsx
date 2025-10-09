import { Ellipsis } from "@tamagui/lucide-icons";
import { Pressable } from "react-native";
import { SizableText, View } from "tamagui";
import { type ParticipantStatus, ParticipantStatusEnum } from "@/api/participants/types";
import { useTranslation } from "@/hooks/useTranslation";

type AcceptanceStatusProps = {
	status: ParticipantStatus | undefined;
	openOptions: () => void;
};

export const FriendAcceptanceStatus = ({ status, openOptions }: AcceptanceStatusProps) => {
	const { t } = useTranslation();

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
				<SizableText size="$2">{t("guests.pending")}</SizableText>
			</View>
		);
	}

	if (status === ParticipantStatusEnum.DECLINED) {
		return (
			<View padding="$2" borderRadius="$12" backgroundColor="$color.red8Light">
				<SizableText size="$2">{t("guests.declined")}</SizableText>
			</View>
		);
	}
};
