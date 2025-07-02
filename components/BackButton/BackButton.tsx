import { Link } from 'expo-router';
import { ChevronLeft } from '@tamagui/lucide-icons';
import { styled, View, ViewProps } from 'tamagui';
import { ComponentProps } from 'react';

const Wrapper = styled(View, {
  zIndex: 1,
  width: '$2',
  height: '$2',
  backgroundColor: '$primary',
  padding: 0,
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '$12',
});

type BackButtonProps = Partial<Pick<ComponentProps<typeof Link>, 'href'>> & ViewProps;
export const BackButton = ({ href = '..', ...viewProps }: BackButtonProps) => {
  return (
    <Wrapper {...viewProps}>
      <Link href={href}>
        <ChevronLeft left={-0.5} scale={0.8} color="$background" />
      </Link>
    </Wrapper>
  );
};
