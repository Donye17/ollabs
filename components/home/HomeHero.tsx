import { HomeLiveDemo } from '@/components/home/HomeLiveDemo';
import { PAGE_TOP_UNDER_NAV } from '@/lib/mobileNav';

/**
 * First viewport is the tool. Headline, one line, the frame, a live slug,
 * one field, one button. Colour rings and a second CTA live in /create.
 */
export function HomeHero() {
    return (
        <section className={`relative ${PAGE_TOP_UNDER_NAV} pb-8 px-5`}>
            <div className="max-w-[340px] mx-auto">
                <h1 className="font-display text-[29px] sm:text-4xl font-extrabold leading-[1.08] tracking-tight text-center text-balance mb-2.5">
                    Sua causa em <span className="text-brand">cada perfil</span>.
                </h1>
                <p className="text-sm text-muted leading-relaxed mb-[18px] text-left">
                    Um link. Menos de um minuto. Sem cadastro e sem marca d&apos;água para quem apoia.
                </p>
                <HomeLiveDemo />
            </div>
        </section>
    );
}
