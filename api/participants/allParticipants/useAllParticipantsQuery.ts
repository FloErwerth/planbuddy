import { allParticipantsSupabaseQuery } from "@/api/participants/allParticipants/query";
import { PARTICIPANT_QUERY_KEY } from "@/api/participants/constants";
import { participantSchema } from "@/api/participants/types";
import { useQuery } from "@tanstack/react-query";
import { array } from "zod";

export const useAllParticipantsQuery = () => {
  return useQuery({
    queryFn: async () => {
      const result = await allParticipantsSupabaseQuery();

      const parsedResult = array(participantSchema).safeParse(result.data);

      if (parsedResult.error) {
        throw new Error(`Error in useAllParticipantsQuery: ${parsedResult.error.message}`);
      }

      return parsedResult.data;
    },
    queryKey: [PARTICIPANT_QUERY_KEY],
  });
};
