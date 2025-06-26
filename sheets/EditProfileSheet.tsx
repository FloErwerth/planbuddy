import { Screen } from '@/components/Screen';
import { AvatarImagePicker } from '@/components/AvatarImagePicker';
import { FormProvider, useForm } from 'react-hook-form';
import { FormInput } from '@/components/FormFields/FormInput';
import { useCallback, useEffect, useState } from 'react';
import { Button } from '@/components/tamagui/Button';
import { SheetProps, View } from 'tamagui';
import { zodResolver } from '@hookform/resolvers/zod';
import { useUpdateUserMutation, useUserQuery } from '@/api/user';
import {
  useDeleteProfilePictureMutation,
  useProfileImageQuery,
  useUploadProfilePictureMutation,
} from '@/api/images';
import { Input } from '@/components/tamagui/Input';
import { FormFieldPhoneInput } from '@/components/FormFields/FormFieldPhoneInput';
import { OnboardingSchema, onboardingSchema } from '@/api/types';
import { Sheet } from '@/components/tamagui/Sheet';

export const EditProfileSheet = ({ open, onOpenChange }: SheetProps) => {
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

  const form = useForm<OnboardingSchema>({ resolver: zodResolver(onboardingSchema) });

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
    <Sheet
      snapPointsMode="percent"
      open={open}
      onOpenChange={onOpenChange}
      unmountChildrenWhenHidden
    >
      <Screen flex={1} title="Profil bearbeiten">
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
            <FormFieldPhoneInput label="Telefonnummer" name="phone" />
          </FormProvider>
        </View>
        <Button onPress={handleSubmit} disabled={!form.formState.isDirty || isLoading}>
          Änderungen abschicken
        </Button>
      </Screen>
    </Sheet>
  );
};
