import type { PropsWithChildren } from "react";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { dateDeserializer } from "@/providers/QueryClient/utils";
import { QueryClient } from "@tanstack/react-query";

const asyncStoragePersister = createAsyncStoragePersister({
	/*
    Note: When hydrating the app the dates are just plain strings which leads to errors when using functionalities from
    the Date object. Here we make sure, that every time a date is detected we deserialize this as a Date object.
   */
	deserialize: (serializedState) => {
		return JSON.parse(serializedState, dateDeserializer);
	},
	storage: AsyncStorage,
});

const client = new QueryClient({
	defaultOptions: { queries: { staleTime: 30_000 } },
});

export const QueryProvider = ({ children }: PropsWithChildren) => {
	return (
		<PersistQueryClientProvider persistOptions={{ persister: asyncStoragePersister }} client={client}>
			{children}
		</PersistQueryClientProvider>
	);
};
