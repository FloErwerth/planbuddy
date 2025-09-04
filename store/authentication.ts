import { atom, useAtom, useAtomValue, useSetAtom } from "jotai/index";
import { User } from "@supabase/auth-js";

export const onboardedAtom = atom<boolean>(false);

export const useWasOnboarded = () => useAtomValue(onboardedAtom);
export const useSetWasOnboarded = () => useSetAtom(onboardedAtom);

export const useIsAuthenticated = () => {
	const user = useGetUser();
	const wasOnboarded = useWasOnboarded();

	return !!user && wasOnboarded;
};

export const userAtom = atom<User | undefined>(undefined);

export const useSetUser = () => {
	return useSetAtom(userAtom);
};

export const useGetUser = () => {
	const user = useAtomValue(userAtom);
	if (user === undefined) {
		throw new Error("Error in useGetUser: User is undefined.");
	}

	return user;
};

export const useUser = () => {
	return useAtom(userAtom);
};
