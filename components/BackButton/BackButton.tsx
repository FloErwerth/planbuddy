import { Link } from 'expo-router';
import { ChevronLeft } from '@tamagui/lucide-icons';
import { ButtonProps } from 'tamagui';
import { ComponentProps } from 'react';
import { Button } from '@/components/tamagui/Button';

type BackButtonProps = Partial<Pick<ComponentProps<typeof Link>, 'href'>> & ButtonProps;
export const BackButton = ({ href = '..', ...viewProps }: BackButtonProps) => {
  return (
    <Button variant="round" padding={0} width="$2" height="$2" {...viewProps}>
      <Link href={href}>
        <ChevronLeft left={-0.5} scale={0.8} color="$background" />
      </Link>
    </Button>
  );
};
