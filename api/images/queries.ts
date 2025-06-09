import { useQuery } from 'react-query';
import { supabase } from '@/api/supabase';
import { useGetUser } from '@/store/user';
import { QUERY_KEYS } from '@/api/queryKeys';

export const useProfileImageQuery = () => {
  const user = useGetUser();

  return useQuery({
    queryFn: async (): Promise<string | undefined> => {
      if (!user) {
        return;
      }

      const download = await supabase.storage
        .from('profile-images')
        .download(`${user.id}/profileImage.png`);

      if (download.error) {
        throw new Error(download.error.message);
      }

      if (download.data.size < 100) {
        return undefined;
      }

      return new Promise((resolve, _) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(download.data);
      });
    },
    queryKey: [QUERY_KEYS.IMAGES.PROFILES.QUERY],
  });
};

export const useEventImageQuery = (eventId?: string) => {
  return useQuery({
    queryFn: async () => {
      if (!eventId) {
        return undefined;
      }

      const download = await supabase.storage.from('event-images').download(`${eventId}/image.png`);

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
    queryKey: [QUERY_KEYS.IMAGES.EVENTS.QUERY, eventId],
  });
};
