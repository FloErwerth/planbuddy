import { useCallback, useState } from 'react';
import * as ExpoImagePicker from 'expo-image-picker';
import { MediaTypeOptions } from 'expo-image-picker';
import { Avatar, Spinner, View } from 'tamagui';
import Animated, { BounceIn, FadeIn, ZoomOut } from 'react-native-reanimated';
import { Check, Edit3, Trash2 } from '@tamagui/lucide-icons';
import { color } from '@tamagui/themes';
import { Button } from '@/components/tamagui/Button';

type AvatarImagePickerProps = {
  editable?: boolean;
  image: string | undefined;
  onImageSelected?: (imageUri: string) => void;
  onImageDeleted?: () => void;
};

export const AvatarImagePicker = ({ editable = false, image, onImageSelected, onImageDeleted }: AvatarImagePickerProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const pickImage = useCallback(async () => {
    const result = await ExpoImagePicker.launchImageLibraryAsync({
      mediaTypes: MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.25,
    });
    if (!result.canceled) {
      onImageSelected?.(result.assets[0].uri);
    }
  }, [onImageSelected]);

  const RenderedButtonIcon = useCallback(() => {
    if (showSuccess) {
      return null;
    }
    if (isLoading) {
      return <Spinner size="large" position="absolute" />;
    }
    return (
      <View position="absolute">
        <Animated.View entering={FadeIn.duration(200).delay(100)}>
          {image ? (
            <Trash2 zIndex={999} onPress={onImageDeleted} scale={0.75} color="$background" />
          ) : (
            <Edit3 zIndex={999} onPress={pickImage} scale={0.75} color="$background" />
          )}
        </Animated.View>
      </View>
    );
  }, [image, isLoading, onImageDeleted, pickImage, showSuccess]);

  const SuccessAnimation = useCallback(() => {
    if (!showSuccess) {
      return null;
    }
    return (
      <View top="$1" position="absolute">
        <Animated.View entering={BounceIn} exiting={ZoomOut}>
          <Check color={color.green8Light} scale={0.8} />
        </Animated.View>
      </View>
    );
  }, [showSuccess]);

  return (
    <View>
      {editable && (
        <Button
          onPress={image ? onImageDeleted : pickImage}
          borderRadius="$12"
          width="$2"
          disabled={isLoading || showSuccess}
          height="$2"
          padding="$2"
          position="absolute"
          top={0}
          left="55%"
          zIndex={1000}
        >
          <RenderedButtonIcon />
          <SuccessAnimation />
        </Button>
      )}
      <View alignSelf="center" width="$10" height="$10" backgroundColor="white" borderRadius={100} elevationAndroid="$4">
        <Avatar size="$10" circular>
          <Avatar.Image source={{ uri: image }} />
        </Avatar>
      </View>
    </View>
  );
};
