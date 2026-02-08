"use client";
import React, { useState } from 'react';
import { authClient } from '@/lib/auth-client';
import { Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface User {
    id: string;
    name: string;
    email: string;
    image?: string | null;
    username?: string;
}

export const OnboardingModal: React.FC<{ isOpen: boolean; onClose?: () => void }> = ({ isOpen, onClose }) => {
    const { data: session } = authClient.useSession();
    const user = session?.user as User | undefined;
    const router = useRouter();
    const [username, setUsername] = useState('');
    const [isChecking, setIsChecking] = useState(false);
    const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    if (!isOpen || !user) return null;

    // Determine initials for avatar fallback
    const initials = user.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);

    const checkAvailability = async (value: string) => {
        if (value.length < 3) {
            setIsAvailable(null);
            return;
        }
        setIsChecking(true);
        // Simulate check (In real app, add an API endpoint)
        // For now, we'll just optimistically assume it's available unless it's "admin"
        await new Promise(resolve => setTimeout(resolve, 500));
        setIsAvailable(value.toLowerCase() !== 'admin');
        setIsChecking(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!username || !isAvailable) return;

        setIsSubmitting(true);
        try {
            // @ts-ignore
            const payload: any = { username: username };
            await authClient.updateUser(payload);
            onClose?.();
            router.refresh();
        } catch (err) {
            setError('Failed to update username. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-zinc-900 border border-white/10 rounded-3xl w-full max-w-md p-8 shadow-2xl relative overflow-hidden">
                {/* Background Decor */}
                <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-blue-600/20 to-transparent pointer-events-none" />

                <div className="relative z-10 text-center">
                    <div className="w-20 h-20 bg-zinc-800 rounded-full mx-auto mb-6 flex items-center justify-center text-3xl font-bold text-zinc-500 border-4 border-zinc-900 shadow-xl">
                        {user.image ? (
                            <img src={user.image} alt={user.name} className="w-full h-full object-cover rounded-full" />
                        ) : (
                            initials
                        )}
                    </div>

                    <h2 className="text-2xl font-bold text-white mb-2">Welcome, {user.name.split(' ')[0]}!</h2>
                    <p className="text-zinc-400 text-sm mb-8">Choose a unique username to claim your profile URL.</p>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-4 flex items-center text-zinc-500 font-bold select-none">
                                @
                            </div>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => {
                                    const val = e.target.value.replace(/[^a-zA-Z0-9_]/g, '').toLowerCase();
                                    setUsername(val);
                                    checkAvailability(val);
                                }}
                                placeholder="username"
                                className="w-full bg-zinc-950/50 border border-white/10 rounded-xl py-4 pl-10 pr-12 text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-bold text-lg"
                                minLength={3}
                                maxLength={20}
                                required
                            />
                            <div className="absolute inset-y-0 right-4 flex items-center">
                                {isChecking ? (
                                    <Loader2 className="w-5 h-5 text-zinc-500 animate-spin" />
                                ) : isAvailable === true ? (
                                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                                ) : isAvailable === false ? (
                                    <XCircle className="w-5 h-5 text-red-500" />
                                ) : null}
                            </div>
                        </div>

                        {error && <p className="text-red-400 text-xs">{error}</p>}

                        <button
                            type="submit"
                            disabled={!isAvailable || isSubmitting}
                            className="w-full py-4 bg-white hover:bg-zinc-200 text-zinc-950 rounded-xl font-bold text-lg shadow-lg shadow-white/5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? <Loader2 className="w-6 h-6 animate-spin mx-auto" /> : 'Claim Username'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};
