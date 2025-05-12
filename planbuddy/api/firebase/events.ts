import { getAuth } from '@react-native-firebase/auth';
import { arrayRemove, doc, getFirestore, updateDoc } from '@react-native-firebase/firestore';

type EventOperations = {
  joinEvent: (id: string) => Promise<void>;
  leaveEvent: (id: string) => Promise<void>;
};

const eventOperations: EventOperations = {
  leaveEvent: async (eventId) => {
    const userId = getAuth().currentUser?.uid;
    if (!userId) {
      return;
    }

    await updateDoc(doc(getFirestore(), 'users', userId), {
      adminEventIds: arrayRemove(eventId),
    }).catch((e) => console.log(e));
  },
};
