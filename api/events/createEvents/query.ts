import { AppEvent } from "@/api/events/types";
import { supabase } from "@/api/supabase";
import { PostgrestSingleResponse } from "@supabase/supabase-js";

/**
 * Creates an event in the database
 */
export const createEventSupabaseQuery = async (event: Omit<AppEvent, "id">, userId: string): Promise<PostgrestSingleResponse<AppEvent>> => {
	return await supabase
		.from("events")
		.insert({ ...event, creatorId: userId } satisfies Omit<AppEvent, "id">)
		.select()
		.single()
		.throwOnError();
};
