import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
    metadataBase: new URL('https://ollabs.vercel.app'), // Replace with actual domain if known, or Vercel URL
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
            <body className={inter.className}>{children}</body>
        </html>
    );
}
