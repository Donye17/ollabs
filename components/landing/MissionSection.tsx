"use client";
import { motion } from "framer-motion";

export const MissionSection = () => {
    return (
        <section className="py-12 bg-zinc-950/50">
            <div className="container px-4 text-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6 }}
                    viewport={{ once: true }}
                >
                    <h2 className="text-3xl md:text-5xl font-bold tracking-tighter text-white mb-4">
                        Design without <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500">Boundaries</span>
                    </h2>
                    <p className="max-w-2xl mx-auto text-lg text-zinc-400">
                        Ollabs gives you the power to create stunning visuals in seconds.
                    </p>
                </motion.div>
            </div>
        </section>
    );
};
