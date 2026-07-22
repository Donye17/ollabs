import type { Metadata } from 'next';
import { NavBar } from '@/components/NavBar';
import { MyCampaignsClient } from '@/components/MyCampaignsClient';

export const metadata: Metadata = {
    title: 'My campaigns | Ollabs',
    description: 'Campaigns you created on this device, with quick links back to their dashboards.',
    robots: { index: false, follow: false },
};

export default function MinePage() {
    return (
        <main className="min-h-screen bg-paper text-ink">
            <NavBar />
            <section className="pt-32 pb-8 px-6">
                <div className="max-w-2xl mx-auto text-center">
                    <h1 className="font-display text-4xl font-extrabold mb-3">My campaigns</h1>
                    <p className="text-ink/70">The campaigns you started in this browser, and quick links back to each dashboard.</p>
                </div>
            </section>
            <section className="px-6 pb-24">
                <MyCampaignsClient />
            </section>
        </main>
    );
}
