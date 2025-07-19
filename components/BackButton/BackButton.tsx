import { Link } from 'expo-router';
import { ChevronLeft } from '@tamagui/lucide-icons';
import { ButtonProps, View } from 'tamagui';
import { ComponentProps } from 'react';
import { Pressable } from 'react-native';

type BackButtonProps = Partial<Pick<ComponentProps<typeof Link>, 'href'>> & ButtonProps;
export const BackButton = ({ href = '..', ...viewProps }: BackButtonProps) => {
    return (
        <Pressable onPress={viewProps.onPress}>
            <View padding={0} backgroundColor="$primary" borderRadius="$12" justifyContent="center" alignItems="center" width="$2" height="$2" {...viewProps}>
                <Link href={href}>
                    <ChevronLeft color="$background" />
                </Link>
            </View>
        </Pressable>
    );
};
