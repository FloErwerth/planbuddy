import { useGetUser } from '@/store/authentication';

export const useIsMe = (participantUserId?: string) => {
    const user = useGetUser();

    if (!user) {
        return false;
    }

    return participantUserId === user.id;
};
