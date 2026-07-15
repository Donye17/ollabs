import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { NavBar } from "@/components/NavBar";
import { AboutSection } from "@/components/landing/AboutSection";
import { FAQSection } from "@/components/landing/FAQSection";

export const revalidate = 3600;

export default function Home() {
    return (
        <main className="min-h-screen bg-zinc-950 text-zinc-50 selection:bg-blue-500/30 relative">
            <NavBar />

            {/* Global Background Grid */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 px-6 overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-blue-500/20 blur-[120px] rounded-full mix-blend-screen pointer-events-none opacity-50" />
                <div className="absolute bottom-0 right-0 w-[800px] h-[600px] bg-violet-500/10 blur-[100px] rounded-full mix-blend-screen pointer-events-none opacity-30" />

                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <h1 className="text-5xl md:text-8xl font-bold tracking-tighter mb-6 text-white animate-slide-up select-none">
                        Rally your people, <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500">one link</span>
                    </h1>

                    <p className="text-lg md:text-xl text-zinc-400 mb-8 max-w-2xl mx-auto leading-relaxed animate-slide-up" style={{ animationDelay: '100ms' }}>
                        Create a profile-picture frame for your cause, team, or event. Share one link and supporters add it to their photo in seconds. No signup, no ads.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: '200ms' }}>
                        <Link
                            href="/create"
                            className="group h-12 px-8 rounded-full bg-gradient-to-r from-blue-600 to-violet-600 text-white font-bold flex items-center gap-2 hover:scale-105 transition-all shadow-lg shadow-blue-500/25"
                        >
                            Create a campaign
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </div>
            </section>

            {/* About Section */}
            <AboutSection />

            {/* FAQ Section */}
            <FAQSection />

            {/* Footer */}
            <footer className="border-t border-white/5 py-16 bg-zinc-950 relative z-10">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex flex-col md:flex-row items-start justify-between gap-12 mb-12">
                        <div className="max-w-xs">
                            <h4 className="text-2xl font-bold text-white mb-4">Ollabs</h4>
                            <p className="text-zinc-500 text-sm leading-relaxed">
                                The fast, ad-free way to run a profile-picture campaign. Built with privacy and performance in mind.
                            </p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-8 sm:gap-16">
                            <div>
                                <h5 className="font-bold text-white mb-4">Product</h5>
                                <ul className="space-y-2 text-sm text-zinc-500">
                                    <li><Link href="/create" className="hover:text-blue-400 transition-colors">Create a campaign</Link></li>
                                </ul>
                            </div>
                            <div>
                                <h5 className="font-bold text-white mb-4">Legal</h5>
                                <ul className="space-y-2 text-sm text-zinc-500">
                                    <li><Link href="/privacy" className="hover:text-blue-400 transition-colors">Privacy</Link></li>
                                    <li><Link href="/terms" className="hover:text-blue-400 transition-colors">Terms</Link></li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-zinc-600">
                        <p>© 2026 Ollabs. All rights reserved.</p>
                        <p>Made for the crowd.</p>
                    </div>
                </div>
            </footer>
        </main>
    );
}
