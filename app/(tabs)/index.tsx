import { Events } from '@/screens/Events';
import { useEffect } from 'react';
import { removeInviteId } from '@/utils/invite';

export default function HomePage() {
  useEffect(() => {
    (async () => {
      await removeInviteId();
    })();
  }, []);

  return <Events />;
}
