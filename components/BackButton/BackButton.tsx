import { router } from 'expo-router';
import { ChevronLeft } from '@tamagui/lucide-icons';
import { Button } from '@/components/tamagui';
import { styled } from 'tamagui';

const StyledButton = styled(Button, {
  zIndex: 1,
  width: '$2',
  height: '$2',
  padding: 0,
  borderRadius: '$12',
});

export const BackButton = () => {
  return (
    <StyledButton onPress={router.back}>
      <ChevronLeft left={-0.5} scale={0.8} color="$background" />
    </StyledButton>
  );
};
