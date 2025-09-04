import { createContext, PropsWithChildren, useContext, useMemo, useState } from "react";
import { Status, User, userSchema } from "@/api/types";
import { supabase } from "@/api/supabase";
import { useQuery } from "@tanstack/react-query";
import { array } from "zod";
import { debounce } from "tamagui";
import { friendsQuerySchema } from "@/api/friends/schema";
import { FRIENDS_QUERY_KEY } from "@/api/friends/constants";
import { useGetUser } from "@/store/authentication";
import { USERS_QUERY_KEY } from "@/api/user/constants";

export type UserWithStatus = User & {
	status?: Status;
	receiver?: User;
	requester?: User;
};
type SearchContextType = {
	users: UserWithStatus[] | undefined;
	search: (search: string) => void;
	setSearchDisplay: (search: string) => void;
	searchDisplay: string;
};

const SearchContext = createContext<SearchContextType | undefined>(undefined);

type UserSearchOptions = {
	showUsersWhenEmpty?: boolean;
};

export const useUserSearchContext = () => {
	const context = useContext(SearchContext);

	if (!context) {
		throw new Error("The user search must be used within a user search search context.");
	}

	return context as SearchContextType;
};

const useUsersWithStatusQuery = (search: string, { showUsersWhenEmpty = false }: UserSearchOptions) => {
	const user = useGetUser();

	return useQuery({
		queryFn: async () => {
			if (!showUsersWhenEmpty && !search) {
				return [];
			}

			const terms = search
				.toLowerCase()
				.split(" ")
				.map((term) => `email.ilike.%${term}%, "firstName".ilike.%${term}%, "lastName".ilike.%${term}%`)
				.join(", ");

			const base = supabase.from("users").select();

			if (terms.length > 0) {
				base.or(terms);
			}

			base.order("firstName").throwOnError();

			const result = await base;

			const parsedResult = array(userSchema)
				.parse(result.data)
				.filter(({ id }) => id !== user?.id);

			const ids = parsedResult.map((item) => item.id).join(",");
			const friends = await supabase
				.from("friends")
				.select("*, requesterId(id, *), receiverId(id, *)") // Fetch nested user data
				.or(`requesterId.in.(${ids}),receiverId.in.(${ids})`)
				.throwOnError();

			const parsedFriends = friendsQuerySchema.parse(friends.data);

			return parsedResult.map((user) => {
				const foundFriend = parsedFriends.find((friend) => friend.requester?.id === user.id || friend.receiver?.id === user.id);

				return {
					status: foundFriend?.status ?? undefined,
					requester: foundFriend?.requester,
					receiver: foundFriend?.receiver,
					...user,
				};
			}) as UserWithStatus[];
		},
		queryKey: [FRIENDS_QUERY_KEY, USERS_QUERY_KEY, user?.id, search.toLowerCase()],
	});
};

export const UserSearchProvider = ({ children, ...options }: PropsWithChildren & UserSearchOptions) => {
	const [debouncedSearch, setDebouncedSearch] = useState("");
	const [searchDisplay, setSearchDisplay] = useState("");
	const { data: users } = useUsersWithStatusQuery(debouncedSearch, options);

	const contextValue: SearchContextType = useMemo(
		() => ({
			users,
			search: debounce(setDebouncedSearch, 300),
			searchDisplay,
			setSearchDisplay,
		}),
		[users, searchDisplay]
	);

	return <SearchContext.Provider value={contextValue}>{children}</SearchContext.Provider>;
};
