import { supabase } from '@/api/supabase';
import { BackButton } from '@/components/BackButton';
import { Screen } from '@/components/Screen';
import { TokenInput } from '@/components/TokenInput/TokenInput';
import { Button } from '@/components/tamagui/Button';
import { Sheet } from '@/components/tamagui/Sheet';
import { useCheckLoginState } from '@/hooks/useCheckLoginState';
import { useLoginContext } from '@/providers/LoginProvider';
import { tokenSchema } from '@/screens/Authentication/types';
import { useSetUser } from '@/store/authentication';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { AnimatePresence, debounce, SizableText, View } from 'tamagui';

export const TokenScreen = () => {
    const { email, resendTokenTime, startedLoginAttempt, setStartedLoginAttempt, startResendTokenTimer, setLoginError, resetTokenPage } = useLoginContext();
    const [token, setToken] = useState<string[]>([]);
    const [previousToken, setPreviousToken] = useState<string[]>([]);
    const [showSheet, setShowSheet] = useState(false);
    const setUser = useSetUser();
    const [tokenError, setTokenError] = useState<string>('');
    const hasValue = !token.every((val) => !val);
    const { handleCheckLoginstate } = useCheckLoginState();

    const onComplete = async () => {
        if (!email || token.join('') === previousToken.join('') || !hasValue) {
            return;
        }
        setPreviousToken(token);

        try {
            const { data, error } = await supabase.auth.verifyOtp({
                email: email,
                token: token.join(''),
                type: 'email',
            });

            if (error || !data.session || !data.user) {
                console.error(error?.code);
                switch (error?.code) {
                    case 'invalid_credentials':
                    case 'otp_expired':
                        setTokenError('Der eingegebene Code ist ungültig');
                }
                return;
            }

            await handleCheckLoginstate(data.user);
            await supabase.auth.setSession(data.session);
            console.log('tabs');
            router.replace('/(tabs)');
            resetTokenPage();
            setUser(data.user);
        } catch (e) {
            if (e instanceof Error) {
                console.error(e.message);
            }
        }
    };

    const resendToken = async () => {
        console.log('resend');

        router.push({ pathname: '/authentication/sendingEmail', params: { email } });
        const result = await supabase.auth.signInWithOtp({
            email,
        });
        startResendTokenTimer();

        if (result.error) {
            switch (result.error.code) {
                case 'over_request_rate_limit':
                case 'over_email_send_rate_limit':
                    // should never happen
                    setLoginError(`Es wurden mit ${email} zu viele Loginversuche gemacht. Bitte versuche es später noch einmal`);
                    break;
                case 'email_exists':
                    setLoginError('Diese E-Mail ist bereits vergeben');
                    break;
                default:
                    setLoginError('Es ist ein Fehler aufgetreten, bitte versuche es erneut');
            }
            router.replace('/authentication');
            return;
        }
    };

    const handleChangeMail = () => {
        setStartedLoginAttempt(false);
        setShowSheet(false);
        console.log('change');

        router.push('/authentication');
    };

    useEffect(() => {
        const parsedToken = tokenSchema.safeParse(token);

        if (parsedToken.success) {
            void onComplete();
        }
    }, [token]);

    return (
        <>
            <Screen back={<BackButton href="/authentication" />} flex={1} title="Verifizierung">
                <View flex={1} justifyContent="center" gap="$6">
                    <SizableText size="$8">Checke deine E-Mails</SizableText>
                    <SizableText>
                        Wir haben dir eine E-Mail an <SizableText fontWeight="bold">{email}</SizableText> gesendet. Bitte gib den dort angezeigten Code unten
                        ein
                    </SizableText>
                    <View gap="$2">
                        {tokenError && (
                            <SizableText
                                animation="bouncy"
                                enterStyle={{
                                    height: 0,
                                    opacity: 0,
                                    scale: 0.9,
                                }}
                                pointerEvents="none"
                                theme="error"
                            >
                                {tokenError}
                            </SizableText>
                        )}
                        <TokenInput value={token} onChange={setToken} />
                        {hasValue && (
                            <AnimatePresence>
                                <Button
                                    variant="transparent"
                                    animation="bouncy"
                                    enterStyle={{
                                        opacity: 0,
                                        scale: 0.9,
                                        height: 0,
                                    }}
                                    exitStyle={{
                                        opacity: 0,
                                        scale: 0.9,
                                        height: 0,
                                    }}
                                    alignSelf="flex-end"
                                    size="$2"
                                    onPress={() => setToken([])}
                                >
                                    <SizableText color="$primary">Eingabe enternen</SizableText>
                                </Button>
                            </AnimatePresence>
                        )}
                    </View>
                    <Button onPress={() => setShowSheet(true)} size="$3" alignSelf="flex-start" variant="secondary">
                        Keinen Code erhalten
                    </Button>
                </View>
            </Screen>
            <Sheet snapPoints={undefined} snapPointsMode="fit" open={showSheet} onOpenChange={setShowSheet}>
                <Screen>
                    <SizableText size="$6">Hast Du keinen Code erhalten?</SizableText>
                    <SizableText>Wenn Du keinen Code erhalten hast, dann hast Du folgende Möglichkeiten:</SizableText>
                    <View gap="$2">
                        <Button onPress={debounce(resendToken, 200, true)} disabled={resendTokenTime > 0 && startedLoginAttempt}>
                            {startedLoginAttempt && resendTokenTime > 0 ? `In ${resendTokenTime} erneut senden` : 'Erneut senden'}
                        </Button>
                        <Button onPress={debounce(handleChangeMail, 200, true)}>E-Mail-Addresse ändern</Button>
                    </View>
                </Screen>
            </Sheet>
        </>
    );
};
