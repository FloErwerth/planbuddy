import { styled } from 'tamagui';
import { Button } from '@/components/tamagui';
import { Share } from '@tamagui/lucide-icons';

type ShareButtonProps = {
  id: string;
};
const StyledButton = styled(Button, {
  zIndex: 1,
  width: '$2',
  height: '$2',
  padding: 0,
  borderRadius: '$12',
});

export const ShareButton = ({ id }: ShareButtonProps) => {
  return (
    <StyledButton>
      <Share scale={0.75} scaleY={0.9} top={-1} color="$background" />
    </StyledButton>
  );
};
