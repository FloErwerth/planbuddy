import { SizableText, View } from 'tamagui';
import { Button } from '@/components/tamagui';
import { supabase } from '@/api/supabase';
import { Screen } from '@/components/Screen';
import { FormProvider, useForm } from 'react-hook-form';
import { FormInput } from '@/components/FormFields/FormInput';
import { AvatarImagePicker } from '@/components/AvatarImagePicker';
import { useState } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { router } from 'expo-router';
import { useUploadProfilePictureMutation } from '@/api/images';
import { User } from '@/api/types';
import { useGetUser } from '@/store/user';

export const onboardingSchema = z.object({
  firstName: z.string({ message: 'Wir brauchen deinen Vornamen zur Anzeige in Events.' }),
  lastName: z.string({ message: 'Wir brauchen deinen Nachnamen zur Anzeige in Events.' }),
});

type OnboardingSchema = z.infer<typeof onboardingSchema>;

export default function Onboarding() {
  const form = useForm<OnboardingSchema>({ resolver: zodResolver(onboardingSchema) });
  const user = useGetUser();
  const [file, setFile] = useState<string>();
  const { mutate: uploadImage } = useUploadProfilePictureMutation();

  const completeOnboarding = async ({ firstName, lastName }: OnboardingSchema) => {
    if (!user) {
      return;
    }
    uploadImage(file);
    const result = await supabase
      .from('users')
      .insert<User>({
        id: user.id,
        email: user.email,
        firstName,
        lastName,
        wasOnboarded: true,
        eventIds: [],
      })
      .select();

    if (result.data?.length === 1) {
      router.replace('/(tabs)');
    }
  };

  return (
    <Screen flex={1}>
      <SizableText size="$6" textAlign="center">
        Herzlich Willkommen bei PlanBuddy!
      </SizableText>
      <SizableText textAlign="center">
        Bevor Du loslegen kannst benötigen wir noch ein paar wenige Informationen von Dir.
      </SizableText>
      <AvatarImagePicker editable image={file} onImageSelected={setFile} />
      <FormProvider {...form}>
        <FormInput label="Vorname" name="firstName" />
        <FormInput label="Nachname" name="lastName" />
      </FormProvider>
      <View flex={1} />
      <Button onPress={form.handleSubmit(completeOnboarding)}>Complete</Button>
    </Screen>
  );
}
