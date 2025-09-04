import { SheetProps, SizableText, View } from "tamagui";
import { Sheet } from "@/components/tamagui/Sheet";
import { Screen } from "@/components/Screen";
import { Button } from "@/components/tamagui/Button";
import { useRemoveFriendMutation } from "@/api/friends/addFriendsMutation";
import { useState } from "react";
import { Dialog } from "@/components/tamagui/Dialog";
import { SimpleFriend } from "@/api/friends/types";

type ManageFriendSheetProps = SheetProps & { friend?: SimpleFriend };
export const ManageFriendSheet = ({ friend, onOpenChange, ...props }: ManageFriendSheetProps) => {
	const { mutateAsync } = useRemoveFriendMutation();
	const [warningModal, setWarningModal] = useState(false);

	const handleRemoveFriendPressed = () => {
		setWarningModal(true);
	};

	const handleRemoveFriend = async () => {
		await mutateAsync(friend?.id);
		setWarningModal(false);
		onOpenChange?.(false);
	};

	return (
		<>
			<Sheet {...props} onOpenChange={onOpenChange} snapPointsMode="fit" snapPoints={undefined}>
				<Screen title={`Deine Freundschaft mit \n${friend?.firstName} ${friend?.lastName}`}>
					<Button onPress={handleRemoveFriendPressed}>Freundschaft kündigen</Button>
				</Screen>
			</Sheet>
			<Dialog onOpenChange={setWarningModal} zIndex={100_000_000} open={warningModal}>
				<SizableText size="$5">Möchtest Du {friend?.firstName} die Freundschaft kündigen?</SizableText>
				<View gap="$2">
					<Button onPress={handleRemoveFriend}>
						<SizableText color="$background">Freundschaft kündigen</SizableText>
					</Button>
					<Button variant="secondary" onPress={() => setWarningModal(false)}>
						Nein
					</Button>
				</View>
			</Dialog>
		</>
	);
};
