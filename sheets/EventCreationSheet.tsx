import { SheetProps } from 'tamagui';
import { Sheet } from '@/components/tamagui/Sheet';
import { EventCreation } from '@/screens/EventCreation';

export const EventCreationSheet = ({ open, onOpenChange, ...props }: SheetProps) => {
  const handleEventCreated = () => {
    onOpenChange?.(false);
  };

  return (
    <Sheet
      snapPoints={[97]}
      hideHandle
      snapPointsMode="percent"
      open={open}
      onOpenChange={onOpenChange}
      unmountChildrenWhenHidden
      {...props}
    >
      <EventCreation onEventCreated={handleEventCreated} />
    </Sheet>
  );
};
