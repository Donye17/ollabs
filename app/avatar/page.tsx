import type { Metadata } from 'next';
import { NavBar } from '@/components/NavBar';
import { SiteFooter } from '@/components/SiteFooter';
import { AvatarBuilder } from '@/components/avatar/AvatarBuilder';
import { PAGE_TOP_UNDER_NAV } from '@/lib/mobileNav';

const TITLE = 'Free avatar maker: make your Dummy';
const DESCRIPTION = 'Make a free cartoon avatar in seconds. Pick skin tone, hair, face and outfit, then download a PNG for your profile picture. No account.';

export const metadata: Metadata = {
    title: TITLE,
    description: DESCRIPTION,
    alternates: { canonical: 'https://ollabs.studio/avatar' },
    openGraph: { type: 'website', url: 'https://ollabs.studio/avatar', title: TITLE, description: DESCRIPTION, siteName: 'Ollabs', images: ['/og.png'] },
    twitter: { card: 'summary_large_image', images: ['/og.png'] },
};

export default function AvatarPage() {
    return (
        <main className="min-h-screen bg-paper text-ink">
            <NavBar />
            <div className={`${PAGE_TOP_UNDER_NAV} px-4 sm:px-6 pb-16 max-w-6xl mx-auto`}>
                <header className="mb-6 space-y-2">
                    <h1 className="font-display text-3xl sm:text-4xl font-bold">Make your Dummy</h1>
                    <p className="text-muted max-w-xl">A free avatar in seconds. No account, nothing on top of your picture.</p>
                </header>
                <AvatarBuilder />
            </div>
            <SiteFooter />
        </main>
    );
}
