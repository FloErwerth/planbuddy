import { useState } from "react";
import type { Friend } from "@/api/friends/types";
import { BackButton } from "@/components/BackButton";
import { FriendsList } from "@/components/FriendsList";
import { PlusButton } from "@/components/PlusButton";
import { Screen } from "@/components/Screen";
import { useTranslation } from "@/hooks/useTranslation";
import { FriendAcceptanceStatus } from "@/screens/FriendsScreen/FriendAcceptanceStatus";
import { AddFriendsSheet } from "@/sheets/AddFriendsSheet";
import { ManageFriendSheet } from "@/sheets/ManageFriendSheet";

export const FriendsScreen = () => {
	const [editedFriend, setEditedFriend] = useState<Friend | undefined>(undefined);
	const [friendsSheetOpen, setFriendsSheetOpen] = useState(false);
	const { t } = useTranslation();

	return (
		<>
			<Screen back={<BackButton />} title={t("friends.title")} action={<PlusButton onPress={() => setFriendsSheetOpen(true)} />} />
			<FriendsList
				onFriendPressed={setEditedFriend}
				Action={({ friend }) => <FriendAcceptanceStatus status={friend.status} openOptions={() => setEditedFriend(friend)} />}
			/>
			<AddFriendsSheet open={friendsSheetOpen} onOpenChange={setFriendsSheetOpen} />
			{editedFriend && (
				<ManageFriendSheet
					friend={editedFriend}
					open={!!editedFriend}
					onOpenChange={(open: boolean) => {
						if (!open) {
							setEditedFriend(undefined);
						}
					}}
				/>
			)}
		</>
	);
};
