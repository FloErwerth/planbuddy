import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { View } from "tamagui";
import { useCreateEventMutation } from "@/api/events/createEvents";
import { type AppEvent, eventCreationSchema } from "@/api/events/types";
import { useUploadEventImageMutation } from "@/api/events/uploadEventImage";
import { FormTextArea } from "@/components/FormFields";
import { FormInput } from "@/components/FormFields/FormInput";
import { ScrollableScreen } from "@/components/Screen";
import { Button } from "@/components/tamagui/Button";
import { useTranslation } from "@/hooks/useTranslation";
import { EventCreationImage } from "@/screens/Events/EventCreation/EventCreationImage";
import { useStartEndTimePickers } from "../EventOverview/hooks/useStartEndTime";
import { EventSelectStartEnd } from "../SharedEventComponents/EventSelectStartEnd";

export const EventCreation = () => {
    const { t } = useTranslation();
    const [imageToUpload, setImageToUpload] = useState<string | null>(null);

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
        resolver: zodResolver(eventCreationSchema),
    });

    const endTimeError = form.formState.errors.endTime;

    const { mutateAsync: createEvent } = useCreateEventMutation();
    const { mutateAsync: uploadEventImage } = useUploadEventImageMutation();

    const handleCreateEvent = async (data: Omit<AppEvent, "id" | "createdAt">) => {
        try {
            const createdEvent = await createEvent({
                event: { ...data, startTime: startDate.toISOString(), endTime: endDate.toISOString() },
            });
            if (!createdEvent) {
                throw new Error("Event creation failed");
            }
            if (imageToUpload) {
                await uploadEventImage({
                    eventId: createdEvent.id,
                    image: imageToUpload,
                });
            }
            router.replace({
                pathname: "/eventDetails",
                params: { eventId: createdEvent?.id },
            });
        } catch (e) {
            console.error(e);
        }
    };

    const hasErrors = Object.values(form.formState.errors).length > 0;

    return (
        <>
            <ScrollableScreen paddingBottom="$12" title={t("events.create")}>
                <EventCreationImage setImage={setImageToUpload} image={imageToUpload} />
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
