export const useIsMe = (participantUserId?: string) => {
	const { user } = useAuthenticationContext();

	if (!user) {
		return false;
	}

	return participantUserId === user.id;
};
