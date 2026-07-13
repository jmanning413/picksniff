import { ImageResponse } from 'next/og'

// Sitewide social share card (og:image + twitter:image via Next convention)
export const alt = 'PickSniff: find your signature scent in 4 questions'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '80px',
          backgroundColor: '#F8F6F2',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', fontSize: 72, fontWeight: 900, color: '#1A1A1A' }}>
          Pick<span style={{ color: '#3D7A16' }}>Sniff</span>
        </div>
        <div style={{ display: 'flex', marginTop: 28, fontSize: 44, fontWeight: 700, color: '#1A1A1A', lineHeight: 1.15 }}>
          Find your signature scent in 4 questions.
        </div>
        <div style={{ display: 'flex', marginTop: 20, fontSize: 28, color: '#5C5C5C' }}>
          No jargon. No overwhelm. Just your scent.
        </div>
        <div
          style={{
            display: 'flex',
            marginTop: 48,
            alignSelf: 'flex-start',
            backgroundColor: '#7FE040',
            color: '#1A1A1A',
            fontSize: 26,
            fontWeight: 700,
            padding: '16px 36px',
            borderRadius: 12,
          }}
        >
          picksniff.com
        </div>
      </div>
    ),
    size,
  )
}
