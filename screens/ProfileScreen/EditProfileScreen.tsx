import { useEffect, useState } from 'react';
import { useUpdateUserMutation, useUserQuery } from '@/api/user';
import { useDeleteProfilePictureMutation, useProfileImageQuery, useUploadProfilePictureMutation } from '@/api/images';
import { FormProvider, useForm } from 'react-hook-form';
import { onboardingSchema, OnboardingSchema } from '@/api/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { Screen } from '@/components/Screen';
import { AvatarImagePicker } from '@/components/AvatarImagePicker';
import { SizableText, View } from 'tamagui';
import { FormInput } from '@/components/FormFields';
import { Button } from '@/components/tamagui/Button';
import { BackButton } from '@/components/BackButton';
import { Trash } from '@tamagui/lucide-icons';
import { Dialog } from '@/components/tamagui/Dialog';

export const EditProfileScreen = () => {
    const [isLoading, setIsLoading] = useState(false);
    const { data: user } = useUserQuery();
    const { mutate: updateUser } = useUpdateUserMutation();
    const { mutate: updateImage } = useUploadProfilePictureMutation();
    const { mutateAsync: deleteImage } = useDeleteProfilePictureMutation();
    const { data: imageFromDatabase } = useProfileImageQuery();
    const [image, setImage] = useState<string>();
    const [deleteUserModalOpen, setDeleteUserModalOpen] = useState(false);

    const form = useForm<OnboardingSchema>({
        resolver: zodResolver(onboardingSchema),
    });

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

    const handleImageDeletion = async () => {
        await deleteImage();
        setImage(undefined);
    };

    const disabled = !form.formState.isDirty || isLoading;

    return (
        <>
            <Screen
                flex={1}
                back={<BackButton href="/(tabs)/profile" />}
                action={
                    <Button onPress={() => setDeleteUserModalOpen(true)} theme="error" backgroundColor="$backgroundColor" variant="round">
                        <Trash size="$1" scale={0.75} />
                    </Button>
                }
                title="Profil bearbeiten"
            >
                <View flex={1} gap="$4">
                    <AvatarImagePicker editable image={image ?? imageFromDatabase} onImageDeleted={handleImageDeletion} onImageSelected={updateImage} />

                    <FormProvider {...form}>
                        <FormInput label="Email" name="email" editable={false} disabled value={user?.email} />
                        <FormInput label="Vorname" name="firstName" />
                        <FormInput label="Nachname" name="lastName" />
                    </FormProvider>
                </View>

                <Button onPress={handleSubmit} disabled={disabled} animation="bouncy">
                    Änderungen abschicken
                </Button>
            </Screen>
            <Dialog open={deleteUserModalOpen} onOpenChange={setDeleteUserModalOpen}>
                <SizableText size="$6">Account löschen?</SizableText>
                <SizableText>Schade, dass Du deinen Account löschen möchtest.</SizableText>

                <SizableText>
                    Bitte beachte, dass mit der Löschung deines Accounts auch alle von Dir erstellten Events gelöscht, außer Du überträgst diese vorher an
                    jemand anderen.
                </SizableText>
                <View gap="$2">
                    <Button>Account löschen</Button>
                    <Button onPress={() => setDeleteUserModalOpen(false)} variant="secondary">
                        Abbrechen
                    </Button>
                </View>
            </Dialog>
        </>
    );
};
