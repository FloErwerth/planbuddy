import { SizableText, View } from 'tamagui';
import { Button } from '@/components/tamagui/Button';
import { Screen } from '@/components/Screen';
import { FormProvider, useForm } from 'react-hook-form';
import { FormInput } from '@/components/FormFields/FormInput';
import { AvatarImagePicker } from '@/components/AvatarImagePicker';
import { useEffect, useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useProfileImageQuery, useUploadProfilePictureMutation } from '@/api/images';
import { useGetUser } from '@/store/user';
import { useInsertUserMutation } from '@/api/user';
import { router } from 'expo-router';
import { readInviteId } from '@/utils/invite';
import { useCreateParticipationMutation } from '@/api/events/mutations';
import { OnboardingSchema, onboardingSchema } from '@/api/types';

export default function Onboarding() {
  const form = useForm<OnboardingSchema>({ resolver: zodResolver(onboardingSchema) });
  const user = useGetUser();
  const { data: imageFromDatabase } = useProfileImageQuery(user?.id);
  const { mutateAsync: insertUser } = useInsertUserMutation();
  const { mutateAsync: joinEvent } = useCreateParticipationMutation();

  const [file, setFile] = useState<string>();
  const { mutateAsync: uploadImage } = useUploadProfilePictureMutation();

  useEffect(() => {
    setFile(imageFromDatabase);
  }, [imageFromDatabase]);

  const navigateAwayFromOnboarding = async () => {
    const invitationId = await readInviteId();
    if (invitationId) {
      await joinEvent({ eventId: invitationId, userId: user?.id });
    }
    router.replace('/(tabs)');
  };

  const completeOnboarding = async ({ firstName, lastName }: OnboardingSchema) => {
    if (!user || !user.email) {
      return;
    }

    try {
      const res = await insertUser({
        firstName,
        lastName,
        email: user.email,
      });

      if (file !== imageFromDatabase) {
        await uploadImage(file);
      }
      if (res) {
        await navigateAwayFromOnboarding();
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <Screen flex={1}>
      <SizableText size="$8" textAlign="center">
        Herzlich Willkommen bei PlanBuddy!
      </SizableText>
      <SizableText>Wenn Du willst such Dir ein schickes Profilbild aus und lade es hoch</SizableText>
      <AvatarImagePicker editable image={file} onImageDeleted={() => setFile(undefined)} onImageSelected={setFile} />
      <SizableText>Damit deine Freunde dich ohne Probleme finden können gib uns bitte folgende Informationen. Diese Angaben sind alle optional.</SizableText>
      <FormProvider {...form}>
        <FormInput autoComplete="given-name" textContentType="givenName" label="Vorname" name="firstName" />
        <FormInput autoComplete="family-name" textContentType="familyName" label="Nachname" name="lastName" />
      </FormProvider>
      <View flex={1} />
      <Button onPress={form.handleSubmit(completeOnboarding)}>Abschließen</Button>
    </Screen>
  );
}
