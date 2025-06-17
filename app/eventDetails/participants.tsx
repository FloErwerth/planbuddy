import { Avatar, Separator, SizableText, View, XStack } from 'tamagui';
import { Screen } from '@/components/Screen';
import { BackButton } from '@/components/BackButton';
import { Check, Minus, X } from '@tamagui/lucide-icons';
import { useParticipantsImageQuery, useParticipantsQuery } from '@/api/events/queries';
import { Redirect, useGlobalSearchParams } from 'expo-router';
import { ActivityIndicator } from 'react-native';
import { ParticipantQueryResponse, ParticipantStatus } from '@/api/events/types';
import { useGetUser } from '@/store/user';
import { Card } from '@/components/tamagui/Card';
import { Button } from '@/components/tamagui/Button';
import { useUpdateParticipationMutation } from '@/api/events/mutations';

const ParticipantAvatar = ({
  participant: { firstName, lastName, userId },
}: {
  participant: ParticipantQueryResponse;
}) => {
  const { data: image } = useParticipantsImageQuery(userId);

  const kuerzel =
    firstName?.charAt(0).toUpperCase() + '. ' + lastName?.charAt(0).toUpperCase() + '.';

  return (
    <Avatar circular size="$4" elevationAndroid={4}>
      {image && <Avatar.Image source={{ uri: image }} />}
      <Avatar.Fallback backgroundColor="$background" alignItems="center" justifyContent="center">
        <SizableText>{kuerzel}</SizableText>
      </Avatar.Fallback>
    </Avatar>
  );
};

export default function Participants() {
  const { eventId = '' } = useGlobalSearchParams<{ eventId: string }>();
  const { data: participants, isLoading } = useParticipantsQuery(eventId);
  const user = useGetUser();
  const { mutate } = useUpdateParticipationMutation();

  if (isLoading) {
    return <ActivityIndicator />;
  }

  if (!participants) {
    return <Redirect href=".." />;
  }

  const sortedParticipants = participants.sort((a, b) => {
    if (b.role === 'creator' && a.role !== 'creator') {
      return 1;
    }
    if (b.role === 'admin' && a.role !== 'admin') {
      return 1;
    }
    if (b.role === 'guest' && a.role !== 'guest') {
      return -1;
    }
    return 0;
  });

  const total = participants.length;
  const accepted = participants.filter((part) => part.status === 'accepted').length;

  const StatusIcon = ({ status }: { status: ParticipantStatus }) => {
    switch (status) {
      case 'accepted':
        return <Check color="green" size="$1.5" />;
      case 'declined':
        return <X color="red" size="$1.5" />;
      default:
        return <Minus color="$color.yellow8Light" size="$1.5" />;
    }
  };

  const me = sortedParticipants.find((participant) => participant.id === user?.id);

  if (!me) {
    return;
  }

  const decline = () => {
    mutate({
      id: me?.id,
      userId: me.userId,
      eventId: me.eventId,
      role: me.role,
      status: 'declined',
    });
  };

  const accept = () => {
    mutate({
      id: me?.id,
      userId: me.userId,
      eventId: me.eventId,
      role: me.role,
      status: 'accepted',
    });
  };

  return (
    <Screen back={<BackButton href=".." />} title="Teilnehmer">
      <SizableText>
        {total} eingeladen Teilnehmer, {accepted} haben zugesagt
      </SizableText>
      <Card gap="$2" justifyContent="center" alignItems="center">
        <SizableText size="$5">Bitte sage zu oder ab</SizableText>
        <XStack gap="$4">
          <Button onPress={accept} flex={1} backgroundColor="$color.green11Light">
            Zusagen
          </Button>
          <Button flex={1} onPress={decline} backgroundColor="$color.red11Light">
            Absagen
          </Button>
        </XStack>
      </Card>
      {sortedParticipants.map((participant) => (
        <>
          <Separator borderColor="lightgrey" />
          <XStack justifyContent="space-between" alignItems="center">
            <XStack gap="$4" alignItems="center">
              <ParticipantAvatar participant={participant} />
              <View>
                <SizableText size="$5">
                  {participant.firstName} {participant.lastName}
                </SizableText>
                <SizableText size="$2">{participant.role}</SizableText>
              </View>
            </XStack>
            <StatusIcon status={participant.status} />
          </XStack>
        </>
      ))}
    </Screen>
  );
}
