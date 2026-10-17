// Transactional email for organizers.
//
// Deliberately dependency-free: this calls the Resend REST API with fetch
// rather than pulling in an SDK. If RESEND_API_KEY is not set the module
// no-ops and logs, so local development and preview deploys keep working
// without mail credentials instead of throwing on every campaign create.
//
// We only ever email ORGANIZERS. Supporters never give us an address and must
// never receive anything.

import { organizerShareText, whatsappUrl } from '@/lib/share';
import { localeFromCampaignCountry } from '@/lib/i18n/locale';

export type MailLang = 'en' | 'pt';

/** Untagged campaigns default to Portuguese, same rule as the supporter page. */
export function campaignMailLang(country: string | null | undefined): MailLang {
    if (!country) return 'pt';
    return localeFromCampaignCountry(country) === 'pt' ? 'pt' : 'en';
}

const FROM = process.env.EMAIL_FROM || 'Ollabs <hello@ollabs.studio>';
/** Replies to organizer mail land in Resend Receiving once MX is verified. */
const REPLY_TO = process.env.EMAIL_REPLY_TO || 'hello@ollabs.studio';
const KEY = process.env.RESEND_API_KEY;

export const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'https://ollabs.studio';

export function isValidEmail(value: unknown): value is string {
    if (typeof value !== 'string') return false;
    const v = value.trim();
    if (v.length < 5 || v.length > 254) return false;
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
}

export function normalizeEmail(value: string): string {
    return value.trim().toLowerCase();
}

export type EmailTag =
    | 'campaign_live'
    | 'first_supporter'
    | 'zero_supporter'
    | 'milestone'
    | 'login_code'
    | 'recover'
    | 'contact_forward';

type SendArgs = {
    to: string;
    subject: string;
    html: string;
    text: string;
    /** Resend analytics tag; shows up on the email in the dashboard. */
    tag?: EmailTag;
    /** Override default Reply-To (hello@). */
    replyTo?: string | null;
};

export async function sendEmail({
    to,
    subject,
    html,
    text,
    tag,
    replyTo = REPLY_TO,
}: SendArgs): Promise<boolean> {
    if (!KEY) {
        console.warn(`[email] RESEND_API_KEY not set, skipping send to ${to}: ${subject}`);
        return false;
    }
    try {
        const body: Record<string, unknown> = {
            from: FROM,
            to: [to],
            subject,
            html,
            text,
        };
        if (replyTo) body.reply_to = replyTo;
        if (tag) body.tags = [{ name: 'type', value: tag }];

        const res = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });
        if (!res.ok) {
            console.error('[email] send failed', res.status, await res.text().catch(() => ''));
            return false;
        }
        return true;
    } catch (e) {
        console.error('[email] send threw', e);
        return false;
    }
}

// ------------------------------------------------------------------ shell

function esc(s: string): string {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function shell(body: string, lang: MailLang): string {
    const foot = lang === 'pt'
        ? `O Ollabs é grátis e nunca coloca marca d'água na foto de quem apoia.<br>Você recebe isto porque deixou seu e-mail ao criar uma campanha. Só escrevemos para quem organiza.`
        : `Ollabs is free and never watermarks your supporters' photos.<br>You are getting this because you gave your email when creating a campaign. We only email campaign organizers.`;
    return `<!doctype html><html lang="${lang === 'pt' ? 'pt-BR' : 'en'}"><body style="margin:0;padding:0;background:#F7F8F6;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#F7F8F6;padding:32px 16px;">
<tr><td align="center">
<table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#ffffff;border-radius:16px;padding:32px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:#06141F;">
<tr><td style="padding-bottom:20px;"><img src="https://ollabs.studio/favicon/apple-touch-icon.png" width="40" height="40" alt="Ollabs" style="display:block;border-radius:9px;" /></td></tr>
${body}
<tr><td style="padding-top:28px;border-top:1px solid #E8E3DA;color:#6B7280;font-size:12px;line-height:1.6;">
${foot}
</td></tr>
</table>
</td></tr></table></body></html>`;
}

function button(href: string, label: string): string {
    return `<a href="${href}" style="display:inline-block;background:#01BEF6;color:#06141F;font-weight:700;text-decoration:none;padding:13px 22px;border-radius:999px;">${label}</a>`;
}

/** Country name in the mail language. Parentheses in Portuguese avoid "de/do/da". */
function regionName(code: string | null | undefined, lang: MailLang): string | null {
    if (!code) return null;
    try {
        const name = new Intl.DisplayNames([lang === 'pt' ? 'pt-BR' : 'en'], { type: 'region' }).of(code.toUpperCase());
        return name || null;
    } catch {
        return null;
    }
}

// ------------------------------------------------------------- templates

export function campaignLiveEmail(opts: {
    title: string; slug: string; ownerToken: string; lang?: MailLang;
}) {
    const lang = opts.lang ?? 'pt';
    const url = `${SITE}/c/${opts.slug}`;
    const manage = `${SITE}/c/${opts.slug}/manage?k=${opts.ownerToken}`;
    const t = esc(opts.title);
    const pt = lang === 'pt';
    return {
        subject: pt ? `Sua campanha "${opts.title}" está no ar` : `Your campaign "${opts.title}" is live`,
        text: pt ? [
            `Sua campanha "${opts.title}" está no ar.`,
            ``,
            `Compartilhe este link com quem vai apoiar:`,
            url,
            ``,
            `Seu painel privado (guarde isto, é a chave da campanha):`,
            manage,
            ``,
            `Quem apoia não precisa de conta e a foto não leva marca d'água.`,
        ].join('\n') : [
            `Your campaign "${opts.title}" is live.`,
            ``,
            `Share this link with your supporters:`,
            url,
            ``,
            `Your private dashboard (keep this, it is the key to your campaign):`,
            manage,
            ``,
            `Supporters never need an account and never get a watermark.`,
        ].join('\n'),
        html: shell(pt ? `
<tr><td style="font-size:22px;font-weight:800;padding-bottom:8px;">Sua campanha está no ar</td></tr>
<tr><td style="font-size:15px;line-height:1.6;color:#374151;padding-bottom:20px;">
<strong>${t}</strong> está pronta. Compartilhe o link abaixo e as pessoas colocam a moldura na foto em segundos, sem cadastro.
</td></tr>
<tr><td style="padding-bottom:8px;font-size:13px;font-weight:700;color:#6B7280;">COMPARTILHE ESTE LINK</td></tr>
<tr><td style="padding-bottom:22px;"><a href="${url}" style="color:#0369A1;font-size:15px;">${url}</a></td></tr>
<tr><td style="padding-bottom:20px;">${button(manage, 'Abrir o painel')}</td></tr>
<tr><td style="font-size:13px;line-height:1.6;color:#6B7280;">
Guarde este e-mail. O link do painel é a chave da campanha, e é como você volta se trocar de aparelho ou limpar o navegador.
</td></tr>` : `
<tr><td style="font-size:22px;font-weight:800;padding-bottom:8px;">Your campaign is live</td></tr>
<tr><td style="font-size:15px;line-height:1.6;color:#374151;padding-bottom:20px;">
<strong>${t}</strong> is ready. Share the link below and supporters can add your frame to their profile picture in seconds, with no signup.
</td></tr>
<tr><td style="padding-bottom:8px;font-size:13px;font-weight:700;color:#6B7280;">SHARE THIS LINK</td></tr>
<tr><td style="padding-bottom:22px;"><a href="${url}" style="color:#0369A1;font-size:15px;">${url}</a></td></tr>
<tr><td style="padding-bottom:20px;">${button(manage, 'Open your dashboard')}</td></tr>
<tr><td style="font-size:13px;line-height:1.6;color:#6B7280;">
Keep this email. That dashboard link is the key to your campaign, and it is how you get back in if you switch devices or clear your browser.
</td></tr>`, lang),
    };
}

export function firstSupporterEmail(opts: {
    title: string;
    slug: string;
    ownerToken: string;
    country?: string | null;
    countryName?: string | null;
    lang?: MailLang;
}) {
    const lang = opts.lang ?? 'pt';
    const pt = lang === 'pt';
    const manage = `${SITE}/c/${opts.slug}/manage?k=${opts.ownerToken}`;
    const url = `${SITE}/c/${opts.slug}`;
    const whatsapp = whatsappUrl(organizerShareText(opts.title, lang), url);
    const t = esc(opts.title);
    const place = regionName(opts.country, lang) || opts.countryName || null;
    const where = place
        ? (pt ? ` (${esc(place)})` : ` from ${esc(place)}`)
        : '';
    const headline = pt ? `Seu primeiro apoio acabou de entrar${where}` : `Your first supporter just joined${where}`;
    return {
        subject: pt ? `Primeiro apoio em "${opts.title}"` : `First supporter on "${opts.title}"`,
        text: pt ? [
            headline,
            ``,
            `Alguém colocou a sua moldura. O que mais importa é a primeira hora, então este é um bom momento para compartilhar de novo.`,
            ``,
            `Compartilhar de novo no WhatsApp: ${whatsapp}`,
            ``,
            `Campanha: ${url}`,
            `Painel: ${manage}`,
        ].join('\n') : [
            headline,
            ``,
            `Someone added your frame. Momentum matters most in the first hour, so this is a good moment to share again.`,
            ``,
            `Share again on WhatsApp: ${whatsapp}`,
            ``,
            `Campaign: ${url}`,
            `Dashboard: ${manage}`,
        ].join('\n'),
        html: shell(pt ? `
<tr><td style="font-size:22px;font-weight:800;padding-bottom:8px;">${headline}</td></tr>
<tr><td style="font-size:15px;line-height:1.6;color:#374151;padding-bottom:22px;">
<strong>${t}</strong> recebeu o primeiro apoio. A maioria das campanhas ganha a primeira pessoa na primeira hora, então compartilhar de novo agora vale.
</td></tr>
<tr><td style="padding-bottom:12px;">${button(whatsapp, 'Compartilhar de novo no WhatsApp')}</td></tr>
<tr><td style="padding-bottom:20px;">${button(manage, 'Ver os números')}</td></tr>
<tr><td style="font-size:13px;line-height:1.6;color:#6B7280;">Compartilhar de novo: <a href="${url}" style="color:#0369A1;">${url}</a></td></tr>` : `
<tr><td style="font-size:22px;font-weight:800;padding-bottom:8px;">${headline}</td></tr>
<tr><td style="font-size:15px;line-height:1.6;color:#374151;padding-bottom:22px;">
<strong>${t}</strong> has its first supporter. Most campaigns get their first person in the first hour after publish, so a quick reshare now is worth it.
</td></tr>
<tr><td style="padding-bottom:12px;">${button(whatsapp, 'Share again on WhatsApp')}</td></tr>
<tr><td style="padding-bottom:20px;">${button(manage, 'See your numbers')}</td></tr>
<tr><td style="font-size:13px;line-height:1.6;color:#6B7280;">Share again: <a href="${url}" style="color:#0369A1;">${url}</a></td></tr>`, lang),
    };
}

/** Still zero supporters ~20 minutes after publish. Share now or it usually stays dead. */
export function zeroSupporterEmail(opts: {
    title: string;
    slug: string;
    ownerToken: string;
    lang?: MailLang;
}) {
    const lang = opts.lang ?? 'pt';
    const pt = lang === 'pt';
    const manage = `${SITE}/c/${opts.slug}/manage?k=${opts.ownerToken}`;
    const url = `${SITE}/c/${opts.slug}`;
    const whatsapp = whatsappUrl(organizerShareText(opts.title, lang), url);
    const t = esc(opts.title);
    return {
        subject: pt ? `Compartilhe "${opts.title}" antes da janela fechar` : `Share "${opts.title}" before the window closes`,
        text: pt ? [
            `Sua campanha "${opts.title}" está no ar, mas ainda ninguém entrou.`,
            ``,
            `A maioria das campanhas que ganham um apoio recebe o primeiro na primeira hora. Abra o WhatsApp e envie o link para um grupo agora.`,
            ``,
            `Compartilhar no WhatsApp: ${whatsapp}`,
            ``,
            `Campanha: ${url}`,
            `Painel: ${manage}`,
        ].join('\n') : [
            `Your campaign "${opts.title}" is live, but nobody has joined yet.`,
            ``,
            `Most campaigns that get a supporter get the first one within the first hour. Open WhatsApp and send the link to one group now.`,
            ``,
            `Share on WhatsApp: ${whatsapp}`,
            ``,
            `Campaign: ${url}`,
            `Dashboard: ${manage}`,
        ].join('\n'),
        html: shell(pt ? `
<tr><td style="font-size:22px;font-weight:800;padding-bottom:8px;">Compartilhe enquanto ainda está fresco</td></tr>
<tr><td style="font-size:15px;line-height:1.6;color:#374151;padding-bottom:22px;">
<strong>${t}</strong> está no ar e ainda sem apoiadores. As campanhas que decolam quase sempre recebem a primeira pessoa na primeira hora. Um grupo de WhatsApp basta para começar.
</td></tr>
<tr><td style="padding-bottom:12px;">${button(whatsapp, 'Compartilhar no WhatsApp')}</td></tr>
<tr><td style="padding-bottom:20px;">${button(manage, 'Abrir o painel')}</td></tr>
<tr><td style="font-size:13px;line-height:1.6;color:#6B7280;">Seu link: <a href="${url}" style="color:#0369A1;">${url}</a></td></tr>` : `
<tr><td style="font-size:22px;font-weight:800;padding-bottom:8px;">Share it while it is still fresh</td></tr>
<tr><td style="font-size:15px;line-height:1.6;color:#374151;padding-bottom:22px;">
<strong>${t}</strong> is live with zero supporters so far. Campaigns that take off almost always get their first person in the first hour. One WhatsApp group is enough to start.
</td></tr>
<tr><td style="padding-bottom:12px;">${button(whatsapp, 'Share on WhatsApp')}</td></tr>
<tr><td style="padding-bottom:20px;">${button(manage, 'Open your dashboard')}</td></tr>
<tr><td style="font-size:13px;line-height:1.6;color:#6B7280;">Your link: <a href="${url}" style="color:#0369A1;">${url}</a></td></tr>`, lang),
    };
}

export function milestoneEmail(opts: {
    title: string; slug: string; ownerToken: string; count: number; goal?: number | null; lang?: MailLang;
}) {
    const lang = opts.lang ?? 'pt';
    const pt = lang === 'pt';
    const manage = `${SITE}/c/${opts.slug}/manage?k=${opts.ownerToken}`;
    const url = `${SITE}/c/${opts.slug}`;
    const t = esc(opts.title);
    const n = opts.count.toLocaleString(pt ? 'pt-BR' : 'en-US');
    const hitGoal = opts.goal != null && opts.count >= opts.goal;
    const headline = hitGoal
        ? (pt ? `Você bateu a meta: ${n} apoiadores` : `You hit your goal: ${n} supporters`)
        : (pt ? `${n} pessoas entraram em ${opts.title}` : `${n} people have joined ${opts.title}`);
    return {
        subject: hitGoal
            ? (pt ? `"${opts.title}" bateu a meta` : `"${opts.title}" hit its goal`)
            : (pt ? `${n} apoiadores em "${opts.title}"` : `${n} supporters on "${opts.title}"`),
        text: [
            headline,
            ``,
            pt ? `Campanha: ${url}` : `Campaign: ${url}`,
            pt ? `Painel: ${manage}` : `Dashboard: ${manage}`,
        ].join('\n'),
        html: shell(`
<tr><td style="font-size:22px;font-weight:800;padding-bottom:8px;">${esc(headline)}</td></tr>
<tr><td style="font-size:15px;line-height:1.6;color:#374151;padding-bottom:22px;">
${hitGoal
                ? (pt
                    ? `<strong>${t}</strong> chegou na meta de apoiadores. Vale compartilhar agora, enquanto tem força.`
                    : `<strong>${t}</strong> reached its supporter goal. Worth sharing the moment while it has momentum.`)
                : (pt
                    ? `<strong>${t}</strong> está crescendo. O impulso importa mais na primeira semana, então este é um bom momento para compartilhar de novo.`
                    : `<strong>${t}</strong> is picking up. Momentum matters most in the first week, so this is a good time to reshare.`)}
</td></tr>
<tr><td style="padding-bottom:20px;">${button(manage, pt ? 'Ver os números' : 'See your numbers')}</td></tr>
<tr><td style="font-size:13px;line-height:1.6;color:#6B7280;">${pt ? 'Compartilhar de novo' : 'Share again'}: <a href="${url}" style="color:#0369A1;">${url}</a></td></tr>`, lang),
    };
}

export function recoveryEmail(opts: { token: string; count: number; lang?: MailLang }) {
    const lang = opts.lang ?? 'pt';
    const pt = lang === 'pt';
    const link = `${SITE}/recover/${opts.token}`;
    const noun = pt
        ? (opts.count === 1 ? 'campanha' : 'campanhas')
        : (opts.count === 1 ? 'campaign' : 'campaigns');
    return {
        subject: pt ? 'Suas campanhas no Ollabs' : 'Your Ollabs campaigns',
        text: pt ? [
            `Aqui está o link de volta para suas campanhas:`,
            link,
            ``,
            `Funciona uma vez e expira em 24 horas.`,
            `Se você não pediu isto, pode ignorar.`,
        ].join('\n') : [
            `Here is the link back to your campaigns:`,
            link,
            ``,
            `It works once and expires in 24 hours.`,
            `If you did not ask for this, you can ignore it.`,
        ].join('\n'),
        html: shell(pt ? `
<tr><td style="font-size:22px;font-weight:800;padding-bottom:8px;">Suas campanhas</td></tr>
<tr><td style="font-size:15px;line-height:1.6;color:#374151;padding-bottom:22px;">
Encontramos ${opts.count} ${noun} neste e-mail. Use o link abaixo para abrir e voltar aos painéis.
</td></tr>
<tr><td style="padding-bottom:20px;">${button(link, 'Abrir minhas campanhas')}</td></tr>
<tr><td style="font-size:13px;line-height:1.6;color:#6B7280;">
Este link funciona uma vez e expira em 24 horas. Se você não pediu, ignore este e-mail.
</td></tr>` : `
<tr><td style="font-size:22px;font-weight:800;padding-bottom:8px;">Your campaigns</td></tr>
<tr><td style="font-size:15px;line-height:1.6;color:#374151;padding-bottom:22px;">
We found ${opts.count} ${noun} for this email address. Use the link below to open ${opts.count === 1 ? 'it' : 'them'} and get back to your dashboards.
</td></tr>
<tr><td style="padding-bottom:20px;">${button(link, 'Open my campaigns')}</td></tr>
<tr><td style="font-size:13px;line-height:1.6;color:#6B7280;">
This link works once and expires in 24 hours. If you did not ask for it, you can ignore this email.
</td></tr>`, lang),
    };
}

export function loginCodeEmail(opts: { code: string; minutes: number; lang?: MailLang }) {
    const lang = opts.lang ?? 'pt';
    const pt = lang === 'pt';
    const spaced = opts.code.split('').join(' ');
    return {
        subject: pt ? `${opts.code} é seu código do Ollabs` : `${opts.code} is your Ollabs sign-in code`,
        text: pt ? [
            `Seu código de entrada no Ollabs é ${opts.code}`,
            ``,
            `Digite na aba que já está aberta. Expira em ${opts.minutes} minutos.`,
            ``,
            `Se você não pediu para entrar, pode ignorar este e-mail.`,
        ].join('\n') : [
            `Your Ollabs sign-in code is ${opts.code}`,
            ``,
            `Type it into the tab you already have open. It expires in ${opts.minutes} minutes.`,
            ``,
            `If you did not ask to sign in, you can ignore this email.`,
        ].join('\n'),
        html: shell(pt ? `
<tr><td style="font-size:22px;font-weight:800;padding-bottom:8px;">Seu código de entrada</td></tr>
<tr><td style="font-size:15px;line-height:1.6;color:#374151;padding-bottom:20px;">
Digite isto na aba do Ollabs que já está aberta.
</td></tr>
<tr><td style="padding-bottom:20px;">
<div style="background:#F7F4EE;border:1px solid #E8E3DA;border-radius:14px;padding:18px;text-align:center;font-size:30px;font-weight:800;letter-spacing:8px;font-family:'SFMono-Regular',Consolas,'Liberation Mono',Menlo,monospace;">${esc(spaced)}</div>
</td></tr>
<tr><td style="font-size:13px;line-height:1.6;color:#6B7280;">
Expira em ${opts.minutes} minutos e funciona uma vez. Se você não pediu para entrar, ignore este e-mail e nada acontece.
</td></tr>` : `
<tr><td style="font-size:22px;font-weight:800;padding-bottom:8px;">Your sign-in code</td></tr>
<tr><td style="font-size:15px;line-height:1.6;color:#374151;padding-bottom:20px;">
Type this back into the Ollabs tab you already have open.
</td></tr>
<tr><td style="padding-bottom:20px;">
<div style="background:#F7F4EE;border:1px solid #E8E3DA;border-radius:14px;padding:18px;text-align:center;font-size:30px;font-weight:800;letter-spacing:8px;font-family:'SFMono-Regular',Consolas,'Liberation Mono',Menlo,monospace;">${esc(spaced)}</div>
</td></tr>
<tr><td style="font-size:13px;line-height:1.6;color:#6B7280;">
It expires in ${opts.minutes} minutes and works once. If you did not ask to sign in, ignore this email and nothing happens.
</td></tr>`, lang),
    };
}
