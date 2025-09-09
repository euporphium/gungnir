import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

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

  return <div className="font-sans">{displayName}</div>;
}
