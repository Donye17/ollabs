"use client";
import { motion } from "framer-motion";

export const MissionSection = () => {
    return (
        <section className="min-h-[60vh] flex items-center justify-center py-20 bg-black/50">
            <div className="container px-4 text-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8 }}
                >
                    <h2 className="text-5xl md:text-7xl font-bold tracking-tighter text-white mb-6">
                        Design without <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 animate-gradient">
                            Boundaries
                        </span>
                    </h2>
                    <p className="max-w-2xl mx-auto text-xl text-white/60">
                        Our mission is to democratize high-end design. Whether you're a pro or just starting, Ollabs gives you the power to create stunning visuals in seconds.
                    </p>
                </motion.div>
            </div>
        </section>
    );
};
