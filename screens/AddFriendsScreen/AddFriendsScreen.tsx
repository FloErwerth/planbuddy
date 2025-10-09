import { FlashList, type ListRenderItemInfo } from "@shopify/flash-list";
import { UserSearch } from "@tamagui/lucide-icons";
import { SizableText, View } from "tamagui";
import type { Friend } from "@/api/friends/types";
import { Screen } from "@/components/Screen";
import { UserSearchInput, useUserSearchContext } from "@/components/UserSearch";
import { useTranslation } from "@/hooks/useTranslation";
import { FriendEntry } from "@/screens/AddFriendsScreen/FriendEntry";

const containerStyle = { padding: 16, paddingBottom: 32 } as const;

const AddFriendsDisplay = () => {
	const { users } = useUserSearchContext();
	const { t } = useTranslation();

	const renderItem = ({ item: friend }: ListRenderItemInfo<Friend>) => <FriendEntry friend={friend} />;

	if (users !== undefined && users?.length === 0) {
		return (
			<Screen>
				<View gap="$4" justifyContent="center" alignItems="center">
					<UserSearch size="$4" />
					<SizableText>{t("friends.startSearch")}</SizableText>
				</View>
			</Screen>
		);
	}

	return (
		<FlashList
			renderItem={renderItem}
			data={users}
			contentContainerStyle={containerStyle}
			ItemSeparatorComponent={() => <View height="$1" />}
			estimatedItemSize={100}
			showsVerticalScrollIndicator={false}
		/>
	);
};

export const AddFriendsScreen = () => {
	const { t } = useTranslation();

	return (
		<>
			<Screen title={t("friends.add")}>
				<UserSearchInput />
			</Screen>
			<AddFriendsDisplay />
		</>
	);
};
