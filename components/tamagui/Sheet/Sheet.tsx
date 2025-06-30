import { Sheet as TamaSheet, SheetProps as TamaSheetProps } from 'tamagui';

type SheetProps = {
  hideHandle?: boolean;
} & TamaSheetProps;

export const Sheet = ({ hideHandle = false, ...props }: SheetProps) => {
  return (
    <TamaSheet
      forceRemoveScrollEnabled
      modal
      snapPoints={props.snapPoints ?? [97]}
      snapPointsMode={props.snapPointsMode ?? 'percent'}
      dismissOnSnapToBottom
      zIndex={100_000}
      animation="medium"
      {...props}
    >
      <TamaSheet.Overlay
        animation="lazy"
        backgroundColor="rgba(0,0,0,0.5)"
        enterStyle={{ opacity: 0 }}
        exitStyle={{ opacity: 0 }}
      />

      {!hideHandle && <TamaSheet.Handle />}
      <TamaSheet.Frame>{props.children}</TamaSheet.Frame>
    </TamaSheet>
  );
};
