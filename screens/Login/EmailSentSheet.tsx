import { Portal, Sheet, SizableText } from 'tamagui';
import { Screen } from '@/components/Screen';

type VerificationProps = {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
};

export const EmailSentSheet = ({ isOpen, onOpenChange }: VerificationProps) => {
  const closeSheet = () => onOpenChange(false);

  return (
    <Portal host="sheets">
      <Sheet
        open={isOpen}
        onOpenChange={onOpenChange}
        snapPointsMode="fit"
        dismissOnSnapToBottom
        dismissOnOverlayPress
        unmountChildrenWhenHidden
        zIndex={100_000}
      >
        <Sheet.Overlay backgroundColor="rgba(100,100,100,0.5)" />

        <Sheet.Handle />
        <Sheet.Frame height="auto" gap="$5">
          <Screen title="Postfach überprüfen">
            <SizableText fontWeight="bold">
              Eine E-Mail zur Verifizierung deiner E-Mail wurde verschickt.
            </SizableText>
            <SizableText>
              Bitte überprüfe nun dein Postfach und bestätige deine E-Mail-Addresse, um den
              Registrierungsvorgang abzuschließen.
            </SizableText>
            <SizableText>
              Falls Du keine E-Mail finden kannst, dann sieh bitte im Spam-Ordner nach. Falls Du die
              E-Mail auch nach einer Minute nicht finden kannst, dann versuche es bitte erneut.
            </SizableText>
          </Screen>
        </Sheet.Frame>
      </Sheet>
    </Portal>
  );
};
