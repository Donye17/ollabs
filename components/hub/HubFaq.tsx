"use client";

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { HUB_FAQS, HUB_FAQS_PT } from "@/lib/faqs";

/** The three hub questions that used to sit on the homepage FAQ. */
export function HubFaq() {
    const { locale } = useLocale();
    const faqs = locale === "pt" ? HUB_FAQS_PT : HUB_FAQS;

    return (
        <section className="mx-auto max-w-lg px-5 pb-16 pt-6">
            <h2 className="mb-4 text-center font-display text-xl font-bold tracking-tight">
                {locale === "pt" ? "Sobre o hub" : "About your hub"}
            </h2>
            <Accordion type="single" collapsible className="w-full space-y-3">
                {faqs.map((faq) => (
                    <AccordionItem key={faq.question} value={faq.question} className="rounded-xl border border-ink/10 bg-cream px-5">
                        <AccordionTrigger className="text-left font-sans text-[15px] font-semibold text-ink hover:text-ink hover:no-underline">
                            {faq.question}
                        </AccordionTrigger>
                        <AccordionContent className="font-sans text-[15px] leading-relaxed text-ink/80">
                            {faq.answer}
                        </AccordionContent>
                    </AccordionItem>
                ))}
            </Accordion>
        </section>
    );
}
