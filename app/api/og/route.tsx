import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);

        // ?title=<title>&creator=<creator>
        const title = searchParams.get('title')?.slice(0, 100) || 'Custom Frame';
        const creator = searchParams.get('creator')?.slice(0, 50) || 'Ollabs Creator';

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
                        backgroundColor: '#09090b', // zinc-950
                        backgroundImage: 'radial-gradient(circle at 25px 25px, #27272a 2%, transparent 0%), radial-gradient(circle at 75px 75px, #27272a 2%, transparent 0%)',
                        backgroundSize: '100px 100px',
                        color: 'white',
                    }}
                >
                    {/* Background Glow */}
                    <div
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: 'radial-gradient(circle at center, rgba(59, 130, 246, 0.15) 0%, transparent 70%)',
                            pointerEvents: 'none',
                        }}
                    />

                    {/* Content Container */}
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            padding: '40px 80px',
                            textAlign: 'center',
                        }}
                    >
                        {/* Logo / Badge */}
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                background: 'linear-gradient(to right, #2563eb, #7c3aed)',
                                borderRadius: '999px',
                                padding: '10px 24px',
                                marginBottom: '40px',
                                boxShadow: '0 0 30px rgba(59, 130, 246, 0.4)',
                            }}
                        >
                            <span style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-0.02em', color: 'white' }}>
                                Ollabs Studio
                            </span>
                        </div>

                        {/* Title */}
                        <div
                            style={{
                                fontSize: 80,
                                fontWeight: 900,
                                background: 'linear-gradient(to bottom, #ffffff, #a1a1aa)',
                                backgroundClip: 'text',
                                color: 'transparent',
                                lineHeight: 1.1,
                                marginBottom: '20px',
                                letterSpacing: '-0.03em',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                            }}
                        >
                            {title}
                        </div>

                        {/* Creator */}
                        <div
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                fontSize: 32,
                                color: '#a1a1aa',
                                fontWeight: 500,
                            }}
                        >
                            <span>Created by</span>
                            <span style={{ color: '#60a5fa', fontWeight: 600 }}>{creator}</span>
                        </div>
                    </div>

                    {/* Footer decoration */}
                    <div
                        style={{
                            position: 'absolute',
                            bottom: 40,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            fontSize: 20,
                            color: '#52525b',
                        }}
                    >
                        <span>ollabs.studio</span>
                    </div>
                </div>
            ),
            {
                width: 1200,
                height: 630,
            }
        );
    } catch (e: any) {
        console.log(`${e.message}`);
        return new Response(`Failed to generate the image`, {
            status: 500,
        });
    }
}
