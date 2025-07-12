import { EventCreation } from '@/screens/EventCreation';
import { EventCreationContextProvider } from '@/screens/EventCreation/EventCreationContext';

export default function Add() {
  return (
    <EventCreationContextProvider>
      <EventCreation />
    </EventCreationContextProvider>
  );
}
