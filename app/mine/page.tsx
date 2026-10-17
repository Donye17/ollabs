import type { Metadata } from 'next';
import { NavBar } from '@/components/NavBar';
import { MyCampaignsClient } from '@/components/MyCampaignsClient';
import { MineFooter, MineIntro } from '@/components/MineIntro';

export const metadata: Metadata = {
    title: 'My campaigns',
    description: 'Your Ollabs campaigns and quick links back to their dashboards.',
    robots: { index: false, follow: false },
};

export default function MinePage() {
    return (
        <main className="min-h-screen bg-paper text-ink">
            <NavBar />
            <section className="pt-[calc(3.5rem+env(safe-area-inset-top,0px)+1.25rem)] pb-4 px-4 sm:px-6">
                <MineIntro />
            </section>
            {/* Tab clearance comes from MobileNavSpacer in the root layout. */}
            <section className="px-4 sm:px-6 pb-8">
                <MyCampaignsClient />
                <MineFooter />
            </section>
        </main>
    );
}
