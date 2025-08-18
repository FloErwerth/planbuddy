import { useCreateEventMutation } from '@/api/events/mutations';
import { appEventSchema, Event } from '@/api/events/types';
import { useUploadEventImageMutation } from '@/api/images';
import { Calendar } from '@/components/Calendar';
import { FormTextArea } from '@/components/FormFields';
import { FormInput } from '@/components/FormFields/FormInput';
import { HeightTransition } from '@/components/HeightTransition';
import { ScrollableScreen } from '@/components/Screen';
import { Button } from '@/components/tamagui/Button';
import { ToggleButton } from '@/components/TogglePillButton';
import { EventCreationImage } from '@/screens/EventCreation/EventCreationImage';
import { formatToDate, formatToTime } from '@/utils/date';
import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { Separator, SizableText, View, XStack } from 'tamagui';
import { EventTimerPicker } from '../Events/EventTimerPicker';

export const EventCreation = () => {
    const now = new Date();
    const [start, setStart] = useState<Date>(now);
    const [end, setEnd] = useState<Date>(
        (() => {
            const newEnd = new Date(now);
            newEnd.setHours(now.getHours() + 3);
            return newEnd;
        })()
    );

    const [showStartCalendar, setShowStartCalendar] = useState(false);
    const [showStartTime, setShowStartTime] = useState(false);
    const [showEndCalendar, setShowEndCalendar] = useState(false);
    const [showEndTime, setShowEndTime] = useState(false);

    const form = useForm({
        resolver: zodResolver(appEventSchema),
        defaultValues: {
            startTime: now.valueOf().toString(),
            endTime: now.valueOf().toString(),
        },
    });

    const endTimeError = form.formState.errors.endTime;

    const [imageToUpload, setImageToUpload] = useState<string>();
    const [isLoading, setIsLoading] = useState(false);

    const handleSetStart = (date: Date) => {
        setStart(date);
        form.setValue('startTime', date.valueOf().toString());
    };

    const handleSetEnd = (date: Date) => {
        setEnd(date);
        form.clearErrors('endTime');
        form.setValue('endTime', date.valueOf().toString());
    };

    const { mutateAsync: createEvent } = useCreateEventMutation();
    const { mutateAsync: uploadEventImage } = useUploadEventImageMutation();

    const handleCreateEvent = async (data: Event) => {
        try {
            setIsLoading(true);
            const createdEvent = await createEvent({
                event: data,
            });
            if (!createdEvent) {
                throw new Error('Event creation failed');
            }
            if (imageToUpload && createdEvent) {
                await uploadEventImage({
                    eventId: createdEvent.id,
                    image: imageToUpload,
                });
            }
            router.replace({
                pathname: '/eventDetails',
                params: { eventId: createdEvent.id },
            });
        } catch (e) {
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    };

    const hasErrors = Object.values(form.formState.errors).length > 0;

    return (
        <>
            <ScrollableScreen>
                <View backgroundColor="$background" overflow="hidden" elevationAndroid="$2" width="100%" borderRadius="$8">
                    <EventCreationImage setImage={setImageToUpload} image={imageToUpload} />
                </View>
                <View gap="$4" height="100%">
                    <FormProvider {...form}>
                        <FormInput label="Eventname" name="name" />
                        <View gap="$1.5">
                            <SizableText>Start und Ende</SizableText>
                            <View gap="$2" borderRadius="$4" padding="$2" backgroundColor="$accent">
                                <View>
                                    <XStack gap="$4" alignItems="center" justifyContent="space-between">
                                        <SizableText>Start</SizableText>
                                        <XStack gap="$2">
                                            <ToggleButton
                                                inactiveBackgroundColor="$white"
                                                active={showStartCalendar}
                                                onPress={() => {
                                                    setShowStartTime(false);
                                                    setShowEndCalendar(false);
                                                    setShowEndTime(false);
                                                    setShowStartCalendar((open) => !open);
                                                }}
                                                size="$2"
                                            >
                                                <SizableText color={showStartCalendar ? '$background' : '$color'}>{formatToDate(start)}</SizableText>
                                            </ToggleButton>
                                            <ToggleButton
                                                inactiveBackgroundColor="$white"
                                                active={showStartTime}
                                                onPress={() => {
                                                    setShowStartCalendar(false);
                                                    setShowEndCalendar(false);
                                                    setShowEndTime(false);
                                                    setShowStartTime((open) => !open);
                                                }}
                                                size="$2"
                                            >
                                                <SizableText color={showStartTime ? '$background' : '$color'}>{formatToTime(start)}</SizableText>
                                            </ToggleButton>
                                        </XStack>
                                    </XStack>
                                    <HeightTransition paddingVertical="$6" open={showStartCalendar}>
                                        <Calendar date={start} onDateSelected={setStart} minimumDate={new Date()} />
                                    </HeightTransition>
                                    <HeightTransition alignSelf="center" open={showStartTime}>
                                        <EventTimerPicker />
                                    </HeightTransition>
                                </View>
                                <Separator borderColor="$background" />
                                <View>
                                    <XStack gap="$4" width="100%" alignItems="center" justifyContent="space-between">
                                        <SizableText>Ende</SizableText>
                                        <XStack gap="$2" alignSelf="center">
                                            <ToggleButton
                                                inactiveBackgroundColor="$white"
                                                active={showEndCalendar}
                                                onPress={() => {
                                                    setShowStartCalendar(false);
                                                    setShowStartTime(false);
                                                    setShowEndTime(false);
                                                    setShowEndCalendar((open) => !open);
                                                }}
                                                size="$2"
                                            >
                                                <SizableText color={showEndCalendar ? '$background' : '$color'}>{formatToDate(start)}</SizableText>
                                            </ToggleButton>
                                            <ToggleButton
                                                inactiveBackgroundColor="$white"
                                                active={showEndTime}
                                                onPress={() => {
                                                    setShowStartCalendar(false);
                                                    setShowStartTime(false);
                                                    setShowEndCalendar(false);
                                                    setShowEndTime((open) => !open);
                                                }}
                                                size="$2"
                                            >
                                                <SizableText color={showEndTime ? '$background' : '$color'}>{formatToTime(start)}</SizableText>
                                            </ToggleButton>
                                        </XStack>
                                    </XStack>
                                    <HeightTransition paddingVertical="$6" open={showEndCalendar}>
                                        <Calendar date={end} onDateSelected={setStart} minimumDate={new Date()} />
                                    </HeightTransition>
                                    <HeightTransition paddingTop="$4" alignSelf="center" open={showEndTime}>
                                        <EventTimerPicker />
                                    </HeightTransition>
                                </View>
                            </View>
                            {endTimeError && <SizableText theme="error">{endTimeError.message}</SizableText>}
                        </View>

                        <FormInput label="Ort" name="location" />
                        <FormTextArea multiline verticalAlign="top" label="Details" name="description" />
                        <FormInput label="Link" name="link" />
                    </FormProvider>
                </View>
            </ScrollableScreen>
            <Button
                marginHorizontal="$4"
                marginBottom="$4"
                disabled={hasErrors}
                onPress={form.handleSubmit((data) =>
                    handleCreateEvent({
                        ...data,
                        startTime: start.valueOf().toString(),
                        endTime: end.valueOf().toString(),
                    })
                )}
            >
                Event erstellen
            </Button>
        </>
    );
};
