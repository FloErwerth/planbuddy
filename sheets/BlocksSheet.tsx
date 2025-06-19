import { SheetProps } from 'tamagui';
import { ReactNode } from 'react';
import { Sheet } from '@/components/tamagui/Sheet';
import { Screen } from '@/components/Screen';

type BlocksSheetProps = { onBlocksSelected: (blocks?: ReactNode[]) => void } & SheetProps;

export const BlocksSheet = ({ onBlocksSelected, ...props }: BlocksSheetProps) => {
  return (
    <Sheet {...props}>
      <Screen title="Eventblöcke"></Screen>
    </Sheet>
  );
};
