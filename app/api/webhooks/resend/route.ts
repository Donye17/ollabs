import { NextRequest, NextResponse } from 'next/server';
import { Webhook } from 'svix';
import { sendEmail } from '@/lib/email';

export const runtime = 'nodejs';

/**
 * Resend → Ollabs webhook.
 *
 * Verifies Svix signatures (RESEND_WEBHOOK_SECRET). Logs delivery problems.
 * For email.received, optionally forwards a copy to CONTACT_NOTIFY_EMAIL so
 * hello@ollabs.studio is usable without living only in the Resend UI.
 */

type ResendEvent = {
    type: string;
    data?: {
        email_id?: string;
        to?: string[] | string;
        from?: string;
        subject?: string;
        bounce?: { message?: string };
        [key: string]: unknown;
    };
};

export async function POST(req: NextRequest) {
    const secret = process.env.RESEND_WEBHOOK_SECRET;
    if (!secret) {
        console.error('[resend-webhook] RESEND_WEBHOOK_SECRET is not set');
        return NextResponse.json({ error: 'not configured' }, { status: 503 });
    }

    const payload = await req.text();
    const id = req.headers.get('svix-id');
    const timestamp = req.headers.get('svix-timestamp');
    const signature = req.headers.get('svix-signature');
    if (!id || !timestamp || !signature) {
        return NextResponse.json({ error: 'missing signature headers' }, { status: 400 });
    }

    let event: ResendEvent;
    try {
        const wh = new Webhook(secret);
        event = wh.verify(payload, {
            'svix-id': id,
            'svix-timestamp': timestamp,
            'svix-signature': signature,
        }) as ResendEvent;
    } catch (e) {
        console.warn('[resend-webhook] bad signature', e);
        return NextResponse.json({ error: 'invalid signature' }, { status: 400 });
    }

    try {
        await handleEvent(event);
    } catch (e) {
        // 200 so Resend does not retry forever on our processing bugs.
        console.error('[resend-webhook] handler error', event.type, e);
    }

    return NextResponse.json({ ok: true });
}

async function handleEvent(event: ResendEvent) {
    const data = event.data || {};
    const to = Array.isArray(data.to) ? data.to.join(', ') : data.to;

    switch (event.type) {
        case 'email.delivered':
            console.info('[resend-webhook] delivered', { to, subject: data.subject, id: data.email_id });
            break;

        case 'email.bounced':
            console.warn('[resend-webhook] bounced', {
                to,
                subject: data.subject,
                id: data.email_id,
                message: data.bounce?.message,
            });
            break;

        case 'email.complained':
            console.warn('[resend-webhook] complained', { to, subject: data.subject, id: data.email_id });
            break;

        case 'email.failed':
        case 'email.suppressed':
            console.warn(`[resend-webhook] ${event.type}`, { to, subject: data.subject, id: data.email_id });
            break;

        case 'email.received':
            await forwardInbound(data);
            break;

        default:
            console.info('[resend-webhook] ignored', event.type);
    }
}

async function forwardInbound(data: NonNullable<ResendEvent['data']>) {
    const notify = process.env.CONTACT_NOTIFY_EMAIL?.trim();
    const emailId = typeof data.email_id === 'string' ? data.email_id : null;
    const from = typeof data.from === 'string' ? data.from : 'unknown';
    const subject = typeof data.subject === 'string' ? data.subject : '(no subject)';
    const toRaw = data.to;
    const to = Array.isArray(toRaw) ? toRaw.join(', ') : typeof toRaw === 'string' ? toRaw : 'hello@ollabs.studio';

    console.info('[resend-webhook] received', { from, to, subject, emailId });

    if (!notify || !emailId || !process.env.RESEND_API_KEY) return;

    const res = await fetch(`https://api.resend.com/emails/receiving/${emailId}`, {
        headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}` },
    });
    if (!res.ok) {
        console.error('[resend-webhook] fetch received failed', res.status, await res.text().catch(() => ''));
        return;
    }
    const full = (await res.json()) as {
        text?: string | null;
        html?: string | null;
        subject?: string;
        from?: string;
    };

    const textBody =
        (full.text && full.text.trim()) ||
        '(No plain-text body. Open Resend → Emails → Receiving for the full message.)';
    const htmlBody =
        full.html ||
        `<pre style="white-space:pre-wrap;font-family:system-ui,sans-serif">${escapeHtml(textBody)}</pre>`;

    await sendEmail({
        to: notify,
        subject: `[Ollabs contact] ${full.subject || subject}`,
        text: [
            `New mail to ${to}`,
            `From: ${full.from || from}`,
            `Subject: ${full.subject || subject}`,
            ``,
            textBody,
            ``,
            `Resend received id: ${emailId}`,
        ].join('\n'),
        html: `
            <p style="font-family:system-ui,sans-serif;font-size:14px;color:#374151;">
              <strong>To:</strong> ${escapeHtml(to)}<br/>
              <strong>From:</strong> ${escapeHtml(full.from || from)}
            </p>
            <hr/>
            ${htmlBody}
            <p style="font-family:system-ui,sans-serif;font-size:12px;color:#6B7280;">
              Resend received id: ${escapeHtml(emailId)}
            </p>
        `,
        tag: 'contact_forward',
        replyTo: full.from || from,
    });
}

function escapeHtml(s: string): string {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
