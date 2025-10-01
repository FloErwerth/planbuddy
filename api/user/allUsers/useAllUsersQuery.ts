import { allUsersSupabaseQuery } from "@/api/user/allUsers/query";
import { ALL_USERS_QUERY_KEY } from "@/api/user/constants";
import { userSchema } from "@/api/user/types";
import { useQuery } from "@tanstack/react-query";
import z from "zod";

export const useAllUsersQuery = () => {
	return useQuery({
		queryFn: async () => {
			const result = await allUsersSupabaseQuery();

			const parsedUsers = z.array(userSchema).safeParse(result.data);

			if (parsedUsers.error) {
				throw new Error(`Error in useAllUsersQuery: Parsing failed. Details: ${parsedUsers.error.message}`);
			}

			return parsedUsers.data;
		},
		queryKey: [ALL_USERS_QUERY_KEY],
	});
};
