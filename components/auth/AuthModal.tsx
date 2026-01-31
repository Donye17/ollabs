"use client";
import React, { useState } from 'react';
import { SignIn } from './SignIn';
import { SignUp } from './SignUp';
import { X } from 'lucide-react';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
    const [mode, setMode] = useState<'signin' | 'signup'>('signin');

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="relative w-full max-w-sm animate-in zoom-in-95 duration-200">
                <button
                    onClick={onClose}
                    className="absolute -top-12 right-0 p-2 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors"
                >
                    <X size={20} />
                </button>

                {mode === 'signin' ? (
                    <SignIn
                        onSuccess={onClose}
                        onSwitch={() => setMode('signup')}
                    />
                ) : (
                    <SignUp
                        onSuccess={onClose}
                        onSwitch={() => setMode('signin')}
                    />
                )}
            </div>
        </div>
    );
};
