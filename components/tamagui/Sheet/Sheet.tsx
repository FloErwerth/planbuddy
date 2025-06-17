import { Sheet as TamaSheet, SheetProps } from 'tamagui';

export const Sheet = (props: SheetProps) => {
  return (
    <TamaSheet
      forceRemoveScrollEnabled
      modal
      snapPoints={props.snapPoints}
      snapPointsMode={props.snapPointsMode ?? 'fit'}
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

      <TamaSheet.Handle />
      <TamaSheet.Frame>{props.children}</TamaSheet.Frame>
    </TamaSheet>
  );
};
