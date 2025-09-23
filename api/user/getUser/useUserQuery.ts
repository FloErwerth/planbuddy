import { USERS_QUERY_KEY } from "@/api/user/constants";
import { getUserSupabaseQuery } from "@/api/user/getUser/query";
import { userSchema } from "@/api/user/types";
import { useGetUser } from "@/store/authentication";
import { useQuery } from "@tanstack/react-query";

export const useGetUserQuery = () => {
	const user = useGetUser();

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
