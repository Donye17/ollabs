import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import Script from 'next/script';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
    subsets: ['latin'],
    variable: '--font-inter',
    display: 'swap',
});

export const metadata: Metadata = {
    metadataBase: new URL('https://ollabs.studio'),
    title: {
        template: '%s | Ollabs',
        default: 'Ollabs — Free Profile Picture Frame Maker for Campaigns & Causes',
    },
    description: 'Create a profile-picture frame for your cause, team, or event and share one link. Supporters add it to their photo in seconds — no signup, no ads. A clean, free alternative to Twibbon.',
    keywords: ['profile picture frame maker', 'profile picture frame', 'pfp frame', 'twibbon alternative', 'profile picture campaign', 'support frame maker', 'add frame to profile picture', 'campaign frame', 'fundraiser profile frame', 'flag overlay', 'avatar frame', 'no signup pfp frame'],
    openGraph: {
        type: 'website',
        locale: 'en_US',
        url: 'https://ollabs.studio',
        siteName: 'Ollabs',
        title: 'Ollabs — Free Profile Picture Frame Maker for Campaigns & Causes',
        description: 'Rally your people with a profile-picture frame. Share one link — supporters add it to their photo in seconds. Free, no signup, no ads.',
        images: [
            {
                url: 'https://ollabs.studio/Ollabs%20Logo%20White.png',
                width: 1200,
                height: 630,
                alt: 'Ollabs — Profile Picture Frame Campaigns',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Ollabs — Free Profile Picture Frame Maker for Campaigns & Causes',
        description: 'Rally your people with a profile-picture frame. Share one link — supporters add it to their photo in seconds. Free, no signup, no ads.',
        images: ['https://ollabs.studio/Ollabs%20Logo%20White.png'],
    },
    icons: {
        icon: [
            { url: '/favicon/favicon.ico' },
            { url: '/favicon/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
            { url: '/favicon/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
        ],
        apple: [
            { url: '/favicon/apple-touch-icon.png' },
        ],
        other: [
            {
                rel: 'android-chrome-192x192',
                url: '/favicon/android-chrome-192x192.png',
            },
            {
                rel: 'android-chrome-512x512',
                url: '/favicon/android-chrome-512x512.png',
            },
        ],
    },
    manifest: '/favicon/site.webmanifest',
};

const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    'name': 'Ollabs',
    'url': 'https://ollabs.studio',
    'description': 'Create a profile-picture frame campaign for your cause, team, or event and share one link. Supporters add it to their photo in seconds. Free, no signup.',
    'applicationCategory': 'DesignApplication',
    'operatingSystem': 'Web',
    'genre': 'Design',
    'offers': {
        '@type': 'Offer',
        'price': '0',
        'priceCurrency': 'USD'
    },
    'featureList': 'Profile Picture Frame Maker, Campaign Links, Supporter Counter, Custom Frame Upload, Flag Overlays',
    'potentialAction': {
        '@type': 'CreateAction',
        'target': {
            '@type': 'EntryPoint',
            'urlTemplate': 'https://ollabs.studio/create'
        },
        'result': {
            '@type': 'ImageObject',
            'name': 'Custom Avatar Frame'
        }
    }
};

const GA_ID = process.env.NEXT_PUBLIC_GA_ID || 'G-0E75K2XJ5Q';

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className="dark">
            <body className={`${inter.variable} font-sans bg-zinc-950 text-zinc-400 antialiased selection:bg-blue-500/30 selection:text-blue-200`}>
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
                />
                {children}
                {GA_ID && (
                    <>
                        <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
                        <Script id="google-analytics" strategy="afterInteractive">
                            {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA_ID}');`}
                        </Script>
                    </>
                )}
                <Analytics />
                <SpeedInsights />
            </body>
        </html>
    );
}
