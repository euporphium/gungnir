import QRCode from 'qrcode';

export default async function QRCodeContainer() {
  const dataUrl = await QRCode.toDataURL('https://www.danielnewton.dev');

  return <img src={dataUrl} />;
}
