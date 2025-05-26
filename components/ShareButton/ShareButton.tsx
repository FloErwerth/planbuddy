import { styled } from 'tamagui';
import { Button } from '@/components/tamagui';
import { Share } from '@tamagui/lucide-icons';

type ShareButtonProps = {
  id: string;
};
const StyledButton = styled(Button, {
  zIndex: 1,
  position: 'absolute',
  top: '$4',
  right: '$4',
  width: '$3',
  height: '$3',
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
