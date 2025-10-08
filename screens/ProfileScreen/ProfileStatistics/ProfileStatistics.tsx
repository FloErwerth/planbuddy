import { View, XStack } from "tamagui";
import { useAllParticipantsQuery } from "@/api/participants/allParticipants/useAllParticipantsQuery";
import { ParticipantRoleEnum } from "@/api/participants/types";
import { Card } from "@/components/tamagui/Card";
import { SizeableText } from "@/components/tamagui/SizeableText";

export const ProfileStatistics = () => {
	const { data: participants } = useAllParticipantsQuery();

	const { user } = useAuthenticationContext();
	const myParticipations = participants?.filter((participant) => participant.userId === user.id);

	const numberOfEventsICreated = myParticipations?.filter((participant) => participant.role === ParticipantRoleEnum.CREATOR).length;
	const numberOfEventsIAttended = myParticipations?.filter((participant) => participant.role === ParticipantRoleEnum.GUEST).length;
	const numberOfEventsIContributedTo = myParticipations?.filter((participant) => participant.role === ParticipantRoleEnum.ADMIN).length;

	return (
		<View gap="$2" marginBottom="$2">
			<SizeableText size="$5">Event Statistiken</SizeableText>
			<Card>
				<XStack justifyContent="space-around">
					<View alignItems="center">
						<SizeableText size="$6" fontWeight="700">
							{numberOfEventsICreated}
						</SizeableText>
						<SizeableText>veranstaltet</SizeableText>
					</View>
					<View alignItems="center">
						<SizeableText size="$6" fontWeight="700">
							{numberOfEventsIAttended}
						</SizeableText>
						<SizeableText>mitgewirkt</SizeableText>
					</View>
					<View alignItems="center">
						<SizeableText size="$6" fontWeight="700">
							{numberOfEventsIContributedTo}
						</SizeableText>
						<SizeableText>teilgenommen</SizeableText>
					</View>
				</XStack>
			</Card>
		</View>
	);
};
