import { Sheet as TamaSheet, SheetProps as TamaSheetProps, styled, View } from 'tamagui';

type SheetProps = {
  hideHandle?: boolean;
} & TamaSheetProps;

const Handle = styled(View, {
  borderRadius: '$12',
  alignSelf: 'center',
  marginTop: '$2',
  width: '$6',
  height: '$0.5',
  backgroundColor: '$color.gray9Light',
});

export const Sheet = ({ hideHandle = false, ...props }: SheetProps) => {
  return (
    <TamaSheet
      forceRemoveScrollEnabled
      modal
      snapPoints={props.snapPoints ?? [97]}
      snapPointsMode={props.snapPointsMode ?? 'percent'}
      dismissOnSnapToBottom
      animation="medium"
      {...props}
    >
      <TamaSheet.Overlay animation="lazy" backgroundColor="rgba(0,0,0,0.5)" enterStyle={{ opacity: 0 }} exitStyle={{ opacity: 0 }} />
      <TamaSheet.Frame>
        {!hideHandle && <Handle />}
        {props.children}
      </TamaSheet.Frame>
    </TamaSheet>
  );
};
