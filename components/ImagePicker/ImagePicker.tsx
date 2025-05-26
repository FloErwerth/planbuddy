import * as ExpoImagePicker from 'expo-image-picker';
import { Button } from '@/components/tamagui';
import { Image } from 'expo-image';
import { useAtom } from 'jotai';
import { imagePickerAtom } from '@/components/ImagePicker/imagePickerAtom';

export const ImagePicker = () => {
  const [image, setImage] = useAtom(imagePickerAtom);
  const pickImage = async () => {
    const result = await ExpoImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.1,
    });
    if (!result.canceled) {
      setImage({ uri: result.assets[0].uri, base64: result.assets[0].base64 ?? '' });
    }
  };
  return (
    <>
      <Button onPress={pickImage}>Image</Button>
      <Image source={{ uri: image?.uri ?? '' }} style={{ width: 100, height: 100 }} />
    </>
  );
};
