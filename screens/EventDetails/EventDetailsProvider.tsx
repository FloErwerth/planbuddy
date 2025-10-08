import { createContext, type PropsWithChildren, useContext, useState } from "react";
import { router, useGlobalSearchParams } from "expo-router";
import type { Participant } from "@/api/participants/types";
import { useCreateParticipationMutation } from "@/api/participants/createParticipant";
import type { User } from "@/api/user/types";

type EventDetailsContextType =
	| {
			eventId: string;
			editedGuest: (Participant & User) | undefined;
			setEditedGuest: (guest: (Participant & User) | undefined) => void;
			toggleInviteToEvent: (userId: string) => void;
			numberOfAddedUsers: number;
			usersToAdd: Set<string>;
			toggleGuest: (userId: string) => void;
			clearUsersToAdd: () => void;
	  }
	| undefined;

export const EventDetailsContext = createContext<EventDetailsContextType>(undefined);

export const useEventDetailsContext = () => {
	const context = useContext(EventDetailsContext);

	if (!context) {
		throw new Error("useEventDetailsContext must be used as useEventDetailsContext");
	}

	return context;
};

export const EventDetailsProvider = ({ children }: PropsWithChildren) => {
	const { eventId } = useGlobalSearchParams<{ eventId: string }>();
	const [editedGuest, setEditedGuest] = useState<Participant & User>();
	const [usersToAdd, setUsersToAdd] = useState<Set<string>>(new Set());
	const { mutateAsync } = useCreateParticipationMutation();

	const addFriendsToEvent = (id: string) => {
		setUsersToAdd((current) => {
			const newSet = new Set(current.values());
			newSet.add(id);
			return newSet;
		});
	};

	const removeUserFromUsersToAdd = (id: string) => {
		setUsersToAdd((current) => {
			const newSet = new Set(current.values());
			newSet.delete(id);
			return newSet;
		});
	};

	const toggleInviteToEvent = (id: string) => {
		if (usersToAdd.has(id)) {
			removeUserFromUsersToAdd(id);
			return;
		}

		addFriendsToEvent(id);
	};

	const handleInviteUsers = async () => {
		await mutateAsync(
			Array.from(usersToAdd).map((user) => ({
				eventId,
				userId: user,
			})),
		);
		router.replace("/eventDetails/participants");
	};

	const addGuest = (userId: string) => {
		setUsersToAdd((current) => {
			const newSet = new Set(current.values());
			newSet.add(userId);
			return newSet;
		});
	};

	const toggleGuest = (userId: string) => {
		if (usersToAdd.has(userId)) {
			removeGuest(userId);
			return;
		}
		addGuest(userId);
	};

	const removeGuest = (userId: string) => {
		setUsersToAdd((current) => {
			const newSet = new Set(current.values());
			newSet.delete(userId);
			return newSet;
		});
	};

	const contextValue: EventDetailsContextType = {
		eventId,
		editedGuest,
		setEditedGuest,
		toggleInviteToEvent,
		numberOfAddedUsers: usersToAdd.size,
		usersToAdd,
		toggleGuest,
		clearUsersToAdd: () => setUsersToAdd(new Set()),
	};

	return <EventDetailsContext.Provider value={contextValue}>{children}</EventDetailsContext.Provider>;
};
