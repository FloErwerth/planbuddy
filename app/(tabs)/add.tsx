import { EventCreation } from '@/screens/EventCreation';
import { EventCreationContextProvider } from '@/screens/EventCreation/EventCreationContext';
import { FriendSearchProvider } from '@/components/FriendSearch';

export default function Add() {
  return (
    <FriendSearchProvider showFriendsWhenEmpty>
      <EventCreationContextProvider>
        <EventCreation />
      </EventCreationContextProvider>
    </FriendSearchProvider>
  );
}
