import { Screen } from '@/components/Screen';
import { BackButton } from '@/components/BackButton';
import { SizableText, XStack } from 'tamagui';
import { Button } from '@/components/tamagui/Button';
import * as Contacts from 'expo-contacts';
import { useState } from 'react';
import { User } from '@/api/types';
import { supabase } from '@/api/supabase';
import { PostgrestSingleResponse } from '@supabase/supabase-js';
import { Card } from '@/components/tamagui/Card';
import { UserAvatar } from '@/screens/Participants/ParticipantsAvatar';
import { Checkbox } from '@/components/tamagui/Checkbox';
import { useGetFriendsQuery } from '@/api/friends/getFriendsQuery';
import { useAddFriendsMutation } from '@/api/friends/addFriendsMutation';
import { router } from 'expo-router';
import { useGetUser } from '@/store/user';

export default function AddFriendsScreen() {
  const [foundUsersInContacts, setFoundUsersInContacts] = useState<
    ({ willBeAdded: boolean } & User)[] | undefined
  >(undefined);

  const { data: friends } = useGetFriendsQuery(true);
  const { mutateAsync: addFriends, isLoading } = useAddFriendsMutation();
  const user = useGetUser();
  const handleSearchWithContacts = async () => {
    const { status } = await Contacts.requestPermissionsAsync();

    if (status === 'granted') {
      const { data } = await Contacts.getContactsAsync({
        fields: [Contacts.Fields.Emails, Contacts.Fields.FirstName, Contacts.Fields.LastName],
      });

      const orFilterString = [
        { email: 'erwerthflorian@outlook.de' },
        { firstName: 'Nadine' },
        { lastName: 'Mustermann' },
      ]
        .map((criteria) => {
          const search: string[] = [];
          if (criteria.email) {
            search.push(`email.eq.${criteria.email}`);
          }
          if (criteria.firstName) {
            search.push(`firstName.eq.${criteria.firstName}`);
          }
          if (criteria.lastName) {
            search.push(`lastName.eq.${criteria.lastName}`);
          }
          return search; // Fallback für unbekannte Kriterien
        })
        .filter(Boolean)
        .join(','); // filter(Boolean) entfernt leere Strings

      const users: PostgrestSingleResponse<User[]> = await supabase
        .from('users')
        .select('*')
        .neq('id', user?.id)
        .or(orFilterString);

      if (users.error) {
        setFoundUsersInContacts([]);
        return;
      }

      const notAddedFriends = users.data.filter((contact) => {
        return (
          !friends?.some(({ id: friendId }) => {
            return contact.id === friendId;
          }) && contact.id !== user?.id
        );
      });

      if (users.data) {
        setFoundUsersInContacts(
          notAddedFriends.map((contact) => {
            return {
              ...contact,
              willBeAdded: false,
            };
          })
        );
      }
    }
  };

  const hasFriendsToAdd = (foundUsersInContacts ?? []).some(({ willBeAdded }) => willBeAdded);

  const handleAddFriends = async () => {
    const successfullyAdded = await addFriends(
      (foundUsersInContacts ?? []).filter(({ willBeAdded }) => willBeAdded).map(({ id }) => id!)
    );

    if (successfullyAdded) {
      router.push('/(tabs)/settings/friends');
      setFoundUsersInContacts([]);
      return;
    }
  };

  const FoundUsers = () => {
    if (foundUsersInContacts === undefined) {
      return <SizableText>Starte eine Suche</SizableText>;
    }

    if (foundUsersInContacts.length === 0) {
      return <SizableText>Deine Suche hat leider keine Ergebnisse gebracht</SizableText>;
    }

    return foundUsersInContacts.map((user, index) => {
      return (
        <Card key={user.id} backgroundColor={user.willBeAdded ? '$color.blue4Light' : undefined}>
          <XStack justifyContent="space-between" paddingRight="$2" alignItems="center">
            <XStack alignItems="center" gap="$4">
              <UserAvatar {...user} />
              <SizableText>
                {user.firstName || user.lastName
                  ? `${user.firstName} ${user.lastName}`
                  : user.email}
              </SizableText>
            </XStack>
            <Checkbox
              checked={user.willBeAdded}
              onChecked={() => {
                setFoundUsersInContacts((users) => {
                  const newContact = (users ?? [])[index];
                  newContact.willBeAdded = !newContact.willBeAdded;
                  const newUsers = [...(users ?? [])];
                  newUsers[index] = newContact;
                  return newUsers;
                });
              }}
            />
          </XStack>
        </Card>
      );
    });
  };

  return (
    <Screen back={<BackButton href=".." />} title="Freunde hinzufügen">
      <SizableText>Suche mit Hilfe deiner Kontakte</SizableText>
      <Button onPress={handleSearchWithContacts}>Kontakte suchen</Button>
      <FoundUsers />
      {hasFriendsToAdd && <Button onPress={handleAddFriends}>Freunde hinzufügen</Button>}
    </Screen>
  );
}
