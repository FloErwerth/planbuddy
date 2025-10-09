import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CREATE_EVENT_MUTATION_KEY, EVENTS_QUERY_KEY } from "@/api/events/constants";
import { createEventSupabaseQuery } from "@/api/events/createEvents/query";
import type { AppEvent } from "@/api/events/types";
import { type Participant, ParticipantRoleEnum, ParticipantStatusEnum } from "@/api/participants/types";
import { supabase } from "@/api/supabase";
import { useAuthenticationContext } from "@/providers/AuthenticationProvider";

type CreateEventMutationArgs = { event: Omit<AppEvent, "id" | "createdAt"> };

export const useCreateEventMutation = () => {
  const { user } = useAuthenticationContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ event }: CreateEventMutationArgs): Promise<AppEvent | undefined> => {
      const queryResult = await createEventSupabaseQuery(event, user.id);

      console.log(event);
      if (queryResult.error) {
        throw new Error(`Error in useCreateEventMutation: ${queryResult.error.message}`);
      }

      const insertedUsers: Omit<Participant, "id" | "createdAt">[] = [
        {
          userId: user.id,
          eventId: queryResult.data.id,
          role: ParticipantRoleEnum.CREATOR,
          status: ParticipantStatusEnum.ACCEPTED,
        },
      ];

      const participantResult = await supabase.from("participants").insert(insertedUsers);

      if (participantResult.error) {
        throw new Error(participantResult.error.message);
      }

      return queryResult.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: [EVENTS_QUERY_KEY] });
    },
    mutationKey: [CREATE_EVENT_MUTATION_KEY],
  });
};
