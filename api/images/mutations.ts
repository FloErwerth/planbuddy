import { useMutation, useQueryClient } from 'react-query';
import { supabase } from '@/api/supabase';
import { decode } from 'base64-arraybuffer';
import * as FileSystem from 'expo-file-system';
import { QUERY_KEYS } from '@/api/queryKeys';
import { useGetUser } from '@/store/authentication';

export const useUploadProfilePictureMutation = () => {
    const user = useGetUser();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (file?: string) => {
            if (!user || !file) {
                return Promise.resolve(undefined);
            }

            const base64 = await FileSystem.readAsStringAsync(file, {
                encoding: 'base64',
            });

            return await supabase.storage.from('profile-images').upload(`${user.id}/profileImage.png`, decode(base64), {
                upsert: true,
                contentType: 'image/png',
            });
        },
        mutationKey: [QUERY_KEYS.IMAGES.PROFILES.MUTATION],
        onSuccess: async () => {
            await queryClient.invalidateQueries([QUERY_KEYS.IMAGES.PROFILES.QUERY]);
        },
    });
};

export const useDeleteProfilePictureMutation = () => {
    const user = useGetUser();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async () => {
            if (!user) {
                return;
            }

            const result = await supabase.storage.from('profile-images').remove([`${user.id}/profileImage.png`]);

            if (result.error) {
                throw new Error(result.error.message);
            }
        },
        mutationKey: [QUERY_KEYS.IMAGES.PROFILES.MUTATION],
        onSuccess: async () => {
            await queryClient.invalidateQueries([QUERY_KEYS.IMAGES.PROFILES.QUERY]);
        },
    });
};

/* --- EVENTS --- */
type UploadedEventData = { eventId: string; image: string };
export const useUploadEventImageMutation = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async ({ image, eventId }: UploadedEventData) => {
            const base64 = await FileSystem.readAsStringAsync(image, {
                encoding: 'base64',
            });

            return await supabase.storage.from('event-images').upload(`${eventId}/image.png`, decode(base64), {
                upsert: true,
                contentType: 'image/png',
            });
        },
        mutationKey: [QUERY_KEYS.IMAGES.EVENTS.MUTATION],
        onSuccess: async () => {
            await queryClient.invalidateQueries([QUERY_KEYS.IMAGES.EVENTS.QUERY]);
        },
    });
};
