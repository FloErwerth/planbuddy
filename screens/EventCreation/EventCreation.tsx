import { useCallback, useState } from 'react';
import { SizableText, View, YStack } from 'tamagui';
import { Calendar } from '@/components/Calendar';
import { router } from 'expo-router';
import { useCreateEventMutation } from '@/api/events/mutations';
import * as ExpoImagePicker from 'expo-image-picker';
import { MediaTypeOptions } from 'expo-image-picker';
import { FormProvider, useForm } from 'react-hook-form';
import { FormInput } from '@/components/FormFields/FormInput';
import { Event, eventSchema } from '@/api/events/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useUploadEventImageMutation } from '@/api/images';
import { Dimensions, Pressable } from 'react-native';
import { FormTextArea } from '@/components/FormFields';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { Image } from 'expo-image';
import { ScrollView } from '@/components/tamagui/ScrollView';
import { Button } from '@/components/tamagui/Button';
import { FileUp, Trash2 } from '@tamagui/lucide-icons';

const screenWidth = Dimensions.get('screen').width;

export const EventCreation = () => {
  const form = useForm({ resolver: zodResolver(eventSchema) });
  const [imageToUpload, setImageToUpload] = useState<string>();
  const [date, setDate] = useState<Date>(new Date());
  const [isLoading, setIsLoading] = useState(false);

  const cardStyle = useAnimatedStyle(
    () =>
      ({
        flex: withTiming(imageToUpload ? 0.5 : 0.25),
      }) as const
  );

  const buttonStyle = useAnimatedStyle(
    () =>
      ({
        position: 'absolute',
        opacity: withTiming(imageToUpload ? 1 : 0),
        zIndex: 15,
        right: 16,
        top: 16,
      }) as const
  );

  const imageStyle = useAnimatedStyle(
    () =>
      ({
        opacity: withTiming(imageToUpload ? 1 : 0),
        height: imageToUpload ? '100%' : '0%',
        zIndex: 10,
      }) as const
  );

  const imageSelectionStyle = useAnimatedStyle(
    () =>
      ({
        opacity: withTiming(imageToUpload ? 0 : 1, { duration: imageToUpload ? 0 : 200 }),
        zIndex: 5,
        height: imageToUpload ? '0%' : '100%',
      }) as const
  );

  const { mutateAsync: createEvent } = useCreateEventMutation();
  const { mutateAsync: uploadEventImage } = useUploadEventImageMutation();

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

  const handleCreateEvent = useCallback(
    async (data: Event) => {
      setIsLoading(true);

      const event = await createEvent({ ...data, eventTime: date.valueOf().toString() });
      if (imageToUpload && event?.id) {
        const result = await uploadEventImage({ eventId: event.id, image: imageToUpload });
        if (result.error) {
          // do something?
        }
      }
      setIsLoading(false);
      if (event?.id) {
        router.replace(`/eventDetails/${event.id}`);
      }
    },
    [createEvent, date, imageToUpload, uploadEventImage]
  );

  const UploadedImage = useCallback(() => {
    return (
      <Animated.View style={cardStyle}>
        <Animated.View style={buttonStyle}>
          <Button
            onPress={() => setImageToUpload(undefined)}
            width="$4"
            height="$4"
            borderRadius="$8"
          >
            <Trash2 size="$1" color="$background" />
          </Button>
        </Animated.View>
        <Animated.View style={imageSelectionStyle}>
          <Pressable onPress={pickImage} style={{ height: '100%', justifyContent: 'center' }}>
            <View alignSelf="center" justifyContent="center" borderRadius="$8" alignItems="center">
              <YStack padding="$4" alignItems="center">
                <FileUp />
                <SizableText>Bild auswählen oder hochladen</SizableText>
              </YStack>
            </View>
          </Pressable>
        </Animated.View>
        <View backgroundColor="$inputBackground">
          <Animated.View style={imageStyle}>
            <Image source={imageToUpload} style={{ aspectRatio: '4/3', width: screenWidth }} />
          </Animated.View>
        </View>
      </Animated.View>
    );
  }, [buttonStyle, cardStyle, imageSelectionStyle, imageStyle, imageToUpload]);

  return (
    <>
      <UploadedImage />
      <View
        elevationAndroid="$4"
        borderTopLeftRadius="$8"
        borderTopRightRadius="$8"
        flex={1}
        backgroundColor="$background"
        top="$-4"
        overflow="hidden"
      >
        <ScrollView
          contentContainerStyle={{
            padding: '$4',
            paddingTop: 0,
          }}
        >
          <View
            position="relative"
            gap="$4"
            width={Dimensions.get('screen').width}
            right="$4"
            overflow="hidden"
            height="100%"
            borderTopLeftRadius="$8"
            borderTopRightRadius="$8"
          >
            <ScrollView contentContainerStyle={{ padding: '$4', gap: '$4' }}>
              <FormProvider {...form}>
                <FormInput label="Name des Events" name="name" placeholder="Go-Kart fahren" />
                <FormInput label="Ort" name="location" placeholder="Am Eck" />
                <View gap="$1.5">
                  <SizableText>Zeitpunkt</SizableText>
                  <Calendar date={date} onDateSelected={setDate} />
                </View>
                <FormTextArea
                  multiline
                  verticalAlign="top"
                  label="Details"
                  name="description"
                  placeholder="Weitere Details zum Go-Kart fahren"
                />
                <FormInput
                  autoCapitalize="none"
                  autoComplete="url"
                  textContentType="URL"
                  autoCorrect={false}
                  name="link"
                  label="Link zu einer Webseite"
                />
              </FormProvider>
            </ScrollView>
          </View>
        </ScrollView>
        <Button
          marginHorizontal="$4"
          onPress={form.handleSubmit((data) => {
            void handleCreateEvent({ ...data, eventTime: date.valueOf().toString() });
          })}
        >
          Event erstellen
        </Button>
      </View>
    </>
  );
};
