import { USERS_QUERY_KEY } from "@/api/user/constants";
import { getUserSupabaseQuery } from "@/api/user/getUser/query";
import { useGetUser } from "@/store/authentication";
import { User } from "@supabase/supabase-js";
import { useQuery } from "@tanstack/react-query";

export const useGetUserQuery = () => {
	const user = useGetUser();

	return useQuery({
		queryFn: async () => {
			const result = await getUserSupabaseQuery(user.id);
			if (result.error) {
				throw new Error(result.error.message);
			}

			return result.data[0] as User;
		},
		queryKey: [USERS_QUERY_KEY],
	});
};
