import { createContext, PropsWithChildren, useContext, useMemo, useState } from "react";
import { supabase } from "@/api/supabase";
import { useQuery } from "@tanstack/react-query";
import { array } from "zod";
import { debounce } from "tamagui";
import { FRIENDS_QUERY_KEY } from "@/api/friends/constants";
import { useUser } from "@/store/authentication";
import { USERS_QUERY_KEY } from "@/api/user/constants";
import { userSchema } from "@/api/user/types";
import { allFriendsQueryResponseSchema, Friend } from "@/api/friends/types";
import { getFriendFromQuery } from "@/api/friends/utils/getFriendFromQuery";

type SearchContextType = {
	users: Friend[] | undefined;
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
	const [user] = useUser();

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

			return allFriendsQueryResponseSchema.parse(friends.data).map((friend) => getFriendFromQuery(friend, user?.id));
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
