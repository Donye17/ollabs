"use client";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { HOME_FAQS, HOME_FAQS_PT } from "@/lib/faqs";

export const FAQSection = () => {
    const { locale } = useLocale();
    const faqs = locale === "pt" ? HOME_FAQS_PT : HOME_FAQS;

    return (
        <section className="bg-paper py-16">
            <div className="max-w-lg mx-auto px-5">
                <div className="text-center mb-8">
                    <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-ink tracking-tight">
                        {locale === "pt" ? "Perguntas, respondidas" : "Questions, answered"}
                    </h2>
                </div>

                <Accordion type="single" collapsible className="w-full space-y-3">
                    {faqs.map((faq) => (
                        <AccordionItem key={faq.question} value={faq.question} className="border border-ink/10 rounded-xl px-5 bg-cream">
                            <AccordionTrigger className="text-ink hover:text-ink hover:no-underline text-left font-sans font-semibold text-[15px]">
                                {faq.question}
                            </AccordionTrigger>
                            <AccordionContent className="font-sans text-[15px] leading-relaxed text-ink/80">
                                {faq.answer}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>
        </section>
    );
};
