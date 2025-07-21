import { useMutation, useQueryClient } from 'react-query';
import { supabase } from '@/api/supabase';
import { decode } from 'base64-arraybuffer';
import * as FileSystem from 'expo-file-system';
import { useGetUser } from '@/store/authentication';
import { Image } from 'react-native-compressor';
import { useProfileImageQuery } from '@/api/images/queries';
import {
    DELETE_EVENT_IMAGE_MUTATION_KEY,
    DELETE_PROFILE_IMAGE_MUTATION_KEY,
    EVENT_IMAGE_QUERY_KEY,
    PROFILE_PICTURE_QUERY_KEY,
    REMOVE_EVENT_IMAGE_MUTATION_KEY,
    UPLOAD_EVENT_IMAGE_MUTATION_KEY,
    UPLOAD_PROFILE_IMAGE_MUTATION_KEY,
} from '@/api/images/constants';

export const useUploadProfilePictureMutation = () => {
    const user = useGetUser();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (file?: string) => {
            if (!user) {
                throw new Error('Error in upload profile picture: user not defined, probably not logged in');
            }

            if (!file) {
                return Promise.resolve(undefined);
            }

            const compressedImage = await Image.compress(file, {
                compressionMethod: 'manual',
                maxWidth: 240,
                maxHeight: 240,
                quality: 1,
            });

            const base64 = await FileSystem.readAsStringAsync(compressedImage, {
                encoding: 'base64',
            });

            return await supabase.storage.from('profile-images').update(`${user.id}/profileImage.png?bust=${Date.now()}`, decode(base64), {
                upsert: true,
                contentType: 'image/png',
            });
        },
        mutationKey: [UPLOAD_PROFILE_IMAGE_MUTATION_KEY],
        onSuccess: async () => {
            await queryClient.refetchQueries([PROFILE_PICTURE_QUERY_KEY]);
        },
    });
};

export const useDeleteProfilePictureMutation = () => {
    const user = useGetUser();
    const queryClient = useQueryClient();
    const image = useProfileImageQuery(user?.id);

    return useMutation({
        mutationFn: async () => {
            if (!image) {
                return;
            }

            const result = await supabase.storage.from('profile-images').update(`${user?.id}/profileImage.png?bust=${Date.now()}`, '');
            if (result.error) {
                throw new Error(result.error.message);
            }
        },
        mutationKey: [DELETE_PROFILE_IMAGE_MUTATION_KEY],
        onSuccess: async () => {
            await queryClient.invalidateQueries([PROFILE_PICTURE_QUERY_KEY]);
        },
    });
};

/* --- EVENTS --- */
type UploadedEventData = { eventId: string; image: string };
type DeletedEventImageData = { eventId: string };
export const useUploadEventImageMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ image, eventId }: UploadedEventData) => {
            if (!image) {
                throw new Error('Error in uploading image: image was empty or undefined');
            }
            if (!eventId) {
                throw new Error('Error in uploading image: event id was empty or undefined');
            }

            const compressedImage = await Image.compress(image, {
                compressionMethod: 'manual',
                maxWidth: 240,
                maxHeight: 240,
                quality: 1,
            });

            const base64 = await FileSystem.readAsStringAsync(compressedImage, {
                encoding: 'base64',
            });

            return await supabase.storage.from('event-images').upload(`${eventId}/image.png?bust=${Date.now()}`, decode(base64), {
                upsert: true,
                contentType: 'image/png',
            });
        },
        mutationKey: [UPLOAD_EVENT_IMAGE_MUTATION_KEY],
        onSuccess: async () => {
            await queryClient.invalidateQueries([EVENT_IMAGE_QUERY_KEY]);
        },
    });
};

export const useRemoveEventImageMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ eventId }: DeletedEventImageData) => {
            if (!eventId) {
                throw new Error(`Error in remove event image: event id was undefined or empty`);
            }
            return await supabase.storage.from('event-images').upload(`${eventId}/image.png?bust=${Date.now()}`, '', {
                upsert: true,
                contentType: 'image/png',
            });
        },
        mutationKey: [REMOVE_EVENT_IMAGE_MUTATION_KEY],
        onSuccess: async () => {
            await queryClient.invalidateQueries([EVENT_IMAGE_QUERY_KEY]);
        },
    });
};

export const useDeleteEventImageMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (eventId?: string) => {
            if (!eventId) {
                throw new Error('Error in delete event image mutation: The event id must be provided');
            }
            return await supabase.storage.from('event-images').remove([`${eventId}/image.png`]);
        },
        mutationKey: [DELETE_EVENT_IMAGE_MUTATION_KEY],
        onSuccess: async () => {
            await queryClient.invalidateQueries([EVENT_IMAGE_QUERY_KEY]);
        },
    });
};
