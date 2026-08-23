import type { Metadata } from 'next';
import { NavBar } from '@/components/NavBar';
import { HubEditorClient } from '@/components/hub/HubEditorClient';

export const metadata: Metadata = {
    title: 'Your hub',
    description: 'Claim your Ollabs hub: a campaign directory with a Join button to your frame.',
    robots: { index: false, follow: false },
};

export default function HubEditPage() {
    return (
        <main className="min-h-screen bg-paper text-ink">
            <NavBar />
            <section className="pt-[calc(3.5rem+env(safe-area-inset-top,0px)+1rem)] pb-5 px-4 sm:px-6">
                <div className="max-w-lg mx-auto text-center">
                    <h1 className="font-display text-2xl sm:text-4xl font-extrabold mb-2 sm:mb-3">Your hub</h1>
                    <p className="text-ink/70 text-[15px] leading-relaxed">
                        One link for the whole campaign: bio, Join button to your frame, and
                        whatever else people need.
                    </p>
                </div>
            </section>
            <section className="px-5 sm:px-6">
                <HubEditorClient />
            </section>
        </main>
    );
}
