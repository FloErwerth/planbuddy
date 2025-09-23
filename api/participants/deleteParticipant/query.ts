import { supabase } from "@/api/supabase";

/**
 * Deletes a participant from the database.
 * @param participantId The actual id of the database entry. Not the user id of the participant.
 */
export const deleteParticipantSupabaseQuery = async (participantId: string) => {
	return await supabase.from("participants").delete().eq("id", participantId).select();
};
