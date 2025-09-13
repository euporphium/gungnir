'use server';

import { auth } from '@/lib/server/auth';
import { headers } from 'next/headers';
import { gameDAL } from '@/lib/server/db/dal';

export async function createGame() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session || !session.user) {
    throw new Error('Not authenticated');
  }

  const newGame = await gameDAL.create({
    key: crypto.randomUUID(),
    userId: session.user.id,
  });

  return { gameId: newGame.id, key: newGame.key };
}
