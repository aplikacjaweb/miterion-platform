import { ImageResponse } from "next/og";

// Konstrukcja ImageResponse wymaga zdefiniowania runtime
export const runtime = "edge";

// Wymiary miniatury zgodne ze standardem Open Graph
export const alt = "Miterion - Clinical Trial Feasibility Intelligence";
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          backgroundColor: '#f7f7f3',
          padding: '80px',
          fontFamily: 'sans-serif',
          position: 'relative',
        }}
      >
        {/* Subtelne tło z kropek (analogiczne do dotGridBg w aplikacji) */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'radial-gradient(circle, #d9d9d4 1.5px, transparent 1.5px)',
            backgroundSize: '32px 32px',
            opacity: 0.8,
          }}
        />

        {/* Gradient rozjaśniający górę */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to bottom, rgba(255,255,255,0.7) 0%, transparent 100%)',
          }}
        />

        {/* GÓRA: LOGO / BRANDING */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            zIndex: 10,
          }}
        >
          {/* Sygnet / Mini-wykres jako ikona logo */}
          <div
            style={{
              display: 'flex',
              width: '32px',
              height: '32px',
              backgroundColor: '#0f172a',
              borderRadius: '8px',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div style={{ width: '12px', height: '12px', backgroundColor: '#fff', borderRadius: '2px' }} />
          </div>
          {/* Nazwa firmy */}
          <span
            style={{
              fontSize: '28px',
              fontWeight: 700,
              color: '#0f172a',
              letterSpacing: '-0.02em',
            }}
          >
            Miterion
          </span>
        </div>

        {/* ŚRODEK: GŁÓWNE HASŁO MARKETINGOWE */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            maxWidth: '900px',
            zIndex: 10,
            marginTop: 'auto',
            marginBottom: 'auto',
          }}
        >
          {/* Mały eyebrow text nad nagłówkiem */}
          <span
            style={{
              fontSize: '14px',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.24em',
              color: '#64748b',
              marginBottom: '20px',
            }}
          >
            Clinical Operations Intelligence
          </span>

          {/* Główny nagłówek */}
          <h1
            style={{
              fontSize: '56px',
              fontWeight: 400,
              color: '#0f172a',
              lineHeight: 1.15,
              letterSpacing: '-0.03em',
              margin: 0,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <span>Clinical Trial Feasibility Intelligence.</span>
            <span style={{ color: '#94a3b8', marginTop: '8px' }}>
              See the risk before it gets expensive.
            </span>
          </h1>
        </div>

        {/* DÓŁ: DODATKOWY AKAPIT LUB ADRES STRONY */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '100%',
            zIndex: 10,
            borderTop: '1px solid #deded8',
            paddingTop: '32px',
          }}
        >
          <span
            style={{
              fontSize: '16px',
              color: '#64748b',
              maxWidth: '600px',
            }}
          >
            Before you commit budget, see what public trial data reveals.
          </span>
          <span
            style={{
              fontSize: '16px',
              fontWeight: 600,
              color: '#0f172a',
              backgroundColor: '#ffffff',
              padding: '8px 16px',
              borderRadius: '9999px',
              border: '1px solid #deded8',
            }}
          >
            miterion.com
          </span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}