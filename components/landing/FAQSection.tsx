"use client";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { HOME_FAQS } from "@/lib/faqs";

export const FAQSection = () => {
    return (
        <section className="py-24 bg-paper2/50">
            <div className="container px-4 max-w-3xl mx-auto">
                {/* Was a framer-motion whileInView fade. The library was 130KB of the
                    homepage bundle to animate one heading, and the Tailwind keyframes
                    below already existed. This plays on mount rather than on scroll,
                    which is what it looked like anyway at this position in the page. */}
                <div className="text-center mb-12 animate-slide-up">
                    <h2 className="font-display text-3xl md:text-4xl font-extrabold text-ink mb-4">Questions, answered</h2>
                </div>

                <Accordion type="single" collapsible className="w-full space-y-4">
                    {HOME_FAQS.map((faq, i) => (
                        <AccordionItem key={i} value={`item-${i}`} className="border border-ink/10 rounded-xl px-5 bg-cream">
                            <AccordionTrigger className="text-ink hover:text-brand-deep hover:no-underline text-left font-semibold">
                                {faq.question}
                            </AccordionTrigger>
                            <AccordionContent className="text-ink/70">
                                {faq.answer}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>
        </section>
    );
};
