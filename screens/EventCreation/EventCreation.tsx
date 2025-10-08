import { FormTextArea } from "@/components/FormFields";
import { FormInput } from "@/components/FormFields/FormInput";
import { ScrollableScreen } from "@/components/Screen";
import { Button } from "@/components/tamagui/Button";
import { ToggleButton } from "@/components/TogglePillButton";
import { EventCreationImage } from "@/screens/EventCreation/EventCreationImage";
import { formatToDate, formatToTime } from "@/utils/date";
import { zodResolver } from "@hookform/resolvers/zod";
import { router } from "expo-router";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { Separator, SizableText, View, XStack, YStack } from "tamagui";
import { EventSelectStartEnd } from "../Events/EventSelectStartEnd";
import { useStartEndTimePickers } from "../Events/hooks/useStartEndTime";
import { BackButton } from "@/components/BackButton";
import { useCreateEventMutation } from "@/api/events/createEvents";
import { useEventImageQuery } from "@/api/events/eventImage";
import { useRemoveEventImageMutation } from "@/api/events/removeEventImage";
import { type AppEvent, eventCreationSchema } from "@/api/events/types";
import { useUpdateEventMutation } from "@/api/events/updateEvent";
import { useUploadEventImageMutation } from "@/api/events/uploadEventImage";

type EventCreationProps = {
	event?: AppEvent;
};

export const EventCreation = ({ event }: EventCreationProps) => {
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
		resolver: zodResolver(eventCreationSchema),
		defaultValues: {
			creatorId: event?.creatorId,
			description: event?.description,
			link: event?.link,
			location: event?.location,
			name: event?.name,
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
			// update the existing event
			console.log(event);
			if (event) {
				await updateEvent({
					...data,
					id: event.id,
					createdAt: event.createdAt,
					startTime: startDate.toISOString(),
					endTime: endDate.toISOString(),
				});
				const isSameImage = imageToUpload === eventImage;
				if (!isSameImage) {
					console.log(imageToUpload);
					if (imageToUpload) {
						await uploadEventImage({
							eventId: event.id,
							image: imageToUpload,
						});
					} else if (eventImage) {
						await removeImage({ eventId: event.id });
					}
				}
			} else {
				// create a new event
				createdEvent = await createEvent({
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
	console.log(form.formState.errors);
	return (
		<>
			<ScrollableScreen paddingBottom="$12" back={event && <BackButton />} title={event ? "Event bearbeiten" : "Event erstellen"}>
				<YStack backgroundColor="$accent" overflow="hidden" borderRadius="$4" elevation="$2">
					<EventCreationImage setImage={setImageToUpload} image={imageToUpload} />
				</YStack>
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
												<SizableText color={isStartCalendarOpen ? "$background" : "$color"}>{formatToDate(startDate)}</SizableText>
											</ToggleButton>
											<ToggleButton inactiveBackgroundColor="$white" active={isStartTimeOpen} onPress={showStartTime} size="$2">
												<SizableText color={isStartTimeOpen ? "$background" : "$color"}>{formatToTime(startDate)}</SizableText>
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
											<ToggleButton elevationAndroid={0} inactiveBackgroundColor="$white" active={isEndCalendarOpen} onPress={showEndCalendar} size="$2">
												<SizableText color={isEndCalendarOpen ? "$background" : "$color"}>{formatToDate(endDate)}</SizableText>
											</ToggleButton>
											<ToggleButton elevationAndroid={0} inactiveBackgroundColor="$white" active={isEndTimeOpen} onPress={showEndTime} size="$2">
												<SizableText color={isEndTimeOpen ? "$background" : "$color"}>{formatToTime(endDate)}</SizableText>
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
											form.clearErrors("endTime");
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
				{event ? "Event aktualisieren" : "Event erstellen"}
			</Button>
		</>
	);
};
