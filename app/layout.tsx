import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import Script from 'next/script';
import type { Metadata, Viewport } from 'next';
import { Inter, Bricolage_Grotesque } from 'next/font/google';
import './globals.css';

const inter = Inter({
    subsets: ['latin'],
    variable: '--font-inter',
    display: 'swap',
});

const bricolage = Bricolage_Grotesque({
    subsets: ['latin'],
    weight: ['400', '600', '700', '800'],
    variable: '--font-display',
    display: 'swap',
});

export const metadata: Metadata = {
    metadataBase: new URL('https://ollabs.studio'),
    title: {
        template: '%s | Ollabs',
        default: 'Ollabs: Free Profile Picture Frame Maker for Campaigns & Causes',
    },
    description: 'Create a profile-picture frame for your cause, team, or event and share one link. Supporters add it to their photo in seconds, no signup, no ads. A clean, free alternative to Twibbon.',
    keywords: ['profile picture frame maker', 'profile picture frame', 'pfp frame', 'twibbon alternative', 'profile picture campaign', 'support frame maker', 'add frame to profile picture', 'campaign frame', 'fundraiser profile frame', 'flag overlay', 'avatar frame', 'no signup pfp frame'],
    openGraph: {
        type: 'website',
        locale: 'en_US',
        url: 'https://ollabs.studio',
        siteName: 'Ollabs',
        title: 'Ollabs: Free Profile Picture Frame Maker for Campaigns & Causes',
        description: 'Rally your people with a profile-picture frame. Share one link, supporters add it to their photo in seconds. Free, no signup, no ads.',
        images: [
            {
                url: 'https://ollabs.studio/og.png',
                width: 1200,
                height: 630,
                alt: 'Ollabs, bring your people together with a profile-picture frame',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Ollabs: Free Profile Picture Frame Maker for Campaigns & Causes',
        description: 'Rally your people with a profile-picture frame. Share one link, supporters add it to their photo in seconds. Free, no signup, no ads.',
        images: ['https://ollabs.studio/og.png'],
    },
    icons: {
        icon: [
            { url: '/favicon/favicon.ico' },
            { url: '/favicon/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
            { url: '/favicon/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
            // Google chooses the search result icon from rel="icon" and wants a
            // square at least 48px and a multiple of 48. With only 16 and 32
            // declared it was upscaling one of them, which is why the icon
            // looked rough in results.
            { url: '/favicon/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
        ],
        apple: [
            { url: '/favicon/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
        ],
        // The android-chrome files are declared in site.webmanifest, which is
        // where Android actually reads them. They used to be listed here too
        // under invented rel values that no browser recognises.
    },
    manifest: '/favicon/site.webmanifest',
};

// Colours the iOS status bar and the Android system chrome when the site is
// installed. Next wants this in the viewport export, not in metadata.
export const viewport: Viewport = {
    themeColor: '#01BEF6',
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
        <html lang="en">
            <body className={`${inter.variable} ${bricolage.variable} font-sans bg-paper text-ink antialiased`}>
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
