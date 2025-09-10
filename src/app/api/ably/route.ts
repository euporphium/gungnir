import Ably from 'ably';
import type { NextRequest } from 'next/server';
import { auth } from '@/lib/server/auth';

export const revalidate = 0;

export async function GET(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  if (!session) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const client = new Ably.Rest(process.env.ABLY_API_KEY!);
  const tokenRequestData = await client.auth.createTokenRequest({
    clientId: session.user.id,
  });
  return Response.json(tokenRequestData);
}
