import { User } from "@/api/user/types";
import { atom, useAtom, useAtomValue, useSetAtom } from "jotai/index";

export const userAtom = atom<User>({ id: "", createdAt: "", email: "", pushToken: undefined, firstName: undefined, lastName: undefined, pushChannels: [] });

export const useSetUser = () => {
	return useSetAtom(userAtom);
};

export const useGetUser = () => {
	const user = useAtomValue(userAtom);

	return user;
};

export const useUser = () => {
	return useAtom(userAtom);
};
