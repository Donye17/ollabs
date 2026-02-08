"use client";
import React from 'react';
import { User, Heart, Sparkles, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

const RECENT_ACTIVITY = [
    { id: 1, user: "Leo", action: "created", target: "Neon Dreams", icon: Sparkles, color: "text-blue-400" },
    { id: 2, user: "Sarah", action: "liked", target: "Cyberpunk V2", icon: Heart, color: "text-red-400" },
    { id: 3, user: "Ollie", action: "remixed", target: "Retro Wave", icon: Zap, color: "text-yellow-400" },
    { id: 4, user: "System", action: "verified", target: "Trending Creator", icon: User, color: "text-green-400" },
    { id: 5, user: "Alex", action: "published", target: "Minimal White", icon: Sparkles, color: "text-purple-400" },
    { id: 6, user: "Mia", action: "liked", target: "Glitch Effect", icon: Heart, color: "text-red-400" },
];

export const SocialTicker = () => {
    return (
        <div className="w-full bg-zinc-950/50 border-y border-white/5 py-3 overflow-hidden flex relative z-20 backdrop-blur-sm">
            <div className="flex animate-marquee whitespace-nowrap">
                {[...RECENT_ACTIVITY, ...RECENT_ACTIVITY, ...RECENT_ACTIVITY].map((item, i) => (
                    <div key={`${item.id}-${i}`} className="inline-flex items-center gap-2 mx-8 text-sm text-zinc-400">
                        <item.icon className={cn("w-4 h-4", item.color)} />
                        <span className="font-bold text-zinc-300">{item.user}</span>
                        <span>{item.action}</span>
                        <span className="text-zinc-500 font-medium">"{item.target}"</span>
                    </div>
                ))}
            </div>

            {/* Fade Edges */}
            <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-zinc-950 to-transparent pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-zinc-950 to-transparent pointer-events-none" />
        </div>
    );
};
