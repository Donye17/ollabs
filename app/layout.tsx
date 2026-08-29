import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import type { Metadata, Viewport } from 'next';
import { Inter, Bricolage_Grotesque } from 'next/font/google';
import { LocaleProvider } from '@/components/i18n/LocaleProvider';
import { LanguageBanner } from '@/components/i18n/LanguageBanner';
import { MobileOrganizerNav } from '@/components/MobileOrganizerNav';
import { MobileNavSpacer } from '@/components/MobileNavSpacer';
import { DeferredAnalytics } from '@/components/DeferredAnalytics';
import { DeferredAdSense } from '@/components/DeferredAdSense';
import './globals.css';

const inter = Inter({
    subsets: ['latin'],
    variable: '--font-inter',
    display: 'swap',
    adjustFontFallback: true,
    // Body copy can swap in after paint. Preloading both faces competed with LCP.
    preload: false,
});

const bricolage = Bricolage_Grotesque({
    subsets: ['latin'],
    weight: ['700', '800'],
    variable: '--font-display',
    display: 'swap',
    adjustFontFallback: true,
    preload: true,
});

export const metadata: Metadata = {
    metadataBase: new URL('https://ollabs.studio'),
    title: {
        template: '%s | Ollabs',
        default: 'Ollabs: Free Profile Picture Frame Maker for Campaigns & Causes',
    },
    description: 'Create a profile-picture frame for your cause, team, or event and share one link. Supporters add it to their photo in seconds, no signup. A clean, free alternative to Twibbon.',
    keywords: ['profile picture frame maker', 'profile picture frame', 'pfp frame', 'twibbon alternative', 'profile picture campaign', 'support frame maker', 'add frame to profile picture', 'campaign frame', 'fundraiser profile frame', 'flag overlay', 'avatar frame', 'no signup pfp frame'],
    openGraph: {
        type: 'website',
        locale: 'en_US',
        url: 'https://ollabs.studio',
        siteName: 'Ollabs',
        title: 'Ollabs: Free Profile Picture Frame Maker for Campaigns & Causes',
        description: 'Rally your people with a profile-picture frame. Share one link, supporters add it to their photo in seconds. Free, no signup, no watermark.',
        images: [
            {
                url: 'https://ollabs.studio/og.png',
                width: 1200,
                height: 630,
                alt: 'Ollabs, bring your people together with a profile-picture frame',
            },
        ],
    },
    alternates: {
        languages: {
            en: 'https://ollabs.studio',
            'pt-BR': 'https://ollabs.studio/pt',
            'x-default': 'https://ollabs.studio',
        },
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Ollabs: Free Profile Picture Frame Maker for Campaigns & Causes',
        description: 'Rally your people with a profile-picture frame. Share one link, supporters add it to their photo in seconds. Free, no signup, no watermark.',
        images: ['https://ollabs.studio/og.png'],
    },
    icons: {
        // Google Search picks a square PNG >= ~48px. Lead with that (stable
        // filename google-site-icon.png so a re-crawl can leave blurry SVG /
        // 16px upscales behind). SVG stays for sharp browser tabs. Root
        // /favicon.ico exists too: many crawlers still request that path first.
        icon: [
            { url: '/favicon/google-site-icon.png', sizes: '192x192', type: 'image/png' },
            { url: '/favicon/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
            { url: '/favicon/mark.svg', type: 'image/svg+xml' },
            { url: '/favicon.ico', sizes: 'any' },
            { url: '/favicon/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
            { url: '/favicon/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
        ],
        apple: [
            { url: '/favicon/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
        ],
    },
    manifest: '/favicon/site.webmanifest',
    other: {
        // How AdSense confirms we own ollabs.studio. Google reads this from the
        // <head> of any page on the domain. It does not serve or request an ad.
        'google-adsense-account': 'ca-pub-5665798404376894',
    },
};

// Colours the iOS status bar and the Android system chrome when the site is
// installed. Next wants this in the viewport export, not in metadata.
export const viewport: Viewport = {
    themeColor: '#01BEF6',
    // Next supplies these by default, but almost everyone here is on a phone,
    // so they are worth stating rather than inheriting. No maximumScale and no
    // userScalable false: pinch zoom stays available, which people rely on.
    width: 'device-width',
    initialScale: 1,
    // Without cover, env(safe-area-inset-*) stays 0 on notched iPhones and the
    // sticky thumb bars sit under the home indicator.
    viewportFit: 'cover',
};

const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
        {
            '@type': 'Organization',
            '@id': 'https://ollabs.studio/#organization',
            'name': 'Ollabs',
            'url': 'https://ollabs.studio',
            'logo': {
                '@type': 'ImageObject',
                'url': 'https://ollabs.studio/favicon/android-chrome-512x512.png',
            },
            'email': 'hello@ollabs.studio',
            'description':
                'Free profile-picture frame campaigns for causes, teams, and events. No watermark for supporters.',
        },
        {
            '@type': 'WebSite',
            '@id': 'https://ollabs.studio/#website',
            'name': 'Ollabs',
            'url': 'https://ollabs.studio',
            'publisher': { '@id': 'https://ollabs.studio/#organization' },
        },
        {
            '@type': 'WebApplication',
            '@id': 'https://ollabs.studio/#app',
            'name': 'Ollabs',
            'url': 'https://ollabs.studio',
            'description': 'Create a profile-picture frame campaign for your cause, team, or event and share one link. Supporters add it to their photo in seconds. Free, no signup.',
            'applicationCategory': 'DesignApplication',
            'operatingSystem': 'Web',
            'genre': 'Design',
            'offers': {
                '@type': 'Offer',
                'price': '0',
                'priceCurrency': 'USD',
            },
            'featureList': 'Profile Picture Frame Maker, Campaign Links, Supporter Counter, Custom Frame Upload, Flag Overlays',
            'potentialAction': {
                '@type': 'CreateAction',
                'target': {
                    '@type': 'EntryPoint',
                    'urlTemplate': 'https://ollabs.studio/create',
                },
                'result': {
                    '@type': 'ImageObject',
                    'name': 'Custom Avatar Frame',
                },
            },
        },
    ],
};

const GA_ID = process.env.NEXT_PUBLIC_GA_ID || 'G-0E75K2XJ5Q';
// Same client as AdSlot / meta tag. Loaded sitewide so AdSense crawlers see the
// connection snippet on high-traffic HTML (home), not only after a unit mounts.
const ADSENSE_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT || 'ca-pub-5665798404376894';

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
                <LocaleProvider>
                    {children}
                    {/* Spacer + nav share the same route gate so /c and SEO pages
                        do not reserve empty thumb space under the fold. */}
                    <MobileNavSpacer />
                    <MobileOrganizerNav />
                    <LanguageBanner />
                </LocaleProvider>
                {GA_ID ? <DeferredAnalytics gaId={GA_ID} /> : null}
                {/* Meta tag in metadata.other still verifies the site. Script is
                    deferred so home LCP is not fighting unused AdSense JS. */}
                <DeferredAdSense client={ADSENSE_CLIENT} />
                <Analytics />
                <SpeedInsights />
            </body>
        </html>
    );
}
