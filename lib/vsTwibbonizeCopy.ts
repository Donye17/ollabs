export type VsCopy = {
    metaTitle: string;
    metaDescription: string;
    eyebrow: string;
    h1: string;
    hero: string;
    createCta: string;
    exploreCta: string;
    tableHeaderOllabs: string;
    tableHeaderTwibbonize: string;
    disclaimer: string;
    honestTitle: string;
    honestP1: string;
    honestP2: string;
    faqTitle: string;
    faqs: { q: string; a: string }[];
    tryTitle: string;
    tryBody: string;
    tryCta: string;
    rows: { label: string; ollabs: string; twibbonize: string; ollabsWins: boolean }[];
};

export const VS_EN: VsCopy = {
    metaTitle: 'Ollabs vs Twibbonize',
    metaDescription:
        'An honest comparison of Ollabs and Twibbonize for profile picture frame campaigns. The core difference: Twibbonize charges supporters to remove a watermark. Ollabs never charges supporters.',
    eyebrow: 'Comparison',
    h1: 'Ollabs vs Twibbonize',
    hero: 'Both let you run a profile picture frame campaign. The difference that actually matters is who ends up paying: Twibbonize charges your supporters to remove a watermark. Ollabs never charges supporters, ever.',
    createCta: 'Create a free campaign',
    exploreCta: 'See live campaigns',
    tableHeaderOllabs: 'Ollabs',
    tableHeaderTwibbonize: 'Twibbonize',
    disclaimer:
        'Based on Twibbonize\'s own published help documentation on watermarks and its Remove Watermark plan, current as of August 2026. Products change; if something here is out of date, tell us at hello@ollabs.studio and we will correct it.',
    honestTitle: 'Where Twibbonize is the better pick',
    honestP1:
        'We would rather be straight with you than pretend there is no reason to use them. Twibbonize is enormous, has been running for years, and has native mobile apps. It is especially established in Indonesia and the Philippines. If you want an app on the App Store, or you are running a campaign in a market where everyone already knows the Twibbonize name, that familiarity is worth something.',
    honestP2:
        'Ollabs is newer and smaller. There are ads on some pages and they are what keeps it free. What we will not do is put a watermark or a payment screen between your supporters and the thing you asked them to do, or run an ad on the photo itself.',
    faqTitle: 'Common questions',
    faqs: [
        {
            q: 'What is the actual difference between Ollabs and Twibbonize?',
            a: 'Who pays. Twibbonize\'s business model puts a watermark on the photo a supporter downloads and charges to remove it. Ollabs makes money from organizers who choose to support it, never from supporters. Your supporters download a clean, unwatermarked photo every time.',
        },
        {
            q: 'Why does the watermark matter so much?',
            a: 'If you are a nonprofit, school, or company, a watermark and a paywall land on your supporters, not on the platform. They see your campaign and then they see an upsell. That reflects on your organization.',
        },
        {
            q: 'Is Ollabs really free, or is this a trial?',
            a: 'Free, and not a trial. Unlimited campaigns and unlimited supporters. Some alternatives advertise as free but mean free for one month.',
        },
        {
            q: 'Is Twibbonize better at anything?',
            a: 'Yes. It is far larger, has been running much longer, and has native iOS and Android apps. If you need a mobile app or you are running a campaign in Indonesia or the Philippines where it is dominant, it is a reasonable choice.',
        },
        {
            q: 'Can I move an existing campaign to Ollabs?',
            a: 'There is no import, but recreating a frame takes a couple of minutes. Upload your existing frame design as a transparent PNG and you will have a new link right away.',
        },
    ],
    tryTitle: 'Try it with one campaign',
    tryBody: 'It takes about a minute and costs nothing. If it does not beat what you are using, you have lost a minute.',
    tryCta: 'Create a campaign',
    rows: [
        { label: 'Watermark on the supporter\'s photo', ollabs: 'Never', twibbonize: 'Yes, unless paid to remove', ollabsWins: true },
        { label: 'Who pays', ollabs: 'Nobody. Organizers may donate if they want to', twibbonize: 'Supporters, to remove the watermark', ollabsWins: true },
        { label: 'Ads', ollabs: 'On some pages, never on the photo', twibbonize: 'Yes', ollabsWins: false },
        { label: 'Account required to support', ollabs: 'No', twibbonize: 'No', ollabsWins: false },
        { label: 'Account required to create', ollabs: 'No', twibbonize: 'Yes', ollabsWins: true },
        { label: 'Mobile app', ollabs: 'No, works in the browser', twibbonize: 'Yes, iOS and Android', ollabsWins: false },
        { label: 'Scale and track record', ollabs: 'New, small, growing', twibbonize: 'Very large, hundreds of millions of users', ollabsWins: false },
    ],
};

export const VS_PT: VsCopy = {
    metaTitle: 'Ollabs vs Twibbonize',
    metaDescription:
        'Comparação honesta entre Ollabs e Twibbonize. A diferença que importa: Twibbonize cobra quem apoia para tirar a marca d\'água. O Ollabs nunca cobra quem apoia.',
    eyebrow: 'Comparação',
    h1: 'Ollabs vs Twibbonize',
    hero: 'Os dois servem para campanha de moldura na foto de perfil. A diferença real é quem paga: no Twibbonize, quem apoia paga para remover a marca d\'água. No Ollabs, quem apoia nunca paga.',
    createCta: 'Criar campanha grátis',
    exploreCta: 'Ver campanhas ao vivo',
    tableHeaderOllabs: 'Ollabs',
    tableHeaderTwibbonize: 'Twibbonize',
    disclaimer:
        'Com base na documentação pública do Twibbonize sobre marcas d\'água, atualizado em agosto de 2026. Se algo estiver desatualizado, avise em hello@ollabs.studio.',
    honestTitle: 'Onde o Twibbonize ainda ganha',
    honestP1:
        'Preferimos ser diretos. O Twibbonize é enorme, existe há anos e tem apps nativos. É muito forte na Indonésia e nas Filipinas. Se você precisa de app na loja ou está num mercado onde todo mundo já conhece o nome, essa familiaridade vale.',
    honestP2:
        'O Ollabs é mais novo e menor. Há anúncios em algumas páginas, e é isso que mantém tudo grátis. O que não fazemos é colocar marca d\'água ou tela de pagamento entre quem apoia e a sua campanha, nem anúncio em cima da foto.',
    faqTitle: 'Perguntas comuns',
    faqs: [
        {
            q: 'Qual é a diferença de verdade?',
            a: 'Quem paga. No Twibbonize, a foto baixa com marca d\'água e cobra para remover. No Ollabs, quem apoia baixa a foto limpa, sempre.',
        },
        {
            q: 'Por que a marca d\'água importa?',
            a: 'Se você é ONG, escola ou empresa, a cobrança cai em quem apoia a sua causa, não na plataforma. Isso reflete na sua organização.',
        },
        {
            q: 'O Ollabs é grátis de verdade?',
            a: 'Sim, sem trial. Campanhas e apoiadores ilimitados.',
        },
        {
            q: 'O Twibbonize é melhor em algo?',
            a: 'Sim. Escala, histórico e apps móveis. Em mercados onde ele domina, pode ser a escolha certa.',
        },
        {
            q: 'Posso migrar uma campanha?',
            a: 'Não há importação, mas recriar leva poucos minutos. Envie seu PNG transparente e tenha um link novo na hora.',
        },
    ],
    tryTitle: 'Teste com uma campanha',
    tryBody: 'Leva cerca de um minuto e não custa nada.',
    tryCta: 'Criar uma campanha',
    rows: VS_EN.rows.map((r) => ({
        ...r,
        label:
            r.label === 'Watermark on the supporter\'s photo'
                ? 'Marca d\'água na foto de quem apoia'
                : r.label === 'Who pays'
                  ? 'Quem paga'
                  : r.label === 'Ads'
                    ? 'Anúncios'
                    : r.label === 'Account required to support'
                      ? 'Conta para apoiar'
                      : r.label === 'Account required to create'
                        ? 'Conta para criar'
                        : r.label === 'Mobile app'
                          ? 'App móvel'
                          : 'Escala e histórico',
        ollabs:
            r.label === 'Watermark on the supporter\'s photo'
                ? 'Nunca'
                : r.label === 'Who pays'
                  ? 'Ninguém'
                  : r.label === 'Ads'
                    ? 'Em algumas páginas, nunca na foto'
                    : r.label === 'Account required to create'
                      ? 'Não'
                      : r.label === 'Mobile app'
                        ? 'Não, funciona no navegador'
                        : r.ollabs,
        twibbonize:
            r.label === 'Watermark on the supporter\'s photo'
                ? 'Sim, salvo se pagar'
                : r.label === 'Who pays'
                  ? 'Quem apoia, para remover a marca'
                  : r.twibbonize,
    })),
};

export const VS_ID: VsCopy = {
    metaTitle: 'Ollabs vs Twibbonize',
    metaDescription:
        'Perbandingan jujur Ollabs dan Twibbonize. Perbedaan utamanya: Twibbonize membebanki pendukung untuk menghapus watermark. Ollabs tidak pernah membebanki pendukung.',
    eyebrow: 'Perbandingan',
    h1: 'Ollabs vs Twibbonize',
    hero: 'Keduanya untuk kampanye bingkai foto profil. Perbedaan yang benar-benar penting: di Twibbonize, pendukung bayar untuk menghapus watermark. Di Ollabs, pendukung tidak pernah bayar.',
    createCta: 'Buat kampanye gratis',
    exploreCta: 'Lihat kampanye live',
    tableHeaderOllabs: 'Ollabs',
    tableHeaderTwibbonize: 'Twibbonize',
    disclaimer:
        'Berdasarkan dokumentasi publik Twibbonize tentang watermark, per Agustus 2026. Jika ada yang sudah usang, hubungi hello@ollabs.studio.',
    honestTitle: 'Di mana Twibbonize masih unggul',
    honestP1:
        'Lebih baik jujur. Twibbonize sangat besar, sudah lama, dan punya aplikasi native. Sangat mapan di Indonesia dan Filipina. Jika Anda butuh app di toko atau pasar yang sudah mengenal nama itu, familiaritas itu berharga.',
    honestP2:
        'Ollabs lebih baru dan kecil. Ada iklan di beberapa halaman, dan itulah yang menjaga layanan gratis. Yang tidak kami lakukan: watermark, layar bayar di antara pendukung dan kampanye Anda, atau iklan di atas foto.',
    faqTitle: 'Pertanyaan umum',
    faqs: [
        {
            q: 'Apa beda sebenarnya?',
            a: 'Siapa yang bayar. Twibbonize menaruh watermark dan membebanki penghapusannya. Ollabs: foto bersih untuk pendukung, selalu.',
        },
        {
            q: 'Mengapa watermark penting?',
            a: 'Untuk NGO, sekolah, atau perusahaan, biaya jatuh ke pendukung Anda, bukan platform. Itu memantul ke organisasi Anda.',
        },
        {
            q: 'Apakah Ollabs benar-benar gratis?',
            a: 'Ya, bukan trial. Kampanye dan pendukung tanpa batas.',
        },
        {
            q: 'Apakah Twibbonize lebih baik di sesuatu?',
            a: 'Ya. Skala, rekam jejak, dan app mobile. Di pasar yang didominasinya, pilihan masuk akal.',
        },
        {
            q: 'Bisa pindah kampanye?',
            a: 'Tidak ada impor, tapi membuat ulang hanya beberapa menit. Upload PNG transparan Anda.',
        },
    ],
    tryTitle: 'Coba satu kampanye',
    tryBody: 'Sekitar satu menit dan gratis.',
    tryCta: 'Buat kampanye',
    rows: VS_EN.rows.map((r) => ({
        ...r,
        label:
            r.label === 'Watermark on the supporter\'s photo'
                ? 'Watermark di foto pendukung'
                : r.label === 'Who pays'
                  ? 'Siapa yang bayar'
                  : r.label === 'Ads'
                    ? 'Iklan'
                    : r.label === 'Account required to support'
                      ? 'Akun untuk mendukung'
                      : r.label === 'Account required to create'
                        ? 'Akun untuk membuat'
                        : r.label === 'Mobile app'
                          ? 'Aplikasi mobile'
                          : 'Skala dan rekam jejak',
        ollabs:
            r.label === 'Watermark on the supporter\'s photo'
                ? 'Tidak pernah'
                : r.label === 'Who pays'
                  ? 'Tidak ada'
                  : r.label === 'Ads'
                    ? 'Di beberapa halaman, tidak pernah di foto'
                    : r.label === 'Account required to create'
                      ? 'Tidak'
                      : r.label === 'Mobile app'
                        ? 'Tidak, lewat browser'
                        : r.ollabs,
        twibbonize:
            r.label === 'Watermark on the supporter\'s photo'
                ? 'Ya, kecuali bayar'
                : r.label === 'Who pays'
                  ? 'Pendukung, untuk hapus watermark'
                  : r.twibbonize,
    })),
};
