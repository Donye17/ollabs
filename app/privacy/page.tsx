import React from 'react';
import { NavBar } from '@/components/NavBar';

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-50 font-sans">
            <NavBar />
            <main className="max-w-4xl mx-auto px-6 py-24 prose prose-invert">
                <h1>Privacy Policy</h1>
                <p>Last updated: {new Date().toLocaleDateString()}</p>

                <h2>1. Information We Collect</h2>
                <p>We collect information you provide directly to us when you create an account, such as your name, email address, and profile image. If you sign in via a third-party service (Google, Discord, Twitter), we collect your public profile information as permitted by that service.</p>

                <h2>2. How We Use Information</h2>
                <p>We use the information we collect to provide, maintain, and improve our services, to communicate with you, and to personalize your experience.</p>

                <h2>3. Sharing of Information</h2>
                <p>We do not share your personal information with third parties except as described in this policy or with your consent.</p>

                <h2>4. Data Security</h2>
                <p>We take reasonable measures to help protect information about you from loss, theft, misuse, and unauthorized access, disclosure, alteration, and destruction.</p>

                <h2>5. Cookies</h2>
                <p>We use cookies and similar technologies to collect information about your activity, browser, and device.</p>

                <h2>6. Contact Us</h2>
                <p>If you have any questions about this Privacy Policy, please contact us.</p>
            </main>
        </div>
    );
}
