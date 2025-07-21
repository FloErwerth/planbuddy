import { Square, View, XStack } from 'tamagui';
import { Skeleton } from '@/components/Skeleton';

export const ParticipantSkeleton = () => {
    return (
        <Skeleton shape="square">
            <Square justifyContent="space-between" padding="$2" borderRadius="$4" backgroundColor="$accent" alignItems="center">
                <XStack gap="$4" alignItems="center">
                    <Skeleton shape="circle" size="$4" />
                    <View flex={1} gap="$2">
                        <Skeleton shape="square" width="50%" backgroundColor="$color.gray10Light" height="$1" />
                        <Skeleton shape="square" width="35%" height="$0.75" />
                    </View>
                </XStack>
            </Square>
        </Skeleton>
    );
};
