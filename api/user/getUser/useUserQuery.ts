import { useQuery } from "@tanstack/react-query";
import { USERS_QUERY_KEY } from "@/api/user/constants";
import { getUserSupabaseQuery } from "@/api/user/getUser/query";
import { userSchema } from "@/api/user/types";

export const useGetUserQuery = () => {
	const { user } = useAuthenticationContext();

	return useQuery({
		queryFn: async () => {
			const result = await getUserSupabaseQuery(user.id);

			const parsedUserResult = userSchema.safeParse(result.data);

			if (parsedUserResult.error) {
				throw new Error(`Error in useGetUserQuery: ${parsedUserResult.error.message}`);
			}

			return parsedUserResult.data;
		},
		queryKey: [USERS_QUERY_KEY, user.id],
	});
};
