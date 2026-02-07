"use client";

import { Gallery } from "@/components/Gallery";
import { useRouter } from "next/navigation";
import { FrameConfig } from "@/lib/types";
import { PublishedFrame } from "./FrameCard";

interface HomeClientProps {
    initialFrames: PublishedFrame[];
    initialTrendingFrames: PublishedFrame[];
    viewMode?: 'full' | 'trending-only';
}

export function HomeClient({ initialFrames, initialTrendingFrames, viewMode = 'full' }: HomeClientProps) {
    const router = useRouter();

    const handleSelectFrame = (frameConfig: FrameConfig, frameId: string) => {
        // Navigate to create page with this frame config
        router.push(`/create?id=${frameId}`);
    };

    return (
        <Gallery
            onSelectFrame={handleSelectFrame}
            initialFrames={initialFrames}
            initialTrendingFrames={initialTrendingFrames}
            viewMode={viewMode}
        />
    );
}
