import { useState } from 'react';
import { Screen } from '@/components/Screen';
import { View, XStack } from 'tamagui';
import { useCreateEventMutation } from '@/api/query/events';
import { Button, Card, Input } from '@/components/tamagui';
import { Calendar } from '@/components/Calendar';
import { ImagePicker } from '@/components/ImagePicker';
import { getAuth } from '@react-native-firebase/auth';
import { useAtomValue } from 'jotai';
import { imagePickerAtom } from '@/components/ImagePicker/imagePickerAtom';
import storage from '@react-native-firebase/storage';
import { getApp } from '@react-native-firebase/app';
import { router } from 'expo-router';

export const EventCreation = () => {
  const [name, setName] = useState('');
  const [streetHouseNr, setStreetHouseNr] = useState('');
  const [zipCity, setZipCity] = useState('');
  const [date, setDate] = useState<Date>(new Date());
  const [description, setDescription] = useState('');
  const { mutateAsync: createEvent } = useCreateEventMutation();
  const [isLoading, setIsLoading] = useState(false);
  const image = useAtomValue(imagePickerAtom);

  const handleImageUpload = async () => {
    const userId = getAuth().currentUser?.uid;
    if (!image || !userId) {
      return Promise.resolve('');
    }
    const reference = storage(getApp()).ref(`images/${userId}/${Date.now()}`);
    const response = await fetch(image);
    const blob = await response.blob();
    const snapShot = await reference.put(blob);
    return await storage(getApp())
      .ref(`images/${userId}/${snapShot.metadata.name}`)
      .getDownloadURL();
  };

  const handleCreateEvent = async () => {
    setIsLoading(true);
    // save image for user
    const imageUrl = await handleImageUpload();

    const id = await createEvent({
      name,
      dateTimestamp: date.valueOf(),
      description,
      address: { streetHouseNr, zipCity },
      image: imageUrl,
    });

    setIsLoading(false);
    if (id) {
      router.replace({ pathname: './shareEvent', params: { eventId: id } });
    }
    /*router.replace({ pathname: './shareEvent', params: { eventId: id } });*/
  };

  return (
    <Screen>
      <Card height="100%" gap="$4">
        <Input onChangeText={setName} textAlign="center" placeholder="Eventname" />
        <XStack gap="$2">
          <Input flex={1} onChangeText={setStreetHouseNr} placeholder="Strasse, Nr." />
          <Input flex={1} onChangeText={setZipCity} placeholder="Plz, Ort" />
        </XStack>
        <Calendar date={date} onDateSelected={setDate} />
        <Input
          placeholder="Beschreibung"
          variant="medium"
          onChangeText={setDescription}
          numberOfLines={8}
          textAlignVertical="top"
          multiline
        />
        <ImagePicker />
        <View flex={1} />
        <Button onPress={handleCreateEvent}>Erstellen</Button>
      </Card>
    </Screen>
  );
};
