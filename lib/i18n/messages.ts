import type { Locale } from './locale';

/** UI chrome strings. Campaign titles stay as the organizer wrote them. */
export type Messages = {
    banner: {
        suggest: string;
        switchTo: string;
        dismiss: string;
    };
    campaign: {
        eyebrow: string;
        tapHint: string;
        uploadPhoto: string;
        stepAdd: string;
        stepFit: string;
        stepShare: string;
        size: string;
        saveOrShare: string;
        savePhotoHint: string;
        savePhotoUnavailable: string;
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
        shareWhatsApp: string;
        shareMessenger: string;
        shareAnother: string;
        copyLink: string;
        scanCampaign: string;
        wantOwn: string;
        wantOwnBody: string;
        makeOwn: string;
        makeOwnFooter: string;
        setupHub: string;
        report: string;
        reportTitle: string;
        reportPlaceholder: string;
        submitReport: string;
        cancel: string;
        reportThanks: string;
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
        fallback: string;
        uploadFrame: string;
        changeFrame: string;
        uploading: string;
        pngTip: string;
        photoWindow: string;
        photoWindowHint: string;
        tipLogo: string;
        simpleStyles: string;
        simpleStylesHint: string;
        fineTune: string;
        previewContacts: string;
        createCampaign: string;
        saveChanges: string;
        dragTip: string;
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
    campaign: {
        eyebrow: 'Ollabs campaign',
        tapHint: 'Tap the circle or drag a photo onto it.',
        uploadPhoto: 'Upload your photo',
        stepAdd: 'Add your photo',
        stepFit: 'Adjust the fit',
        stepShare: 'Download & share',
        size: 'Size',
        saveOrShare: 'Save or share photo',
        savePhotoHint: 'In the sheet, tap Save Image to add it to your Photos app.',
        savePhotoUnavailable: 'Could not save here. Open this page in Safari, then try again.',
        download: 'Download',
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
        bringPeople: 'Post your framed photo, and share the link so others can add it too.',
        shareWhatsApp: 'Share on WhatsApp',
        shareMessenger: 'Share on Messenger',
        shareAnother: 'Share another way',
        copyLink: 'Copy link',
        scanCampaign: 'Scan to open this campaign',
        wantOwn: 'Want one of your own?',
        wantOwnBody:
            'Make a frame for your team, your school, your campaign. It is free, and you get a link just like this one to send out.',
        makeOwn: 'Make your own frame',
        makeOwnFooter: 'Make your own with Ollabs',
        setupHub: 'Set up your campaign hub',
        report: 'Report this campaign',
        reportTitle: 'Report this campaign',
        reportPlaceholder: "What's wrong with it? (optional)",
        submitReport: 'Submit report',
        cancel: 'Cancel',
        reportThanks: 'Thanks, we will review this campaign.',
    },
    create: {
        title: 'Campaign builder',
        editTitle: 'Edit your frame',
        subtitle: 'Upload your frame, name it, send one link. No account needed.',
        editSubtitle: (name) => `Saves to "${name}". Your link and supporters stay put.`,
        yourFrame: 'Your frame',
        yourFrameHint:
            'Upload your logo, badge, or designed frame. Watch the live preview above while you open a window for the photo.',
        artworkStep: '1. Your artwork',
        artworkStepHint: 'Logo, badge, or designed PNG.',
        photoWindowStep: '2. Photo window',
        photoWindowStepHint: 'Left = more frame. Right = more photo.',
        addText: 'Add text',
        optional: 'optional',
        fallback: 'fallback',
        uploadFrame: 'Upload logo or frame',
        changeFrame: 'Change frame image',
        uploading: 'Uploading…',
        pngTip: 'PNG with transparency works best',
        photoWindow: 'Photo window',
        photoWindowHint:
            'Cut a circle so the photo shows through. Left = more frame, right = more photo. Set to 0 if your PNG already has a transparent center.',
        tipLogo:
            "A square logo or round badge works great. Ollabs keeps the outer design and opens a window in the center for each supporter's photo.",
        simpleStyles: 'Simple styles',
        simpleStylesHint: 'No artwork yet? Pick a colour ring to start.',
        fineTune: 'Fine tune colours',
        previewContacts: 'Preview in contacts',
        createCampaign: 'Create campaign',
        saveChanges: 'Save changes',
        dragTip: 'Upload your frame first. Optionally drop a photo on the circle to preview how supporters will look.',
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
        setupHubBody: 'One link for your bio, Support button, and every campaign you run.',
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
    campaign: {
        eyebrow: 'Campanha Ollabs',
        tapHint: 'Toque no círculo ou arraste uma foto.',
        uploadPhoto: 'Enviar sua foto',
        stepAdd: 'Adicione sua foto',
        stepFit: 'Ajuste o enquadramento',
        stepShare: 'Baixe e compartilhe',
        size: 'Tamanho',
        saveOrShare: 'Salvar ou compartilhar foto',
        savePhotoHint: 'Na folha de compartilhamento, toque em Salvar imagem para ir às Fotos.',
        savePhotoUnavailable: 'Não deu para salvar aqui. Abra no Safari e tente de novo.',
        download: 'Baixar',
        downloadedAgain: 'Baixado, baixar de novo',
        copyImage: 'Copiar imagem',
        imageCopied: 'Imagem copiada',
        newPhoto: 'Nova foto',
        share: 'Compartilhar',
        copied: 'Copiado',
        peopleSupporting: 'pessoas apoiando',
        of: 'de',
        ofSupporters: 'apoiadores',
        goalReached: 'meta atingida',
        youreIn: 'Pronto. Agora chame a sua galera.',
        bringPeople:
            'Poste a foto com a moldura e compartilhe o link para outras pessoas também colocarem.',
        shareWhatsApp: 'Compartilhar no WhatsApp',
        shareMessenger: 'Compartilhar no Messenger',
        shareAnother: 'Compartilhar de outro jeito',
        copyLink: 'Copiar link',
        scanCampaign: 'Escaneie para abrir esta campanha',
        wantOwn: 'Quer uma moldura sua?',
        wantOwnBody:
            'Faça uma moldura para o seu time, escola ou campanha. É grátis, e você ganha um link igual a este para enviar.',
        makeOwn: 'Criar minha moldura',
        makeOwnFooter: 'Crie a sua no Ollabs',
        setupHub: 'Configure seu hub de campanhas',
        report: 'Denunciar esta campanha',
        reportTitle: 'Denunciar esta campanha',
        reportPlaceholder: 'O que está errado? (opcional)',
        submitReport: 'Enviar denúncia',
        cancel: 'Cancelar',
        reportThanks: 'Obrigado, vamos analisar esta campanha.',
    },
    create: {
        title: 'Criar campanha',
        editTitle: 'Editar sua moldura',
        subtitle: 'Envie sua moldura, dê um nome e compartilhe um link. Não precisa de conta.',
        editSubtitle: (name) => `Salva em "${name}". Seu link e seus apoiadores continuam iguais.`,
        yourFrame: 'Sua moldura',
        yourFrameHint:
            'Envie o logo, emblema ou moldura. Veja a prévia ao vivo enquanto abre a janela da foto.',
        artworkStep: '1. Sua arte',
        artworkStepHint: 'Logo, emblema ou PNG desenhado.',
        photoWindowStep: '2. Janela da foto',
        photoWindowStepHint: 'Esquerda = mais moldura. Direita = mais foto.',
        addText: 'Adicionar texto',
        optional: 'opcional',
        fallback: 'alternativa',
        uploadFrame: 'Enviar logo ou moldura',
        changeFrame: 'Trocar imagem da moldura',
        uploading: 'Enviando…',
        pngTip: 'PNG com transparência funciona melhor',
        photoWindow: 'Janela da foto',
        photoWindowHint:
            'Abra um círculo para a foto aparecer. Esquerda = mais moldura, direita = mais foto. Use 0 se o PNG já tiver o centro transparente.',
        tipLogo:
            'Um logo quadrado ou emblema redondo funciona bem. O Ollabs mantém o desenho de fora e abre uma janela no centro para a foto de cada pessoa.',
        simpleStyles: 'Estilos simples',
        simpleStylesHint: 'Ainda sem arte? Escolha um anel de cor para começar.',
        fineTune: 'Ajustar cores',
        previewContacts: 'Prévia nos contatos',
        createCampaign: 'Criar campanha',
        saveChanges: 'Salvar alterações',
        dragTip: 'Arraste uma foto para o círculo e veja como fica. Aperte ou arraste para encaixar.',
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
        setupHubBody: 'Um link para bio, botão Apoiar e todas as suas campanhas.',
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
    campaign: {
        eyebrow: 'Kampanye Ollabs',
        tapHint: 'Ketuk lingkaran atau seret foto ke situ.',
        uploadPhoto: 'Unggah fotomu',
        stepAdd: 'Tambahkan fotomu',
        stepFit: 'Sesuaikan posisi',
        stepShare: 'Unduh & bagikan',
        size: 'Ukuran',
        saveOrShare: 'Simpan atau bagikan foto',
        savePhotoHint: 'Di lembar bagikan, ketuk Simpan Gambar untuk masuk ke Foto.',
        savePhotoUnavailable: 'Tidak bisa simpan di sini. Buka di Safari, lalu coba lagi.',
        download: 'Unduh',
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
            'Posting fotomu yang sudah dibingkai, dan bagikan linknya supaya orang lain juga bisa pasang.',
        shareWhatsApp: 'Bagikan di WhatsApp',
        shareMessenger: 'Bagikan di Messenger',
        shareAnother: 'Bagikan cara lain',
        copyLink: 'Salin link',
        scanCampaign: 'Pindai untuk buka kampanye ini',
        wantOwn: 'Mau buat sendiri?',
        wantOwnBody:
            'Buat bingkai untuk tim, sekolah, atau kampanyemu. Gratis, dan kamu dapat link seperti ini untuk dibagikan.',
        makeOwn: 'Buat bingkai sendiri',
        makeOwnFooter: 'Buat sendiri di Ollabs',
        setupHub: 'Atur hub kampanyemu',
        report: 'Laporkan kampanye ini',
        reportTitle: 'Laporkan kampanye ini',
        reportPlaceholder: 'Ada apa yang salah? (opsional)',
        submitReport: 'Kirim laporan',
        cancel: 'Batal',
        reportThanks: 'Terima kasih, kami akan meninjau kampanye ini.',
    },
    create: {
        title: 'Pembuat kampanye',
        editTitle: 'Edit bingkaimu',
        subtitle: 'Unggah bingkai, beri nama, bagikan satu link. Tidak perlu akun.',
        editSubtitle: (name) => `Disimpan ke "${name}". Link dan pendukungmu tetap sama.`,
        yourFrame: 'Bingkaimu',
        yourFrameHint:
            'Unggah logo, lencana, atau desain bingkai. Lihat pratinjau langsung sambil membuka jendela untuk foto.',
        artworkStep: '1. Desainmu',
        artworkStepHint: 'Logo, lencana, atau PNG desain.',
        photoWindowStep: '2. Jendela foto',
        photoWindowStepHint: 'Kiri = lebih banyak bingkai. Kanan = lebih banyak foto.',
        addText: 'Tambah teks',
        optional: 'opsional',
        fallback: 'cadangan',
        uploadFrame: 'Unggah logo atau bingkai',
        changeFrame: 'Ganti gambar bingkai',
        uploading: 'Mengunggah…',
        pngTip: 'PNG dengan transparansi paling bagus',
        photoWindow: 'Jendela foto',
        photoWindowHint:
            'Potong lingkaran supaya fotonya terlihat. Kiri = lebih banyak bingkai, kanan = lebih banyak foto. Setel 0 jika PNG-mu sudah transparan di tengah.',
        tipLogo:
            'Logo persegi atau lencana bulat cocok. Ollabs menjaga desain luar dan membuka jendela di tengah untuk foto setiap pendukung.',
        simpleStyles: 'Gaya sederhana',
        simpleStylesHint: 'Belum ada desain? Pilih cincin warna untuk mulai.',
        fineTune: 'Sesuaikan warna',
        previewContacts: 'Pratinjau di kontak',
        createCampaign: 'Buat kampanye',
        saveChanges: 'Simpan perubahan',
        dragTip:
            'Seret foto ke lingkaran untuk melihat hasilnya. Cubit atau geser untuk menyesuaikan.',
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
        setupHubBody: 'Satu link untuk bio, tombol Dukung, dan semua kampanyemu.',
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
    landingPt,
    landingId,
    landingTl,
    landingHi,
    landingEs,
};

export const dictionaries: Record<Locale, Messages> = { en, pt, id };

export function getMessages(locale: Locale): Messages {
    return dictionaries[locale] || dictionaries.en;
}
