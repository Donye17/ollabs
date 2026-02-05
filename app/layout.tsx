import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
    subsets: ['latin'],
    variable: '--font-inter',
    display: 'swap',
});

export const metadata: Metadata = {
    metadataBase: new URL('https://ollabs.vercel.app'),
    title: {
        template: '%s | Ollabs',
        default: 'Ollabs - Custom Avatar Frame Maker & PFP Border Creator',
    },
    description: 'The best free tool to create custom avatar frames, profile picture borders, and PFP overlays for Discord, Twitter, and Instagram.',
    openGraph: {
        type: 'website',
        locale: 'en_US',
        url: 'https://ollabs.studio',
        siteName: 'Ollabs',
        title: 'Ollabs - Custom Avatar Frame Maker',
        description: 'Design unique profile picture frames, neon borders, and PFP overlays in seconds.',
        images: [
            {
                url: '/og-image.png',
                width: 1200,
                height: 630,
                alt: 'Ollabs Avatar Frame Creator',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Ollabs - Custom Avatar Frame Maker',
        description: 'Design unique profile picture frames, neon borders, and PFP overlays in seconds.',
        images: ['/og-image.png'],
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
    'url': 'https://ollabs.vercel.app',
    'description': 'Create custom avatar frames, profile picture borders, and PFP overlays for Discord, Twitter, and social media.',
    'applicationCategory': 'DesignApplication',
    'operatingSystem': 'Web',
    'offers': {
        '@type': 'Offer',
        'price': '0',
        'priceCurrency': 'USD'
    },
    'featureList': 'Custom Avatar Frames, PFP Maker, Discord Profile Borders, Sticker Overlays'
};

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
                <Analytics />
                <SpeedInsights />
            </body>
        </html>
    );
}
