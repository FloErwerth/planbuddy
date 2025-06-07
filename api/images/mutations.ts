import { useMutation, useQueryClient } from 'react-query';
import { supabase } from '@/api/supabase';
import { decode } from 'base64-arraybuffer';
import { useGetUser } from '@/store/user';
import * as FileSystem from 'expo-file-system';

export const useUploadProfilePictureMutation = () => {
  const user = useGetUser();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (file?: string) => {
      if (!user || !file) {
        return Promise.resolve(undefined);
      }

      const base64 = await FileSystem.readAsStringAsync(file, { encoding: 'base64' });

      return await supabase.storage
        .from('profile-images')
        .upload(`${user.id}/profileImage.png`, decode(base64), {
          upsert: true,
          contentType: 'image/png',
        });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries(['profileImage']);
    },
  });
};

type UploadedEventData = { eventId: string; image: string };
export const useUploadEventImageMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ image, eventId }: UploadedEventData) => {
      const base64 = await FileSystem.readAsStringAsync(image, { encoding: 'base64' });

      return await supabase.storage
        .from('event-images')
        .upload(`${eventId}/image.png`, decode(base64), {
          upsert: true,
          contentType: 'image/png',
        });
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries(['profileImage']);
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

      const result = await supabase.storage
        .from('profile-images')
        .remove([`${user.id}/profileImage.png`]);

      if (result.error) {
        throw new Error(result.error.message);
      }
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries(['profileImage']);
    },
  });
};
