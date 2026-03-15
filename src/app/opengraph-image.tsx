import { ImageResponse } from 'next/og'

export const runtime = 'edge'

// Image metadata
export const alt = 'HKJ - Design Engineering'
export const size = {
    width: 1200,
    height: 630,
}
export const contentType = 'image/png'

// Image generation
export default async function Image() {
    return new ImageResponse(
        (
            <div
                style={{
                    height: '100%',
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: '#faf9f7', // canvas
                    color: '#0a0a0a', // ink
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <div style={{ fontSize: 120, fontFamily: 'serif', fontStyle: 'italic', marginBottom: 20 }}>
                        HKJ
                    </div>
                    <div
                        style={{
                            fontSize: 24,
                            fontFamily: 'monospace',
                            letterSpacing: '0.3em',
                            textTransform: 'uppercase',
                            color: '#555555', // ink-muted
                        }}
                    >
                        Index 2026 — Digital Naturalism
                    </div>
                </div>
            </div>
        ),
        {
            ...size,
        }
    )
}
