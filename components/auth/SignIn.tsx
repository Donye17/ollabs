import React, { useState } from 'react';
import { authClient } from '../../lib/auth-client';
import { Loader2, AlertCircle } from 'lucide-react';

interface AuthProps {
    onSuccess: () => void;
    onSwitch: () => void;
}

export const SignIn: React.FC<AuthProps> = ({ onSuccess, onSwitch }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { data, error } = await authClient.signIn.email({
                email,
                password
            });

            if (error) {
                setError(error.message || 'Failed to sign in');
            } else {
                onSuccess();
            }
        } catch (e) {
            setError('An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-sm mx-auto p-6 bg-slate-900 rounded-xl border border-slate-800 shadow-xl">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">Welcome Back</h2>

            {error && (
                <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg flex items-center gap-2 text-red-500 text-sm">
                    <AlertCircle size={16} />
                    <span>{error}</span>
                </div>
            )}

            <div className="space-y-3 mb-6">
                <button
                    onClick={async () => {
                        console.log("Attempting Google Sign In...");
                        await authClient.signIn.social({
                            provider: 'google',
                            callbackURL: '/gallery'
                        })
                            .then(() => console.log("Google Sign In initiated"))
                            .catch(err => {
                                console.error("Google Error:", err);
                                alert("Google Login Error: " + err.message);
                            });
                    }}
                    className="w-full bg-white text-black hover:bg-gray-100 font-bold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                    <svg className="w-5 h-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" /></svg>
                    Continue with Google
                </button>
                <button
                    onClick={async () => {
                        console.log("Attempting Discord Sign In...");
                        await authClient.signIn.social({
                            provider: 'discord',
                            callbackURL: '/gallery'
                        })
                            .then(() => console.log("Discord Sign In initiated"))
                            .catch(err => {
                                console.error("Discord Error:", err);
                                alert("Discord Login Error: " + err.message);
                            });
                    }}
                    className="w-full bg-[#5865F2] hover:bg-[#4752C4] text-white font-bold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 127.14 96.36"><path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.11,77.11,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.89,105.89,0,0,0,126.6,80.22c1.24-23.28-3.28-47.25-18.9-72.15ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,46,96.12,53,91.08,65.69,84.69,65.69Z" /></svg>
                    Continue with Discord
                </button>
                <button
                    onClick={async () => {
                        console.log("Attempting Twitter Sign In...");
                        await authClient.signIn.social({
                            provider: 'twitter',
                            callbackURL: '/gallery'
                        })
                            .then(() => console.log("Twitter Sign In initiated"))
                            .catch(err => {
                                console.error("Twitter Error:", err);
                                alert("Twitter Login Error: " + err.message);
                            });
                    }}
                    className="w-full bg-black hover:bg-gray-800 text-white font-bold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
                    Continue with X
                </button>
            </div>

            <div className="relative mb-6">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-800"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-slate-900 text-slate-500">Or continue with email</span>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1">Email</label>
                    <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                        placeholder="you@example.com"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-400 mb-1">Password</label>
                    <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                        placeholder="••••••••"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? <Loader2 className="animate-spin" size={20} /> : 'Sign In'}
                </button>
            </form>

            <div className="mt-6 text-center text-sm text-slate-400">
                Don't have an account?{' '}
                <button onClick={onSwitch} className="text-blue-400 hover:text-blue-300 font-medium">
                    Sign Up
                </button>
            </div>
        </div>
    );
};
