import { EventCreation } from '@/screens/EventCreation';
import { EventCreationContextProvider } from '@/screens/EventCreation/EventCreationContext';
import { useIsFocused } from '@react-navigation/core';

export default function Add() {
  const isFocused = useIsFocused();

  if (!isFocused) {
    return null;
  }

  return (
    <EventCreationContextProvider>
      <EventCreation />
    </EventCreationContextProvider>
  );
}
