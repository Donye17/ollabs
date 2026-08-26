"use client";
import React, { useState } from 'react';
import { Mail, CheckCircle2, Loader2 } from 'lucide-react';
import { track } from '@/lib/analytics';
import { ORGANIZER_PRIMARY_BTN } from '@/lib/mobileNav';

export const RecoverClient: React.FC = () => {
    const [email, setEmail] = useState('');
    const [state, setState] = useState<'idle' | 'sending' | 'sent'>('idle');
    const [error, setError] = useState<string | null>(null);

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (state === 'sending') return;
        setError(null);
        setState('sending');
        try {
            const res = await fetch('/api/recover', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });
            const data = await res.json().catch(() => ({}));
            if (!res.ok) {
                setError(data?.error || 'Something went wrong. Please try again.');
                setState('idle');
                return;
            }
            setState('sent');
            track('recover_requested');
        } catch {
            setError('Could not reach the server. Please try again.');
            setState('idle');
        }
    };

    if (state === 'sent') {
        return (
            <div className="max-w-md mx-auto bg-cream border border-ink/10 rounded-2xl p-8 text-center">
                <CheckCircle2 className="w-9 h-9 text-brand-deep mx-auto mb-3" />
                <p className="font-display font-bold text-lg mb-2">Check your email</p>
                <p className="text-sm text-ink/70">
                    If <span className="font-semibold">{email}</span> has campaigns, a link is on its way.
                    It works once and expires in 24 hours.
                </p>
            </div>
        );
    }

    return (
        <form onSubmit={submit} className="max-w-md mx-auto bg-cream border border-ink/10 rounded-2xl p-8">
            <label htmlFor="recover-email" className="block text-sm font-semibold text-ink mb-2">
                Your email
            </label>
            <div className="relative mb-4">
                <Mail className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                    id="recover-email"
                    type="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@organization.org"
                    className="w-full h-12 pl-10 pr-4 rounded-xl border border-ink/15 bg-paper text-ink placeholder:text-muted/70 focus:outline-none focus:ring-2 focus:ring-brand"
                />
            </div>
            {error && (
                <p role="alert" className="text-sm text-coral bg-coral/10 border border-coral/25 rounded-xl px-3 py-2.5 mb-4">
                    {error}
                </p>
            )}
            <button
                type="submit"
                disabled={state === 'sending'}
                className={`w-full flex items-center justify-center gap-2 px-4 ${ORGANIZER_PRIMARY_BTN}`}
            >
                {state === 'sending' && <Loader2 className="w-4 h-4 animate-spin" />}
                {state === 'sending' ? 'Sending' : 'Email me my campaigns'}
            </button>
            <p className="text-xs text-muted mt-4 leading-relaxed">
                Only works if you gave your email when you created the campaign. If you did not, the dashboard
                link from your browser history is the only way back in.
            </p>
        </form>
    );
};
