import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { View, YStack } from "tamagui";
import { useCreateEventMutation } from "@/api/events/createEvents";
import { useEventImageQuery } from "@/api/events/eventImage";
import { useRemoveEventImageMutation } from "@/api/events/removeEventImage";
import { type AppEvent, appEventSchema } from "@/api/events/types";
import { useUpdateEventMutation } from "@/api/events/updateEvent";
import { useUploadEventImageMutation } from "@/api/events/uploadEventImage";
import { BackButton } from "@/components/BackButton";
import { FormTextArea } from "@/components/FormFields";
import { FormInput } from "@/components/FormFields/FormInput";
import { ScrollableScreen } from "@/components/Screen";
import { Button } from "@/components/tamagui/Button";
import { useTranslation } from "@/hooks/useTranslation";
import { EventCreationImage } from "@/screens/Events/EventCreation/EventCreationImage";
import { useStartEndTimePickers } from "../EventOverview/hooks/useStartEndTime";
import { EventSelectStartEnd } from "../SharedEventComponents/EventSelectStartEnd";

type EventCreationProps = {
    event: AppEvent;
};

export const EventEditScreen = ({ event }: EventCreationProps) => {
    const { t } = useTranslation();
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
    } = useStartEndTimePickers(event && { startDate: new Date(event.startTime), endDate: new Date(event.endTime) });

    const form = useForm({
        resolver: zodResolver(appEventSchema),
        defaultValues: {
            ...event,
            startTime: event?.startTime ?? now.valueOf().toString(),
            endTime: event?.endTime ?? now.valueOf().toString(),
        },
    });

    const endTimeError = form.formState.errors.endTime;

    const { mutateAsync: createEvent } = useCreateEventMutation();
    const { mutateAsync: uploadEventImage } = useUploadEventImageMutation();
    const { mutateAsync: updateEvent } = useUpdateEventMutation();
    const { data: eventImage = null } = useEventImageQuery(event?.id);
    const { mutateAsync: removeImage } = useRemoveEventImageMutation();
    const [imageToUpload, setImageToUpload] = useState<string | null>(eventImage);

    const handleCreateEvent = async (data: AppEvent) => {
        try {
            let createdEvent: Awaited<ReturnType<typeof createEvent>>;

            await updateEvent({
                ...data,
                id: event.id,
                createdAt: event.createdAt,
                startTime: startDate.toISOString(),
                endTime: endDate.toISOString(),
            });
            const isSameImage = imageToUpload === eventImage;
            if (!isSameImage) {
                if (imageToUpload) {
                    await uploadEventImage({
                        eventId: event.id,
                        image: imageToUpload,
                    });
                } else if (eventImage) {
                    await removeImage({ eventId: event.id });
                }
            }
            router.replace({
                pathname: "/eventDetails",
                params: { eventId: event ? event.id : createdEvent?.id },
            });
        } catch (e) {
            console.error(e);
        }
    };

    const hasErrors = Object.values(form.formState.errors).length > 0;

    return (
        <>
            <ScrollableScreen paddingBottom="$12" back={event && <BackButton />} title={event ? t("events.edit") : t("events.create")}>
                <YStack backgroundColor="$accent" overflow="hidden" borderRadius="$4" elevation="$2">
                    <EventCreationImage setImage={setImageToUpload} image={imageToUpload} />
                </YStack>
                <View gap="$4" height="100%">
                    <FormProvider {...form}>
                        <FormInput label={t("events.name")} name="name" />
                        <EventSelectStartEnd onChangeStart={setStartDate} onChangeEnd={setEndDate} startDate={startDate} endDate={endDate} />
                        <FormInput label={t("events.location")} name="location" />
                        <FormTextArea multiline verticalAlign="top" label={t("events.details")} name="description" />
                        <FormInput label={t("events.link")} name="link" />
                    </FormProvider>
                </View>
            </ScrollableScreen>
            <Button
                debounceDisabled
                disabled={hasErrors}
                position="absolute"
                bottom="$4"
                left="$4"
                right="$4"
                size="$5"
                fontWeight="700"
                onPress={form.handleSubmit((data) =>
                    handleCreateEvent({
                        ...data,
                        startTime: startDate.valueOf().toString(),
                        endTime: endDate.valueOf().toString(),
                    }),
                )}
            >
                {event ? t("events.update") : t("events.create")}
            </Button>
        </>
    );
};
