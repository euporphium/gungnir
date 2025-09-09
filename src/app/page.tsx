import { headers } from 'next/headers';
import Chat from '@/components/Chat';
import { auth } from '@/lib/auth';

async function getDisplayName() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return 'Unauthenticated user';
  }

  if (session.user.name === 'Anonymous') {
    return 'Anonymous_' + session.user.id;
  }

  return session.user.name;
}

export default async function Home() {
  const displayName = await getDisplayName();

  return (
    <div className="font-sans">
      <div>{displayName}</div>
      <Chat />
    </div>
  );
}
