import { Screen } from '@/components/Screen';
import { UserSearchInput } from '@/components/UserSearch';
import { BackButton } from '@/components/BackButton';
import { ParticipantsSearchResults } from '@/screens/Participants/ParticipantsSearchResults';

export default function AddUsers() {
  return (
    <>
      <Screen title="User hinzufügen" back={<BackButton />}>
        <UserSearchInput />
      </Screen>
      <ParticipantsSearchResults />
    </>
  );
}
