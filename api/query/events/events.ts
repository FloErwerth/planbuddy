import { getAuth } from "@react-native-firebase/auth";
import { addDoc, arrayRemove, arrayUnion, collection, doc, getDoc, getDocs, getFirestore, query, updateDoc, where } from "@react-native-firebase/firestore";
import { useCallback } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";

import { EventData, eventDataSchema, EventStatus } from "./types";
import { queryKeys } from "../queryKeys";
import { userDataSchema } from "../user";

const getEventData = async (eventId: string) => {
  const eventSnapshot = await getDoc(doc(getFirestore(), "events", eventId));

  if (eventSnapshot.exists) {
    return eventDataSchema.parse({ id: eventId, ...eventSnapshot.data() });
  }

  return undefined;
};

export const useEventsQuery = () => {
  return useQuery({
    queryFn: async () => {
      const userId = getAuth().currentUser?.uid;
      if (!userId) {
        throw new Error("Not logged in");
      }

      const usersRef = collection(getFirestore(), "users");
      const userData = await getDocs(query(usersRef, where("id", "==", userId)));
      const eventIds: string[] = [];

      userData.forEach((doc) => {
        const parsedUserData = userDataSchema.safeParse(doc.data());

        if (parsedUserData.success) {
          eventIds.push(...(parsedUserData.data.eventIds ?? []));
        }
      });

      return await Promise.all(eventIds.map(getEventData));
    },
    queryKey: [queryKeys.EVENTS.EVENT_QUERY_KEY],
  });
};

export const useJoinEventsMutation = () => {
  const queryClient = useQueryClient();
  const joinEvent = async (eventId: string) => {
    const userId = getAuth().currentUser?.uid;

    if (!userId) {
      return;
    }
    const possibleEvent = await getDoc(collection(getFirestore(), "events").doc(eventId));
    if (!possibleEvent.exists) {
      return;
    }

    await updateDoc(doc(getFirestore(), "users", userId), {
      eventIds: arrayUnion(eventId),
    }).catch((e) => console.log(e));
  };

  return useMutation({
    mutationFn: joinEvent,
    mutationKey: [queryKeys.EVENTS.JOIN_EVENT_MUTATION_KEY],
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.USER.EVENT_IDS_QUERY_KEY });
      await queryClient.invalidateQueries({ queryKey: queryKeys.EVENTS.EVENT_QUERY_KEY });
    },
  });
};

export const useCreateEventMutation = () => {
  const queryClient = useQueryClient();

  const doCreateEvent = useCallback(async (data: EventData) => {
    const userId = getAuth().currentUser?.uid;

    if (userId) {
      const result = await addDoc(collection(getFirestore(), "events"), {
        ...data,
        users: arrayUnion({
          id: userId,
          isAdmin: true,
          status: EventStatus.ACCEPTED,
        }),
      });

      await updateDoc(doc(getFirestore(), "users", userId), {
        eventIds: arrayUnion(result.id),
      });

      return result.id;
    }
  }, []);

  return useMutation({
    mutationFn: doCreateEvent,
    mutationKey: [queryKeys.EVENTS.CREATE_EVENT_MUTATION_KEY],
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.USER.EVENT_IDS_QUERY_KEY });
      await queryClient.invalidateQueries({ queryKey: queryKeys.EVENTS.EVENT_QUERY_KEY });
    },
  });
};

export const useDeleteEventMutation = () => {
  const queryClient = useQueryClient();

  const doDeleteEvent = useCallback(async (eventId: string) => {
    const userId = getAuth().currentUser?.uid;

    if (userId) {
      const result = await addDoc(collection(getFirestore(), "events"), {
        ...data,
      });

      await updateDoc(doc(getFirestore(), "users", userId), {
        eventIds: arrayRemove(eventId),
      });

      return result.id;
    }
  }, []);

  return useMutation({
    mutationFn: doDeleteEvent,
    mutationKey: [queryKeys.EVENTS.CREATE_EVENT_MUTATION_KEY],
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: queryKeys.USER.EVENT_IDS_QUERY_KEY });
      await queryClient.invalidateQueries({ queryKey: queryKeys.EVENTS.EVENT_QUERY_KEY });
    },
  });
};
