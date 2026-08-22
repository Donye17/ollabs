"use client";
import React, { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { X, Check, Loader2, Copy, ExternalLink, Rocket, ShieldCheck, QrCode, UserPlus, KeyRound, Pencil, Save, Share2, LayoutGrid } from 'lucide-react';
import { FrameConfig } from '@/lib/types';
import { upload } from '@vercel/blob/client';
import { FramePreview } from './FramePreview';
import { QRCode } from './QRCode';
import { WhatsAppGlyph, WHATSAPP_GREEN } from './ShareGlyphs';
import { track, withUtm } from '@/lib/analytics';
import { organizerShareText, whatsappUrl, messengerShareUrl, prefersTagalog } from '@/lib/share';
import { suggestHandleFromEmail } from '@/lib/hub';
import { useLocale } from '@/components/i18n/LocaleProvider';

interface EditTarget {
    slug: string;
    token: string;
    title: string;
}

interface PublishTemplateModalProps {
    isOpen: boolean;
    onClose: () => void;
    config: FrameConfig;
    previewDataUrl: string | null;
    parentId?: string;
    /** When set, saving updates this campaign's frame instead of creating one. */
    editTarget?: EditTarget | null;
}

// Steps for the inline account panel that appears after a campaign publishes.
// Deliberately part of creating the campaign rather than a cleanup task later:
// the account is how the organizer keeps the campaign, so it belongs here.
type AccountStep = 'offer' | 'sending' | 'code' | 'verifying' | 'saved';

export const PublishTemplateModal: React.FC<PublishTemplateModalProps> = ({ isOpen, onClose, config, previewDataUrl, editTarget }) => {
    const { messages, locale } = useLocale();
    const tp = messages.publish;
    // Set when the builder was opened from a /day page, so the campaign can be
    // attributed to that day rather than guessed at by category.
    const [daySlug, setDaySlug] = useState<string | null>(null);
    const [referrerSlug, setReferrerSlug] = useState<string | null>(null);
    useEffect(() => {
        try {
            const params = new URLSearchParams(window.location.search);
            const d = params.get('day');
            const from = params.get('from');
            if (d) setDaySlug(d);
            if (from) setReferrerSlug(from);
        } catch { /* ignore */ }
    }, []);

    // Whether an organizer is already signed in. Null means not checked yet.
    // When they are, the campaign attaches to their account server side and the
    // whole account panel disappears, because there is nothing left to ask.
    const [sessionEmail, setSessionEmail] = useState<string | null>(null);
    const [hubHandle, setHubHandle] = useState<string | null>(null);
    useEffect(() => {
        if (!isOpen) return;
        let cancelled = false;
        fetch('/api/auth/me')
            .then((r) => (r.ok ? r.json() : null))
            .then((d) => { if (!cancelled && d?.email) setSessionEmail(d.email); })
            .catch(() => { /* signed out, which is the normal case */ });
        fetch('/api/organizer/hub')
            .then((r) => (r.ok ? r.json() : null))
            .then((d) => { if (!cancelled && d?.handle) setHubHandle(d.handle); })
            .catch(() => { /* no hub yet */ });
        return () => { cancelled = true; };
    }, [isOpen]);

    const [title, setTitle] = useState('');
    const [organizerEmail, setOrganizerEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    // Shown above the button that failed. An alert() here was particularly bad:
    // it sits on top of a form the organizer has just filled in, and on a phone
    // it can be dismissed by a stray tap before it is read.
    const [createError, setCreateError] = useState<string | null>(null);
    const [campaignUrl, setCampaignUrl] = useState<string | null>(null);
    const [manageUrl, setManageUrl] = useState<string | null>(null);
    const [ownerToken, setOwnerToken] = useState<string | null>(null);
    const [campaignSlug, setCampaignSlug] = useState<string | null>(null);
    const [copied, setCopied] = useState(false);
    const [manageCopied, setManageCopied] = useState(false);
    const [showQR, setShowQR] = useState(false);

    // Whether the OS share sheet is available. Checked in an effect rather than
    // read during render so the server and the first client render agree.
    const [canNativeShare, setCanNativeShare] = useState(false);
    useEffect(() => {
        setCanNativeShare(typeof navigator !== 'undefined' && typeof navigator.share === 'function');
    }, []);

    // Inline account creation
    const [accountStep, setAccountStep] = useState<AccountStep>('offer');
    const [accountEmail, setAccountEmail] = useState('');
    const [accountCode, setAccountCode] = useState('');
    const [accountError, setAccountError] = useState<string | null>(null);
    // Closing after publish without saving access is how organizers lose
    // campaigns inside WhatsApp's in-app browser. Account login or copying the
    // manage link clears this; Skip is explicit, not accidental.
    const [linkSaved, setLinkSaved] = useState(false);
    const [closeBlocked, setCloseBlocked] = useState(false);
    const [shareFired, setShareFired] = useState(false);
    const [shareNudgeShown, setShareNudgeShown] = useState(false);
    const [showShareNudge, setShowShareNudge] = useState(false);

    useEffect(() => {
        if (!campaignUrl || shareFired || shareNudgeShown) return;
        const timer = window.setTimeout(() => {
            setShareNudgeShown(true);
            setShowShareNudge(true);
        }, 30_000);
        return () => window.clearTimeout(timer);
    }, [campaignUrl, shareFired, shareNudgeShown]);

    // Editing an existing campaign's frame
    const [savingFrame, setSavingFrame] = useState(false);
    const [frameSaved, setFrameSaved] = useState(false);
    const [frameError, setFrameError] = useState<string | null>(null);

    const saveFrame = async () => {
        if (!editTarget || savingFrame) return;
        setSavingFrame(true);
        setFrameError(null);
        try {
            // Only refresh the stored thumbnail when a new one was actually
            // rendered. Editing the frame without dropping a photo in leaves the
            // old preview alone rather than blanking it.
            let previewUrl: string | null = null;
            if (previewDataUrl) {
                try {
                    const blob = await (await fetch(previewDataUrl)).blob();
                    const uploaded = await upload(`preview-${Date.now()}.png`, blob, { access: 'public', handleUploadUrl: '/api/upload' });
                    previewUrl = uploaded.url;
                } catch (e) {
                    console.error('preview upload failed', e);
                }
            }

            const payload: Record<string, unknown> = { token: editTarget.token, frameConfig: config };
            if (previewUrl) payload.previewUrl = previewUrl;

            const res = await fetch(`/api/campaigns/${editTarget.slug}/manage`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });
            const data = await res.json().catch(() => ({}));
            if (!res.ok) {
                setFrameError(data?.error || 'Could not save your frame. Try again.');
                return;
            }
            track('frame_updated', { campaign: editTarget.slug });
            setFrameSaved(true);
        } catch {
            setFrameError('Could not reach the server. Try again.');
        } finally {
            setSavingFrame(false);
        }
    };

    const resetForm = useCallback(() => {
        setTitle('');
        setOrganizerEmail('');
        setCampaignUrl(null);
        setManageUrl(null);
        setOwnerToken(null);
        setCampaignSlug(null);
        setShowQR(false);
        setAccountStep('offer');
        setAccountEmail('');
        setAccountCode('');
        setAccountError(null);
        setCreateError(null);
        setFrameError(null);
        setFrameSaved(false);
        setLinkSaved(false);
        setCloseBlocked(false);
        setShareFired(false);
        setShareNudgeShown(false);
        setShowShareNudge(false);
    }, []);

    const handleClose = useCallback(() => {
        // A single soft interception catches the highest-risk exit: closing the
        // success screen before sending the link anywhere. It never traps them;
        // "Not now" below continues the normal close path.
        if (campaignUrl && !shareFired && !shareNudgeShown) {
            setShareNudgeShown(true);
            setShowShareNudge(true);
            return;
        }
        // After a successful create, refuse a silent dismiss until they have a
        // way back in — account, or an acknowledged manage-link save.
        if (campaignUrl && !sessionEmail && !linkSaved) {
            setCloseBlocked(true);
            return;
        }
        onClose();
        resetForm();
    }, [onClose, resetForm, campaignUrl, sessionEmail, linkSaved, shareFired, shareNudgeShown]);

    /**
     * Escape closes the modal, and the page behind it stays where it was.
     *
     * Both of these were mobile problems. Without the scroll lock, a scroll
     * inside the modal handed off to the builder underneath the moment it hit
     * the end of the panel, so closing dropped the organizer somewhere else in
     * the page than where they opened it — on a phone, usually the bottom.
     * Pinning the body and restoring the offset on close keeps their place.
     */
    useEffect(() => {
        if (!isOpen) return;

        const onKeyDown = (e: KeyboardEvent) => { if (e.key === 'Escape') handleClose(); };
        document.addEventListener('keydown', onKeyDown);

        const body = document.body;
        const scrollY = window.scrollY;
        const prev = {
            position: body.style.position,
            top: body.style.top,
            width: body.style.width,
            overflow: body.style.overflow,
        };
        body.style.position = 'fixed';
        body.style.top = `-${scrollY}px`;
        body.style.width = '100%';
        body.style.overflow = 'hidden';

        return () => {
            document.removeEventListener('keydown', onKeyDown);
            body.style.position = prev.position;
            body.style.top = prev.top;
            body.style.width = prev.width;
            body.style.overflow = prev.overflow;
            window.scrollTo(0, scrollY);
        };
    }, [isOpen, handleClose]);

    if (!isOpen) return null;

    // Clicking the dimmed area closes, but only when the press started there:
    // a drag that begins inside the panel and releases outside it is not a
    // request to throw away what was typed.
    const onBackdropMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) handleClose();
    };

    // ------------------------------------------------------------- edit mode
    // A separate, much smaller modal. Nothing here creates a campaign, asks for
    // an email, or writes to localStorage: the campaign already exists and this
    // only swaps its frame, so the link and the supporters are untouched.
    if (editTarget) {
        const manageUrlForEdit = `/c/${editTarget.slug}/manage?k=${editTarget.token}`;
        return (
            <div
                onMouseDown={onBackdropMouseDown}
                className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/70 backdrop-blur-sm p-4 animate-in fade-in duration-200"
            >
                {/* dvh, not vh: on iOS Safari 100vh is the height with the toolbars
                    hidden, so a vh-capped panel runs under the address bar and the
                    button at its bottom cannot be reached. */}
                <div
                    role="dialog"
                    aria-modal="true"
                    aria-label={frameSaved ? 'Frame updated' : 'Save your changes'}
                    className="bg-paper border border-ink/10 rounded-3xl w-full max-w-md max-h-[92dvh] overflow-y-auto overscroll-contain shadow-2xl animate-in zoom-in-95 duration-200"
                >
                    <div className="px-6 py-4 border-b border-ink/10 flex items-center justify-between sticky top-0 bg-paper z-10">
                        <h2 className="font-display text-lg font-extrabold text-ink">
                            {frameSaved ? 'Frame updated' : 'Save your changes'}
                        </h2>
                        <button onClick={handleClose} aria-label="Close" className="p-2 hover:bg-ink/10 rounded-full transition-colors">
                            <X size={18} className="text-muted" />
                        </button>
                    </div>

                    <div className="p-6 space-y-5">
                        <div className="flex justify-center py-2">
                            <FramePreview frame={config} className="w-40 h-40 rounded-full border-4 border-cream bg-paper2 shadow-lg mx-auto" />
                        </div>

                        {frameSaved ? (
                            <>
                                <p className="text-sm text-ink/70 text-center">
                                    <span className="font-semibold text-ink">{editTarget.title}</span> now uses this frame.
                                    Everyone who already has your link will see it, and anyone who downloaded the old one
                                    keeps what they downloaded.
                                </p>
                                <div className="flex gap-2">
                                    <a
                                        href={manageUrlForEdit}
                                        className="flex-1 py-3 rounded-xl font-bold flex items-center justify-center gap-2 bg-brand hover:brightness-105 text-ink transition-all"
                                    >
                                        <Pencil size={17} /> Back to campaign
                                    </a>
                                    <a
                                        href={`/c/${editTarget.slug}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 bg-cream border border-ink/10 hover:bg-ink/5 text-ink transition-all"
                                    >
                                        <ExternalLink size={17} /> View
                                    </a>
                                </div>
                            </>
                        ) : (
                            <>
                                <p className="text-sm text-ink/70 text-center">
                                    This replaces the frame on <span className="font-semibold text-ink">{editTarget.title}</span>.
                                    The campaign link, the supporter count, and your stats all stay exactly as they are.
                                </p>
                                {!previewDataUrl && (
                                    <p className="text-[11px] text-muted text-center leading-relaxed">
                                        Drop a photo into the editor before saving if you also want to refresh the preview
                                        image people see when your link is shared. Otherwise the old one stays.
                                    </p>
                                )}
                                {frameError && <p className="text-sm text-red-600 text-center">{frameError}</p>}
                            </>
                        )}
                    </div>

                    <div className="p-6 border-t border-ink/10">
                        {frameSaved ? (
                            <button onClick={handleClose} className="w-full py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 bg-ink text-paper transition-all">
                                <Check size={20} /> Done
                            </button>
                        ) : (
                            <button
                                onClick={saveFrame}
                                disabled={savingFrame}
                                className="w-full py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 bg-brand hover:brightness-105 text-ink transition-all disabled:opacity-50"
                            >
                                {savingFrame ? <Loader2 className="animate-spin" size={20} /> : <><Save size={20} /> Save frame</>}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    const handleCreate = async () => {
        if (!title) return;
        setIsSubmitting(true);
        setCreateError(null);

        try {
            // Upload the rendered preview so the shared campaign link shows a rich image.
            let previewUrl: string | null = null;
            if (previewDataUrl) {
                try {
                    const blob = await (await fetch(previewDataUrl)).blob();
                    const uploaded = await upload(`preview-${Date.now()}.png`, blob, { access: 'public', handleUploadUrl: '/api/upload' });
                    previewUrl = uploaded.url;
                } catch (e) {
                    console.error('preview upload failed', e);
                }
            }
            const res = await fetch('/api/campaigns', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title,
                    frameConfig: config,
                    previewUrl,
                    organizerEmail: organizerEmail || null,
                    daySlug,
                    referrerSlug,
                })
            });

            if (res.ok) {
                const campaign = await res.json();
                const cUrl = `${window.location.origin}/c/${campaign.slug}`;
                const mUrl = campaign.owner_token ? `${window.location.origin}/c/${campaign.slug}/manage?k=${campaign.owner_token}` : null;
                setCampaignUrl(cUrl);
                setCampaignSlug(campaign.slug);
                setOwnerToken(campaign.owner_token ?? null);
                if (mUrl) setManageUrl(mUrl);
                // Carry whatever they typed into the account panel so they do not
                // have to enter the same address twice.
                setAccountEmail(organizerEmail || '');
                // Welcome email includes the manage link, so they already have a
                // way back — do not block Done on that path.
                if (organizerEmail.trim() || sessionEmail) {
                    setLinkSaved(true);
                }
                track('campaign_created', {
                    campaign: campaign.slug,
                    day: daySlug || 'none',
                    country: campaign.publisher_country || 'unknown',
                });
                track('create_step', { step: 'send' });

                // Remember this campaign on the device so the owner can find it again.
                try {
                    const key = 'ollabs_my_campaigns';
                    const list = JSON.parse(localStorage.getItem(key) || '[]');
                    list.unshift({ slug: campaign.slug, title, url: cUrl, manageUrl: mUrl, createdAt: Date.now() });
                    localStorage.setItem(key, JSON.stringify(list.slice(0, 50)));
                } catch { /* ignore */ }
            } else {
                const err = await res.json().catch(() => ({}));
                setCreateError(err.error || 'Could not create your campaign. Nothing was lost. Try again.');
            }
        } catch (error) {
            console.error(error);
            setCreateError('Could not reach the server. Check your connection and try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const sendAccountCode = async () => {
        if (!accountEmail) return;
        setAccountError(null);
        setAccountStep('sending');
        try {
            const res = await fetch('/api/auth/code', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: accountEmail }),
            });
            const data = await res.json().catch(() => ({}));
            if (!res.ok) {
                setAccountError(data?.error || 'Could not send a code. Try again.');
                setAccountStep('offer');
                return;
            }
            setAccountCode('');
            setAccountStep('code');
        } catch {
            setAccountError('Could not reach the server. Try again.');
            setAccountStep('offer');
        }
    };

    const verifyAccountCode = async () => {
        if (accountCode.length !== 6) return;
        setAccountError(null);
        setAccountStep('verifying');
        try {
            const res = await fetch('/api/auth/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: accountEmail, code: accountCode }),
            });
            const data = await res.json().catch(() => ({}));
            if (!res.ok) {
                setAccountError(data?.error || 'That code did not work.');
                setAccountStep('code');
                return;
            }

            // Signing in claims every campaign created with this address. This one
            // may have been created without an email, so attach it explicitly with
            // the owner token as well. Doing both covers either path.
            if (campaignSlug && ownerToken) {
                try {
                    await fetch(`/api/campaigns/${campaignSlug}/claim`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ token: ownerToken }),
                    });
                } catch { /* the email match above usually covers it anyway */ }
            }

            setSessionEmail(accountEmail);
            setAccountStep('saved');
            setLinkSaved(true);
            setCloseBlocked(false);
        } catch {
            setAccountError('Could not reach the server. Try again.');
            setAccountStep('code');
        }
    };

    const handleCopy = async () => {
        if (!campaignUrl) return;
        try {
            await navigator.clipboard.writeText(campaignUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        } catch {
            // clipboard unavailable
        }
    };

    // Sending the link, from the screen where sending it decides the outcome.
    // See lib/share.ts for the numbers behind putting these here.

    const shareWhatsApp = () => {
        if (!campaignUrl) return;
        // Spanish and Tagalog do not yet have full UI dictionaries. Passing no
        // explicit locale lets share.ts detect those browser languages while an
        // explicitly localized Portuguese or Bahasa UI still wins.
        const text = organizerShareText(title || 'Ollabs', locale === 'en' ? undefined : locale);
        setShareFired(true);
        setShowShareNudge(false);
        window.open(whatsappUrl(text, withUtm(campaignUrl, 'whatsapp')), '_blank', 'noopener,noreferrer');
        track('campaign_share', { campaign: campaignSlug, method: 'whatsapp', platform: 'whatsapp', from: 'publish' });
    };

    const shareNative = async () => {
        if (!campaignUrl) return;
        const text = organizerShareText(title || 'Ollabs', locale === 'en' ? undefined : locale);
        try {
            await navigator.share({ title: title || 'Ollabs', text, url: withUtm(campaignUrl, 'native') });
            setShareFired(true);
            setShowShareNudge(false);
            track('campaign_share', { campaign: campaignSlug, platform: 'native', from: 'publish' });
        } catch {
            // Cancelled from the sheet, which is not an error worth surfacing.
        }
    };

    const showMessengerShare = locale === 'id' || prefersTagalog();

    const shareMessenger = () => {
        if (!campaignUrl) return;
        setShareFired(true);
        setShowShareNudge(false);
        window.location.href = messengerShareUrl(withUtm(campaignUrl, 'messenger'));
        track('campaign_share', { campaign: campaignSlug, platform: 'messenger', from: 'publish' });
    };

    const publishEmail = sessionEmail || organizerEmail || accountEmail;
    const suggestedHubHandle = !hubHandle && publishEmail ? suggestHandleFromEmail(publishEmail) : '';
    const hubHref = hubHandle
        ? `/u/${hubHandle}`
        : suggestedHubHandle
          ? `/hub?suggest=${encodeURIComponent(suggestedHubHandle)}`
          : '/hub';

    const handleCopyManage = async () => {
        if (!manageUrl) return;
        try {
            await navigator.clipboard.writeText(manageUrl);
            setManageCopied(true);
            setLinkSaved(true);
            setCloseBlocked(false);
            setTimeout(() => setManageCopied(false), 1500);
        } catch {
            // clipboard unavailable
        }
    };

    const skipAccountForNow = () => {
        setLinkSaved(true);
        setCloseBlocked(false);
        setAccountStep('offer');
    };

    const dismissShareNudge = () => {
        setShowShareNudge(false);
        if (campaignUrl && !sessionEmail && !linkSaved) {
            setCloseBlocked(true);
            return;
        }
        onClose();
        resetForm();
    };

    // Already signed in when the campaign was created, or signed in just now via
    // the panel below. Either way it is already on their account.
    const onAccount = Boolean(sessionEmail);

    return (
        <div
            onMouseDown={onBackdropMouseDown}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-ink/70 backdrop-blur-sm p-4 animate-in fade-in duration-200"
        >
            {/* dvh, not vh: on iOS Safari 100vh is the height with the toolbars
                hidden, so a vh-capped panel runs under the address bar and the
                Create button at its bottom cannot be reached. overscroll-contain
                stops a scroll that reaches the end of this panel from handing off
                to the builder page behind it. */}
            <div
                role="dialog"
                aria-modal="true"
                aria-label={campaignUrl ? tp.liveTitle : tp.createTitle}
                className="bg-paper border border-ink/10 rounded-3xl w-full max-w-md max-h-[92dvh] overflow-y-auto overscroll-contain shadow-2xl scale-100 animate-in zoom-in-95 duration-200"
            >

                {/* Header */}
                <div className="px-6 py-4 border-b border-ink/10 flex items-center justify-between sticky top-0 bg-paper z-10">
                    <h2 className="font-display text-lg font-extrabold text-ink">{campaignUrl ? tp.liveTitle : tp.createTitle}</h2>
                    <button onClick={handleClose} aria-label="Close" className="p-2 hover:bg-ink/10 rounded-full transition-colors">
                        <X size={18} className="text-muted" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Preview */}
                    {!campaignUrl && <div className="flex justify-center py-2">
                        <FramePreview frame={config} className="w-40 h-40 rounded-full border-4 border-cream bg-paper2 shadow-lg mx-auto" />
                    </div>}

                    {campaignUrl ? (
                        /* Success: share first, save access second — Frame → Name → Send */
                        <div className="space-y-4">
                            <p className="text-sm text-ink/70 text-center">
                                {tp.sendNowBody}
                            </p>

                            <button
                                onClick={shareWhatsApp}
                                className="w-full min-h-[56px] py-4 rounded-xl font-bold text-base flex items-center justify-center gap-2.5 text-white hover:brightness-105 active:brightness-95 transition-all shadow-sm"
                                style={{ backgroundColor: WHATSAPP_GREEN }}
                            >
                                <WhatsAppGlyph size={20} /> {tp.shareWhatsApp}
                            </button>

                            {showShareNudge && (
                                <div className="rounded-xl border border-brand/30 bg-brand/10 p-4 text-center space-y-3">
                                    <p className="text-sm font-bold text-ink">Ready to send it?</p>
                                    <p className="text-xs text-ink/70 leading-relaxed">
                                        Campaigns get moving when the link reaches the first group. WhatsApp opens with your message ready.
                                    </p>
                                    <div className="flex gap-2">
                                        <button
                                            type="button"
                                            onClick={shareWhatsApp}
                                            className="flex-1 min-h-[44px] rounded-lg bg-ink px-3 text-sm font-bold text-paper"
                                        >
                                            Open WhatsApp
                                        </button>
                                        <button
                                            type="button"
                                            onClick={dismissShareNudge}
                                            className="min-h-[44px] rounded-lg border border-ink/15 bg-cream px-3 text-sm font-semibold text-ink"
                                        >
                                            Not now
                                        </button>
                                    </div>
                                </div>
                            )}

                            {showMessengerShare && (
                                <button
                                    onClick={shareMessenger}
                                    className="w-full min-h-[52px] py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 bg-[#0084FF] text-white hover:brightness-105 active:brightness-95 transition-all"
                                >
                                    <Share2 size={18} /> {tp.shareMessenger}
                                </button>
                            )}

                            {canNativeShare && (
                                <button
                                    onClick={shareNative}
                                    className="w-full min-h-[52px] py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 bg-cream border border-ink/10 hover:bg-ink/5 text-ink transition-all"
                                >
                                    <Share2 size={18} /> {tp.shareAnother}
                                </button>
                            )}

                            <div className="bg-cream border border-ink/10 rounded-xl px-4 py-3 flex items-center gap-3">
                                <span className="text-sm text-ink truncate flex-1">{campaignUrl}</span>
                                <button onClick={handleCopy} className="text-muted hover:text-brand-deep transition-colors flex items-center gap-1 text-xs shrink-0 font-semibold min-h-[36px] px-1">
                                    {copied ? <><Check size={14} className="text-brand-deep" /> Copied</> : <><Copy size={14} /> Copy</>}
                                </button>
                            </div>

                            <div className="flex gap-2">
                                <a
                                    href={campaignUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex-1 min-h-[44px] py-2.5 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 bg-cream border border-ink/10 hover:bg-ink/5 text-ink transition-all"
                                >
                                    <ExternalLink size={15} /> {tp.open}
                                </a>
                                <button
                                    onClick={() => setShowQR((v) => !v)}
                                    className="min-h-[44px] py-2.5 px-3 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 bg-cream border border-ink/10 hover:bg-ink/5 text-ink transition-all"
                                >
                                    <QrCode size={15} /> QR
                                </button>
                            </div>

                            {showQR && (
                                <div className="flex flex-col items-center gap-2">
                                    <QRCode value={campaignUrl} size={172} className="border border-ink/10" />
                                    <p className="text-[11px] text-muted">Scan or download to print for events</p>
                                </div>
                            )}

                            <Link
                                href={hubHref}
                                onClick={() => track('hub_from_publish', { campaign: campaignSlug || '' })}
                                className="w-full min-h-[48px] py-3 rounded-xl font-bold flex items-center justify-center gap-2 bg-cream border border-brand/30 text-brand-deep hover:bg-brand/10 active:bg-brand/15 transition-all"
                            >
                                <LayoutGrid size={16} /> {hubHandle ? 'Open your hub' : tp.setupHub}
                            </Link>
                            <p className="text-xs text-muted text-center">
                                {hubHandle
                                    ? `Your hub is live at ollabs.studio/u/${hubHandle}`
                                    : suggestedHubHandle
                                      ? `Suggested handle: /u/${suggestedHubHandle}. ${tp.setupHubBody}`
                                      : tp.setupHubBody}
                            </p>

                            <div className="border-t border-ink/10 pt-4 space-y-3">
                                <p className="text-sm font-bold text-ink">{tp.thenSaveAccess}</p>

                            {onAccount ? (
                                <div className="bg-brand/10 border border-brand/30 rounded-xl p-4 flex items-start gap-2.5">
                                    <Check size={16} className="text-brand-deep mt-0.5 shrink-0" />
                                    <p className="text-xs text-ink/80">
                                        Saved to your account, <span className="font-semibold">{sessionEmail}</span>. Open it from
                                        any device by signing in with a code at{' '}
                                        <a href="/login" className="underline font-semibold">/login</a>.
                                    </p>
                                </div>
                            ) : (
                                <div className={`rounded-xl p-4 space-y-3 ${closeBlocked ? 'bg-coral/10 border border-coral/30' : 'bg-cream border border-ink/10'}`}>
                                    <div className="flex items-center gap-2 text-ink">
                                        <UserPlus size={16} className="text-brand-deep" />
                                        <span className="text-sm font-bold">{tp.saveCampaigns}</span>
                                    </div>

                                    {closeBlocked && (
                                        <p role="alert" className="text-xs text-coral">
                                            {tp.closeBlocked}
                                        </p>
                                    )}

                                    {accountStep === 'code' || accountStep === 'verifying' ? (
                                        <>
                                            <p className="text-xs text-ink/70">
                                                {tp.enterCode(accountEmail)}
                                            </p>
                                            <div className="relative">
                                                <KeyRound className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
                                                <input
                                                    type="text"
                                                    autoFocus
                                                    inputMode="numeric"
                                                    autoComplete="one-time-code"
                                                    maxLength={6}
                                                    value={accountCode}
                                                    onChange={(e) => setAccountCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                                    placeholder="123456"
                                                    className="w-full bg-paper border border-ink/10 rounded-xl pl-10 pr-4 py-3 text-ink tracking-[0.35em] font-semibold placeholder:tracking-normal placeholder:font-normal placeholder-muted focus:ring-2 focus:ring-brand/50 focus:border-brand outline-none transition-all"
                                                />
                                            </div>
                                            {accountError && <p className="text-xs text-coral">{accountError}</p>}
                                            <button
                                                onClick={verifyAccountCode}
                                                disabled={accountStep === 'verifying' || accountCode.length !== 6}
                                                className="w-full min-h-[44px] py-2.5 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 bg-brand hover:brightness-105 text-ink transition-all disabled:opacity-50"
                                            >
                                                {accountStep === 'verifying' ? <><Loader2 size={15} className="animate-spin" /> …</> : tp.saveMyCampaign}
                                            </button>
                                            <button
                                                onClick={sendAccountCode}
                                                className="w-full text-[11px] text-muted hover:text-brand-deep transition-colors"
                                            >
                                                {tp.sendNewCode}
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <p className="text-xs text-ink/70">
                                                {tp.saveCampaignsBody}
                                            </p>
                                            <input
                                                type="email"
                                                autoComplete="email"
                                                autoFocus={!organizerEmail}
                                                value={accountEmail}
                                                onChange={(e) => setAccountEmail(e.target.value)}
                                                placeholder="you@organization.org"
                                                className="w-full bg-paper border border-ink/10 rounded-xl px-4 py-3 text-ink placeholder-muted focus:ring-2 focus:ring-brand/50 focus:border-brand outline-none transition-all"
                                            />
                                            {accountError && <p className="text-xs text-coral">{accountError}</p>}
                                            <button
                                                onClick={sendAccountCode}
                                                disabled={accountStep === 'sending' || !accountEmail}
                                                className="w-full min-h-[44px] py-2.5 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 bg-brand hover:brightness-105 text-ink transition-all disabled:opacity-50"
                                            >
                                                {accountStep === 'sending' ? <><Loader2 size={15} className="animate-spin" /> …</> : tp.emailCode}
                                            </button>
                                            {manageUrl && (
                                                <button
                                                    type="button"
                                                    onClick={handleCopyManage}
                                                    className="w-full min-h-[44px] py-2.5 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 bg-cream border border-ink/10 hover:bg-ink/5 text-ink transition-all"
                                                >
                                                    {manageCopied ? <><Check size={15} className="text-brand-deep" /> Copied</> : <><Copy size={15} /> {tp.skipForNow}</>}
                                                </button>
                                            )}
                                            {!manageUrl && (
                                                <button
                                                    type="button"
                                                    onClick={skipAccountForNow}
                                                    className="w-full text-[11px] text-muted hover:text-ink transition-colors py-1"
                                                >
                                                    {tp.skipForNow}
                                                </button>
                                            )}
                                        </>
                                    )}
                                </div>
                            )}

                            {manageUrl && (
                                <div className="bg-brand/10 border border-brand/30 rounded-xl p-4 space-y-2.5">
                                    <div className="flex items-center gap-2 text-ink">
                                        <Pencil size={16} className="text-brand-deep" />
                                        <span className="text-sm font-bold">{tp.manage}</span>
                                    </div>
                                    <p className="text-xs text-ink/70">
                                        {tp.manageBody}
                                    </p>
                                    <div className="flex gap-2">
                                        <a
                                            href={manageUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            onClick={() => { setLinkSaved(true); setCloseBlocked(false); }}
                                            className="flex-1 min-h-[44px] py-2.5 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 bg-brand hover:brightness-105 text-ink transition-all"
                                        >
                                            <ExternalLink size={15} /> {tp.open}
                                        </a>
                                        <button onClick={handleCopyManage}
                                            className="min-h-[44px] py-2.5 px-3 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 bg-cream border border-ink/10 hover:bg-ink/5 text-ink transition-colors">
                                            {manageCopied ? <><Check size={15} className="text-brand-deep" /> ✓</> : <><Copy size={15} /> {messages.campaign.copyLink}</>}
                                        </button>
                                    </div>
                                    <p className="text-[11px] text-muted flex items-start gap-1.5">
                                        <ShieldCheck size={13} className="mt-0.5 shrink-0" />
                                        <span>
                                            {onAccount
                                                ? tp.privateKey
                                                : organizerEmail
                                                    ? tp.privateKeyEmail(organizerEmail)
                                                    : tp.privateKeyOnly}
                                        </span>
                                    </p>
                                </div>
                            )}
                            </div>
                        </div>
                    ) : (
                        /* Name it — title + email only; the rest waits on Manage */
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-muted uppercase tracking-wider">{tp.campaignTitle}</label>
                                <input
                                    type="text"
                                    autoFocus
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="Support Team USA"
                                    className="w-full bg-cream border border-ink/10 rounded-xl px-4 py-3 text-ink placeholder-muted focus:ring-2 focus:ring-brand/50 focus:border-brand outline-none transition-all"
                                />
                            </div>

                            {onAccount ? (
                                <div className="bg-brand/10 border border-brand/30 rounded-xl p-3 flex items-start gap-2.5">
                                    <Check size={15} className="text-brand-deep mt-0.5 shrink-0" />
                                    <p className="text-[11px] text-ink/80">
                                        {tp.signedInAs(sessionEmail!)}
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-muted uppercase tracking-wider">
                                        {tp.emailBack}
                                    </label>
                                    <input
                                        type="email"
                                        autoComplete="email"
                                        value={organizerEmail}
                                        onChange={(e) => setOrganizerEmail(e.target.value)}
                                        placeholder="you@organization.org"
                                        className="w-full bg-cream border border-ink/10 rounded-xl px-4 py-3 text-ink placeholder-muted focus:ring-2 focus:ring-brand/50 focus:border-brand outline-none transition-all"
                                    />
                                </div>
                            )}

                            <p className="text-[11px] text-muted leading-relaxed">
                                {tp.nameItHint}
                            </p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-ink/10">
                    {campaignUrl ? (
                        <button
                            onClick={handleClose}
                            className="w-full py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 bg-ink text-paper transition-all"
                        >
                            <Check size={20} /> {linkSaved || onAccount ? tp.done : tp.saveThenDone}
                        </button>
                    ) : (
                        <>
                        {createError && (
                            <p role="alert" className="mb-3 text-sm text-coral bg-coral/10 border border-coral/25 rounded-xl px-3 py-2.5">
                                {createError}
                            </p>
                        )}
                        <button
                            onClick={handleCreate}
                            disabled={!title || isSubmitting}
                            className="w-full py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 bg-brand hover:brightness-105 text-ink transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? <Loader2 className="animate-spin" /> : <><Rocket size={20} /> {tp.createButton}</>}
                        </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};
