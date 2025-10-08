import { SizableText, YStack } from "tamagui";
import { Button } from "@/components/tamagui/Button";

type ParticipantEditGuestOptions = { onRemoveGuest: () => void };
export const ParticipantEditMeOptions = ({ onRemoveGuest }: ParticipantEditGuestOptions) => {
	return (
		<YStack gap="$2">
			<SizableText>Teilnehmerschaft verwalten</SizableText>
			<Button onPress={onRemoveGuest}>
				<SizableText color="$background">Das Event verlassen</SizableText>
			</Button>
		</YStack>
	);
};
