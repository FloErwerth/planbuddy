import { Circle, Square, View, XStack } from 'tamagui';
import { Skeleton } from '@/components/Skeleton';

export const ParticipantSkeleton = () => {
    return (
        <Skeleton>
            <Square justifyContent="space-between" padding="$2" borderRadius="$4" backgroundColor="$accent" alignItems="center">
                <XStack gap="$4" alignItems="center">
                    <Skeleton>
                        <Circle size="$4" backgroundColor="$color.gray9Light" />
                    </Skeleton>
                    <View flex={1} gap="$2">
                        <Skeleton>
                            <Square width="50%" borderRadius="$2" backgroundColor="$color.gray10Light" height="$1" />
                        </Skeleton>
                        <Skeleton>
                            <Square width="35%" borderRadius="$2" backgroundColor="$color.gray9Light" height="$0.75" />
                        </Skeleton>
                    </View>
                </XStack>
            </Square>
        </Skeleton>
    );
};
