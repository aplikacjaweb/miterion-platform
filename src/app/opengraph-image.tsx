import { ImageResponse } from 'next/og';
import fs from 'fs';
import path from 'path';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  // Używamy pełnej nazwy pliku z rozszerzeniem .png
  const logoPath = path.join(process.cwd(), 'public', 'logo-miterion.png');
  const logoData = fs.readFileSync(logoPath);
  const logoBase64 = Buffer.from(logoData).toString('base64');

  return new ImageResponse(
    (
      <div style={{
        background: '#f7f7f3',
        width: '100%', height: '100%',
        display: 'flex', alignItems: 'center', justifyContent: 'center'
      }}>
        <img src={`data:image/png;base64,${logoBase64}`} width="800" />
      </div>
    ),
    { ...size }
  );
}