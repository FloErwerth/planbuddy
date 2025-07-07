import { ComponentProps } from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { Screen } from '@/components/Screen/Screen';

export const GradientScreen = ({ children, ...props }: ComponentProps<typeof Screen>) => {
  return (
    <LinearGradient style={{ flex: 1 }} start={[0, 0]} end={[1, 1]} locations={[0, 0.5, 1]} colors={['#DD7568', '#786284', '#354173']}>
      {children}
    </LinearGradient>
  );
};
