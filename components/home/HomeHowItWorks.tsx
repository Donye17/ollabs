import React from 'react';
import { ArrowRight } from 'lucide-react';

const flow = [
    { n: '1', title: 'Upload your frame', body: 'Your logo, colors, and slogan on a transparent PNG.' },
    { n: '2', title: 'Share one link', body: 'WhatsApp, Instagram, email. One URL for everyone.' },
    { n: '3', title: 'They save the photo', body: 'Drop in a picture, download it framed, counter goes up.' },
];

/** Product-led flow strip. No icon cards — the steps are the story. */
export function HomeHowItWorks() {
    return (
        <section className="px-6 py-16 sm:py-20 border-t border-ink/10">
            <div className="max-w-4xl mx-auto">
                <h2 className="font-display text-2xl sm:text-3xl font-bold text-center mb-10 sm:mb-12">How it works</h2>
                <ol className="grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr_auto_1fr] gap-6 sm:gap-4 items-start list-none">
                    {flow.map((step, i) => (
                        <React.Fragment key={step.n}>
                            <li className="text-left px-2">
                                <p className="text-sm font-semibold text-muted mb-1">{step.n}. {step.title}</p>
                                <p className="text-[15px] text-ink/70 leading-relaxed">{step.body}</p>
                            </li>
                            {i < flow.length - 1 && (
                                <li className="hidden sm:flex items-center justify-center pt-1 text-muted/40" aria-hidden>
                                    <ArrowRight size={18} />
                                </li>
                            )}
                        </React.Fragment>
                    ))}
                </ol>
            </div>
        </section>
    );
}
