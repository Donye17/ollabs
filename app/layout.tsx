import type { Metadata } from 'next';
import { Archivo, Space_Grotesk } from 'next/font/google';
import './globals.css';

const archivo = Archivo({
    subsets: ['latin'],
    variable: '--font-archivo',
    display: 'swap',
});

const spaceGrotesk = Space_Grotesk({
    subsets: ['latin'],
    variable: '--font-space',
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
        <html lang="en">
            <body className={`${archivo.variable} ${spaceGrotesk.variable} font-sans bg-slate-950 text-slate-50 antialiased`}>
                {children}
            </body>
        </html>
    );
}
