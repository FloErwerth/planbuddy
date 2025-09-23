import { supabase } from "@/api/supabase";

export const removeEventImageSupabaseQuery = async (eventId: string) => {
	return await supabase.storage.from("event-images").upload(`${eventId}/image.png?bust=${Date.now()}`, "", {
		upsert: true,
		contentType: "image/png",
	});
};
