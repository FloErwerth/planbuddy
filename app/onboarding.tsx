import { SizableText, View } from 'tamagui';
import { Button } from '@/components/tamagui/Button';
import { Screen } from '@/components/Screen';
import { FormProvider, useForm } from 'react-hook-form';
import { FormInput } from '@/components/FormFields/FormInput';
import { AvatarImagePicker } from '@/components/AvatarImagePicker';
import { useEffect, useState } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useProfileImageQuery, useUploadProfilePictureMutation } from '@/api/images';
import { useGetUser } from '@/store/user';
import { useInsertUserMutation } from '@/api/user';
import { router } from 'expo-router';
import { readInviteId } from '@/utils/invite';
import { useCreateParticipationMutation } from '@/api/events/mutations';

export const onboardingSchema = z.object({
  firstName: z.string({ message: 'Wir brauchen deinen Vornamen zur Anzeige in Events.' }),
  lastName: z.string({ message: 'Wir brauchen deinen Nachnamen zur Anzeige in Events.' }),
});

type OnboardingSchema = z.infer<typeof onboardingSchema>;

export default function Onboarding() {
  const form = useForm<OnboardingSchema>({ resolver: zodResolver(onboardingSchema) });
  const user = useGetUser();
  const { data: imageFromDatabase } = useProfileImageQuery();
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
        wasOnboarded: true,
        email: user.email,
        eventIds: [],
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
      <SizableText size="$6" textAlign="center">
        Herzlich Willkommen bei PlanBuddy!
      </SizableText>
      <SizableText textAlign="center">
        Bevor Du loslegen kannst benötigen wir noch ein paar wenige Informationen von Dir.
      </SizableText>
      <AvatarImagePicker
        editable
        image={file}
        onImageDeleted={() => setFile(undefined)}
        onImageSelected={setFile}
      />
      <FormProvider {...form}>
        <FormInput label="Vorname" name="firstName" />
        <FormInput label="Nachname" name="lastName" />
      </FormProvider>
      <View flex={1} />
      <Button onPress={form.handleSubmit(completeOnboarding)}>Complete</Button>
    </Screen>
  );
}
