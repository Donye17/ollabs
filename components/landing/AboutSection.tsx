"use client";
import { motion } from "framer-motion";

export const AboutSection = () => {
    return (
        <section className="py-24 relative overflow-hidden">
            <div className="container px-4 mx-auto">
                <div className="max-w-4xl mx-auto text-center">
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="text-3xl md:text-4xl font-bold mb-8 text-white"
                    >
                        We are <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">Ollabs</span>.
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-lg text-white/70 leading-relaxed mb-12"
                    >
                        Born from the belief that creativity shouldn't be gated. We provide professional-grade design tools directly in your browser. No subscriptions, no complex software—just you and your ideas.
                    </motion.p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
                        {[
                            { title: "Open Source", desc: "Built by the community, for the community." },
                            { title: "Privacy First", desc: "Your data stays yours. No hidden tracking." },
                            { title: "High Performance", desc: "60fps canvas rendering on any device." }
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 + (i * 0.1) }}
                                className="p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm"
                            >
                                <h3 className="text-xl font-semibold mb-2 text-white">{item.title}</h3>
                                <p className="text-white/60">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};
