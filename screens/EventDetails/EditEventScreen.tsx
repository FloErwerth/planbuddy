import { ScrollableScreen } from '@/components/Screen';
import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { appEventSchema, Event } from '@/api/events/types';
import { useUpdateEventMutation } from '@/api/events/mutations';
import { useUploadEventImageMutation } from '@/api/images';
import { router } from 'expo-router';
import { Separator, SizableText, View, XStack } from 'tamagui';
import { EventCreationImage } from '@/screens/EventCreation';
import { FormInput, FormTextArea } from '@/components/FormFields';
import { Calendar } from '@/components/Calendar';
import { Button } from '@/components/tamagui/Button';
import { useSingleEventQuery } from '@/api/events/queries';
import { useEventDetailsContext } from '@/screens/EventDetails/EventDetailsProvider';
import { BackButton } from '@/components/BackButton';

export const EditEventScreen = () => {
    const { eventId } = useEventDetailsContext();
    const { data: event, isLoading } = useSingleEventQuery(eventId);
    const [startDate, setStartDate] = useState<Date>(new Date());
    const [endDate, setEndDate] = useState<Date>(new Date());
    const { mutateAsync: updateEvent } = useUpdateEventMutation();
    const { mutateAsync: uploadEventImage } = useUploadEventImageMutation();

    const form = useForm({
        resolver: zodResolver(appEventSchema),
    });

    useEffect(() => {
        if (event?.startTime) {
            setStartDate(new Date(parseInt(event?.startTime)));
        }
        if (event?.endTime) {
            setEndDate(new Date(parseInt(event?.endTime)));
        }
        form.reset({
            ...event,
        });
    }, [event, form]);

    const endTimeError = form.formState.errors.endTime;

    const [imageToUpload, setImageToUpload] = useState<string>();

    const handleSetStart = (date: Date) => {
        setStartDate(date);
        form.setValue('startTime', date.valueOf().toString());
    };

    const handleSetEnd = (date: Date) => {
        setEndDate(date);
        form.clearErrors('endTime');
        form.setValue('endTime', date.valueOf().toString());
    };

    const handleCreateEvent = async (data: Event) => {
        try {
            const createdEvent = await updateEvent({
                event: {
                    ...data,
                    startTime: startDate.valueOf().toString(),
                    endTime: endDate.valueOf().toString(),
                },
            });
            if (!createdEvent) {
                throw new Error('Event creation failed');
            }
            if (imageToUpload && createdEvent) {
                await uploadEventImage({
                    eventId: data.id!,
                    image: imageToUpload,
                });
            }
            router.back();
        } catch (e) {
            console.error(e);
        }
    };

    const hasErrors = Object.values(form.formState.errors).length > 0;

    return (
        <>
            <ScrollableScreen back={<BackButton />} title={`${event?.name ?? 'Event'} bearbeiten`}>
                <View backgroundColor="$background" overflow="hidden" elevationAndroid="$2" width="100%" borderRadius="$8">
                    <EventCreationImage setImage={setImageToUpload} image={imageToUpload} />
                </View>
                <View gap="$4" height="100%">
                    <FormProvider {...form}>
                        <FormInput label="Eventname" name="name" />
                        <View gap="$1.5">
                            <SizableText>Start und Ende</SizableText>
                            <View gap="$2" borderRadius="$4" padding="$2" backgroundColor="$inputBackground">
                                <XStack gap="$4" alignItems="center">
                                    <SizableText>Start</SizableText>
                                    <Calendar
                                        date={startDate}
                                        onDateSelected={(date) => {
                                            const splitt = endDate.toISOString().split('T');
                                            const dateSplitt = date.toISOString().split('T');
                                            const newEnd = new Date(dateSplitt[0] + 'T' + splitt[1]);
                                            newEnd.setHours(newEnd.getHours() + 3);
                                            handleSetEnd(newEnd);
                                            handleSetStart(date);
                                        }}
                                    />
                                </XStack>
                                <Separator borderColor="$background" />
                                <XStack gap="$4" alignItems="center">
                                    <SizableText>Ende</SizableText>
                                    <Calendar minimumDate={startDate} date={endDate} onDateSelected={handleSetEnd} />
                                </XStack>
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
                disabled={hasErrors || !form.formState.isDirty}
                onPress={form.handleSubmit(async (data) => {
                    await handleCreateEvent(data);
                })}
            >
                Abschließen
            </Button>
        </>
    );
};
