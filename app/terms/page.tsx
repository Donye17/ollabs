import React from 'react';
import { NavBar } from '@/components/NavBar';

export default function TermsOfService() {
    return (
        <div className="min-h-screen bg-paper text-ink font-sans">
            <NavBar />
            <div className="max-w-3xl mx-auto px-6 py-28">
                <h1 className="font-display text-4xl font-extrabold mb-2">Terms of Service</h1>
                <p className="text-sm text-muted mb-10">Last updated: {new Date().toLocaleDateString()}</p>

                <div className="space-y-8 text-ink/75 leading-relaxed">
                    <section>
                        <h2 className="font-display text-xl font-bold text-ink mb-2">1. Acceptance of terms</h2>
                        <p>By accessing or using Ollabs (the "Service"), you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you may not access the Service.</p>
                    </section>

                    <section>
                        <h2 className="font-display text-xl font-bold text-ink mb-2">2. Your content</h2>
                        <p>The Service lets you create campaigns and add frames to photos. You are responsible for the content you create and share, including its legality and appropriateness. You keep ownership of your content. By creating a public campaign, you allow it to be displayed on the Service so that others can add your frame to their photo.</p>
                    </section>

                    <section>
                        <h2 className="font-display text-xl font-bold text-ink mb-2">3. Acceptable use</h2>
                        <p>Do not use the Service to create content that is unlawful, hateful, harassing, infringing, or otherwise harmful. We may remove campaigns that violate these terms.</p>
                    </section>

                    <section>
                        <h2 className="font-display text-xl font-bold text-ink mb-2">4. Intellectual property</h2>
                        <p>The Service and its original content (excluding content provided by users), features, and functionality are and will remain the exclusive property of Ollabs and its licensors.</p>
                    </section>

                    <section>
                        <h2 className="font-display text-xl font-bold text-ink mb-2">5. Limitation of liability</h2>
                        <p>In no event shall Ollabs, nor its owners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your access to or use of, or inability to use, the Service.</p>
                    </section>

                    <section>
                        <h2 className="font-display text-xl font-bold text-ink mb-2">6. Contact us</h2>
                        <p>If you have any questions about these Terms, contact us at <a href="mailto:feedback@ollabs.studio" className="text-brand-deep hover:underline">feedback@ollabs.studio</a>.</p>
                    </section>
                </div>
            </div>
        </div>
    );
}
