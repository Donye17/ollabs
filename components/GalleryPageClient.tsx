"use client";
import React from 'react';
import { Gallery } from '@/components/Gallery';
import { NavBar } from '@/components/NavBar';
import { useRouter } from 'next/navigation';
import { FrameConfig } from '@/lib/types';

export const GalleryPageClient: React.FC = () => {
    const router = useRouter();

    const handleSelectFrame = (frame: FrameConfig) => {
        // Store in localStorage purely for client-side persistence across navigation
        localStorage.setItem('temp_frame', JSON.stringify(frame));
        router.push('/');
    };

    return (
        <div className="min-h-screen bg-slate-900 text-slate-50 font-sans">
            <NavBar />
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <Gallery onSelectFrame={handleSelectFrame} />
            </main>
            <footer className="py-8 text-center text-slate-600 text-sm">
                <p>&copy; {new Date().getFullYear()} Ollabs. Community Gallery.</p>
            </footer>
        </div>
    );
};
