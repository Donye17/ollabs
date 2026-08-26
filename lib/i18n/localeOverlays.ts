/**
 * Product locale overlays for ES / TL.
 *
 * Full marketing landings already exist at /es and /tl. These overlays deepen
 * create / campaign / publish chrome so those visitors are not stuck in English
 * once they enter the product.
 */

import type { Messages } from '@/lib/i18n/messages';

type DeepPartial<T> = {
    [K in keyof T]?: T[K] extends (...args: never[]) => unknown
        ? T[K]
        : T[K] extends object
          ? DeepPartial<T[K]>
          : T[K];
};

function mergeMessages(base: Messages, overlay: DeepPartial<Messages>): Messages {
    const out = { ...base } as Messages;
    for (const key of Object.keys(overlay) as (keyof Messages)[]) {
        const ov = overlay[key];
        if (ov && typeof ov === 'object' && !Array.isArray(ov)) {
            // @ts-expect-error deep merge of dictionary sections
            out[key] = { ...base[key], ...ov };
        }
    }
    return out;
}

const ES: DeepPartial<Messages> = {
    campaign: {
        eyebrow: 'Campaña Ollabs',
        tapHint: 'Toca el círculo o suelta una foto.',
        uploadPhoto: 'Sube tu foto',
        stepAdd: 'Añade tu foto',
        stepFit: 'Ajusta el encuadre',
        stepShare: 'Guarda y comparte',
        size: 'Tamaño',
        dragHint: 'Arrastra para mover. Usa Tamaño para zoom.',
        saveOrShare: 'Guardar o compartir foto',
        savePhotoHint: 'En la hoja de compartir, toca Guardar imagen para ir a Fotos.',
        savePhotoUnavailable: 'No se pudo guardar aquí. Ábrelo en Safari e inténtalo de nuevo.',
        download: 'Descargar',
        downloadedAgain: 'Descargado, descargar de nuevo',
        sharePhoto: 'Compartir foto',
        shareStory: 'Compartir en stories',
        shareWhatsApp: 'Compartir en WhatsApp',
        shareLinkWhatsApp: 'Compartir enlace en WhatsApp',
        shareMessenger: 'Compartir en Messenger',
        shareAnother: 'Compartir de otra forma',
        youreIn: 'Listo. Ahora llama a tu gente.',
        bringPeople: 'Comparte primero la foto con marco. Luego envía el enlace para que otros también lo pongan.',
        setupHub: 'Configura tu hub de campañas',
    },
    create: {
        title: 'Creador de campañas',
        subtitle: 'Sube tu marco, ponle nombre, envía un enlace. Sin cuenta.',
        artworkStep: 'Tu marco',
        uploadFrame: 'Subir logo o marco',
        pngTip: 'PNG con transparencia funciona mejor',
        opaqueFrameWarning:
            'Esta imagen se ve opaca en el centro. Usa un PNG con un hueco transparente para la foto, o abre la ventana con el control de abajo.',
        createCampaign: 'Crear campaña',
        nextNameIt: 'Continuar',
        stepFrame: 'Marco',
        stepName: 'Nombre',
        stepSend: 'Enviar',
    },
    publish: {
        createTitle: 'Nombrar y enviar',
        liveTitle: 'Tu campaña está lista',
        sendNowBody: 'Envía el enlace ahora. La mayoría de las campañas que arrancan lo hacen en la primera hora.',
        shareWhatsApp: 'Compartir en WhatsApp',
        shareMessenger: 'Compartir en Messenger',
        setupHub: 'Configura tu hub de campañas',
        setupHubBody: 'Un enlace para tu bio, botón Unirme y todas tus campañas.',
        claimHub: 'Crear hub con esta campaña',
        claimingHub: 'Creando hub…',
        hubLive: (handle) => `Tu hub está en ollabs.studio/u/${handle}`,
        openHub: 'Abrir tu hub',
        shareHubWhatsApp: 'Compartir hub en WhatsApp',
        createButton: 'Crear campaña',
    },
};

const TL: DeepPartial<Messages> = {
    campaign: {
        eyebrow: 'Ollabs campaign',
        tapHint: 'I-tap ang bilog o i-drop ang photo.',
        uploadPhoto: 'I-upload ang photo mo',
        stepAdd: 'Idagdag ang photo',
        stepFit: 'Iayos ang frame',
        stepShare: 'I-save at i-share',
        size: 'Laki',
        dragHint: 'I-drag para ilipat. Gamitin ang Laki para mag-zoom.',
        saveOrShare: 'I-save o i-share ang photo',
        savePhotoHint: 'Sa share sheet, i-tap ang Save Image para sa Photos.',
        savePhotoUnavailable: 'Hindi ma-save dito. Buksan sa Safari tapos ulitin.',
        download: 'I-download',
        downloadedAgain: 'Na-download, i-download ulit',
        sharePhoto: 'I-share ang photo',
        shareStory: 'I-share bilang story',
        shareWhatsApp: 'I-share sa WhatsApp',
        shareLinkWhatsApp: 'I-share ang link sa WhatsApp',
        shareMessenger: 'I-share sa Messenger',
        shareAnother: 'Ibang paraan ng share',
        youreIn: 'Pasok ka na. Tawagin ang tropa.',
        bringPeople: 'I-share muna ang framed photo. Pagkatapos, ipadala ang link para makasali ang iba.',
        setupHub: 'I-set up ang campaign hub mo',
    },
    create: {
        title: 'Campaign builder',
        subtitle: 'I-upload ang frame, pangalanan, padala ng isang link. Walang account.',
        artworkStep: 'Frame mo',
        uploadFrame: 'I-upload ang logo o frame',
        pngTip: 'PNG na may transparency ang pinakamaganda',
        opaqueFrameWarning:
            'Mukhang opaque ang gitna ng image. Gumamit ng PNG na may transparent hole para sa photo, o buksan ang photo window sa slider sa baba.',
        createCampaign: 'Gumawa ng campaign',
        nextNameIt: 'Magpatuloy',
        stepFrame: 'Frame',
        stepName: 'Pangalan',
        stepSend: 'Ipadala',
    },
    publish: {
        createTitle: 'Pangalanan at ipadala',
        liveTitle: 'Live na ang campaign mo',
        sendNowBody: 'Ipadala ang link ngayon. Karamihan ng campaign na umaarangkada ay sa unang oras.',
        shareWhatsApp: 'I-share sa WhatsApp',
        shareMessenger: 'I-share sa Messenger',
        setupHub: 'I-set up ang campaign hub mo',
        setupHubBody: 'Isang link para sa bio, Join button, at lahat ng campaign mo.',
        claimHub: 'I-claim ang hub gamit ang campaign na ito',
        claimingHub: 'Kino-claim ang hub…',
        hubLive: (handle) => `Live ang hub mo sa ollabs.studio/u/${handle}`,
        openHub: 'Buksan ang hub mo',
        shareHubWhatsApp: 'I-share ang hub sa WhatsApp',
        createButton: 'Gumawa ng campaign',
    },
};

export function applyLocaleOverlay(base: Messages, locale: 'es' | 'tl'): Messages {
    return mergeMessages(base, locale === 'es' ? ES : TL);
}
