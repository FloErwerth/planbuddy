import { Check, Edit3, Trash2, User2 } from "@tamagui/lucide-icons";
import { color } from "@tamagui/themes";
import * as ExpoImagePicker from "expo-image-picker";
import { useState } from "react";
import Animated, { BounceIn, FadeIn, ZoomOut } from "react-native-reanimated";
import { Avatar, Spinner, View } from "tamagui";
import { Button } from "@/components/tamagui/Button";

type AvatarImagePickerProps = {
	editable?: boolean;
	onImageSelected?: (imageUri: string) => void;
	onImageDeleted?: () => void;
	image?: string;
};

export const AvatarImagePicker = ({ image, editable = false, onImageSelected, onImageDeleted }: AvatarImagePickerProps) => {
	const [isLoading, setIsLoading] = useState(false);
	const [showSuccess, setShowSuccess] = useState(false);

	const pickImage = async () => {
		try {
			setIsLoading(true);
			const result = await ExpoImagePicker.launchImageLibraryAsync({
				mediaTypes: ["images"],
				allowsEditing: true,
				aspect: [1, 1],
				quality: 1,
				selectionLimit: 1,
			});
			setShowSuccess(true);
			if (!result || !result.assets || result.assets?.length === 0) {
				return;
			}

			if (!result.canceled) {
				onImageSelected?.(result.assets[0].uri);
			}
		} finally {
			setIsLoading(false);
		}
	};

	const RenderedButtonIcon = () => {
		if (showSuccess) {
			return null;
		}
		if (isLoading) {
			return <Spinner size="large" position="absolute" />;
		}
		return (
			<View position="absolute">
				<Animated.View entering={FadeIn.duration(200).delay(100)}>
					{image !== undefined ? (
						<Trash2 zIndex={999} onPress={onImageDeleted} scale={0.75} color="$background" />
					) : (
						<Edit3 zIndex={999} onPress={pickImage} scale={0.75} color="$background" />
					)}
				</Animated.View>
			</View>
		);
	};

	const SuccessAnimation = () => {
		if (!showSuccess) {
			return null;
		}

		setTimeout(() => {
			setShowSuccess(false);
		}, 500);

		return (
			<View top="$1" position="absolute">
				<Animated.View entering={BounceIn} exiting={ZoomOut}>
					<Check color={color.green8Light} scale={0.8} />
				</Animated.View>
			</View>
		);
	};

	return (
		<View>
			{editable && (
				<Button
					onPress={image ? onImageDeleted : pickImage}
					borderRadius="$12"
					width="$2"
					disabled={isLoading || showSuccess}
					height="$2"
					padding="$2"
					position="absolute"
					top={0}
					left="55%"
					zIndex={1000}
				>
					<RenderedButtonIcon />
					<SuccessAnimation />
				</Button>
			)}
			<View alignSelf="center" width="$10" height="$10" backgroundColor="white" borderRadius={100} elevationAndroid="$4">
				<Avatar size="$10" circular>
					{image && <Avatar.Image source={{ uri: image }} />}
					<Avatar.Fallback backgroundColor="$background" alignItems="center" justifyContent="center">
						<User2 />
					</Avatar.Fallback>
				</Avatar>
			</View>
		</View>
	);
};
