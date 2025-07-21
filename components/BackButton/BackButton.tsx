import { Link } from 'expo-router';
import { ChevronLeft } from '@tamagui/lucide-icons';
import { ButtonProps } from 'tamagui';
import { ComponentProps } from 'react';
import { Pressable } from 'react-native';
import { Button } from '@/components/tamagui/Button';

type BackButtonProps = Partial<Pick<ComponentProps<typeof Link>, 'href'>> & ButtonProps;
export const BackButton = ({ href = '..', ...viewProps }: BackButtonProps) => {
    return (
        <Pressable onPress={viewProps.onPress}>
            <Button variant="round" padding={0} justifyContent="center" alignItems="center" {...viewProps}>
                <Link href={href}>
                    <ChevronLeft size="$1" color="$color" />
                </Link>
            </Button>
        </Pressable>
    );
};
