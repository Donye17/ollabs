// Transactional email for organizers.
//
// Deliberately dependency-free: this calls the Resend REST API with fetch
// rather than pulling in an SDK. If RESEND_API_KEY is not set the module
// no-ops and logs, so local development and preview deploys keep working
// without mail credentials instead of throwing on every campaign create.
//
// We only ever email ORGANIZERS. Supporters never give us an address and must
// never receive anything.

const FROM = process.env.EMAIL_FROM || 'Ollabs <hello@ollabs.studio>';
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

type SendArgs = { to: string; subject: string; html: string; text: string };

export async function sendEmail({ to, subject, html, text }: SendArgs): Promise<boolean> {
    if (!KEY) {
        console.warn(`[email] RESEND_API_KEY not set, skipping send to ${to}: ${subject}`);
        return false;
    }
    try {
        const res = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ from: FROM, to: [to], subject, html, text }),
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

function shell(body: string): string {
    return `<!doctype html><html><body style="margin:0;padding:0;background:#F7F4EE;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#F7F4EE;padding:32px 16px;">
<tr><td align="center">
<table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#ffffff;border-radius:16px;padding:32px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:#06141F;">
${body}
<tr><td style="padding-top:28px;border-top:1px solid #E8E3DA;color:#6B7280;font-size:12px;line-height:1.6;">
Ollabs is free, ad-free, and never watermarks your supporters' photos.<br>
You are getting this because you gave your email when creating a campaign. We only email campaign organizers.
</td></tr>
</table>
</td></tr></table></body></html>`;
}

function button(href: string, label: string): string {
    return `<a href="${href}" style="display:inline-block;background:#01BEF6;color:#06141F;font-weight:700;text-decoration:none;padding:13px 22px;border-radius:999px;">${label}</a>`;
}

// ------------------------------------------------------------- templates

export function campaignLiveEmail(opts: {
    title: string; slug: string; ownerToken: string;
}) {
    const url = `${SITE}/c/${opts.slug}`;
    const manage = `${SITE}/c/${opts.slug}/manage?k=${opts.ownerToken}`;
    const t = esc(opts.title);
    return {
        subject: `Your campaign "${opts.title}" is live`,
        text: [
            `Your campaign "${opts.title}" is live.`,
            ``,
            `Share this link with your supporters:`,
            url,
            ``,
            `Your private dashboard (keep this, it is the key to your campaign):`,
            manage,
            ``,
            `Supporters never need an account, never see an ad, and never get a watermark.`,
        ].join('\n'),
        html: shell(`
<tr><td style="font-size:22px;font-weight:800;padding-bottom:8px;">Your campaign is live</td></tr>
<tr><td style="font-size:15px;line-height:1.6;color:#374151;padding-bottom:20px;">
<strong>${t}</strong> is ready. Share the link below and supporters can add your frame to their profile picture in seconds, with no signup.
</td></tr>
<tr><td style="padding-bottom:8px;font-size:13px;font-weight:700;color:#6B7280;">SHARE THIS LINK</td></tr>
<tr><td style="padding-bottom:22px;"><a href="${url}" style="color:#0369A1;font-size:15px;">${url}</a></td></tr>
<tr><td style="padding-bottom:20px;">${button(manage, 'Open your dashboard')}</td></tr>
<tr><td style="font-size:13px;line-height:1.6;color:#6B7280;">
Keep this email. That dashboard link is the key to your campaign, and it is how you get back in if you switch devices or clear your browser.
</td></tr>`),
    };
}

export function milestoneEmail(opts: {
    title: string; slug: string; ownerToken: string; count: number; goal?: number | null;
}) {
    const manage = `${SITE}/c/${opts.slug}/manage?k=${opts.ownerToken}`;
    const url = `${SITE}/c/${opts.slug}`;
    const t = esc(opts.title);
    const hitGoal = opts.goal != null && opts.count >= opts.goal;
    const headline = hitGoal
        ? `You hit your goal: ${opts.count} supporters`
        : `${opts.count} people have joined ${opts.title}`;
    return {
        subject: hitGoal
            ? `"${opts.title}" hit its goal`
            : `${opts.count} supporters on "${opts.title}"`,
        text: [
            headline,
            ``,
            `Campaign: ${url}`,
            `Dashboard: ${manage}`,
        ].join('\n'),
        html: shell(`
<tr><td style="font-size:22px;font-weight:800;padding-bottom:8px;">${esc(headline)}</td></tr>
<tr><td style="font-size:15px;line-height:1.6;color:#374151;padding-bottom:22px;">
${hitGoal
                ? `<strong>${t}</strong> reached its supporter goal. Worth sharing the moment while it has momentum.`
                : `<strong>${t}</strong> is picking up. Momentum matters most in the first week, so this is a good time to reshare.`}
</td></tr>
<tr><td style="padding-bottom:20px;">${button(manage, 'See your numbers')}</td></tr>
<tr><td style="font-size:13px;line-height:1.6;color:#6B7280;">Share again: <a href="${url}" style="color:#0369A1;">${url}</a></td></tr>`),
    };
}

export function recoveryEmail(opts: { token: string; count: number }) {
    const link = `${SITE}/recover/${opts.token}`;
    return {
        subject: 'Your Ollabs campaigns',
        text: [
            `Here is the link back to your campaigns:`,
            link,
            ``,
            `It works once and expires in 24 hours.`,
            `If you did not ask for this, you can ignore it.`,
        ].join('\n'),
        html: shell(`
<tr><td style="font-size:22px;font-weight:800;padding-bottom:8px;">Your campaigns</td></tr>
<tr><td style="font-size:15px;line-height:1.6;color:#374151;padding-bottom:22px;">
We found ${opts.count} campaign${opts.count === 1 ? '' : 's'} for this email address. Use the link below to open ${opts.count === 1 ? 'it' : 'them'} and get back to your dashboards.
</td></tr>
<tr><td style="padding-bottom:20px;">${button(link, 'Open my campaigns')}</td></tr>
<tr><td style="font-size:13px;line-height:1.6;color:#6B7280;">
This link works once and expires in 24 hours. If you did not ask for it, you can ignore this email.
</td></tr>`),
    };
}

export function loginCodeEmail(opts: { code: string; minutes: number }) {
    const spaced = opts.code.split('').join(' ');
    return {
        subject: `${opts.code} is your Ollabs sign-in code`,
        text: [
            `Your Ollabs sign-in code is ${opts.code}`,
            ``,
            `Type it into the tab you already have open. It expires in ${opts.minutes} minutes.`,
            ``,
            `If you did not ask to sign in, you can ignore this email.`,
        ].join('\n'),
        html: shell(`
<tr><td style="font-size:22px;font-weight:800;padding-bottom:8px;">Your sign-in code</td></tr>
<tr><td style="font-size:15px;line-height:1.6;color:#374151;padding-bottom:20px;">
Type this back into the Ollabs tab you already have open.
</td></tr>
<tr><td style="padding-bottom:20px;">
<div style="background:#F7F4EE;border:1px solid #E8E3DA;border-radius:14px;padding:18px;text-align:center;font-size:30px;font-weight:800;letter-spacing:8px;font-family:'SFMono-Regular',Consolas,'Liberation Mono',Menlo,monospace;">${esc(spaced)}</div>
</td></tr>
<tr><td style="font-size:13px;line-height:1.6;color:#6B7280;">
It expires in ${opts.minutes} minutes and works once. If you did not ask to sign in, ignore this email and nothing happens.
</td></tr>`),
    };
}
