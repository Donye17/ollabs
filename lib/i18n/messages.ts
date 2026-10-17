import type { Locale } from './locale';
import { applyLocaleOverlay } from './localeOverlays';

/** UI chrome strings. Campaign titles stay as the organizer wrote them. */
export type Messages = {
    banner: {
        suggest: string;
        switchTo: string;
        dismiss: string;
    };
    nav: {
        explore: string;
        guides: string;
        myCampaigns: string;
        tabMine: string;
        tabCreate: string;
        tabHub: string;
        create: string;
        language: string;
        english: string;
        portuguese: string;
    };
    footer: {
        guides: string;
        about: string;
        contact: string;
        useCases: string;
        privacy: string;
        terms: string;
        label: string;
    };
    home: {
        headlineBefore: string;
        headlineAccent: string;
        lede: string;
        nameLabel: string;
        namePlaceholder: string;
        create: string;
        free: string;
        exampleAlt: string;
        slugFallback: string;
        topCampaigns: string;
        topCampaignsBody: string;
        calendarLink: string;
        howTitle: string;
        how1Title: string;
        how1Body: string;
        how2Title: string;
        how2Body: string;
        how3Title: string;
        how3Body: string;
        madeFor: string;
        seeAllUseCases: string;
        freeTitle: string;
        freeBody: string;
        ctaTitle: string;
        ctaBody: string;
    };
    campaign: {
        eyebrow: string;
        tapHint: string;
        uploadPhoto: string;
        uploadFailed: string;
        stepAdd: string;
        stepFit: string;
        stepShare: string;
        size: string;
        dragHint: string;
        saveOrShare: string;
        savePhotoHint: string;
        savePhotoUnavailable: string;
        openInSafari: string;
        download: string;
        downloadedAgain: string;
        copyImage: string;
        imageCopied: string;
        newPhoto: string;
        share: string;
        copied: string;
        peopleSupporting: string;
        of: string;
        ofSupporters: string;
        goalReached: string;
        youreIn: string;
        bringPeople: string;
        sharePhoto: string;
        shareStory: string;
        shareWhatsApp: string;
        shareLinkWhatsApp: string;
        shareMessenger: string;
        shareAnother: string;
        moreWays: string;
        copyLink: string;
        linkCopiedPaste: string;
        copyCaptionFailed: string;
        scanCampaign: string;
        wantOwn: string;
        wantOwnBody: string;
        makeOwn: string;
        makeOwnFooter: string;
        setupHub: string;
        report: string;
        guides: string;
        reportTitle: string;
        reportPlaceholder: string;
        submitReport: string;
        cancel: string;
        reportThanks: string;
        inAppWhatsApp: string;
        inAppInstagram: string;
        inAppFacebook: string;
        inAppOpenBrowser: string;
        inAppCopyLink: string;
        inAppDismiss: string;
        inAppSaveFailed: string;
        setPhotoTitle: string;
        setPhotoWhatsApp: string;
        setPhotoInstagram: string;
        setPhotoFacebook: string;
        setPhotoGeneric: string;
        setPhotoProof: string;
        formatProfile: string;
        formatProfileSize: string;
        formatStory: string;
        formatStorySize: string;
        canvasLabel: string;
    };
    create: {
        title: string;
        editTitle: string;
        subtitle: string;
        editSubtitle: (name: string) => string;
        yourFrame: string;
        yourFrameHint: string;
        artworkStep: string;
        artworkStepHint: string;
        photoWindowStep: string;
        photoWindowStepHint: string;
        addText: string;
        optional: string;
        uploadFrame: string;
        changeFrame: string;
        uploading: string;
        pngTip: string;
        opaqueFrameWarning: string;
        photoWindow: string;
        photoWindowHint: string;
        tipLogo: string;
        simpleStyles: string;
        simpleStylesHint: string;
        colourRings: string;
        canvasFrameHint: string;
        fineTune: string;
        previewContacts: string;
        createCampaign: string;
        saveChanges: string;
        dragTip: string;
        nextNameIt: string;
        stepFrame: string;
        stepName: string;
        stepSend: string;
        tryPhotoOptional: string;
        changePreviewPhoto: string;
        adjustPhoto: string;
        magicRemove: string;
        zoomLevel: string;
        rotationAngle: string;
        fitToFrame: string;
        resetAll: string;
        saveOrShare: string;
        downloadPhoto: string;
        savePhoto: string;
        uploadPhoto: string;
        changePhoto: string;
        dragZoom: string;
        uploadFrameBelow: string;
        tapToAdd: string;
        tagline: string;
    };
    publish: {
        createTitle: string;
        liveTitle: string;
        nameItHint: string;
        thenSaveAccess: string;
        sendNow: string;
        sendNowBody: string;
        shareWhatsApp: string;
        shareMessenger: string;
        shareAnother: string;
        open: string;
        saveCampaigns: string;
        saveCampaignsBody: string;
        emailCode: string;
        enterCode: (email: string) => string;
        saveMyCampaign: string;
        sendNewCode: string;
        skipForNow: string;
        closeBlocked: string;
        manage: string;
        manageBody: string;
        privateKey: string;
        privateKeyEmail: (email: string) => string;
        privateKeyOnly: string;
        done: string;
        saveThenDone: string;
        campaignTitle: string;
        description: string;
        goal: string;
        category: string;
        emailBack: string;
        emailBackHint: string;
        createButton: string;
        signedInAs: (email: string) => string;
        savedToAccount: (email: string) => string;
        setupHub: string;
        setupHubBody: string;
        hubNextOptional: string;
        claimHub: string;
        claimingHub: string;
        hubLive: (handle: string) => string;
        openHub: string;
        shareHubWhatsApp: string;
    };
    day: {
        tapAdd: string;
        zoom: string;
        changePhoto: string;
        saveOrShare: string;
        savePhotoHint: string;
        savePhotoUnavailable: string;
        download: string;
        saved: string;
        createCampaign: string;
    };
    mine: {
        title: string;
        lede: string;
        emptyAccount: string;
        emptyDevice: string;
        emptyAccountBody: string;
        emptyDeviceBody: string;
        create: string;
        whatsNew: string;
        otherDevice: string;
        signInCode: string;
        or: string;
        recoveryEmail: string;
        haveAccount: string;
        haveAccountBody: string;
        loading: string;
        signedInAs: (email: string) => string;
        signOut: string;
        travel: string;
        publishedFrom: string;
        firstFrom: string;
        hubYours: string;
        hubPut: string;
        hubClaim: string;
        hubSetup: (handle: string) => string;
        hubOneLink: string;
        hubSuggested: (handle: string) => string;
        hubClaimLinks: string;
        view: string;
        edit: string;
        onlyBrowser: string;
        browserOnlyNote: string;
        openCampaign: string;
        manage: string;
        manageHint: string;
        reuseFrame: string;
        reuse: string;
        reuseHint: string;
        removeHint: string;
        publishedIn: (place: string) => string;
        firstJoinIn: (place: string) => string;
        shareNow: string;
    };
    manage: {
        eyebrow: string;
        loading: string;
        cantOpen: string;
        needsKey: string;
        couldNotLoad: string;
        copied: string;
        copy: string;
        openCampaign: string;
        showQr: string;
        scanQr: string;
        hub: string;
        hubBody: string;
        setUp: string;
        noSupporters: string;
        noSupportersBody: string;
        shareWhatsApp: string;
        views: string;
        supporters: string;
        conversion: string;
        newSupporters: string;
        total: (n: string) => string;
        noneInWindow: string;
        byCountry: string;
        frame: string;
        frameBody: string;
        changeFrame: string;
        details: string;
        title: string;
        description: string;
        goal: string;
        noGoal: string;
        category: string;
        none: string;
        catCause: string;
        catSports: string;
        catEvent: string;
        catFundraiser: string;
        catCommunity: string;
        catFaith: string;
        catSchool: string;
        catAwareness: string;
        catBusiness: string;
        catOther: string;
        customLink: string;
        slugHint: string;
        save: string;
        saved: string;
        couldNotSave: string;
        nothingToUpdate: string;
        linkTaken: string;
        linkInvalid: string;
        goalRange: string;
        frameTooLarge: string;
        previewHttps: string;
        frameInvisible: string;
        privateBefore: string;
        privateAfter: string;
    };
    explore: {
        title: string;
        lede: string;
        popular: string;
        trending: string;
        newest: string;
        all: string;
        search: string;
        noMatch: string;
        emptyCategory: string;
        emptyGrid: string;
        emptyShare: string;
        create: string;
        browseUses: string;
        startOwn: string;
    };
    meta: {
        manage: string;
        hub: string;
        signIn: string;
        recover: string;
    };
    landingPt: LandingCopy;
    landingId: LandingCopy;
    landingTl: LandingCopy;
    landingHi: LandingCopy;
    landingEs: LandingCopy;
};

export type LandingCopy = {
    title: string;
    description: string;
    eyebrow: string;
    headline: string;
    headlineAccent: string;
    sub: string;
    cta: string;
    ctaSecondary: string;
    howTitle: string;
    step1Title: string;
    step1Body: string;
    step2Title: string;
    step2Body: string;
    step3Title: string;
    step3Body: string;
    whyTitle: string;
    why1: string;
    why2: string;
    why3: string;
    why4: string;
    englishSite: string;
    stepLabel: (n: number) => string;
};

const landingPt: LandingCopy = {
    title: 'Ollabs: moldura grátis para foto de perfil e campanhas',
    description:
        'Crie uma moldura de foto de perfil para a sua causa, time ou evento. Compartilhe um link e as pessoas adicionam na foto em segundos. Grátis, sem cadastro, sem marca d\'água.',
    eyebrow: 'De collabs, para reunir pessoas',
    headline: 'Reúna a sua',
    headlineAccent: 'galera.',
    sub: 'Faça uma moldura de foto de perfil para a sua causa, campanha ou evento. Mande um link e todo mundo coloca na foto em segundos. Grátis, sem cadastro, sem marca d\'água.',
    cta: 'Criar uma campanha',
    ctaSecondary: 'Versão em inglês',
    howTitle: 'Como funciona',
    step1Title: 'Faça a moldura',
    step1Body: 'Envie o seu design, logo ou cores.',
    step2Title: 'Compartilhe um link',
    step2Body: 'Mande no WhatsApp, Instagram ou onde a sua galera estiver.',
    step3Title: 'Elas adicionam',
    step3Body: 'Abrem o link, colocam a foto e salvam a moldura.',
    whyTitle: 'Por que o Ollabs',
    why1: 'Sem marca d\'água na foto',
    why2: 'Quem apoia nunca paga',
    why3: 'Funciona no celular, inclusive no WhatsApp',
    why4: 'Sem precisar instalar app',
    englishSite: 'English site',
    stepLabel: (n) => `Passo ${n}`,
};

const landingTl: LandingCopy = {
    title: 'Ollabs: libreng twibbon at profile frame para sa kampanya',
    description:
        'Gumawa ng profile picture frame para sa inyong cause, team, o event. I-share ang isang link at idadagdag ng supporters sa photo nila. Libre, walang signup, walang watermark.',
    eyebrow: 'Mula sa collabs, para tipunin ang tao',
    headline: 'Tipunin ang',
    headlineAccent: 'inyong grupo.',
    sub: 'Gumawa ng profile frame para sa kampanya o event. Isang link lang at lahat makakasali sa ilang segundo. Libre, walang signup, walang watermark.',
    cta: 'Gumawa ng kampanya',
    ctaSecondary: 'English version',
    howTitle: 'Paano gumagana',
    step1Title: 'Gumawa ng frame',
    step1Body: 'Pumili ng kulay o mag-upload ng sariling design.',
    step2Title: 'I-share ang link',
    step2Body: 'I-post sa Messenger, Viber, o group chat. Parehong link para sa lahat.',
    step3Title: 'Sila ang magdadagdag',
    step3Body: 'Mag-upload ng photo, i-download na may frame, tumaas ang counter.',
    whyTitle: 'Bakit Ollabs',
    why1: 'Walang watermark sa supporters',
    why2: 'Walang account para sumali',
    why3: 'Gumagana sa phone browser',
    why4: 'Libre para sa organizers at supporters',
    englishSite: 'English site',
    stepLabel: (n) => `Hakbang ${n}`,
};

const landingHi: LandingCopy = {
    title: 'Ollabs: मुफ़्त twibbon और profile frame',
    description:
        'अपने cause, team या event के लिए profile picture frame बनाएं। एक link शेयर करें, supporters सेकंडों में photo पर frame लगाएं। मुफ़्त, बिना signup, बिना watermark।',
    eyebrow: 'Collabs से, लोगों को जोड़ने के लिए',
    headline: 'अपने लोगों को',
    headlineAccent: 'एक जगह लाएं।',
    sub: 'कैंपेन या event के लिए profile frame बनाएं। एक link, सब कुछ सेकंडों में। मुफ़्त, बिना signup, बिना watermark।',
    cta: 'कैंपेन बनाएं',
    ctaSecondary: 'English version',
    howTitle: 'कैसे काम करता है',
    step1Title: 'Frame बनाएं',
    step1Body: 'रंग चुनें या अपना design upload करें।',
    step2Title: 'Link शेयर करें',
    step2Body: 'WhatsApp, email या social पर भेजें।',
    step3Title: 'Supporters जुड़ें',
    step3Body: 'Photo upload, framed download, counter बढ़ता है।',
    whyTitle: 'Ollabs क्यों',
    why1: 'Supporters पर कोई watermark नहीं',
    why2: 'जुड़ने के लिए account नहीं',
    why3: 'Phone browser पर चलता है',
    why4: 'Organizers और supporters के लिए मुफ़्त',
    englishSite: 'English site',
    stepLabel: (n) => `चरण ${n}`,
};

const landingEs: LandingCopy = {
    title: 'Ollabs: marco de foto de perfil gratis para campañas',
    description:
        'Crea un marco de foto de perfil para tu causa, equipo o evento. Comparte un enlace y todos lo agregan en segundos. Gratis, sin registro, sin marca de agua.',
    eyebrow: 'De collabs, para reunir gente',
    headline: 'Reúne a tu',
    headlineAccent: 'gente.',
    sub: 'Haz un marco de foto de perfil para tu campaña o evento. Un enlace y todos participan en segundos. Gratis, sin registro, sin marca de agua.',
    cta: 'Crear una campaña',
    ctaSecondary: 'English version',
    howTitle: 'Cómo funciona',
    step1Title: 'Crea el marco',
    step1Body: 'Elige un color o sube tu diseño.',
    step2Title: 'Comparte un enlace',
    step2Body: 'Publícalo en WhatsApp, email y redes.',
    step3Title: 'Ellos lo agregan',
    step3Body: 'Suben su foto, descargan con marco, sube el contador.',
    whyTitle: 'Por qué Ollabs',
    why1: 'Sin marca de agua para quien apoya',
    why2: 'Sin cuenta para participar',
    why3: 'Funciona en el navegador del celular',
    why4: 'Gratis para organizadores y apoyos',
    englishSite: 'English site',
    stepLabel: (n) => `Paso ${n}`,
};

const landingId: LandingCopy = {
    title: 'Ollabs: twibbon gratis & bingkai foto profil untuk kampanye',
    description:
        'Buat bingkai foto profil (twibbon) untuk kampanye, komunitas, atau event. Bagikan satu link, orang pasang di foto dalam hitungan detik. Gratis, tanpa daftar, tanpa watermark.',
    eyebrow: 'Dari collabs, untuk kumpulkan orang',
    headline: 'Kumpulkan',
    headlineAccent: 'barengannya.',
    sub: 'Buat bingkai foto profil untuk kampanye, komunitas, atau event. Kirim satu link, semua orang pasang di foto dalam hitungan detik. Gratis, tanpa daftar, tanpa watermark.',
    cta: 'Buat kampanye',
    ctaSecondary: 'English version',
    howTitle: 'Cara kerjanya',
    step1Title: 'Buat bingkainya',
    step1Body: 'Unggah desain, logo, atau warna kamu.',
    step2Title: 'Bagikan satu link',
    step2Body: 'Kirim ke WhatsApp, Instagram, atau di mana barenganmu berada.',
    step3Title: 'Mereka pasang',
    step3Body: 'Buka link, masukkan foto, simpan bingkainya.',
    whyTitle: 'Kenapa Ollabs',
    why1: 'Tanpa watermark di foto',
    why2: 'Pendukung tidak pernah bayar',
    why3: 'Jalan di HP, termasuk di WhatsApp',
    why4: 'Tanpa harus install aplikasi',
    englishSite: 'English site',
    stepLabel: (n) => `Langkah ${n}`,
};

const en: Messages = {
    banner: {
        suggest: 'Parece que você fala português. Quer ver o Ollabs em português?',
        switchTo: 'Usar português',
        dismiss: 'Manter inglês',
    },
    nav: {
        explore: 'Explore',
        guides: 'Guides',
        myCampaigns: 'My campaigns',
        tabMine: 'Mine',
        tabCreate: 'Create',
        tabHub: 'Hub',
        create: 'Create a campaign',
        language: 'Language',
        english: 'EN',
        portuguese: 'PT',
    },
    footer: {
        guides: 'Guides',
        about: 'About',
        contact: 'Contact',
        useCases: 'Use cases',
        privacy: 'Privacy',
        terms: 'Terms',
        label: 'Footer',
    },
    home: {
        headlineBefore: 'Your cause on ',
        headlineAccent: 'every profile',
        lede: 'One link. Under a minute. No signup and no watermark for supporters.',
        nameLabel: 'Campaign name',
        namePlaceholder: 'Your cause, team, or candidate',
        create: 'Create a campaign',
        free: 'Free. No account.',
        exampleAlt: 'Example profile photo with a frame',
        slugFallback: 'your-campaign',
        topCampaigns: 'Top campaigns',
        topCampaignsBody: 'Real frames people are using right now, ranked by supporters.',
        calendarLink: 'Calendar moments',
        howTitle: 'How it works',
        how1Title: 'Upload your frame',
        how1Body: 'Your logo, colors, and slogan on a transparent PNG.',
        how2Title: 'Share one link',
        how2Body: 'WhatsApp, Instagram, email. One URL for everyone.',
        how3Title: 'They save the photo',
        how3Body: 'Drop in a picture, download it framed, counter goes up.',
        madeFor: 'Made for',
        seeAllUseCases: 'See all use cases',
        freeTitle: 'Free for supporters',
        freeBody:
            'No signup, no watermark, no paywall. Upload your own frame art, share one link, and watch the counter climb.',
        ctaTitle: 'Make a frame',
        ctaBody: 'Takes under a minute. No account needed.',
    },
    campaign: {
        eyebrow: 'Ollabs campaign',
        tapHint: 'Tap the circle or drag a photo onto it.',
        uploadPhoto: 'Upload your photo',
        uploadFailed: 'That image could not be opened. Try a JPG or PNG.',
        stepAdd: 'Add your photo',
        stepFit: 'Adjust the fit',
        stepShare: 'Download & share',
        size: 'Size',
        dragHint: 'Drag to move. Use Size to zoom.',
        saveOrShare: 'Save or share photo',
        savePhotoHint: 'In the sheet, tap Save Image to add it to your Photos app.',
        savePhotoUnavailable: 'Could not save here. Open this page in Safari, then try again.',
        openInSafari: 'Open in Safari',
        download: 'Download photo',
        downloadedAgain: 'Downloaded, download again',
        copyImage: 'Copy image',
        imageCopied: 'Image copied',
        newPhoto: 'New photo',
        share: 'Share',
        copied: 'Copied',
        peopleSupporting: 'people supporting',
        of: 'of',
        ofSupporters: 'supporters',
        goalReached: 'goal reached',
        youreIn: "You're in. Now bring your people.",
        bringPeople: 'Share your framed photo first. Then send the link so others can add it too.',
        sharePhoto: 'Share photo',
        shareStory: 'Share as story',
        shareWhatsApp: 'Share on WhatsApp',
        shareLinkWhatsApp: 'Share link on WhatsApp',
        shareMessenger: 'Share on Messenger',
        shareAnother: 'Share another way',
        moreWays: 'More ways to share',
        copyLink: 'Copy link',
        linkCopiedPaste: 'Link copied, paste it with your photo',
        copyCaptionFailed: 'Could not copy the link. Select this and paste it with your photo:',
        scanCampaign: 'Scan to open this campaign',
        wantOwn: 'Want one of your own?',
        wantOwnBody:
            'Make a frame for your team, your school, your campaign. It is free, and you get a link just like this one to send out.',
        makeOwn: 'Make your own frame',
        makeOwnFooter: 'Make your own with Ollabs',
        setupHub: 'Set up your campaign hub',
        report: 'Report this campaign',
        guides: 'Guides',
        reportTitle: 'Report this campaign',
        reportPlaceholder: "What's wrong with it? (optional)",
        submitReport: 'Submit report',
        cancel: 'Cancel',
        reportThanks: 'Thanks, we will review this campaign.',
        inAppWhatsApp: 'You are in the WhatsApp browser.',
        inAppInstagram: 'You are in the Instagram browser.',
        inAppFacebook: 'You are in the Facebook browser.',
        inAppOpenBrowser: 'Open in browser',
        inAppCopyLink: 'Copy link',
        inAppDismiss: 'Continue here',
        inAppSaveFailed: 'The image did not save. This in-app browser sometimes blocks downloads.',
        setPhotoTitle: 'Now set it as your profile picture',
        setPhotoWhatsApp: 'WhatsApp: Settings > tap your photo > Gallery',
        setPhotoInstagram: 'Instagram: Profile > Edit profile > Change photo',
        setPhotoFacebook: 'Facebook: tap your photo > Choose profile picture',
        setPhotoGeneric: 'Open the app and change your profile photo. The file is in your gallery.',
        setPhotoProof: 'How it looks',
        formatProfile: 'Profile photo',
        formatProfileSize: '1080 × 1080',
        formatStory: 'Story',
        formatStorySize: '1080 × 1920',
        canvasLabel: 'Campaign frame. Add your photo here.',
    },
    create: {
        title: 'Campaign builder',
        editTitle: 'Edit your frame',
        subtitle: 'Upload your frame, name it, send one link. No account needed.',
        editSubtitle: (name) => `Saves to "${name}". Your link and supporters stay put.`,
        yourFrame: 'Your frame',
        yourFrameHint:
            'Upload your logo, badge, or designed frame. Watch the live preview above while you open a window for the photo.',
        artworkStep: 'Your frame',
        artworkStepHint: 'Logo, badge, or designed PNG.',
        photoWindowStep: 'Photo window',
        photoWindowStepHint: 'Left = more frame. Right = more photo.',
        addText: 'Add text',
        optional: 'optional',
        uploadFrame: 'Upload logo or frame',
        changeFrame: 'Change frame image',
        uploading: 'Uploading…',
        pngTip: 'PNG with transparency works best',
        opaqueFrameWarning:
            'This image looks opaque in the center. Use a PNG with a transparent hole for the photo, or open the photo window with the slider below.',
        photoWindow: 'Photo window',
        photoWindowHint:
            'Cut a circle so the photo shows through. Left = more frame, right = more photo. Set to 0 if your PNG already has a transparent center.',
        tipLogo:
            "A square logo or round badge works great. Ollabs keeps the outer design and opens a window in the center for each supporter's photo.",
        simpleStyles: 'No design? Start here',
        simpleStylesHint: 'No artwork yet? Pick a colour ring to start.',
        colourRings: 'Colour rings',
        canvasFrameHint: 'Upload your artwork below. Try a photo after if you want.',
        fineTune: 'Fine tune colours',
        previewContacts: 'Preview in contacts',
        createCampaign: 'Create campaign',
        saveChanges: 'Save changes',
        dragTip: 'Upload your frame first. Optionally drop a photo on the circle to preview how supporters will look.',
        nextNameIt: 'Continue',
        stepFrame: 'Frame',
        stepName: 'Name',
        stepSend: 'Send',
        tryPhotoOptional: 'Try with a photo (optional)',
        changePreviewPhoto: 'Change preview photo',
        adjustPhoto: 'Adjust photo',
        magicRemove: 'Magic remove background',
        zoomLevel: 'Zoom level',
        rotationAngle: 'Rotation angle',
        fitToFrame: 'Fit to frame',
        resetAll: 'Reset',
        saveOrShare: 'Save or share photo',
        downloadPhoto: 'Download',
        savePhoto: 'Save',
        uploadPhoto: 'Upload photo',
        changePhoto: 'Change photo',
        dragZoom: 'Drag to move. Scroll or pinch to zoom.',
        uploadFrameBelow: 'Upload your frame below',
        tapToAdd: 'Tap to add a photo',
        tagline: 'Bring your people together.',
    },
    publish: {
        createTitle: 'Name it',
        liveTitle: 'Send it',
        nameItHint: 'Description, goal, and category live on Manage after you publish.',
        thenSaveAccess: 'Then save access',
        sendNow: 'Send it now.',
        sendNowBody:
            'Campaigns that get shared in the first few minutes are the ones that fill up. Anyone who opens your link can add the frame to their photo.',
        shareWhatsApp: 'Share on WhatsApp',
        shareMessenger: 'Share on Messenger',
        shareAnother: 'Share another way',
        open: 'Open',
        saveCampaigns: 'Save your campaigns',
        saveCampaignsBody:
            'Optional, but this is how you manage the campaign from another phone. Get a 6 digit code by email. No password. Supporters still never sign in.',
        emailCode: 'Email me a code',
        enterCode: (email) => `Enter the 6 digit code sent to ${email}.`,
        saveMyCampaign: 'Save my campaign',
        sendNewCode: 'Send a new code',
        skipForNow: "Skip for now. I'll copy the manage link",
        closeBlocked:
            'Create a free login, or copy your manage link below, before you leave. Otherwise this campaign can disappear when you leave WhatsApp.',
        manage: 'Manage campaign',
        manageBody:
            'Change the title, description, goal, category, custom link, and frame. Old share links keep working when you rename the URL. Stats live here too.',
        privateKey: 'This link is a private key to your campaign. Keep it to yourself.',
        privateKeyEmail: (email) =>
            `Private key to your campaign. Also emailed to ${email}. Keep it to yourself.`,
        privateKeyOnly:
            'Private key to your campaign. Without an account it is the only way back in, so copy it somewhere safe.',
        done: 'Done',
        saveThenDone: 'Save access, then Done',
        campaignTitle: 'Campaign title',
        description: 'Description (optional)',
        goal: 'Goal (optional)',
        category: 'Category',
        emailBack: 'Email to get back in (recommended)',
        emailBackHint:
            "Creating never requires an account. An email is the reliable way back in after you leave WhatsApp's browser. Supporters are never emailed.",
        createButton: 'Create campaign',
        signedInAs: (email) => `Signed in as ${email}. This campaign goes straight onto your account.`,
        savedToAccount: (email) =>
            `Saved to your account, ${email}. Open it from any device by signing in with a code at /login.`,
        setupHub: 'Set up your campaign hub',
        setupHubBody: 'Optional: one public page with a Join button for this campaign and the ones you run next.',
        hubNextOptional: 'Optional next: your hub',
        claimHub: 'Claim hub with this campaign',
        claimingHub: 'Claiming hub…',
        hubLive: (handle) => `Your hub is live at ollabs.studio/u/${handle}`,
        openHub: 'Open your hub',
        shareHubWhatsApp: 'Share hub on WhatsApp',
    },
    day: {
        tapAdd: 'Tap to add your photo',
        zoom: 'Zoom',
        changePhoto: 'Change photo',
        saveOrShare: 'Save or share photo',
        savePhotoHint: 'In the sheet, tap Save Image to add it to your Photos app.',
        savePhotoUnavailable: 'Could not save here. Open this page in Safari, then try again.',
        download: 'Download',
        saved: 'Saved. Go set it as your profile picture.',
        createCampaign: 'Create a campaign',
    },
    mine: {
        title: 'My campaigns',
        lede: 'Your campaigns, and quick links back to each dashboard.',
        emptyAccount: 'No campaigns on this account yet',
        emptyDevice: 'No campaigns yet on this device',
        emptyAccountBody: 'Create a frame, then share the link on WhatsApp in the first hour. That is when most campaigns get their first supporter.',
        emptyDeviceBody: 'Create a frame in this browser, then send the link on WhatsApp right away. Campaigns that are not shared in the first hour almost never take off.',
        create: 'Create a campaign',
        whatsNew: "What's new",
        otherDevice: 'Made a campaign on another device?',
        signInCode: 'Sign in with a code',
        or: 'or',
        recoveryEmail: 'get a recovery link by email',
        haveAccount: 'Already have an account?',
        haveAccountBody: 'Sign in with a code and every campaign you saved to it shows up here, on any device. New campaigns join your account as you create them. Supporters never sign in.',
        loading: 'Loading your campaigns...',
        signedInAs: (email) => `Signed in as ${email}`,
        signOut: 'Sign out',
        travel: 'Where your campaigns travel',
        publishedFrom: 'Published from:',
        firstFrom: 'First supporters from:',
        hubYours: 'Your campaign hub',
        hubPut: 'Put these on one public page',
        hubClaim: 'Claim your campaign hub',
        hubSetup: (handle) => `Set up /u/${handle} with a Join button for your campaigns`,
        hubOneLink: 'One bio link with a Join button for the campaigns you run',
        hubSuggested: (handle) => `Suggested: /u/${handle} with Join button, bio, and links`,
        hubClaimLinks: 'Claim /u/… with Join button, bio, and other links',
        view: 'View',
        edit: 'Edit',
        onlyBrowser: 'Only in this browser',
        browserOnlyNote: 'Campaigns in this section live only in this browser. Keep their dashboard links saved somewhere safe.',
        openCampaign: 'Open campaign',
        manage: 'Manage',
        manageHint: 'Edit this campaign and see its stats',
        reuseFrame: 'Reuse frame',
        reuse: 'Reuse',
        reuseHint: 'Start a new campaign with this frame',
        removeHint: 'Remove from this list',
        publishedIn: (place) => `Published ${place}`,
        firstJoinIn: (place) => `First join ${place}`,
        shareNow: 'Share now on WhatsApp',
    },
    manage: {
        eyebrow: 'Campaign',
        loading: 'Loading your stats...',
        cantOpen: "Can't open this dashboard",
        needsKey: 'This page needs your private manage key. Use the link you saved when you created the campaign.',
        couldNotLoad: 'Could not load this campaign',
        copied: 'Copied',
        copy: 'Copy',
        openCampaign: 'Open campaign',
        showQr: 'Show QR code',
        scanQr: 'Scan to open, or screenshot to print',
        hub: 'Campaign hub',
        hubBody: 'Bio, Join button, and other links at /u/…',
        setUp: 'Set up',
        noSupporters: 'No supporters yet. Share now.',
        noSupportersBody: 'Most campaigns that take off get their first person in the first hour. Open WhatsApp and send the link to one group.',
        shareWhatsApp: 'Share on WhatsApp',
        views: 'Views',
        supporters: 'Supporters',
        conversion: 'Conversion',
        newSupporters: 'New supporters, last 14 days',
        total: (n) => `${n} total`,
        noneInWindow: 'No supporters yet in this window. Share your link to get started.',
        byCountry: 'Supporters by country',
        frame: 'Frame',
        frameBody: 'Change the design without starting over. Your link, your supporter count, and everyone who already has the link stay exactly as they are.',
        changeFrame: 'Change the frame',
        details: 'Campaign details',
        title: 'Title',
        description: 'Description',
        goal: 'Supporter goal',
        noGoal: 'No goal',
        category: 'Category',
        none: 'None',
        catCause: 'Causes',
        catSports: 'Sports',
        catEvent: 'Events',
        catFundraiser: 'Fundraisers',
        catCommunity: 'Community',
        catFaith: 'Faith',
        catSchool: 'Schools',
        catAwareness: 'Awareness',
        catBusiness: 'Business',
        catOther: 'Other',
        customLink: 'Custom link',
        slugHint: 'Letters and numbers become dashes. Changing this updates your share link. Older links redirect automatically so WhatsApp shares keep working.',
        save: 'Save changes',
        saved: 'Saved',
        couldNotSave: 'Could not save',
        nothingToUpdate: 'Nothing to update',
        linkTaken: 'That link name is taken. Try another.',
        linkInvalid: 'That link name is not valid. Use letters and numbers.',
        goalRange: 'Goal must be a number between 1 and 100,000,000.',
        frameTooLarge: 'Frame data is too large.',
        previewHttps: 'Preview URL must be https.',
        frameInvisible: "That frame would not show up on anyone's photo. Pick a border style or upload a frame image.",
        privateBefore: 'This dashboard is private to whoever has this link. Bookmark it, and do not share the part after',
        privateAfter: '.',
    },
    explore: {
        title: 'Explore campaigns',
        lede: 'Real campaigns people are rallying behind right now. Add one to your photo, or start your own.',
        popular: 'Popular',
        trending: 'Trending',
        newest: 'Newest',
        all: 'All',
        search: 'Search campaigns',
        noMatch: 'No campaigns match that search.',
        emptyCategory: 'No campaigns with 5 or more supporters in this category yet.',
        emptyGrid: 'Explore only lists campaigns with 5 or more supporters, so quiet frames stay off the public grid.',
        emptyShare: 'Share yours in the first hour. When it crosses five supporters, it can show up here.',
        create: 'Create a campaign',
        browseUses: 'Browse use cases',
        startOwn: 'Start your own campaign',
    },
    meta: {
        manage: 'Manage campaign',
        hub: 'Your hub',
        signIn: 'Organizer sign in',
        recover: 'Find my campaigns',
    },
    landingPt,
    landingId,
    landingTl,
    landingHi,
    landingEs,
};

const pt: Messages = {
    banner: {
        suggest: 'Looking for English? Switch language anytime.',
        switchTo: 'Use English',
        dismiss: 'Keep Portuguese',
    },
    nav: {
        explore: 'Explorar',
        guides: 'Guias',
        myCampaigns: 'Minhas campanhas',
        tabMine: 'Minhas',
        tabCreate: 'Criar',
        tabHub: 'Hub',
        create: 'Criar campanha',
        language: 'Idioma',
        english: 'EN',
        portuguese: 'PT',
    },
    footer: {
        guides: 'Guias',
        about: 'Sobre',
        contact: 'Contato',
        useCases: 'Para quem é',
        privacy: 'Privacidade',
        terms: 'Termos',
        label: 'Rodapé',
    },
    home: {
        headlineBefore: 'Sua causa em ',
        headlineAccent: 'cada perfil',
        lede: 'Um link. Menos de um minuto. Sem cadastro e sem marca d\'água para quem apoia.',
        nameLabel: 'Nome da sua campanha',
        namePlaceholder: 'Sua causa, time ou candidato',
        create: 'Criar campanha',
        free: 'Grátis. Sem conta.',
        exampleAlt: 'Exemplo de foto de perfil com moldura',
        slugFallback: 'sua-campanha',
        topCampaigns: 'Campanhas em alta',
        topCampaignsBody: 'Molduras que as pessoas estão usando agora, por número de apoiadores.',
        calendarLink: 'Datas para marcar',
        howTitle: 'Como funciona',
        how1Title: 'Envie sua moldura',
        how1Body: 'Logo, cores e slogan num PNG transparente.',
        how2Title: 'Compartilhe um link',
        how2Body: 'WhatsApp, Instagram, e-mail. Um URL para todo mundo.',
        how3Title: 'Elas salvam a foto',
        how3Body: 'Entram com a foto, baixam emoldurada, o contador sobe.',
        madeFor: 'Feito para',
        seeAllUseCases: 'Ver todos os usos',
        freeTitle: 'Grátis para quem apoia',
        freeBody:
            'Sem cadastro, sem marca d\'água, sem paywall. Envie a arte da moldura, compartilhe um link e veja o contador subir.',
        ctaTitle: 'Faça uma moldura',
        ctaBody: 'Leva menos de um minuto. Sem conta.',
    },
    campaign: {
        eyebrow: 'Campanha Ollabs',
        tapHint: 'Toque no círculo ou arraste uma foto.',
        uploadPhoto: 'Selecionar sua foto',
        uploadFailed: 'Não foi possível abrir essa imagem. Tente um JPG ou PNG.',
        stepAdd: 'Adicione sua foto',
        stepFit: 'Ajuste o enquadramento',
        stepShare: 'Baixe e compartilhe',
        size: 'Tamanho',
        dragHint: 'Arraste para mover. Use Tamanho para zoom.',
        saveOrShare: 'Salvar ou compartilhar foto',
        savePhotoHint: 'Na folha de compartilhamento, toque em Salvar imagem para ir às Fotos.',
        savePhotoUnavailable: 'Não deu para salvar aqui. Abra no Safari e tente de novo.',
        openInSafari: 'Abrir no Safari',
        download: 'Baixar foto',
        downloadedAgain: 'Baixado, baixar de novo',
        copyImage: 'Copiar imagem',
        imageCopied: 'Imagem copiada',
        newPhoto: 'Nova foto',
        share: 'Compartilhar',
        copied: 'Copiado',
        peopleSupporting: 'apoiadores',
        of: 'de',
        ofSupporters: 'apoiadores',
        goalReached: 'meta atingida',
        youreIn: 'Pronto. Agora chame a sua galera.',
        bringPeople:
            'Compartilhe a foto com a moldura primeiro. Depois envie o link para outras pessoas também colocarem.',
        sharePhoto: 'Compartilhar foto',
        shareStory: 'Compartilhar nos stories',
        shareWhatsApp: 'Compartilhar no WhatsApp',
        shareLinkWhatsApp: 'Compartilhar link no WhatsApp',
        shareMessenger: 'Compartilhar no Messenger',
        shareAnother: 'Compartilhar de outro jeito',
        moreWays: 'Outras formas de compartilhar',
        copyLink: 'Copiar link',
        linkCopiedPaste: 'Link copiado, cole junto com a sua foto',
        copyCaptionFailed: 'Não deu para copiar o link. Selecione isto e cole junto com a sua foto:',
        scanCampaign: 'Escaneie para abrir esta campanha',
        wantOwn: 'Quer uma moldura sua?',
        wantOwnBody:
            'Faça uma moldura para o seu time, escola ou campanha. É grátis, e você ganha um link igual a este para enviar.',
        makeOwn: 'Crie sua própria moldura',
        makeOwnFooter: 'Crie a sua no Ollabs',
        setupHub: 'Configure seu hub de campanhas',
        report: 'Denunciar esta campanha',
        guides: 'Guias',
        reportTitle: 'Denunciar esta campanha',
        reportPlaceholder: 'O que está errado? (opcional)',
        submitReport: 'Enviar denúncia',
        cancel: 'Cancelar',
        reportThanks: 'Obrigado, vamos analisar esta campanha.',
        inAppWhatsApp: 'Você está no navegador do WhatsApp.',
        inAppInstagram: 'Você está no navegador do Instagram.',
        inAppFacebook: 'Você está no navegador do Facebook.',
        inAppOpenBrowser: 'Abrir no navegador',
        inAppCopyLink: 'Copiar link',
        inAppDismiss: 'Continuar aqui',
        inAppSaveFailed: 'A imagem não baixou. Este navegador às vezes bloqueia o salvamento.',
        setPhotoTitle: 'Agora use como foto de perfil',
        setPhotoWhatsApp: 'WhatsApp: Configurações > toque na sua foto > Galeria',
        setPhotoInstagram: 'Instagram: Perfil > Editar perfil > Alterar foto',
        setPhotoFacebook: 'Facebook: toque na sua foto > Escolher foto do perfil',
        setPhotoGeneric: 'Abra o app e altere a foto de perfil. O arquivo já está na galeria.',
        setPhotoProof: 'Veja como fica',
        formatProfile: 'Foto de perfil',
        formatProfileSize: '1080 × 1080',
        formatStory: 'Story',
        formatStorySize: '1080 × 1920',
        canvasLabel: 'Moldura da campanha. Adicione sua foto aqui.',
    },
    create: {
        title: 'Criar campanha',
        editTitle: 'Editar sua moldura',
        subtitle: 'Envie sua moldura, dê um nome e compartilhe um link. Não precisa de conta.',
        editSubtitle: (name) => `Salva em "${name}". Seu link e seus apoiadores continuam iguais.`,
        yourFrame: 'Sua moldura',
        yourFrameHint:
            'Envie o logo, emblema ou moldura. Veja a prévia ao vivo enquanto abre a janela da foto.',
        artworkStep: 'Sua moldura',
        artworkStepHint: 'Logo, emblema ou PNG desenhado.',
        photoWindowStep: 'Janela da foto',
        photoWindowStepHint: 'Esquerda = mais moldura. Direita = mais foto.',
        addText: 'Adicionar texto',
        optional: 'opcional',
        uploadFrame: 'Enviar logo ou moldura',
        changeFrame: 'Trocar imagem da moldura',
        uploading: 'Enviando…',
        pngTip: 'PNG com transparência funciona melhor',
        opaqueFrameWarning:
            'Esta imagem parece opaca no centro. Use um PNG com um buraco transparente para a foto, ou abra a janela da foto com o controle abaixo.',
        photoWindow: 'Janela da foto',
        photoWindowHint:
            'Abra um círculo para a foto aparecer. Esquerda = mais moldura, direita = mais foto. Use 0 se o PNG já tiver o centro transparente.',
        tipLogo:
            'Um logo quadrado ou emblema redondo funciona bem. O Ollabs mantém o desenho de fora e abre uma janela no centro para a foto de cada pessoa.',
        simpleStyles: 'Sem arte? Comece aqui',
        simpleStylesHint: 'Ainda sem arte? Escolha um anel de cor para começar.',
        colourRings: 'Anéis de cor',
        canvasFrameHint: 'Envie a arte abaixo. Se quiser, teste com uma foto depois.',
        fineTune: 'Ajustar cores',
        previewContacts: 'Prévia nos contatos',
        createCampaign: 'Criar campanha',
        saveChanges: 'Salvar alterações',
        dragTip: 'Envie a moldura primeiro. Se quiser, solte uma foto no círculo para ver como fica.',
        nextNameIt: 'Continuar',
        stepFrame: 'Moldura',
        stepName: 'Nome',
        stepSend: 'Enviar',
        tryPhotoOptional: 'Testar com uma foto (opcional)',
        changePreviewPhoto: 'Trocar foto de preview',
        adjustPhoto: 'Ajustar a foto',
        magicRemove: 'Remover o fundo',
        zoomLevel: 'Zoom',
        rotationAngle: 'Rotação',
        fitToFrame: 'Encaixar na moldura',
        resetAll: 'Redefinir',
        saveOrShare: 'Salvar ou compartilhar',
        downloadPhoto: 'Baixar',
        savePhoto: 'Salvar',
        uploadPhoto: 'Enviar foto',
        changePhoto: 'Trocar foto',
        dragZoom: 'Arraste para mover. Role ou belisque para ampliar.',
        uploadFrameBelow: 'Envie a moldura abaixo',
        tapToAdd: 'Toque para adicionar uma foto',
        tagline: 'Junte a sua gente.',
    },
    publish: {
        createTitle: 'Dê um nome',
        liveTitle: 'Envie',
        nameItHint: 'Descrição, meta e categoria ficam em Gerenciar depois de publicar.',
        thenSaveAccess: 'Depois salve o acesso',
        sendNow: 'Envie agora.',
        sendNowBody:
            'Campanhas compartilhadas nos primeiros minutos são as que enchem. Quem abrir o link coloca a moldura na foto.',
        shareWhatsApp: 'Compartilhar no WhatsApp',
        shareMessenger: 'Compartilhar no Messenger',
        shareAnother: 'Compartilhar de outro jeito',
        open: 'Abrir',
        saveCampaigns: 'Salvar suas campanhas',
        saveCampaignsBody:
            'Opcional, mas é assim que você gerencia a campanha em outro celular. Receba um código de 6 dígitos por e-mail. Sem senha. Quem apoia nunca faz login.',
        emailCode: 'Me envie um código',
        enterCode: (email) => `Digite o código de 6 dígitos enviado para ${email}.`,
        saveMyCampaign: 'Salvar minha campanha',
        sendNewCode: 'Enviar outro código',
        skipForNow: 'Pular por agora. Vou copiar o link de gerenciar',
        closeBlocked:
            'Crie um login grátis, ou copie o link de gerenciar abaixo, antes de sair. Senão esta campanha pode sumir quando você sair do WhatsApp.',
        manage: 'Gerenciar campanha',
        manageBody:
            'Mude o título, descrição, meta, categoria, link personalizado e moldura. Links antigos continuam funcionando se você renomear a URL. As estatísticas ficam aqui.',
        privateKey: 'Este link é a chave privada da campanha. Guarde só para você.',
        privateKeyEmail: (email) =>
            `Chave privada da campanha. Também enviada para ${email}. Guarde só para você.`,
        privateKeyOnly:
            'Chave privada da campanha. Sem conta, é o único jeito de voltar. Copie em algum lugar seguro.',
        done: 'Pronto',
        saveThenDone: 'Salve o acesso e depois Pronto',
        campaignTitle: 'Título da campanha',
        description: 'Descrição (opcional)',
        goal: 'Meta (opcional)',
        category: 'Categoria',
        emailBack: 'E-mail para voltar depois (recomendado)',
        emailBackHint:
            'Criar nunca exige conta. O e-mail é o jeito seguro de voltar depois de sair do navegador do WhatsApp. Quem apoia nunca recebe e-mail.',
        createButton: 'Criar campanha',
        signedInAs: (email) =>
            `Conectado como ${email}. Esta campanha vai direto para a sua conta.`,
        savedToAccount: (email) =>
            `Salva na sua conta, ${email}. Abra em qualquer dispositivo entrando com um código em /login.`,
        setupHub: 'Configure seu hub de campanhas',
        setupHubBody: 'Opcional: uma página pública com botão Participar para esta campanha e as próximas.',
        hubNextOptional: 'Opcional: seu hub',
        claimHub: 'Criar hub com esta campanha',
        claimingHub: 'Criando hub…',
        hubLive: (handle) => `Seu hub está no ar em ollabs.studio/u/${handle}`,
        openHub: 'Abrir seu hub',
        shareHubWhatsApp: 'Compartilhar hub no WhatsApp',
    },
    day: {
        tapAdd: 'Toque para adicionar sua foto',
        zoom: 'Zoom',
        changePhoto: 'Trocar foto',
        saveOrShare: 'Salvar ou compartilhar foto',
        savePhotoHint: 'Na folha de compartilhamento, toque em Salvar imagem para ir às Fotos.',
        savePhotoUnavailable: 'Não deu para salvar aqui. Abra no Safari e tente de novo.',
        download: 'Baixar',
        saved: 'Salvo. Agora use como foto de perfil.',
        createCampaign: 'Criar uma campanha',
    },
    mine: {
        title: 'Minhas campanhas',
        lede: 'Suas campanhas, e atalhos para cada painel.',
        emptyAccount: 'Nenhuma campanha nesta conta ainda',
        emptyDevice: 'Nenhuma campanha neste aparelho ainda',
        emptyAccountBody: 'Crie uma moldura e compartilhe o link no WhatsApp na primeira hora. É quando a maioria das campanhas ganha o primeiro apoiador.',
        emptyDeviceBody: 'Crie uma moldura neste navegador e envie o link no WhatsApp agora. Campanha que não é compartilhada na primeira hora quase nunca decola.',
        create: 'Criar campanha',
        whatsNew: 'Novidades',
        otherDevice: 'Fez uma campanha em outro aparelho?',
        signInCode: 'Entrar com um código',
        or: 'ou',
        recoveryEmail: 'receber um link de recuperação por e-mail',
        haveAccount: 'Já tem uma conta?',
        haveAccountBody: 'Entre com um código e todas as campanhas salvas nela aparecem aqui, em qualquer aparelho. Campanhas novas entram na sua conta quando você cria. Quem apoia nunca entra.',
        loading: 'Carregando suas campanhas...',
        signedInAs: (email) => `Conectado como ${email}`,
        signOut: 'Sair',
        travel: 'Para onde suas campanhas viajam',
        publishedFrom: 'Publicado em:',
        firstFrom: 'Primeiros apoiadores em:',
        hubYours: 'Seu hub de campanhas',
        hubPut: 'Coloque tudo em uma página pública',
        hubClaim: 'Crie seu hub de campanhas',
        hubSetup: (handle) => `Monte /u/${handle} com um botão Participar para suas campanhas`,
        hubOneLink: 'Um link de bio com botão Participar para as campanhas que você conduz',
        hubSuggested: (handle) => `Sugestão: /u/${handle} com botão Participar, bio e links`,
        hubClaimLinks: 'Crie /u/… com botão Participar, bio e outros links',
        view: 'Ver',
        edit: 'Editar',
        onlyBrowser: 'Só neste navegador',
        browserOnlyNote: 'As campanhas desta seção existem só neste navegador. Guarde os links do painel em um lugar seguro.',
        openCampaign: 'Abrir campanha',
        manage: 'Gerenciar',
        manageHint: 'Editar esta campanha e ver os números',
        reuseFrame: 'Reusar moldura',
        reuse: 'Reusar',
        reuseHint: 'Começar uma campanha nova com esta moldura',
        removeHint: 'Tirar desta lista',
        publishedIn: (place) => `Publicado em ${place}`,
        firstJoinIn: (place) => `Primeiro apoio em ${place}`,
        shareNow: 'Compartilhar agora no WhatsApp',
    },
    manage: {
        eyebrow: 'Campanha',
        loading: 'Carregando os números...',
        cantOpen: 'Não dá para abrir este painel',
        needsKey: 'Esta página precisa da chave privada do painel. Use o link que você salvou ao criar a campanha.',
        couldNotLoad: 'Não foi possível carregar esta campanha',
        copied: 'Copiado',
        copy: 'Copiar',
        openCampaign: 'Abrir campanha',
        showQr: 'Mostrar QR',
        scanQr: 'Escaneie para abrir, ou tire um print para imprimir',
        hub: 'Hub de campanhas',
        hubBody: 'Bio, botão Participar e outros links em /u/…',
        setUp: 'Configurar',
        noSupporters: 'Ainda sem apoiadores. Compartilhe agora.',
        noSupportersBody: 'A maioria das campanhas que decolam recebe a primeira pessoa na primeira hora. Abra o WhatsApp e envie o link para um grupo.',
        shareWhatsApp: 'Compartilhar no WhatsApp',
        views: 'Visitas',
        supporters: 'Apoiadores',
        conversion: 'Conversão',
        newSupporters: 'Novos apoiadores, últimos 14 dias',
        total: (n) => `${n} no total`,
        noneInWindow: 'Nenhum apoiador neste período. Compartilhe o link para começar.',
        byCountry: 'Apoiadores por país',
        frame: 'Moldura',
        frameBody: 'Troque o desenho sem começar de novo. Seu link, a contagem de apoiadores e quem já tem o link continuam iguais.',
        changeFrame: 'Trocar a moldura',
        details: 'Detalhes da campanha',
        title: 'Título',
        description: 'Descrição',
        goal: 'Meta de apoiadores',
        noGoal: 'Sem meta',
        category: 'Categoria',
        none: 'Nenhuma',
        catCause: 'Causas',
        catSports: 'Esportes',
        catEvent: 'Eventos',
        catFundraiser: 'Arrecadações',
        catCommunity: 'Comunidade',
        catFaith: 'Fé',
        catSchool: 'Escolas',
        catAwareness: 'Conscientização',
        catBusiness: 'Negócios',
        catOther: 'Outro',
        customLink: 'Link personalizado',
        slugHint: 'Letras e números viram traços. Mudar isto atualiza o link de compartilhamento. Links antigos redirecionam sozinhos, então o WhatsApp continua funcionando.',
        save: 'Salvar alterações',
        saved: 'Salvo',
        couldNotSave: 'Não foi possível salvar',
        nothingToUpdate: 'Nada para atualizar',
        linkTaken: 'Esse nome de link já está em uso. Tente outro.',
        linkInvalid: 'Esse nome de link não é válido. Use letras e números.',
        goalRange: 'A meta precisa ser um número entre 1 e 100.000.000.',
        frameTooLarge: 'Os dados da moldura são grandes demais.',
        previewHttps: 'A URL de preview precisa ser https.',
        frameInvisible: 'Essa moldura não aparece na foto de ninguém. Escolha uma borda ou envie uma imagem de moldura.',
        privateBefore: 'Este painel é privado para quem tem este link. Salve nos favoritos e não compartilhe a parte depois de',
        privateAfter: '.',
    },
    explore: {
        title: 'Explorar campanhas',
        lede: 'Campanhas reais que as pessoas estão usando agora. Coloque uma na sua foto, ou crie a sua.',
        popular: 'Populares',
        trending: 'Em alta',
        newest: 'Novas',
        all: 'Todas',
        search: 'Buscar campanhas',
        noMatch: 'Nenhuma campanha combina com essa busca.',
        emptyCategory: 'Ainda não há campanhas com 5 ou mais apoiadores nesta categoria.',
        emptyGrid: 'Explorar só mostra campanhas com 5 ou mais apoiadores, para molduras paradas ficarem fora da grade.',
        emptyShare: 'Compartilhe a sua na primeira hora. Quando passar de cinco apoiadores, ela pode aparecer aqui.',
        create: 'Criar campanha',
        browseUses: 'Ver para quem é',
        startOwn: 'Criar sua campanha',
    },
    meta: {
        manage: 'Gerenciar campanha',
        hub: 'Seu hub',
        signIn: 'Entrar com um código',
        recover: 'Achar minhas campanhas',
    },
    landingPt,
    landingId,
    landingTl,
    landingHi,
    landingEs,
};

const id: Messages = {
    banner: {
        suggest: 'Looking for English? Switch language anytime.',
        switchTo: 'Use English',
        dismiss: 'Keep Indonesian',
    },
    nav: {
        explore: 'Explore',
        guides: 'Guides',
        myCampaigns: 'My campaigns',
        tabMine: 'Kampanye',
        tabCreate: 'Buat',
        tabHub: 'Hub',
        create: 'Create a campaign',
        language: 'Language',
        english: 'EN',
        portuguese: 'PT',
    },
    footer: {
        guides: 'Panduan',
        about: 'Tentang',
        contact: 'Kontak',
        useCases: 'Untuk siapa',
        privacy: 'Privasi',
        terms: 'Ketentuan',
        label: 'Footer',
    },
    home: {
        headlineBefore: 'Your cause on ',
        headlineAccent: 'every profile',
        lede: 'One link. Under a minute. No signup and no watermark for supporters.',
        nameLabel: 'Campaign name',
        namePlaceholder: 'Your cause, team, or candidate',
        create: 'Create a campaign',
        free: 'Free. No account.',
        exampleAlt: 'Example profile photo with a frame',
        slugFallback: 'your-campaign',
        topCampaigns: 'Top campaigns',
        topCampaignsBody: 'Real frames people are using right now, ranked by supporters.',
        calendarLink: 'Calendar moments',
        howTitle: 'How it works',
        how1Title: 'Upload your frame',
        how1Body: 'Your logo, colors, and slogan on a transparent PNG.',
        how2Title: 'Share one link',
        how2Body: 'WhatsApp, Instagram, email. One URL for everyone.',
        how3Title: 'They save the photo',
        how3Body: 'Drop in a picture, download it framed, counter goes up.',
        madeFor: 'Made for',
        seeAllUseCases: 'See all use cases',
        freeTitle: 'Free for supporters',
        freeBody:
            'No signup, no watermark, no paywall. Upload your own frame art, share one link, and watch the counter climb.',
        ctaTitle: 'Make a frame',
        ctaBody: 'Takes under a minute. No account needed.',
    },
    campaign: {
        eyebrow: 'Kampanye Ollabs',
        tapHint: 'Ketuk lingkaran atau seret foto ke situ.',
        uploadPhoto: 'Unggah fotomu',
        uploadFailed: 'Gambar itu tidak bisa dibuka. Coba JPG atau PNG.',
        stepAdd: 'Tambahkan fotomu',
        stepFit: 'Sesuaikan posisi',
        stepShare: 'Unduh & bagikan',
        size: 'Ukuran',
        dragHint: 'Geser untuk pindah. Pakai Ukuran untuk zoom.',
        saveOrShare: 'Simpan atau bagikan foto',
        savePhotoHint: 'Di lembar bagikan, ketuk Simpan Gambar untuk masuk ke Foto.',
        savePhotoUnavailable: 'Tidak bisa simpan di sini. Buka di Safari, lalu coba lagi.',
        openInSafari: 'Buka di Safari',
        download: 'Unduh foto',
        downloadedAgain: 'Sudah diunduh, unduh lagi',
        copyImage: 'Salin gambar',
        imageCopied: 'Gambar disalin',
        newPhoto: 'Foto baru',
        share: 'Bagikan',
        copied: 'Disalin',
        peopleSupporting: 'orang mendukung',
        of: 'dari',
        ofSupporters: 'pendukung',
        goalReached: 'target tercapai',
        youreIn: 'Sudah masuk. Sekarang ajak barenganmu.',
        bringPeople:
            'Bagikan dulu fotomu yang sudah dibingkai. Lalu kirim linknya supaya orang lain juga bisa pasang.',
        sharePhoto: 'Bagikan foto',
        shareStory: 'Bagikan ke story',
        shareWhatsApp: 'Bagikan di WhatsApp',
        shareLinkWhatsApp: 'Bagikan link di WhatsApp',
        shareMessenger: 'Bagikan di Messenger',
        shareAnother: 'Bagikan cara lain',
        moreWays: 'Cara lain untuk berbagi',
        copyLink: 'Salin link',
        linkCopiedPaste: 'Link disalin, tempel bersama fotomu',
        copyCaptionFailed: 'Link tidak tersalin. Pilih teks ini dan tempel bersama fotomu:',
        scanCampaign: 'Pindai untuk buka kampanye ini',
        wantOwn: 'Mau buat sendiri?',
        wantOwnBody:
            'Buat bingkai untuk tim, sekolah, atau kampanyemu. Gratis, dan kamu dapat link seperti ini untuk dibagikan.',
        makeOwn: 'Buat bingkai sendiri',
        makeOwnFooter: 'Buat sendiri di Ollabs',
        setupHub: 'Atur hub kampanyemu',
        report: 'Laporkan kampanye ini',
        guides: 'Panduan',
        reportTitle: 'Laporkan kampanye ini',
        reportPlaceholder: 'Ada apa yang salah? (opsional)',
        submitReport: 'Kirim laporan',
        cancel: 'Batal',
        reportThanks: 'Terima kasih, kami akan meninjau kampanye ini.',
        inAppWhatsApp: 'Kamu sedang di browser WhatsApp.',
        inAppInstagram: 'Kamu sedang di browser Instagram.',
        inAppFacebook: 'Kamu sedang di browser Facebook.',
        inAppOpenBrowser: 'Buka di browser',
        inAppCopyLink: 'Salin link',
        inAppDismiss: 'Lanjut di sini',
        inAppSaveFailed: 'Gambar tidak tersimpan. Browser dalam aplikasi kadang memblokir unduhan.',
        setPhotoTitle: 'Sekarang pasang sebagai foto profil',
        setPhotoWhatsApp: 'WhatsApp: Pengaturan > ketuk fotomu > Galeri',
        setPhotoInstagram: 'Instagram: Profil > Edit profil > Ganti foto',
        setPhotoFacebook: 'Facebook: ketuk fotomu > Pilih foto profil',
        setPhotoGeneric: 'Buka aplikasinya dan ganti foto profil. Filenya sudah di galeri.',
        setPhotoProof: 'Begini tampilannya',
        formatProfile: 'Foto profil',
        formatProfileSize: '1080 × 1080',
        formatStory: 'Story',
        formatStorySize: '1080 × 1920',
        canvasLabel: 'Bingkai kampanye. Tambahkan fotomu di sini.',
    },
    create: {
        title: 'Pembuat kampanye',
        editTitle: 'Edit bingkaimu',
        subtitle: 'Unggah bingkai, beri nama, bagikan satu link. Tidak perlu akun.',
        editSubtitle: (name) => `Disimpan ke "${name}". Link dan pendukungmu tetap sama.`,
        yourFrame: 'Bingkaimu',
        yourFrameHint:
            'Unggah logo, lencana, atau desain bingkai. Lihat pratinjau langsung sambil membuka jendela untuk foto.',
        artworkStep: 'Bingkaimu',
        artworkStepHint: 'Logo, lencana, atau PNG desain.',
        photoWindowStep: 'Jendela foto',
        photoWindowStepHint: 'Kiri = lebih banyak bingkai. Kanan = lebih banyak foto.',
        addText: 'Tambah teks',
        optional: 'opsional',
        uploadFrame: 'Unggah logo atau bingkai',
        changeFrame: 'Ganti gambar bingkai',
        uploading: 'Mengunggah…',
        pngTip: 'PNG dengan transparansi paling bagus',
        opaqueFrameWarning:
            'Gambar ini terlihat solid di tengah. Pakai PNG dengan lubang transparan untuk foto, atau buka jendela foto dengan slider di bawah.',
        photoWindow: 'Jendela foto',
        photoWindowHint:
            'Potong lingkaran supaya fotonya terlihat. Kiri = lebih banyak bingkai, kanan = lebih banyak foto. Setel 0 jika PNG-mu sudah transparan di tengah.',
        tipLogo:
            'Logo persegi atau lencana bulat cocok. Ollabs menjaga desain luar dan membuka jendela di tengah untuk foto setiap pendukung.',
        simpleStyles: 'Belum ada desain? Mulai di sini',
        simpleStylesHint: 'Belum ada desain? Pilih cincin warna untuk mulai.',
        colourRings: 'Cincin warna',
        canvasFrameHint: 'Unggah desain di bawah. Kalau mau, coba dengan foto setelahnya.',
        fineTune: 'Sesuaikan warna',
        previewContacts: 'Pratinjau di kontak',
        createCampaign: 'Buat kampanye',
        saveChanges: 'Simpan perubahan',
        dragTip: 'Unggah bingkai dulu. Opsional: jatuhkan foto ke lingkaran untuk pratinjau.',
        nextNameIt: 'Lanjut',
        stepFrame: 'Bingkai',
        stepName: 'Nama',
        stepSend: 'Kirim',
        tryPhotoOptional: 'Coba dengan foto (opsional)',
        changePreviewPhoto: 'Ganti foto pratinjau',
        adjustPhoto: 'Sesuaikan foto',
        magicRemove: 'Hapus latar',
        zoomLevel: 'Zoom',
        rotationAngle: 'Rotasi',
        fitToFrame: 'Sesuaikan ke bingkai',
        resetAll: 'Atur ulang',
        saveOrShare: 'Simpan atau bagikan',
        downloadPhoto: 'Unduh',
        savePhoto: 'Simpan',
        uploadPhoto: 'Unggah foto',
        changePhoto: 'Ganti foto',
        dragZoom: 'Seret untuk memindahkan. Gulir atau cubit untuk zoom.',
        uploadFrameBelow: 'Unggah bingkai di bawah',
        tapToAdd: 'Ketuk untuk menambah foto',
        tagline: 'Kumpulkan orang-orangmu.',
    },
    publish: {
        createTitle: 'Beri nama',
        liveTitle: 'Kirim',
        nameItHint: 'Deskripsi, target, dan kategori ada di Kelola setelah kamu publikasikan.',
        thenSaveAccess: 'Lalu simpan akses',
        sendNow: 'Kirim sekarang.',
        sendNowBody:
            'Kampanye yang dibagikan di menit-menit pertama yang paling cepat penuh. Siapa pun yang buka linkmu bisa pasang bingkai di fotonya.',
        shareWhatsApp: 'Bagikan di WhatsApp',
        shareMessenger: 'Bagikan di Messenger',
        shareAnother: 'Bagikan cara lain',
        open: 'Buka',
        saveCampaigns: 'Simpan kampanyemu',
        saveCampaignsBody:
            'Opsional, tapi begini kamu bisa kelola kampanye dari HP lain. Dapat kode 6 digit lewat email. Tanpa kata sandi. Pendukung tetap tidak perlu masuk.',
        emailCode: 'Kirimi aku kode',
        enterCode: (email) => `Masukkan kode 6 digit yang dikirim ke ${email}.`,
        saveMyCampaign: 'Simpan kampanyeku',
        sendNewCode: 'Kirim kode baru',
        skipForNow: 'Lewati dulu. Aku akan salin link kelola',
        closeBlocked:
            'Buat login gratis, atau salin link kelola di bawah, sebelum keluar. Kalau tidak kampanye ini bisa hilang saat kamu keluar dari WhatsApp.',
        manage: 'Kelola kampanye',
        manageBody:
            'Ubah judul, deskripsi, target, kategori, link kustom, dan bingkai. Link lama tetap jalan saat kamu mengganti URL. Statistik juga di sini.',
        privateKey: 'Link ini adalah kunci pribadi kampanyemu. Simpan untuk dirimu sendiri.',
        privateKeyEmail: (email) =>
            `Kunci pribadi kampanyemu. Juga dikirim ke ${email}. Simpan untuk dirimu sendiri.`,
        privateKeyOnly:
            'Kunci pribadi kampanyemu. Tanpa akun, ini satu-satunya cara kembali. Salin ke tempat aman.',
        done: 'Selesai',
        saveThenDone: 'Simpan akses, lalu Selesai',
        campaignTitle: 'Judul kampanye',
        description: 'Deskripsi (opsional)',
        goal: 'Target (opsional)',
        category: 'Kategori',
        emailBack: 'Email untuk kembali lagi (disarankan)',
        emailBackHint:
            'Membuat tidak pernah butuh akun. Email adalah cara andal untuk kembali setelah keluar dari browser WhatsApp. Pendukung tidak pernah diemail.',
        createButton: 'Buat kampanye',
        signedInAs: (email) =>
            `Masuk sebagai ${email}. Kampanye ini langsung masuk ke akunmu.`,
        savedToAccount: (email) =>
            `Disimpan ke akunmu, ${email}. Buka dari perangkat mana saja dengan masuk pakai kode di /login.`,
        setupHub: 'Atur hub kampanyemu',
        setupHubBody: 'Opsional: satu halaman publik dengan tombol Gabung untuk kampanye ini dan berikutnya.',
        hubNextOptional: 'Opsional: hubmu',
        claimHub: 'Klaim hub dengan kampanye ini',
        claimingHub: 'Mengklaim hub…',
        hubLive: (handle) => `Hubmu sudah live di ollabs.studio/u/${handle}`,
        openHub: 'Buka hubmu',
        shareHubWhatsApp: 'Bagikan hub di WhatsApp',
    },
    day: {
        tapAdd: 'Ketuk untuk menambah fotomu',
        zoom: 'Zoom',
        changePhoto: 'Ganti foto',
        saveOrShare: 'Simpan atau bagikan foto',
        savePhotoHint: 'Di lembar bagikan, ketuk Simpan Gambar untuk masuk ke Foto.',
        savePhotoUnavailable: 'Tidak bisa simpan di sini. Buka di Safari, lalu coba lagi.',
        download: 'Unduh',
        saved: 'Tersimpan. Pasang sebagai foto profilmu.',
        createCampaign: 'Buat kampanye',
    },
    mine: {
        title: 'Kampanye saya',
        lede: 'Kampanyemu, dan jalan cepat kembali ke setiap dasbor.',
        emptyAccount: 'Belum ada kampanye di akun ini',
        emptyDevice: 'Belum ada kampanye di perangkat ini',
        emptyAccountBody: 'Buat bingkai, lalu bagikan link di WhatsApp pada jam pertama. Saat itulah sebagian besar kampanye mendapat pendukung pertama.',
        emptyDeviceBody: 'Buat bingkai di browser ini, lalu kirim link di WhatsApp sekarang. Kampanye yang tidak dibagikan pada jam pertama hampir tidak pernah jalan.',
        create: 'Buat kampanye',
        whatsNew: 'Yang baru',
        otherDevice: 'Buat kampanye di perangkat lain?',
        signInCode: 'Masuk dengan kode',
        or: 'atau',
        recoveryEmail: 'dapatkan link pemulihan lewat email',
        haveAccount: 'Sudah punya akun?',
        haveAccountBody: 'Masuk dengan kode dan setiap kampanye yang kamu simpan muncul di sini, di perangkat mana saja. Kampanye baru masuk ke akunmu saat kamu membuatnya. Pendukung tidak pernah masuk.',
        loading: 'Memuat kampanyemu...',
        signedInAs: (email) => `Masuk sebagai ${email}`,
        signOut: 'Keluar',
        travel: 'Ke mana kampanyemu pergi',
        publishedFrom: 'Diterbitkan dari:',
        firstFrom: 'Pendukung pertama dari:',
        hubYours: 'Hub kampanyemu',
        hubPut: 'Satukan di satu halaman publik',
        hubClaim: 'Klaim hub kampanyemu',
        hubSetup: (handle) => `Siapkan /u/${handle} dengan tombol Gabung untuk kampanyemu`,
        hubOneLink: 'Satu link bio dengan tombol Gabung untuk kampanye yang kamu jalankan',
        hubSuggested: (handle) => `Saran: /u/${handle} dengan tombol Gabung, bio, dan tautan`,
        hubClaimLinks: 'Klaim /u/… dengan tombol Gabung, bio, dan tautan lain',
        view: 'Lihat',
        edit: 'Edit',
        onlyBrowser: 'Hanya di browser ini',
        browserOnlyNote: 'Kampanye di bagian ini hanya ada di browser ini. Simpan link dasbornya di tempat yang aman.',
        openCampaign: 'Buka kampanye',
        manage: 'Kelola',
        manageHint: 'Edit kampanye ini dan lihat angkanya',
        reuseFrame: 'Pakai lagi bingkai',
        reuse: 'Pakai lagi',
        reuseHint: 'Mulai kampanye baru dengan bingkai ini',
        removeHint: 'Hapus dari daftar ini',
        publishedIn: (place) => `Diterbitkan di ${place}`,
        firstJoinIn: (place) => `Dukungan pertama di ${place}`,
        shareNow: 'Bagikan sekarang di WhatsApp',
    },
    manage: {
        eyebrow: 'Kampanye',
        loading: 'Memuat angkamu...',
        cantOpen: 'Dasbor ini tidak bisa dibuka',
        needsKey: 'Halaman ini butuh kunci privat dasbor. Pakai link yang kamu simpan saat membuat kampanye.',
        couldNotLoad: 'Kampanye ini tidak bisa dimuat',
        copied: 'Tersalin',
        copy: 'Salin',
        openCampaign: 'Buka kampanye',
        showQr: 'Tampilkan QR',
        scanQr: 'Pindai untuk membuka, atau screenshot untuk dicetak',
        hub: 'Hub kampanye',
        hubBody: 'Bio, tombol Gabung, dan tautan lain di /u/…',
        setUp: 'Siapkan',
        noSupporters: 'Belum ada pendukung. Bagikan sekarang.',
        noSupportersBody: 'Sebagian besar kampanye yang jalan mendapat orang pertama di jam pertama. Buka WhatsApp dan kirim link ke satu grup.',
        shareWhatsApp: 'Bagikan di WhatsApp',
        views: 'Tayangan',
        supporters: 'Pendukung',
        conversion: 'Konversi',
        newSupporters: 'Pendukung baru, 14 hari terakhir',
        total: (n) => `${n} total`,
        noneInWindow: 'Belum ada pendukung di periode ini. Bagikan linkmu untuk mulai.',
        byCountry: 'Pendukung menurut negara',
        frame: 'Bingkai',
        frameBody: 'Ganti desain tanpa mulai dari awal. Linkmu, jumlah pendukung, dan siapa pun yang sudah punya link tetap sama.',
        changeFrame: 'Ganti bingkai',
        details: 'Detail kampanye',
        title: 'Judul',
        description: 'Deskripsi',
        goal: 'Target pendukung',
        noGoal: 'Tanpa target',
        category: 'Kategori',
        none: 'Tidak ada',
        catCause: 'Gerakan',
        catSports: 'Olahraga',
        catEvent: 'Acara',
        catFundraiser: 'Penggalangan dana',
        catCommunity: 'Komunitas',
        catFaith: 'Kepercayaan',
        catSchool: 'Sekolah',
        catAwareness: 'Kesadaran',
        catBusiness: 'Bisnis',
        catOther: 'Lainnya',
        customLink: 'Link khusus',
        slugHint: 'Huruf dan angka jadi tanda hubung. Mengubah ini memperbarui link berbagi. Link lama dialihkan otomatis, jadi WhatsApp tetap jalan.',
        save: 'Simpan perubahan',
        saved: 'Tersimpan',
        couldNotSave: 'Tidak bisa menyimpan',
        nothingToUpdate: 'Tidak ada yang diubah',
        linkTaken: 'Nama link itu sudah dipakai. Coba yang lain.',
        linkInvalid: 'Nama link itu tidak valid. Pakai huruf dan angka.',
        goalRange: 'Target harus angka antara 1 dan 100.000.000.',
        frameTooLarge: 'Data bingkai terlalu besar.',
        previewHttps: 'URL pratinjau harus https.',
        frameInvisible: 'Bingkai itu tidak akan terlihat di foto siapa pun. Pilih gaya tepi atau unggah gambar bingkai.',
        privateBefore: 'Dasbor ini privat bagi siapa pun yang punya link ini. Simpan bookmark, dan jangan bagikan bagian setelah',
        privateAfter: '.',
    },
    explore: {
        title: 'Jelajahi kampanye',
        lede: 'Kampanye nyata yang sedang dipakai orang. Pasang di fotomu, atau buat sendiri.',
        popular: 'Populer',
        trending: 'Sedang naik',
        newest: 'Terbaru',
        all: 'Semua',
        search: 'Cari kampanye',
        noMatch: 'Tidak ada kampanye yang cocok.',
        emptyCategory: 'Belum ada kampanye dengan 5 pendukung atau lebih di kategori ini.',
        emptyGrid: 'Jelajah hanya menampilkan kampanye dengan 5 pendukung atau lebih, supaya bingkai yang sepi tidak masuk grid.',
        emptyShare: 'Bagikan milikmu di jam pertama. Setelah lewat lima pendukung, kampanye itu bisa muncul di sini.',
        create: 'Buat kampanye',
        browseUses: 'Lihat contoh',
        startOwn: 'Buat kampanyemu',
    },
    meta: {
        manage: 'Kelola kampanye',
        hub: 'Hub kamu',
        signIn: 'Masuk dengan kode',
        recover: 'Cari kampanyeku',
    },
    landingPt,
    landingId,
    landingTl,
    landingHi,
    landingEs,
};

export const dictionaries: Record<'en' | 'pt' | 'id', Messages> = { en, pt, id };

export function getMessages(locale: Locale): Messages {
    if (locale === 'es' || locale === 'tl') {
        return applyLocaleOverlay(en, locale);
    }
    return dictionaries[locale] || dictionaries.en;
}
