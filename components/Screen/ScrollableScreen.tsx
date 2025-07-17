import { PropsWithChildren, ReactNode } from 'react';
import { SizableText, View, XStack } from 'tamagui';
import { ScrollView } from '@/components/tamagui/ScrollView';

type ScreenProps = PropsWithChildren & {
    showBackButton?: boolean;
    title?: string;
    back?: ReactNode;
    action?: ReactNode;
    submit?: ReactNode;
};

export const ScrollableScreen = ({ children, showBackButton = false, back, title, action }: ScreenProps) => {
    return (
        <ScrollView
            contentContainerStyle={{
                padding: '$4',
                gap: '$4',
                backgroundColor: '$background',
            }}
        >
            {(back || title || action) && (
                <XStack alignItems="center">
                    <View flex={0.3}>{back}</View>
                    <View flex={1}>
                        <SizableText size="$8" textAlign="center">
                            {title}
                        </SizableText>
                    </View>
                    <View flex={0.3} alignItems="flex-end">
                        {action}
                    </View>
                </XStack>
            )}
            {children}
        </ScrollView>
    );
};
