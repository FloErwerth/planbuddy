import { User } from "@/api/user/types";
import { atom, useAtom, useAtomValue, useSetAtom } from "jotai/index";

const defaultUser: User = { id: "", createdAt: "", email: "", pushToken: undefined, firstName: undefined, lastName: undefined, pushChannels: [] };

export const userAtom = atom<User>(defaultUser);

export const useSetUser = () => {
	return useSetAtom(userAtom);
};

export const useResetUser = () => {
	const setUser = useSetUser();

	return () => setUser(defaultUser);
};

export const useGetUser = () => {
	const user = useAtomValue(userAtom);

	return user;
};

export const useUser = () => {
	return useAtom(userAtom);
};
