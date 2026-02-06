'use client';

import { useState } from 'react';
import { BadgeCheck, Loader2 } from 'lucide-react';
import { toggleVerification } from './actions';

interface VerificationToggleProps {
    userId: string;
    isVerified: boolean;
}

export function VerificationToggle({ userId, isVerified }: VerificationToggleProps) {
    const [loading, setLoading] = useState(false);

    const handleToggle = async () => {
        if (confirm(`Are you sure you want to ${isVerified ? 'remove' : 'grant'} verification for this user?`)) {
            setLoading(true);
            try {
                await toggleVerification(userId, isVerified);
            } catch (e) {
                alert("Failed to update verification status");
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <button
            onClick={handleToggle}
            disabled={loading}
            className={`p-1.5 rounded-lg transition-colors ${isVerified
                    ? 'text-blue-400 bg-blue-500/10 hover:bg-blue-500/20'
                    : 'text-slate-600 hover:text-slate-400 hover:bg-white/5'
                }`}
            title={isVerified ? "Verified (Click to revoke)" : "Not Verified (Click to verify)"}
        >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <BadgeCheck size={16} />}
        </button>
    );
}
