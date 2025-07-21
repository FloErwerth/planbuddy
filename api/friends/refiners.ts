import { useDatabaseFriendsQuery } from '@/api/friends/databaseQuery';
import { StatusEnum } from '@/api/types';
import { sortFriendsToTop } from '@/utils/sorters';
import { extractOtherUser, useExtractOtherUser } from '@/utils/extractOtherUser';
import { useGetUser } from '@/store/authentication';

export const useFriendsByStatus = () => {
    const { data = [], refetch, isLoading } = useDatabaseFriendsQuery();
    const extractOther = useExtractOtherUser();
    const mapped = data.map((friend) => extractOther(friend));

    return {
        accepted: mapped.filter((friend) => friend.status === StatusEnum.ACCEPTED),
        pending: mapped.filter((friend) => friend.status === StatusEnum.PENDING),
        declined: mapped.filter((friend) => friend.status === StatusEnum.DECLINED),
        refetch,
        isLoading,
    };
};

export const useFriendOverview = () => {
    const { data = [], refetch, isLoading } = useDatabaseFriendsQuery();
    const user = useGetUser();

    const pending = data.filter((friend) => friend.status === StatusEnum.PENDING);

    return {
        data: data.sort(sortFriendsToTop),
        others: data.map((friend) => extractOtherUser(user?.id!, friend)),
        pending,
        pendingToAccept: pending.filter((friend) => friend.requester?.id !== user?.id).map((friend) => extractOtherUser(user?.id!, friend)),
        refetch,
        isLoading,
    };
};

export const useHasFriends = () => {
    const { accepted } = useFriendsByStatus();
    return accepted.length > 0;
};
