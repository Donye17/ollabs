import React from 'react';
import { NavBar } from '@/components/NavBar';

export default function TermsPage() {
    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-50 font-sans">
            <NavBar />
            <main className="max-w-4xl mx-auto px-6 py-24 prose prose-invert">
                <h1>Terms of Service</h1>
                <p>Last updated: {new Date().toLocaleDateString()}</p>

                <h2>1. Introduction</h2>
                <p>Welcome to Ollabs ("we", "our", "us"). By accessing or using our website, service, and software (collectively, the "Service"), you agree to be bound by these Terms of Service ("Terms").</p>

                <h2>2. Usage of Service</h2>
                <p>You agree to use the Service only for lawful purposes and in accordance with these Terms. You are responsible for any content you create, post, or share using the Service.</p>

                <h2>3. Accounts</h2>
                <p>When you create an account with us, you must provide us information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms.</p>

                <h2>4. Intellectual Property</h2>
                <p>The Service and its original content, features, and functionality are and will remain the exclusive property of Ollabs and its licensors.</p>

                <h2>5. Termination</h2>
                <p>We may terminate or suspend access to our Service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.</p>

                <h2>6. Changes</h2>
                <p>We reserve the right, at our sole discretion, to modify or replace these Terms at any time.</p>

                <h2>7. Contact Us</h2>
                <p>If you have any questions about these Terms, please contact us.</p>
            </main>
        </div>
    );
}
