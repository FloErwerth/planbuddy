import { Input } from '@/components/tamagui/Input';
import { debounce, InputProps } from 'tamagui';

export const SearchInput = ({ onChangeText, ...props }: Omit<InputProps, 'onChangeText'> & { onChangeText: (text: string) => void }) => {
  return <Input {...props} onChangeText={debounce(onChangeText, 300)} />;
};
