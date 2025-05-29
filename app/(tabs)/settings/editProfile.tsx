import { Screen } from '@/components/Screen';
import { AvatarImagePicker } from '@/components/AvatarImagePicker';
import { FormProvider, useForm } from 'react-hook-form';
import { FormInput } from '@/components/FormFields/FormInput';
import { useUpdateUser, useUserQuery } from '@/api/query/user';
import { useEffect, useState } from 'react';
import { getAuth } from '@react-native-firebase/auth';
import { Button } from '@/components/tamagui';
import { View } from 'tamagui';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const updateProfileSchema = z.object({
  firstName: z
    .string()
    .min(1, { message: 'Wir brauchen deinen Vornamen' })
    .max(20, { message: 'Bitte gib einen kürzeren Vornamen an' }),
  lastName: z
    .string()
    .min(1, { message: 'Wir brauchen deinen Nachnamen' })
    .max(20, { message: 'Bitte gib einen kürzeren Vornamen an' }),
  email: z.string().email({ message: 'Bitte gib eine gültige E-Mail Addresse an.' }),
});

type UpdateProfileSchema = z.infer<typeof updateProfileSchema>;

export default function EditProfile() {
  const [isLoading, setIsLoading] = useState(false);
  const { data: user } = useUserQuery();
  const updateUser = useUpdateUser();
  const form = useForm<UpdateProfileSchema>({ resolver: zodResolver(updateProfileSchema) });

  useEffect(() => {
    form.reset(user);
  }, [form, user]);

  const handleSubmit = form.handleSubmit(async (data, event) => {
    setIsLoading(true);
    if (data.email !== user?.email) {
      await getAuth().currentUser?.updateEmail(data.email);
    }
    await updateUser({ ...data });
    setIsLoading(false);
  });

  return (
    <Screen flex={1} showBackButton title="Profil bearbeiten">
      <AvatarImagePicker editable />
      <View flex={1} gap="$5">
        <FormProvider {...form}>
          <FormInput label="Vorname" name="firstName" />
          <FormInput label="Nachname" name="lastName" />
          <FormInput label="E-Mail" name="email" />
        </FormProvider>
      </View>
      <Button onPress={handleSubmit} disabled={!form.formState.isDirty || isLoading}>
        Änderungen abschicken
      </Button>
    </Screen>
  );
}
