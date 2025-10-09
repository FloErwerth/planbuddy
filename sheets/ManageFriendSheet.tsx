import { useState } from "react";
import { type SheetProps, SizableText, View } from "tamagui";
import { useRemoveFriendMutation } from "@/api/friends/removeFriend";
import type { Friend } from "@/api/friends/types";
import { Screen } from "@/components/Screen";
import { Button } from "@/components/tamagui/Button";
import { Dialog } from "@/components/tamagui/Dialog";
import { Sheet } from "@/components/tamagui/Sheet";
import { useTranslation } from "@/hooks/useTranslation";

type ManageFriendSheetProps = SheetProps & { friend: Friend };
export const ManageFriendSheet = ({ friend, onOpenChange, ...props }: ManageFriendSheetProps) => {
	const { mutateAsync } = useRemoveFriendMutation();
	const [warningModal, setWarningModal] = useState(false);
	const { t } = useTranslation();

	const handleRemoveFriendPressed = () => {
		setWarningModal(true);
	};

	const handleRemoveFriend = async () => {
		await mutateAsync(friend.id);
		setWarningModal(false);
		onOpenChange?.(false);
	};

	return (
		<>
			<Sheet {...props} onOpenChange={onOpenChange} snapPointsMode="fit" snapPoints={undefined}>
				<Screen title={t("friends.friendshipWith", { name: `${friend?.firstName} ${friend?.lastName}` })}>
					<Button onPress={handleRemoveFriendPressed}>{t("friends.unfriend")}</Button>
				</Screen>
			</Sheet>
			<Dialog onOpenChange={setWarningModal} zIndex={100_000_000} open={warningModal}>
				<SizableText size="$5">{t("friends.unfriendConfirm", { name: friend?.firstName })}</SizableText>
				<View gap="$2">
					<Button onPress={handleRemoveFriend}>
						<SizableText color="$background">{t("friends.unfriend")}</SizableText>
					</Button>
					<Button variant="secondary" onPress={() => setWarningModal(false)}>
						{t("common.no")}
					</Button>
				</View>
			</Dialog>
		</>
	);
};
