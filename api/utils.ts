import type { QueryClient } from "@tanstack/react-query";

export const invalidateQueriesSimultaneously = async (queryKeyArray: string[], queryClient: QueryClient) => {
	return await Promise.all(queryKeyArray.map(async (key) => await queryClient.invalidateQueries({ queryKey: [key] })));
};
