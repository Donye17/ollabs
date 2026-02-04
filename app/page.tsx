"use client";

import { Gallery } from "@/components/Gallery";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { NavBar } from "@/components/NavBar";

export default function Home() {
    const router = useRouter();

    const handleSelectFrame = (frameConfig: any, frameId: string) => {
        // Navigate to create page with this frame config
        router.push(`/create?id=${frameId}`);
    };

    return (
        <main className="min-h-screen bg-zinc-950 text-zinc-50 selection:bg-blue-500/30">
            <NavBar />

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 px-6 overflow-hidden">
                {/* Background Gradients */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-blue-500/20 blur-[120px] rounded-full mix-blend-screen pointer-events-none opacity-50" />
                <div className="absolute bottom-0 right-0 w-[800px] h-[600px] bg-violet-500/10 blur-[100px] rounded-full mix-blend-screen pointer-events-none opacity-30" />

                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <div className="inline-flex items-center gap-2 bg-zinc-900/50 border border-white/10 px-4 py-1.5 rounded-full mb-8 backdrop-blur-md animate-fade-in">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                        <span className="text-xs font-medium text-zinc-300">v2.0 Now Available</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-zinc-500 animate-slide-up">
                        Design Avatar Frames <br /> Like a Pro.
                    </h1>

                    <p className="text-lg md:text-xl text-zinc-400 mb-10 max-w-2xl mx-auto leading-relaxed animate-slide-up" style={{ animationDelay: '100ms' }}>
                        The easiest way to create, customize, and share professional avatar frames.
                        Join thousands of creators making their mark.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: '200ms' }}>
                        <Link
                            href="/create"
                            className="group h-12 px-8 rounded-full bg-gradient-to-r from-blue-600 to-violet-600 text-white font-bold flex items-center gap-2 hover:scale-105 transition-all shadow-lg shadow-blue-500/25"
                        >
                            Start Creating
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link
                            href="/gallery"
                            className="h-12 px-8 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300 font-medium flex items-center border-white/5 hover:bg-zinc-800 hover:text-white transition-all backdrop-blur-sm"
                        >
                            View Gallery
                        </Link>
                    </div>
                </div>
            </section>

            {/* Gallery Section */}
            <section className="px-6 py-20 border-t border-white/5 bg-zinc-900/20 backdrop-blur-sm">
                <div className="max-w-7xl mx-auto">
                    <Gallery onSelectFrame={handleSelectFrame} />
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-white/5 py-12 bg-zinc-950">
                <div className="max-w-7xl mx-auto px-6 text-center text-zinc-500 text-sm">
                    <p>© 2026 Ollabs. All rights reserved.</p>
                </div>
            </footer>
        </main>
    );
}
