"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, KeyRound, Loader2, ArrowLeft, CheckCircle2 } from 'lucide-react';

type Step = 'email' | 'code' | 'done';

export const LoginClient: React.FC = () => {
    const router = useRouter();
    const [step, setStep] = useState<Step>('email');
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [claimed, setClaimed] = useState(0);

    const requestCode = async (e: React.FormEvent) => {
        e.preventDefault();
        if (busy) return;
        setBusy(true);
        setError(null);
        try {
            const res = await fetch('/api/auth/code', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });
            const data = await res.json().catch(() => ({}));
            if (!res.ok) {
                setError(data?.error || 'Something went wrong. Please try again.');
                return;
            }
            setCode('');
            setStep('code');
        } catch {
            setError('Could not reach the server. Please try again.');
        } finally {
            setBusy(false);
        }
    };

    const verify = async (e: React.FormEvent) => {
        e.preventDefault();
        if (busy) return;
        setBusy(true);
        setError(null);
        try {
            const res = await fetch('/api/auth/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, code }),
            });
            const data = await res.json().catch(() => ({}));
            if (!res.ok) {
                setError(data?.error || 'That code did not work.');
                return;
            }
            setClaimed(typeof data?.claimed === 'number' ? data.claimed : 0);
            setStep('done');
            // Let them read the confirmation for a beat before the list loads.
            setTimeout(() => {
                router.push('/mine');
                router.refresh();
            }, 1400);
        } catch {
            setError('Could not reach the server. Please try again.');
        } finally {
            setBusy(false);
        }
    };

    if (step === 'done') {
        return (
            <div className="max-w-md mx-auto bg-cream border border-ink/10 rounded-2xl p-8 text-center">
                <CheckCircle2 className="w-9 h-9 text-brand-deep mx-auto mb-3" />
                <p className="font-display font-bold text-lg mb-2">You&apos;re in</p>
                <p className="text-sm text-ink/70">
                    {claimed > 0
                        ? `${claimed} campaign${claimed === 1 ? '' : 's'} added to your account. Taking you there now.`
                        : 'Taking you to your campaigns now.'}
                </p>
            </div>
        );
    }

    if (step === 'code') {
        return (
            <form onSubmit={verify} className="max-w-md mx-auto bg-cream border border-ink/10 rounded-2xl p-8">
                <button
                    type="button"
                    onClick={() => { setStep('email'); setError(null); }}
                    className="text-xs font-bold text-muted hover:text-brand-deep flex items-center gap-1.5 mb-5 transition-colors"
                >
                    <ArrowLeft size={14} /> Use a different email
                </button>

                <p className="text-sm text-ink/70 mb-5">
                    Enter the 6 digit code sent to <span className="font-semibold text-ink">{email}</span>.
                </p>

                <label htmlFor="login-code" className="block text-xs font-bold uppercase tracking-wider text-muted mb-2">
                    Your code
                </label>
                <div className="relative mb-4">
                    <KeyRound className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                        id="login-code"
                        type="text"
                        required
                        autoFocus
                        inputMode="numeric"
                        autoComplete="one-time-code"
                        pattern="[0-9]{6}"
                        maxLength={6}
                        value={code}
                        onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                        placeholder="123456"
                        className="w-full h-12 pl-10 pr-4 rounded-xl border border-ink/15 bg-paper text-ink text-lg tracking-[0.4em] font-semibold placeholder:tracking-normal placeholder:font-normal placeholder:text-muted/70 focus:outline-none focus:ring-2 focus:ring-brand"
                    />
                </div>

                {error && <p className="text-sm text-red-600 mb-4">{error}</p>}

                <button
                    type="submit"
                    disabled={busy || code.length !== 6}
                    className="w-full h-12 rounded-xl bg-brand text-ink font-bold hover:brightness-105 transition-all disabled:opacity-60 flex items-center justify-center gap-2"
                >
                    {busy && <Loader2 className="w-4 h-4 animate-spin" />}
                    {busy ? 'Checking' : 'Sign in'}
                </button>

                <p className="text-xs text-muted mt-4 leading-relaxed">
                    The code expires in 10 minutes. Didn&apos;t get it? Check spam, or{' '}
                    <button type="button" onClick={requestCode} className="text-brand-deep font-semibold hover:underline">
                        send a new one
                    </button>.
                </p>
            </form>
        );
    }

    return (
        <form onSubmit={requestCode} className="max-w-md mx-auto bg-cream border border-ink/10 rounded-2xl p-8">
            <label htmlFor="login-email" className="block text-xs font-bold uppercase tracking-wider text-muted mb-2">
                Your email
            </label>
            <div className="relative mb-4">
                <Mail className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                    id="login-email"
                    type="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@organization.org"
                    className="w-full h-12 pl-10 pr-4 rounded-xl border border-ink/15 bg-paper text-ink placeholder:text-muted/70 focus:outline-none focus:ring-2 focus:ring-brand"
                />
            </div>

            {error && <p className="text-sm text-red-600 mb-4">{error}</p>}

            <button
                type="submit"
                disabled={busy}
                className="w-full h-12 rounded-xl bg-brand text-ink font-bold hover:brightness-105 transition-all disabled:opacity-60 flex items-center justify-center gap-2"
            >
                {busy && <Loader2 className="w-4 h-4 animate-spin" />}
                {busy ? 'Sending' : 'Email me a code'}
            </button>

            <p className="text-xs text-muted mt-4 leading-relaxed">
                No password to remember. You get a 6 digit code by email and type it back in here, which
                works even when you opened Ollabs from inside another app. Any campaign you created with
                this address gets added to your account automatically.
            </p>
        </form>
    );
};
