import { Participant } from "@/api/participants/types";
import { getDefaultParticipant, isParticipantWithIdAndUserId } from "@/api/participants/util";
import { supabase } from "@/api/supabase";

/**
 * Inserts a participant using upsert.
 * @param participant Can be an array of participants or a single participant.
 */
export const upsertParticipantSupabaseQuery = async (participant: Partial<Participant> | Partial<Participant>[]) => {
	if (Array.isArray(participant)) {
		const participantsToUpsert = participant.filter(isParticipantWithIdAndUserId).map((participant) => getDefaultParticipant(participant));
		return await supabase.from("participants").upsert(participantsToUpsert, { ignoreDuplicates: true });
	}

	if (!isParticipantWithIdAndUserId(participant)) {
		throw new Error("Error in upsertParticipantSupabaseQuery: Incomming single participant was invalid.");
	}

	return await supabase.from("participants").upsert(getDefaultParticipant(participant), { ignoreDuplicates: true });
};
