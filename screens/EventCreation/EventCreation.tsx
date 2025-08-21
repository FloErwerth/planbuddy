import { useCreateEventMutation } from '@/api/events/mutations';
import { appEventSchema, Event } from '@/api/events/types';
import { useUploadEventImageMutation } from '@/api/images';
import { FormTextArea } from '@/components/FormFields';
import { FormInput } from '@/components/FormFields/FormInput';
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
import { EventSelectStartEnd } from '../Events/EventSelectStartEnd';
import { useStartEndTimePickers } from '../Events/hooks/useStartEndTime';

export const EventCreation = () => {
    const now = new Date();
    const {
        startDate,
        endDate,
        startPicker: {
            date: { setStartDate, showStartCalendar, isStartCalendarOpen },
            time: { setStartTime, showStartTime, isStartTimeOpen },
        },
        endPicker: {
            date: { setEndDate, showEndCalendar, isEndCalendarOpen },
            time: { setEndTime, showEndTime, isEndTimeOpen },
        },
    } = useStartEndTimePickers();

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
                            <SizableText>Zeitraum</SizableText>
                            <View gap="$2" borderRadius="$4" padding="$2" backgroundColor="$accent">
                                <View>
                                    <XStack gap="$4" alignItems="center" justifyContent="space-between">
                                        <SizableText>Start</SizableText>
                                        <XStack gap="$2">
                                            <ToggleButton inactiveBackgroundColor="$white" active={isStartCalendarOpen} onPress={showStartCalendar} size="$2">
                                                <SizableText color={isStartCalendarOpen ? '$background' : '$color'}>{formatToDate(startDate)}</SizableText>
                                            </ToggleButton>
                                            <ToggleButton inactiveBackgroundColor="$white" active={isStartTimeOpen} onPress={showStartTime} size="$2">
                                                <SizableText color={isStartTimeOpen ? '$background' : '$color'}>{formatToTime(startDate)}</SizableText>
                                            </ToggleButton>
                                        </XStack>
                                    </XStack>
                                    <EventSelectStartEnd
                                        showCalendar={isStartCalendarOpen}
                                        showTimePicker={isStartTimeOpen}
                                        setTime={setStartTime}
                                        date={startDate}
                                        setDate={setStartDate}
                                    />
                                </View>
                                <Separator borderColor="$background" />
                                <View>
                                    <XStack gap="$4" width="100%" alignItems="center" justifyContent="space-between">
                                        <SizableText>Ende</SizableText>
                                        <XStack gap="$2" alignSelf="center">
                                            <ToggleButton inactiveBackgroundColor="$white" active={isEndCalendarOpen} onPress={showEndCalendar} size="$2">
                                                <SizableText color={isEndCalendarOpen ? '$background' : '$color'}>{formatToDate(endDate)}</SizableText>
                                            </ToggleButton>
                                            <ToggleButton inactiveBackgroundColor="$white" active={isEndTimeOpen} onPress={showEndTime} size="$2">
                                                <SizableText color={isEndTimeOpen ? '$background' : '$color'}>{formatToTime(endDate)}</SizableText>
                                            </ToggleButton>
                                        </XStack>
                                    </XStack>
                                    <EventSelectStartEnd
                                        setTime={setEndTime}
                                        showCalendar={isEndCalendarOpen}
                                        showTimePicker={isEndTimeOpen}
                                        date={endDate}
                                        minimumDate={startDate}
                                        setDate={(date) => {
                                            setEndDate(date);
                                            form.clearErrors('endTime');
                                        }}
                                    />
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
                        startTime: startDate.valueOf().toString(),
                        endTime: endDate.valueOf().toString(),
                    })
                )}
            >
                Event erstellen
            </Button>
        </>
    );
};
