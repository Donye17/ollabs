"use client";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
    {
        question: "Is Ollabs free?",
        answer: "Yes, completely free. Create a campaign, share the link, and let supporters add your frame. No cost, and no watermark on the photo anyone downloads."
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
        answer: "They open your link, drop in a photo, adjust it, and download in seconds, on any phone. No app to install."
    },
    {
        question: "Where can they post it?",
        answer: "Anywhere: Instagram, X, Discord, WhatsApp, LinkedIn, Facebook. It's just an image you download."
    }
]

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
                    {faqs.map((faq, i) => (
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
