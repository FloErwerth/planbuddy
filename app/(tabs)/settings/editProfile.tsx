import { Screen } from '@/components/Screen';
import { AvatarImagePicker } from '@/components/AvatarImagePicker';
import { FormProvider, useForm } from 'react-hook-form';
import { FormInput } from '@/components/FormFields/FormInput';
import { useEffect, useState } from 'react';
import { Button, Input } from '@/components/tamagui';
import { View } from 'tamagui';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useUpdateUserMutation, useUserQuery } from '@/api/user';
import { useUploadProfilePictureMutation } from '@/api/images';

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
  const [image, setImage] = useState<string>();

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

  return (
    <>
      <Screen flex={1} showBackButton title="Profil bearbeiten">
        <AvatarImagePicker editable image={image} onImageSelected={updateImage} />
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
