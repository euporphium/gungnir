import { headers } from 'next/headers';
import { auth } from '@/lib/server/auth';
import { StartGameButton } from '@/components/StartGameButton';

async function getUserData() {
  'use server';
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session || !session.user) {
    return { displayName: 'Unauthenticated user', userId: null };
  }

  if (session.user.name === 'Anonymous') {
    return {
      displayName: 'Anonymous_' + session.user.id,
      userId: session.user.id,
    };
  }

  return { displayName: session.user.name, userId: session.user.id };
}

export default async function Home() {
  const { displayName, userId } = await getUserData();

  if (!userId) {
    return <div>Who are you?</div>;
  }

  return (
    <div className="flex min-h-dvh flex-col p-1 font-sans">
      <StartGameButton />
      <div className="mt-auto text-right">{displayName}</div>
    </div>
  );
}
