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
        default: 'Ollabs - Create Custom Avatar Frames',
    },
    description: 'The easiest way to create, customize, and share professional avatar frames for social media.',
    openGraph: {
        type: 'website',
        locale: 'en_US',
        url: 'https://ollabs.vercel.app',
        siteName: 'Ollabs',
        title: 'Ollabs - AI Avatar Frame Creator',
        description: 'Design unique profile picture frames with neon, geometric, and artistic styles.',
        images: [
            {
                url: '/og-image.png',
                width: 1200,
                height: 630,
                alt: 'Ollabs Social Banner',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Ollabs - AI Avatar Frame Creator',
        description: 'Design unique profile picture frames with neon, geometric, and artistic styles.',
        images: ['/og-image.png'],
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className="dark">
            <body className={`${inter.variable} font-sans bg-zinc-950 text-zinc-400 antialiased selection:bg-blue-500/30 selection:text-blue-200`}>
                {children}
            </body>
        </html>
    );
}
