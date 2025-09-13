'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createGame } from '@/app/actions';

export function StartGameButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleStart = async () => {
    setLoading(true);
    setError(null);
    try {
      const { key } = await createGame();
      router.push(`/games/${key}`);
    } catch (e: any) {
      setError(e?.message ?? 'Could not create game');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      className="rounded-lg border border-gray-300 p-8 hover:cursor-pointer active:outline-1"
      onClick={handleStart}
      disabled={loading}
    >
      {loading ? 'Starting...' : 'Start'}
    </button>
  );
}
