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
        question: "Is Ollabs free to use?",
        answer: "Yes! The core features of Ollabs are completely free. We believe in accessible design tools for everyone."
    },
    {
        question: "Do I own the designs I create?",
        answer: "Absolutely. You retain full ownership of any artwork or frames you create using our platform."
    },
    {
        question: "Can I use custom fonts?",
        answer: "Currently, we offer a curated selection of premium fonts. Custom font uploads are on our roadmap!"
    },
    {
        question: "How do I verify my profile?",
        answer: "Profile verification is currently by invitation or request. Active community members are prioritized."
    }
];

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
