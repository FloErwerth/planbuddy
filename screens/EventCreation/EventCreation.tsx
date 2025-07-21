import { useState } from 'react';
import { Separator, SizableText, View, XStack } from 'tamagui';
import { Calendar } from '@/components/Calendar';
import { useCreateEventMutation } from '@/api/events/mutations';
import { FormProvider, useForm } from 'react-hook-form';
import { FormInput } from '@/components/FormFields/FormInput';
import { appEventSchema, Event } from '@/api/events/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useUploadEventImageMutation } from '@/api/images';
import { FormTextArea } from '@/components/FormFields';
import { Button } from '@/components/tamagui/Button';
import { ScrollableScreen } from '@/components/Screen';
import { EventCreationImage } from '@/screens/EventCreation/EventCreationImage';
import { router } from 'expo-router';

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
            setIsLoading(false);
            router.replace({
                pathname: '/eventDetails',
                params: { eventId: createdEvent.id },
            });
        } catch (e) {
            console.error(e);
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
                                <XStack gap="$4" alignItems="center">
                                    <SizableText>Start</SizableText>
                                    <Calendar
                                        date={start}
                                        onDateSelected={(date) => {
                                            const splitt = end.toISOString().split('T');
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
                                    <Calendar minimumDate={start} date={end} onDateSelected={handleSetEnd} />
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
