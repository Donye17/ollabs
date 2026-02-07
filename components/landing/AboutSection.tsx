"use client";
import { motion } from "framer-motion";
import { Code, Shield, Zap } from "lucide-react";

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

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
                        {[
                            { title: "Open Source", desc: "Built by the community, for the community.", icon: Code },
                            { title: "Privacy First", desc: "Your data stays yours. No hidden tracking.", icon: Shield },
                            { title: "High Performance", desc: "60fps canvas rendering on any device.", icon: Zap }
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 + (i * 0.1) }}
                                viewport={{ once: true }}
                                className="group p-8 rounded-3xl bg-zinc-900/50 border border-white/5 hover:border-blue-500/30 hover:bg-zinc-900/80 transition-all duration-300 hover:-translate-y-1 relative overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-blue-500/10 group-hover:text-blue-400 transition-all text-zinc-400">
                                    <item.icon size={24} />
                                </div>
                                <h3 className="text-xl font-bold mb-3 text-white relative z-10">{item.title}</h3>
                                <p className="text-zinc-400 text-sm leading-relaxed relative z-10">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};
