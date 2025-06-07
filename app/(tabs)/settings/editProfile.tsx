import { Screen } from '@/components/Screen';
import { AvatarImagePicker } from '@/components/AvatarImagePicker';
import { FormProvider, useForm } from 'react-hook-form';
import { FormInput } from '@/components/FormFields/FormInput';
import { useCallback, useEffect, useState } from 'react';
import { Button } from '@/components/tamagui/Button';
import { View } from 'tamagui';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useUpdateUserMutation, useUserQuery } from '@/api/user';
import {
  useDeleteProfilePictureMutation,
  useProfileImageQuery,
  useUploadProfilePictureMutation,
} from '@/api/images';
import { Input } from '@/components/tamagui/Input';

const updateProfileSchema = z.object({
  firstName: z
    .string()
    .min(1, { message: 'Wir brauchen deinen Vornamen' })
    .max(20, { message: 'Bitte gib einen kürzeren Vornamen an' }),
  lastName: z
    .string()
    .min(1, { message: 'Wir brauchen deinen Nachnamen' })
    .max(20, { message: 'Bitte gib einen kürzeren Vornamen an' }),
});

type UpdateProfileSchema = z.infer<typeof updateProfileSchema>;

export default function EditProfile() {
  const [isLoading, setIsLoading] = useState(false);
  const { data: user } = useUserQuery();
  const { mutate: updateUser } = useUpdateUserMutation();
  const { mutate: updateImage } = useUploadProfilePictureMutation();
  const { mutateAsync: deleteImage } = useDeleteProfilePictureMutation();
  const { data: imageFromDatabase } = useProfileImageQuery();
  const [image, setImage] = useState<string>();

  useEffect(() => {
    setImage(imageFromDatabase);
  }, [imageFromDatabase]);

  const form = useForm<UpdateProfileSchema>({ resolver: zodResolver(updateProfileSchema) });

  useEffect(() => {
    if (user) {
      form.reset(user);
    }
  }, [form, user]);

  const handleSubmit = form.handleSubmit(async (data) => {
    setIsLoading(true);

    updateUser({ updatedUser: data, onSuccess: () => setIsLoading(false) });
    setIsLoading(false);
  });

  const handleImageDeletion = useCallback(async () => {
    await deleteImage();
    setImage(undefined);
  }, [deleteImage]);

  return (
    <>
      <Screen flex={1} showBackButton title="Profil bearbeiten">
        <AvatarImagePicker
          editable
          image={image}
          onImageDeleted={handleImageDeletion}
          onImageSelected={updateImage}
        />
        <Input editable={false} disabled value={user?.email} />
        <View flex={1} gap="$5">
          <FormProvider {...form}>
            <FormInput label="Vorname" name="firstName" />
            <FormInput label="Nachname" name="lastName" />
          </FormProvider>
        </View>
        <Button onPress={handleSubmit} disabled={!form.formState.isDirty || isLoading}>
          Änderungen abschicken
        </Button>
      </Screen>
    </>
  );
}
