import { useCallback, useEffect, useState } from 'react';
import { useAtom } from 'jotai/index';
import { imagePickerAtom } from '@/components/ImagePicker/imagePickerAtom';
import { useUpdateProfilePicture } from '@/hooks/useUpdateProfilePicture';
import * as ExpoImagePicker from 'expo-image-picker';
import { Avatar, Spinner, View } from 'tamagui';
import Animated, { BounceIn, FadeIn, ZoomOut } from 'react-native-reanimated';
import { Check, Edit3 } from '@tamagui/lucide-icons';
import { color } from '@tamagui/themes';
import { Button } from '@/components/tamagui';
import { Image } from 'expo-image';
import { getAuth } from '@react-native-firebase/auth';

type AvatarImagePickerProps = { editable?: boolean };
export const AvatarImagePicker = ({ editable = false }: AvatarImagePickerProps) => {
  const profileImage = getAuth().currentUser?.photoURL ?? '';
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isInitialRender, setIsInitialRender] = useState(true);

  useEffect(() => {
    setIsInitialRender(false);
  }, []);

  const [image, setImage] = useAtom(imagePickerAtom);
  const updateUserImage = useUpdateProfilePicture();

  const pickImage = useCallback(async () => {
    const result = await ExpoImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.1,
    });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
      setIsLoading(true);
      const string = await updateUserImage(result.assets[0].uri);
      setIsLoading(false);
      setShowSuccess(!!string);
      setTimeout(() => {
        setShowSuccess(false);
      }, 1000);
    }
  }, [setImage, updateUserImage]);

  const RenderedButtonIcon = useCallback(() => {
    if (showSuccess) {
      return null;
    }
    if (isLoading) {
      return <Spinner size="large" position="absolute" />;
    }
    return (
      <View position="absolute">
        <Animated.View entering={FadeIn.duration(isInitialRender ? 0 : 200).delay(100)}>
          <Edit3 zIndex={999} onPress={pickImage} scale={0.75} color="$background" />
        </Animated.View>
      </View>
    );
  }, [isInitialRender, isLoading, pickImage, showSuccess]);

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
          onPress={pickImage}
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
      <View
        alignSelf="center"
        width="$10"
        height="$10"
        backgroundColor="white"
        borderRadius={100}
        elevationAndroid="$4"
      >
        <Avatar size="$10" circular>
          <Avatar.Image src={isLoading ? image : profileImage} />
          <Image source={{ uri: image }} style={{ width: 104, height: 104 }} />
        </Avatar>
      </View>
    </View>
  );
};
