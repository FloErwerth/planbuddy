import { ButtonProps } from 'tamagui';
import { Plus } from '@tamagui/lucide-icons';
import { Button } from '@/components/tamagui/Button';

export const PlusButton = (props: ButtonProps) => {
  return (
    <Button variant="round" width="$2" height="$2" {...props}>
      <Plus color="$background" scale={0.85} />
    </Button>
  );
};
