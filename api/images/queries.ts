import { useQuery } from 'react-query';
import { supabase } from '@/api/supabase';
import { useGetUser } from '@/store/user';

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
    queryKey: ['profileImage'],
  });
};

export const useEventImageQuery = (eventId: string) => {
  const user = useGetUser();

  return useQuery({
    queryFn: async () => {
      if (!user) {
        return;
      }

      const download = await supabase.storage.from('event-images').download(`${eventId}/image.png`);

      if (download.error) {
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
    queryKey: ['eventImage', eventId],
  });
};
