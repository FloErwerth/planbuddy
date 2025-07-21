import { useQuery } from 'react-query';
import { supabase } from '@/api/supabase';
import { EVENT_IMAGE_QUERY_KEY, PROFILE_PICTURE_QUERY_KEY } from '@/api/images/constants';

export const useEventImageQuery = (eventId?: string) => {
    return useQuery({
        queryFn: async (): Promise<string | undefined> => {
            if (!eventId) {
                return undefined;
            }

            const download = await supabase.storage.from('event-images').download(`${eventId}/image.png?bust=${Date.now()}`);

            if (download.error) {
                if (download.error.name === 'StorageUnknownError') {
                    // this is likely because of no image uploaded for the event
                    return undefined;
                }
                throw new Error(download.error.message);
            }

            if (download.data.size < 100) {
                return;
            }

            return new Promise((resolve, _) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result as string);
                reader.readAsDataURL(download.data);
            });
        },
        queryKey: [EVENT_IMAGE_QUERY_KEY, eventId],
    });
};

export const useProfileImageQuery = (userId?: string) => {
    return useQuery({
        queryFn: async (): Promise<string | undefined> => {
            if (!userId) {
                return undefined;
            }

            // get image
            const download = await supabase.storage.from('profile-images').download(`${userId}/profileImage.png?bust=${Date.now()}`);

            if (download.error) {
                if (download.error.name === 'StorageUnknownError') {
                    // this is likely because of no image uploaded for the event
                    return undefined;
                }
                throw new Error(download.error.message);
            }

            if (download.data.size === 0) {
                return undefined;
            }

            return new Promise((resolve, _) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result as string);
                reader.readAsDataURL(download.data);
            });
        },
        queryKey: [PROFILE_PICTURE_QUERY_KEY, userId],
    });
};
