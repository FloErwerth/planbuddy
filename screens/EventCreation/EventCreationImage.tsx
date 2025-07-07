import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { Image } from 'expo-image';
import { Pressable } from 'react-native';
import { SizableText, View, YStack } from 'tamagui';
import { FileUp, Trash2 } from '@tamagui/lucide-icons';
import * as ExpoImagePicker from 'expo-image-picker';
import { MediaTypeOptions } from 'expo-image-picker';
import { Button } from '@/components/tamagui/Button';

type EventCreationImageProps = {
  image?: string;
  setImage: (image?: string) => void;
};
export const EventCreationImage = ({ image, setImage }: EventCreationImageProps) => {
  const imageStyle = useAnimatedStyle(
    () =>
      ({
        height: withTiming(image ? 200 : 100),
        justifyContent: 'center',
      }) as const
  );

  const pickImage = async () => {
    const result = await ExpoImagePicker.launchImageLibraryAsync({
      mediaTypes: MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.25,
    });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const buttonStyle = useAnimatedStyle(
    () =>
      ({
        position: 'absolute',
        opacity: withTiming(image ? 1 : 0),
        zIndex: 15,
        right: 8,
        top: 8,
      }) as const
  );

  return (
    <>
      <Animated.View style={buttonStyle}>
        <Button onPress={() => setImage(undefined)} width="$3" height="$3" padding={0} borderRadius="$12">
          <Trash2 size="$1" color="$background" />
        </Button>
      </Animated.View>
      <Animated.View style={imageStyle}>
        {image ? (
          <Image source={image} style={{ width: 'auto', height: 200 }} />
        ) : (
          <Pressable onPress={pickImage}>
            <View alignSelf="center" justifyContent="center" borderRadius="$8" alignItems="center">
              <YStack padding="$4" alignItems="center">
                <FileUp />
                <SizableText>Bild auswählen</SizableText>
              </YStack>
            </View>
          </Pressable>
        )}
      </Animated.View>
    </>
  );
};
