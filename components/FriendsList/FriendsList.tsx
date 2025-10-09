import { FlashList, type ListRenderItemInfo } from "@shopify/flash-list";
import { type FC, useState } from "react";
import { Pressable, RefreshControl } from "react-native";
import { SizableText, View, XStack } from "tamagui";
import { useAllFriendsQuery } from "@/api/friends/allFriends";
import { type Friend, FriendRequestStatusEnum } from "@/api/friends/types";
import { useProfileImageQuery } from "@/api/user/profilePicture";
import { AvatarImagePicker } from "@/components/AvatarImagePicker";
import { SearchInput } from "@/components/SearchInput";
import { Card } from "@/components/tamagui/Card";
import { useTranslation } from "@/hooks/useTranslation";
import { formatToDate } from "@/utils/date";

type FriendsListProps = {
	onFriendPressed: (friend: Friend) => void;
	Action: FC<{ friend: Friend }>;
};

const FriendAvatar = ({ id }: { id: string }) => {
	const { data: image } = useProfileImageQuery(id);
	return <AvatarImagePicker image={image || undefined} />;
};

export const FriendsList = ({ onFriendPressed, Action }: FriendsListProps) => {
	const { data: friends, refetch } = useAllFriendsQuery();
	const [refreshing, setRefreshing] = useState(false);
	const [filter, setFilter] = useState<string | null>(null);
	const { t } = useTranslation();

	const render = ({ item: friend }: ListRenderItemInfo<Friend>) => {
		const { id, firstName, lastName } = friend;

		return (
			<Pressable onPress={() => onFriendPressed(friend)}>
				<Card>
					<XStack justifyContent="space-between" paddingRight="$2" alignItems="center">
						<XStack alignItems="center" gap="$4">
							<FriendAvatar id={id} />
							<View>
								<SizableText>{`${firstName} ${lastName}`}</SizableText>
								{friend.status === FriendRequestStatusEnum.ACCEPTED && friend.acceptedAt && (
									<SizableText size="$2">{t("friends.receivedOn", { date: formatToDate(friend.acceptedAt) })}</SizableText>
								)}
								{friend.status === FriendRequestStatusEnum.PENDING && friend.sendAt && (
									<SizableText size="$2">{t("friends.receivedOn", { date: formatToDate(friend.sendAt) })}</SizableText>
								)}
							</View>
						</XStack>
						<Action friend={friend} />
					</XStack>
				</Card>
			</Pressable>
		);
	};

	const applyFilter = (other: Friend | undefined) => {
		if (!filter || !other) {
			return true;
		}

		const terms = filter.split(" ");

		if (terms.length === 0) {
			return true;
		}

		let foundMatch = false;

		for (let i = 0; i < terms.length; i++) {
			const currentTerm = terms[i].toLowerCase();
			if (!foundMatch) {
				foundMatch = Boolean(other.firstName?.includes(currentTerm) || other.lastName?.includes(currentTerm) || other.email?.includes(currentTerm));
			}
		}

		return foundMatch;
	};

	const searchedOthers = friends?.filter(applyFilter);

	return (
		<>
			<SearchInput margin="$4" placeholder={t("guests.nameOrEmail")} onChangeText={setFilter} />
			<FlashList
				key={searchedOthers?.length}
				refreshControl={
					<RefreshControl
						onRefresh={async () => {
							setRefreshing(true);
							await refetch();
							setRefreshing(false);
						}}
						refreshing={refreshing}
					/>
				}
				refreshing={refreshing}
				renderItem={render}
				data={searchedOthers}
				contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
				ItemSeparatorComponent={() => <View height="$1" />}
				estimatedItemSize={100}
				showsVerticalScrollIndicator={false}
			/>
		</>
	);
};
