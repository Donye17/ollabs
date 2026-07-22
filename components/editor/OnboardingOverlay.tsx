import React, { useState, useEffect } from 'react';
import { X, ArrowDown } from 'lucide-react';

export const OnboardingOverlay: React.FC = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Check if user has seen onboarding
        const hasSeen = localStorage.getItem('ollabs_onboarding_seen');
        if (!hasSeen) {
            // Show after a short delay
            const timer = setTimeout(() => setIsVisible(true), 1000);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleDismiss = () => {
        setIsVisible(false);
        localStorage.setItem('ollabs_onboarding_seen', 'true');
    };

    if (!isVisible) return null;

    return (
        <div className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center">
            {/* Backdrop with hole punch effect (simulated via multiple divs or just a dark overlay with transparency) */}
            {/* For simplicity, we just use a floating card near the center/upload area */}

            <div className="absolute inset-0 bg-ink/40 pointer-events-auto transition-opacity duration-500" onClick={handleDismiss} />

            <div className="relative pointer-events-auto bg-white text-ink p-6 rounded-2xl shadow-2xl max-w-sm mx-4 animate-in slide-in-from-bottom-10 zoom-in-95 duration-300">
                <button
                    onClick={handleDismiss}
                    className="absolute top-2 right-2 text-muted hover:text-ink p-1 rounded-full hover:bg-paper2 transition-colors"
                >
                    <X size={20} />
                </button>

                <h3 className="text-xl font-bold font-heading mb-2">Welcome to the Studio! 🎨</h3>
                <p className="text-muted mb-6 leading-relaxed">
                    Start by uploading your pfp or choosing a base frame.
                    Then add stickers, text, and motion effects to make it pop!
                </p>

                <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-3 text-sm font-medium text-ink/80">
                        <span className="w-6 h-6 rounded-full bg-brand/15 text-brand-deep flex items-center justify-center text-xs font-bold">1</span>
                        Upload a photo
                    </div>
                    <div className="flex items-center gap-3 text-sm font-medium text-ink/80">
                        <span className="w-6 h-6 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center text-xs font-bold">2</span>
                        Customize your frame
                    </div>
                    <div className="flex items-center gap-3 text-sm font-medium text-ink/80">
                        <span className="w-6 h-6 rounded-full bg-pink-100 text-pink-600 flex items-center justify-center text-xs font-bold">3</span>
                        Export as GIF/PNG
                    </div>
                </div>

                <button
                    onClick={handleDismiss}
                    className="mt-6 w-full bg-cream text-ink font-bold py-3 rounded-xl hover:bg-cream transition-colors shadow-lg shadow-slate-900/20"
                >
                    Let's Create!
                </button>
            </div>
        </div>
    );
};
