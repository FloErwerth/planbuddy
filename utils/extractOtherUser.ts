import { FriendsQueryResponse } from '@/api/friends/schema';
import { SimpleFriend } from '@/api/friends/types';
import { useGetUser } from '@/store/authentication';

export const useExtractedUser = (friend?: SimpleFriend) => {
    const user = useGetUser();
    return extractOtherUser(user?.id!, friend);
};

export const extractOtherUser = (userId?: string, friend?: Partial<FriendsQueryResponse[number]>) => {
    const { me, other } = (() => {
        if (friend?.requester?.id !== userId) {
            return { me: friend?.receiver, other: friend?.requester };
        }
        return { me: friend?.requester, other: friend?.receiver };
    })();

    const simpleFriend: SimpleFriend = {
        id: friend?.id,
        userId: other?.id,
        status: friend?.status,
        firstName: other?.firstName,
        lastName: other?.lastName,
        email: other?.email,
        sendAt: friend?.sendAt,
        acceptedAt: friend?.acceptedAt,
    };

    return {
        other: other ?? undefined,
        me: me ?? undefined,
        requesterWasMe: friend?.requester?.id === me?.id,
        ...simpleFriend,
    } as const;
};

export const useExtractOtherUser = () => {
    const user = useGetUser();
    return (friend: SimpleFriend) => extractOtherUser(user?.id!, friend);
};
