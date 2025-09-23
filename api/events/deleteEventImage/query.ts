import { supabase } from "@/api/supabase";

export const deleteEventImageSupabaseQuery = async (eventId: string) => {
	return await supabase.storage.from("event-images").remove([`${eventId}/image.png`]);
};
