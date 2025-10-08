import { memo } from "react";
import { View, XStack } from "tamagui";
import type { Participant } from "@/api/participants/types";
import type { User } from "@/api/user/types";
import { Card } from "@/components/tamagui/Card";
import { Checkbox } from "@/components/tamagui/Checkbox";
import { SizeableText } from "@/components/tamagui/SizeableText";
import { UserAvatar } from "@/components/UserAvatar";
import { formatToDate, formatToTime } from "@/utils/date";

export type EventDetailsGuestProps = User & { checked: boolean; onPress: (id: string) => void } & Pick<Participant, "createdAt">;

export const EventDetailsGuest = memo(({ id, onPress, checked, firstName, createdAt, lastName, email }: EventDetailsGuestProps) => {
	return (
		<Card onPress={() => onPress(id)} key={id}>
			<XStack alignItems="center" paddingRight="$2" justifyContent="space-between">
				<XStack gap="$3" alignItems="center">
					<UserAvatar id={id} />
					<View gap="$1">
						<SizeableText>
							{firstName} {lastName}
						</SizeableText>
						{createdAt ? (
							<SizeableText size="$3">
								Eingeladen am {formatToDate(createdAt)}, {formatToTime(createdAt)} Uhr
							</SizeableText>
						) : (
							<SizeableText size="$3">{email}</SizeableText>
						)}
					</View>
				</XStack>
				{!createdAt && <Checkbox checked={checked} />}
			</XStack>
		</Card>
	);
});
EventDetailsGuest.displayName = "EventDetailsGuest";
