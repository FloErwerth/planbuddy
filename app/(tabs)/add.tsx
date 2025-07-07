import { EventCreation } from '@/screens/EventCreation';
import { EventCreationContextProvider } from '@/screens/EventCreation/EventCreationContext';
import { UserSearchProvider } from '@/components/UserSearch';

export default function Add() {
  return (
    <UserSearchProvider showFriendsWhenEmpty>
      <EventCreationContextProvider>
        <EventCreation />
      </EventCreationContextProvider>
    </UserSearchProvider>
  );
}
