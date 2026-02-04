"use client";
import React from 'react';
import { Gallery } from '@/components/Gallery';
import { GalleryErrorBoundary } from '@/components/GalleryErrorBoundary';
import { NavBar } from '@/components/NavBar';
import { useRouter } from 'next/navigation';
import { FrameConfig } from '@/lib/types';

export const GalleryPageClient: React.FC = () => {
    const router = useRouter();

    const handleSelectFrame = (frame: FrameConfig, frameId: string) => {
        // Store in localStorage purely for client-side persistence across navigation
        localStorage.setItem('temp_frame', JSON.stringify(frame));
        router.push(`/create?id=${frameId}`);
    };

    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-50 font-sans selection:bg-blue-500/30">
            <NavBar />
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                <GalleryErrorBoundary>
                    <Gallery onSelectFrame={handleSelectFrame} />
                </GalleryErrorBoundary>
            </main>
            <footer className="py-12 text-center text-zinc-600 text-sm border-t border-white/5 bg-zinc-950">
                <p>&copy; {new Date().getFullYear()} Ollabs. Community Gallery.</p>
            </footer>
        </div>
    );
};
