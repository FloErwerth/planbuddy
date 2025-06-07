import { useState } from 'react';
import { Screen } from '@/components/Screen';
import { View } from 'tamagui';
import { Button } from '@/components/tamagui';
import { Calendar } from '@/components/Calendar';
import { router } from 'expo-router';
import { useCreateEventMutation } from '@/api/events/createEvents/mutations';
import * as ExpoImagePicker from 'expo-image-picker';
import { MediaTypeOptions } from 'expo-image-picker';
import { FormProvider, useForm } from 'react-hook-form';
import { FormInput } from '@/components/FormFields/FormInput';
import { Event, eventSchema } from '@/api/events/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useUploadEventImageMutation } from '@/api/images';

export const EventCreation = () => {
  const form = useForm({ resolver: zodResolver(eventSchema) });

  const [date, setDate] = useState<Date>(new Date());
  const { mutateAsync: createEvent } = useCreateEventMutation();
  const { mutateAsync: uploadEventImage } = useUploadEventImageMutation();

  const [isLoading, setIsLoading] = useState(false);
  const [imageToUpload, setImageToUpload] = useState<string>();

  const pickImage = async () => {
    const result = await ExpoImagePicker.launchImageLibraryAsync({
      mediaTypes: MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.25,
    });
    if (!result.canceled) {
      setImageToUpload(result.assets[0].uri);
    }
  };

  const handleCreateEvent = async (data: Event) => {
    setIsLoading(true);

    const id = await createEvent({ ...data, eventTime: date.valueOf().toString() });
    if (imageToUpload && id) {
      const result = await uploadEventImage({ eventId: id, image: imageToUpload });
      if (result.error) {
        // do something?
      }
    }
    setIsLoading(false);
    if (id) {
      router.replace({ pathname: './shareEvent', params: { eventId: id } });
    }
  };

  return (
    <Screen flex={1}>
      <FormProvider {...form}>
        <FormInput name="name" placeholder="Name des Events" />
        <FormInput name="location" placeholder="Ort des Events" />
        <Calendar date={date} onDateSelected={setDate} />
        <FormInput name="description" placeholder="Beschreibung" />
      </FormProvider>
      <Button onPress={pickImage}>Image</Button>
      <View flex={1} />
      <Button onPress={form.handleSubmit(handleCreateEvent)}>Erstellen</Button>
    </Screen>
  );
};
