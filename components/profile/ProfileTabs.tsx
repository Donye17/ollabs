
"use client";

import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { LayoutGrid, Heart, Library, PenTool } from 'lucide-react';

interface ProfileTabsProps {
    isOwner: boolean;
}

export function ProfileTabs({ isOwner }: ProfileTabsProps) {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    // Default to 'frames' if no tab or unrecognized
    const currentTab = searchParams.get('tab') || 'frames';

    const tabs = [
        { id: 'frames', label: 'Frames', icon: LayoutGrid },
        { id: 'liked', label: 'Liked', icon: Heart },
        { id: 'collections', label: 'Collections', icon: Library },
    ];

    if (isOwner) {
        tabs.push({ id: 'drafts', label: 'Drafts', icon: PenTool });
    }

    const handleTabChange = (tabId: string) => {
        const params = new URLSearchParams(searchParams);
        params.set('tab', tabId);
        router.push(`${pathname}?${params.toString()}`);
    };

    return (
        <div className="flex items-center gap-1 bg-slate-900/50 p-1 rounded-xl mb-8 overflow-x-auto">
            {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = currentTab === tab.id;
                return (
                    <button
                        key={tab.id}
                        onClick={() => handleTabChange(tab.id)}
                        className={cn(
                            "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap",
                            isActive
                                ? "bg-slate-800 text-white shadow-sm"
                                : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                        )}
                    >
                        <Icon size={16} />
                        {tab.label}
                    </button>
                );
            })}
        </div>
    );
}
