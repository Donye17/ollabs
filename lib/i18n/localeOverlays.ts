/**
 * Product locale overlays for ES / TL.
 *
 * Spanish and Tagalog have no marketing landings. These overlays deepen
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
    nav: {
        tabMine: 'Mías',
        tabCreate: 'Crear',
        tabHub: 'Hub',
    },
    campaign: {
        eyebrow: 'Campaña Ollabs',
        tapHint: 'Toca el círculo o suelta una foto.',
        uploadPhoto: 'Sube tu foto',
        uploadFailed: 'No se pudo abrir esa imagen. Prueba un JPG o PNG.',
        download: 'Descargar foto',
        peopleSupporting: 'personas apoyando',
        makeOwn: 'Crea tu propio marco',
        makeOwnFooter: 'Haz la tuya con Ollabs',
        report: 'Denunciar esta campaña',
        guides: 'Guías',
        stepAdd: 'Añade tu foto',
        stepFit: 'Ajusta el encuadre',
        stepShare: 'Guarda y comparte',
        size: 'Tamaño',
        dragHint: 'Arrastra para mover. Usa Tamaño para zoom.',
        saveOrShare: 'Guardar o compartir foto',
        savePhotoHint: 'En la hoja de compartir, toca Guardar imagen para ir a Fotos.',
        savePhotoUnavailable: 'No se pudo guardar aquí. Ábrelo en Safari e inténtalo de nuevo.',
        openInSafari: 'Abrir en Safari',
        downloadedAgain: 'Descargado, descargar de nuevo',
        sharePhoto: 'Compartir foto',
        shareStory: 'Compartir en stories',
        shareWhatsApp: 'Compartir en WhatsApp',
        shareLinkWhatsApp: 'Compartir enlace en WhatsApp',
        shareMessenger: 'Compartir en Messenger',
        shareAnother: 'Compartir de otra forma',
        moreWays: 'Otras formas de compartir',
        linkCopiedPaste: 'Enlace copiado, pégalo con tu foto',
        copyCaptionFailed: 'No se pudo copiar el enlace. Selecciona esto y pégalo con tu foto:',
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
        simpleStyles: '¿Sin diseño? Empieza aquí',
        simpleStylesHint: '¿Aún sin arte? Elige un anillo de color para empezar.',
        colourRings: 'Anillos de color',
        canvasFrameHint: 'Sube tu arte abajo. Si quieres, prueba con una foto después.',
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
    mine: {
        title: 'Mis campañas',
        lede: 'Tus campañas, y atajos a cada panel.',
        emptyAccount: 'Aún no hay campañas en esta cuenta',
        emptyDevice: 'Aún no hay campañas en este dispositivo',
        emptyAccountBody: 'Crea un marco y comparte el enlace en WhatsApp en la primera hora. Ahí es cuando la mayoría recibe a su primer apoyo.',
        emptyDeviceBody: 'Crea un marco en este navegador y envía el enlace en WhatsApp ahora. Una campaña que no se comparte en la primera hora casi nunca arranca.',
        create: 'Crear campaña',
        whatsNew: 'Novedades',
        otherDevice: '¿Hiciste una campaña en otro dispositivo?',
        signInCode: 'Entrar con un código',
        or: 'o',
        recoveryEmail: 'recibir un enlace de recuperación por correo',
        haveAccount: '¿Ya tienes una cuenta?',
        haveAccountBody: 'Entra con un código y cada campaña que guardaste aparece aquí, en cualquier dispositivo. Las campañas nuevas se unen a tu cuenta al crearlas. Quien apoya nunca entra.',
    },
};

const TL: DeepPartial<Messages> = {
    nav: {
        tabMine: 'Akin',
        tabCreate: 'Gawa',
        tabHub: 'Hub',
    },
    campaign: {
        eyebrow: 'Ollabs campaign',
        tapHint: 'I-tap ang bilog o i-drop ang photo.',
        uploadPhoto: 'I-upload ang photo mo',
        uploadFailed: 'Hindi mabuksan ang image. Subukan ang JPG o PNG.',
        download: 'I-download ang photo',
        peopleSupporting: 'sumusuporta',
        makeOwn: 'Gumawa ng sarili mong frame',
        makeOwnFooter: 'Gumawa ng sarili sa Ollabs',
        report: 'I-report ang campaign na ito',
        guides: 'Mga gabay',
        stepAdd: 'Idagdag ang photo',
        stepFit: 'Iayos ang frame',
        stepShare: 'I-save at i-share',
        size: 'Laki',
        dragHint: 'I-drag para ilipat. Gamitin ang Laki para mag-zoom.',
        saveOrShare: 'I-save o i-share ang photo',
        savePhotoHint: 'Sa share sheet, i-tap ang Save Image para sa Photos.',
        savePhotoUnavailable: 'Hindi ma-save dito. Buksan sa Safari tapos ulitin.',
        openInSafari: 'Buksan sa Safari',
        downloadedAgain: 'Na-download, i-download ulit',
        sharePhoto: 'I-share ang photo',
        shareStory: 'I-share bilang story',
        shareWhatsApp: 'I-share sa WhatsApp',
        shareLinkWhatsApp: 'I-share ang link sa WhatsApp',
        shareMessenger: 'I-share sa Messenger',
        shareAnother: 'Ibang paraan ng share',
        moreWays: 'Iba pang paraan ng pagbabahagi',
        linkCopiedPaste: 'Nakopya ang link, i-paste kasama ng photo',
        copyCaptionFailed: 'Hindi nakopya ang link. Piliin ito at i-paste kasama ng photo:',
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
        simpleStyles: 'Walang design? Magsimula dito',
        simpleStylesHint: 'Wala pang artwork? Pumili ng colour ring para magsimula.',
        colourRings: 'Mga colour ring',
        canvasFrameHint: 'I-upload ang artwork sa baba. Puwede ring subukan ng photo pagkatapos.',
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
    mine: {
        title: 'Mga campaign ko',
        lede: 'Mga campaign mo, at mabilis na balik sa bawat dashboard.',
        emptyAccount: 'Wala pang campaign sa account na ito',
        emptyDevice: 'Wala pang campaign sa device na ito',
        emptyAccountBody: 'Gumawa ng frame, tapos i-share ang link sa WhatsApp sa unang oras. Doon karaniwang dumarating ang unang supporter.',
        emptyDeviceBody: 'Gumawa ng frame sa browser na ito, tapos ipadala ang link sa WhatsApp ngayon. Ang campaign na hindi na-share sa unang oras ay halos hindi na umaandar.',
        create: 'Gumawa ng campaign',
        whatsNew: 'Ano ang bago',
        otherDevice: 'May campaign ka sa ibang device?',
        signInCode: 'Mag-sign in gamit ang code',
        or: 'o',
        recoveryEmail: 'kumuha ng recovery link sa email',
        haveAccount: 'May account ka na?',
        haveAccountBody: 'Mag-sign in gamit ang code at lalabas dito ang bawat campaign na na-save mo, sa anumang device. Ang bagong campaign ay sumasali sa account mo habang ginagawa mo. Ang supporter ay hindi nag-sign in.',
    },
};

export function applyLocaleOverlay(base: Messages, locale: 'es' | 'tl'): Messages {
    return mergeMessages(base, locale === 'es' ? ES : TL);
}
