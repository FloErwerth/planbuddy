import { useEffect, useState } from 'react';
import { useSetTimeout } from '@/hooks/useSetTimeout';
import { SizableText, Spinner, useWindowDimensions, View } from 'tamagui';
import { Check } from '@tamagui/lucide-icons';
import { router } from 'expo-router';

export default function SendingEmail() {
    const [emailSent, setEmailSent] = useState(false);
    const { setTimeout: setEmailSentTimeout, clear: clearEmailSentTimeout } = useSetTimeout();
    const { setTimeout: setRedirectTimeout, clear: clearRedirectTimeout } = useSetTimeout();
    const { width, height } = useWindowDimensions();

    const measures = {
        left: 0,
        top: 0,
        width,
        height,
    };

    useEffect(() => {
        setEmailSentTimeout(() => {
            setEmailSent(true);
            setRedirectTimeout(() => {
                router.replace('/token');
            }, 1500);
        }, 3000);

        return () => {
            clearEmailSentTimeout();
            clearRedirectTimeout();
        };
    }, [clearEmailSentTimeout, clearRedirectTimeout, setEmailSentTimeout, setRedirectTimeout]);

    return (
        <View flex={1} justifyContent="center">
            {emailSent ? (
                <View gap="$3" position="absolute" justifyContent="center" alignItems="center" {...measures}>
                    <View
                        animation="bouncy"
                        width="$6"
                        justifyContent="center"
                        alignItems="center"
                        height="$6"
                        enterStyle={{ scale: 1.5 }}
                        borderRadius="$12"
                        backgroundColor="$primary"
                    >
                        <Check size="$4" animation="bouncy" enterStyle={{ size: '$1' }} color="$background" />
                    </View>
                    <SizableText size="$6">Fertig!</SizableText>
                </View>
            ) : (
                <View gap="$6" position="absolute" {...measures} justifyContent="center" alignItems="center">
                    <Spinner animation="bouncy" exitStyle={{ opacity: 0 }} enterStyle={{ scale: 0.5 }} scale={1.7} color="$primary" size="large" />
                    <SizableText size="$6">Deine E-Mail wird versendet...</SizableText>
                </View>
            )}
        </View>
    );
}
