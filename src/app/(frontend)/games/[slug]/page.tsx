import { gameDAL } from '@/lib/server/db/dal';
import { notFound } from 'next/navigation';
import QRCode from 'qrcode';

async function getGame(key: string) {
  // TODO validate key is valid uuid or explode
  const game = await gameDAL.findByKey(key);
  if (!game) {
    notFound();
  }
  return game;
}

export default async function GamesPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  console.log('slug', slug);
  const game = await getGame(slug);
  const qrDataUrl = await QRCode.toDataURL(game.key);

  return (
    <div>
      <div>Welcome to {slug}</div>
      <img src={qrDataUrl} alt={`${slug} qr`} />
    </div>
  );
}
