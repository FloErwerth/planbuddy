import { Dialog as TamaguiDialog, DialogProps as TamaguiDialogProps } from "tamagui";
import { ComponentProps, ReactElement } from "react";

type DialogProps = TamaguiDialogProps & {
	title?: ReactElement;
	fullscreen?: boolean;
	zIndex?: number;
};

const overlayAnimationStyles = { opacity: 0 };
const contentStyles = {
	enterStyle: { opacity: 0, scale: 0.95, rotate: "5deg" },
	exitStyle: { opacity: 0, scale: 0.95, rotate: "5deg" },
} as const;
const contentAnimation: ComponentProps<typeof TamaguiDialog.Content>["animation"] = [
	"quicker",
	{
		opacity: {
			overshootClamping: true,
		},
	},
];

export const Dialog = ({ title, fullscreen, children, ...props }: DialogProps) => {
	return (
		<TamaguiDialog modal={props.modal || true} {...props}>
			<TamaguiDialog.Portal zIndex={props.zIndex}>
				{!fullscreen && (
					<TamaguiDialog.Overlay
						key="overlay"
						backgroundColor="rgba(0,0,0,0.5)"
						animateOnly={["transform", "opacity"]}
						animation={contentAnimation}
						forceMount
						enterStyle={overlayAnimationStyles}
						exitStyle={overlayAnimationStyles}
						onPress={() => props.onOpenChange?.(false)}
					/>
				)}

				<TamaguiDialog.Content
					fullscreen={fullscreen}
					elevate
					borderRadius="$6"
					width="90%"
					key="content"
					animateOnly={["transform", "opacity"]}
					animation={contentAnimation}
					enterStyle={contentStyles.enterStyle}
					exitStyle={contentStyles.exitStyle}
					gap="$4"
				>
					{title}
					{children}
				</TamaguiDialog.Content>
			</TamaguiDialog.Portal>
		</TamaguiDialog>
	);
};
