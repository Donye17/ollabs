import type { UseCase } from '@/lib/useCases';

/** Portuguese use-case landings at /pt/for/<slug>. */
export const USE_CASES_PT: UseCase[] = [
    {
        slug: 'igrejas',
        audience: 'Igrejas',
        h1: 'Moldura de foto de perfil para igrejas',
        subtitle: 'Reúna a congregação em torno de uma série, missão ou campanha.',
        keyword: 'moldura foto perfil igreja',
        intro: [
            'Série nova, missão, acampamento ou campanha comunitária: uma moldura compartilhada ajuda a igreja inteira a aparecer junta. O Ollabs deixa você criar uma moldura, mandar um link e cada pessoa coloca na foto em segundos.',
            'Grátis e sem cadastro. Use as cores da igreja ou o logo, compartilhe no grupo do WhatsApp e no boletim.',
        ],
        benefits: [
            { title: 'Ideal para séries', body: 'Crie uma moldura por série ou evento e troque quando terminar.' },
            { title: 'Funciona para todos', body: 'Qualquer idade consegue colocar na foto pelo celular.' },
            { title: 'Com a cara da igreja', body: 'Cores ou logo da sua comunidade em cada foto.' },
        ],
        faqs: [
            { q: 'Precisa de conta para apoiar?', a: 'Não. A pessoa abre o link, coloca a foto e baixa. Só isso.' },
            { q: 'É grátis?', a: 'Sim. Sem marca d\'água e sem cobrança de quem apoia.' },
        ],
    },
    {
        slug: 'escolas',
        audience: 'Escolas',
        h1: 'Moldura de foto de perfil para escolas',
        subtitle: 'Semana temática, formatura e orgulho de turma em um link.',
        keyword: 'moldura foto perfil escola',
        intro: [
            'Semana temática, arrecadação ou formatura: uma moldura compartilhada coloca alunos, pais e professores na mesma campanha visual.',
            'Grátis, sem app e sem login. Todo mundo entra pelo link no celular.',
        ],
        benefits: [
            { title: 'Cores da escola', body: 'Defina as cores ou envie o brasão como moldura.' },
            { title: 'Perfeito para semanas temáticas', body: 'Uma moldura nova a cada evento.' },
            { title: 'Sem barreira', body: 'Ninguém precisa instalar nada.' },
        ],
        faqs: [
            { q: 'Pais e funcionários podem usar?', a: 'Sim. Qualquer pessoa com o link pode participar.' },
            { q: 'As fotos ficam no servidor?', a: 'Não. O processamento é no navegador da pessoa.' },
        ],
    },
    {
        slug: 'times',
        audience: 'Times',
        h1: 'Moldura de foto de perfil para times',
        subtitle: 'Torcida e elenco com as cores do time no dia do jogo.',
        keyword: 'moldura foto perfil time esporte',
        intro: [
            'Hype de jogo começa quando a torcida veste a mesma cor. Crie uma moldura, mande o link no grupo e veja o contador subir antes da partida.',
            'Grátis e sem cadastro. Use escudo ou cores oficiais.',
        ],
        benefits: [
            { title: 'Escudo ou cores', body: 'Envie um PNG transparente ou escolha as cores exatas.' },
            { title: 'Contador ao vivo', body: 'Veja quantas pessoas já colocaram a moldura.' },
            { title: 'Um toque no celular', body: 'Torcedor abre o link e pronto.' },
        ],
        faqs: [
            { q: 'Posso usar o escudo do clube?', a: 'Sim. Envie o escudo como PNG transparente.' },
            { q: 'Tem marca d\'água?', a: 'Nunca. A foto baixa limpa.' },
        ],
    },
    {
        slug: 'ongs',
        audience: 'ONGs',
        h1: 'Moldura de foto de perfil para ONGs',
        subtitle: 'Mobilize apoiadores em torno da sua causa com um link.',
        keyword: 'moldura foto perfil ONG',
        intro: [
            'Conscientização espalha quando as pessoas vestem a causa. O Ollabs deixa sua ONG criar uma moldura com a identidade visual e compartilhar um único link.',
            'Grátis para você e para quem apoia. Sem conta obrigatória.',
        ],
        benefits: [
            { title: 'Sua marca em minutos', body: 'Logo ou cores da organização na moldura.' },
            { title: 'Sem login para apoiar', body: 'Menos atrito, mais gente entra.' },
            { title: 'Números reais', body: 'Contador mostra apoio de verdade, não inflado.' },
        ],
        faqs: [
            { q: 'É gratuito para ONGs?', a: 'Sim. Campanhas e apoiadores ilimitados.' },
            { q: 'Posso esconder da página Explore?', a: 'Sim. Deixe a campanha não listada e compartilhe só o link.' },
        ],
    },
    {
        slug: 'eventos',
        audience: 'Eventos',
        h1: 'Moldura de foto de perfil para eventos',
        subtitle: 'Antes, durante e depois: todo mundo mostra que vai.',
        keyword: 'moldura foto perfil evento',
        intro: [
            'Participante vira divulgador quando usa a moldura do evento. Um link, QR no local e as pessoas entram na hora.',
            'Grátis e sem cadastro. Coloque a identidade visual do evento na moldura.',
        ],
        benefits: [
            { title: 'QR incluído', body: 'Baixe o QR da campanha para cartazes e telas.' },
            { title: 'Energia de "vou"', body: 'Quem usa a moldura puxa mais gente.' },
            { title: 'Sua identidade', body: 'Logo ou cores do evento em cada foto.' },
        ],
        faqs: [
            { q: 'Funciona durante o evento?', a: 'Sim. Coloque o QR nas telas e deixe as pessoas entrarem na hora.' },
            { q: 'Precisa baixar app?', a: 'Não. Funciona no navegador do celular.' },
        ],
    },
    {
        slug: 'conscientizacao',
        audience: 'Campanhas de conscientização',
        h1: 'Moldura de foto de perfil para campanhas de conscientização',
        subtitle: 'Coloque a causa em milhares de perfis com um link.',
        keyword: 'moldura conscientização foto perfil',
        intro: [
            'Meses de conscientização e solidariedade crescem quando as pessoas vestem a cor ou o símbolo. Crie uma moldura e deixe o movimento aparecer.',
            'Grátis e sem cadastro. Use a cor da fita ou envie sua arte.',
        ],
        benefits: [
            { title: 'Cores prontas', body: 'Anéis de cor limpos ou arte personalizada.' },
            { title: 'Espalha de pessoa em pessoa', body: 'Quem baixa é convidado a compartilhar depois.' },
            { title: 'Contagem honesta', body: 'Cada número é alguém que realmente usou a moldura.' },
        ],
        faqs: [
            { q: 'Posso usar a cor exata da fita?', a: 'Sim. Defina a cor ou envie sua arte.' },
            { q: 'Vocês inflam o contador?', a: 'Nunca. Só conta quem baixou de verdade.' },
        ],
    },
];

export function getUseCasePt(slug: string): UseCase | undefined {
    return USE_CASES_PT.find((u) => u.slug === slug);
}
