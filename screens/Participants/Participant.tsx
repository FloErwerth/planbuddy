import { SizableText, View, XStack } from 'tamagui';
import { UserAvatar } from '@/components/UserAvatar';
import { ParticipantQueryResponse } from '@/api/events/types';
import { useIsMe } from '@/screens/Participants/useIsMe';
import { ParticipantsAcceptanceStatus } from '@/screens/Participants/ParticipantsAcceptanceStatus';
import { Pressable } from 'react-native';
import { Ellipsis } from '@tamagui/lucide-icons';

type ParticipantProps = {
    onOpenOptions?: () => void;
    participant: ParticipantQueryResponse;
};
export const Participant = ({ participant, onOpenOptions }: ParticipantProps) => {
    const isMe = useIsMe(participant.userId);

    return (
        <XStack
            key={participant.userId}
            justifyContent="space-between"
            elevationAndroid="$1"
            padding="$2"
            borderRadius="$4"
            backgroundColor={isMe ? '$color.blue4Light' : '$background'}
            alignItems="center"
        >
            <XStack gap="$4" alignItems="center" justifyContent="space-evenly">
                <UserAvatar id={participant.userId} />
                <View>
                    <SizableText size="$5">
                        {participant.firstName} {participant.lastName}
                    </SizableText>
                    <SizableText size="$2">{participant.role}</SizableText>
                </View>
            </XStack>
            <XStack alignItems="center" gap="$4">
                <View>{isMe ? <SizableText marginRight="$2">Du</SizableText> : <ParticipantsAcceptanceStatus status={participant.status} />}</View>
                {onOpenOptions && (
                    <Pressable onPress={onOpenOptions}>
                        <Ellipsis />
                    </Pressable>
                )}
            </XStack>
        </XStack>
    );
};
