import { SizableText, View, XStack } from 'tamagui';
import { UserAvatar } from '@/components/UserAvatar';
import { ParticipantQueryResponse } from '@/api/events/types';
import { useIsMe } from '@/screens/Participants/useIsMe';
import { ParticipantsAcceptanceStatus } from '@/screens/Participants/ParticipantsAcceptanceStatus';
import { Pressable } from 'react-native';
import { Ellipsis } from '@tamagui/lucide-icons';
import { Card } from '@/components/tamagui/Card';

type ParticipantProps = {
    onOpenOptions?: () => void;
    participant: ParticipantQueryResponse;
    showStatus?: boolean;
    showEllipsis?: boolean;
};
export const Participant = ({ participant, onOpenOptions, showStatus = true, showEllipsis = true }: ParticipantProps) => {
    const isMe = useIsMe(participant.userId);

    return (
        <Pressable onPress={onOpenOptions}>
            <Card flexDirection="row" justifyContent="space-between" backgroundColor={isMe ? '$color.blue4Light' : '$background'} alignItems="center">
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
                    <View>
                        {isMe ? (
                            <SizableText marginRight="$2">Du</SizableText>
                        ) : showStatus ? (
                            <ParticipantsAcceptanceStatus status={participant.status} />
                        ) : null}
                    </View>
                    {showEllipsis && onOpenOptions && <Ellipsis />}
                </XStack>
            </Card>
        </Pressable>
    );
};
