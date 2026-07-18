import React from 'react';
import { NavBar } from '@/components/NavBar';

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-paper text-ink font-sans">
            <NavBar />
            <main className="max-w-3xl mx-auto px-6 py-28">
                <h1 className="font-display text-4xl font-extrabold mb-2">Privacy Policy</h1>
                <p className="text-sm text-muted mb-10">Last updated: {new Date().toLocaleDateString()}</p>

                <div className="space-y-8 text-ink/75 leading-relaxed">
                    <section>
                        <h2 className="font-display text-xl font-bold text-ink mb-2">1. Information we collect</h2>
                        <p>Ollabs works without an account. You can create a campaign and add a frame to a photo without signing up. Photos you add to a frame are processed in your browser and are not stored on our servers. When you create a campaign, we store the campaign details you enter, such as its title, description, and frame design.</p>
                    </section>

                    <section>
                        <h2 className="font-display text-xl font-bold text-ink mb-2">2. How we use information</h2>
                        <p>We use the limited information we collect to provide, maintain, and improve the service, and to show public campaign pages and supporter counts.</p>
                    </section>

                    <section>
                        <h2 className="font-display text-xl font-bold text-ink mb-2">3. Sharing of information</h2>
                        <p>We do not sell your personal information. We do not share it with third parties except as described in this policy or with your consent.</p>
                    </section>

                    <section>
                        <h2 className="font-display text-xl font-bold text-ink mb-2">4. Analytics</h2>
                        <p>We use privacy-conscious analytics to understand how the site is used, such as page views and general device information. This helps us improve the product.</p>
                    </section>

                    <section>
                        <h2 className="font-display text-xl font-bold text-ink mb-2">5. Data security</h2>
                        <p>We take reasonable measures to protect information from loss, theft, misuse, and unauthorized access, disclosure, alteration, and destruction.</p>
                    </section>

                    <section>
                        <h2 className="font-display text-xl font-bold text-ink mb-2">6. Contact us</h2>
                        <p>If you have any questions about this Privacy Policy, contact us at <a href="mailto:feedback@ollabs.studio" className="text-brand-deep hover:underline">feedback@ollabs.studio</a>.</p>
                    </section>
                </div>
            </main>
        </div>
    );
}
