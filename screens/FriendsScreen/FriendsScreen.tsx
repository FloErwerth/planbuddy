import { Screen } from "@/components/Screen";
import { BackButton } from "@/components/BackButton";
import { useState } from "react";
import { PlusButton } from "@/components/PlusButton";
import { AddFriendsSheet } from "@/sheets/AddFriendsSheet";
import { ManageFriendSheet } from "@/sheets/ManageFriendSheet";
import { FriendsList } from "@/components/FriendsList";
import { FriendAcceptanceStatus } from "@/screens/FriendsScreen/FriendAcceptanceStatus";
import { Friend } from "@/api/friends/types";

export const FriendsScreen = () => {
	const [editedFriend, setEditedFriend] = useState<Friend | undefined>(undefined);
	const [friendsSheetOpen, setFriendsSheetOpen] = useState(false);

	return (
		<>
			<Screen back={<BackButton />} title="Deine Freunde" action={<PlusButton onPress={() => setFriendsSheetOpen(true)} />}></Screen>
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
