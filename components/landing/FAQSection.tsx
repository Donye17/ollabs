"use client";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { motion } from "framer-motion";

const faqs = [
    {
        question: "Is Ollabs free?",
        answer: "Yes, completely free. Create a campaign, share the link, and let supporters add your frame — no cost, no ads."
    },
    {
        question: "Do I need an account?",
        answer: "No. You can create a campaign and supporters can use it without signing up for anything."
    },
    {
        question: "Can I use my own design?",
        answer: "Yes. Upload your own transparent PNG frame with your logo, colors, or slogan, and it wraps every supporter's photo."
    },
    {
        question: "How do supporters add the frame?",
        answer: "They open your link, drop in a photo, adjust it, and download — in seconds, on any phone. No app to install."
    },
    {
        question: "Where can they post it?",
        answer: "Anywhere — Instagram, X, Discord, WhatsApp, LinkedIn, Facebook. It's just an image you download."
    }
]

export const FAQSection = () => {
    return (
        <section className="py-24 bg-black/20">
            <div className="container px-4 max-w-3xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <h2 className="text-3xl font-bold text-white mb-4">Frequently Asked Questions</h2>
                </motion.div>

                <Accordion type="single" collapsible className="w-full space-y-4">
                    {faqs.map((faq, i) => (
                        <AccordionItem key={i} value={`item-${i}`} className="border border-white/10 rounded-lg px-4 bg-white/5">
                            <AccordionTrigger className="text-white hover:text-blue-400 hover:no-underline text-left">
                                {faq.question}
                            </AccordionTrigger>
                            <AccordionContent className="text-white/70">
                                {faq.answer}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>
        </section>
    );
};
