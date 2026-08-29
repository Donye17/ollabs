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
        scenarios: [
            {
                title: 'Série de pregações tem data para acabar',
                paragraphs: [
                    'Uma série de seis semanas não é a identidade eterna da igreja. Crie a moldura na semana anterior ao primeiro domingo, coloque o QR no boletim e peça para os líderes de célula colarem o mesmo link no WhatsApp depois do culto. Quando a série termina, publique outra campanha para o próximo tempo. Deixar o título da série passada na foto da irmandade só confunde quem chega agora.',
                    'Acampamento, equipe de missão e oferta da obra cada um merece o próprio link. Misturar tudo numa moldura só deixa o contador sem sentido e a arte pesada.',
                ],
            },
            {
                title: 'O boletim, o telão e o grupo que a igreja já usa',
                paragraphs: [
                    'Imprima o QR da campanha ao lado do título da série. Quem não vai digitar um endereço aponta a câmera na hora dos avisos. O mesmo link vai no grupo da igreja, que na prática funciona melhor do que pedir para instalar o aplicativo da congregação.',
                    'Muita gente da terceira idade vive no navegador do celular e não vai criar conta em mais nada. Não tem app para baixar. A pessoa abre o link, coloca a foto e salva. Se o navegador de dentro do WhatsApp travar o download, a folha de compartilhar ainda manda a imagem para ela mesma.',
                ],
            },
            {
                title: 'Isso não substitui o site da igreja',
                paragraphs: [
                    'Ollabs não é arquivo de sermão, página de dízimo nem agenda. Isso continua no site que vocês já têm. O hub só vale se a igreja quiser um único link na bio que sempre abre a moldura da série atual. Para o culto deste domingo, o link da campanha basta.',
                    'O grupo da célula na quarta à noite espalha mais rápido que o aviso do púlpito. Mande o link para os líderes no sábado, com o título da série numa linha, sem apresentação de marca. Quem vai colocar a foto coloca entre o estacionamento e a porta. Depois disso, não coloca.',
                ],
            },
        ],
        benefits: [
            { title: 'Ideal para séries', body: 'Crie uma moldura por série ou evento e troque quando terminar.' },
            { title: 'Funciona para todos', body: 'Qualquer idade consegue colocar na foto pelo celular.' },
            { title: 'Com a cara da igreja', body: 'Cores ou logo da sua comunidade em cada foto.' },
        ],
        faqs: [
            { q: 'Precisa de conta para apoiar?', a: 'Não. A pessoa abre o link, coloca a foto e baixa. Só isso.' },
            { q: 'É grátis?', a: 'Sim. Sem marca d\'água e sem cobrança de quem apoia.' },
            { q: 'Dá para imprimir o QR no boletim?', a: 'Sim. Toda campanha tem um QR para baixar e colocar no boletim, no telão ou no cartaz da entrada.' },
        ],
        guide: { href: '/guides/hub', label: 'O que é um hub de campanhas' },
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
        scenarios: [
            {
                title: 'Quem posta é o grupo de pais',
                paragraphs: [
                    'Aluno de escola particular ou pública quase nunca controla a foto do perfil da família. Quem troca a foto é mãe, pai e a comissão de formatura. Coloque o link no grupo de WhatsApp da turma e no e-mail da APM, não só no mural da secretaria. Anel nas cores da escola resolve uma semana temática. Se o brasão já existe em PNG transparente, use esse arquivo em vez de fotografar o uniforme.',
                    'Faça uma campanha nova a cada gincana ou semana. Deixar a moldura da “sexta de pijama” do ano passado circulando só vira recorte velho. O contador mostra quantas famílias entraram, o que é mais honesto do que uma foto do pátio com três cartazes.',
                ],
            },
            {
                title: 'Arrecadação da APM não é formatura',
                paragraphs: [
                    'Vaquinha de festa junina ou rifa da APM é pedido de dinheiro: o link da moldura viaja junto com a chave Pix. Formatura é orgulho, não pitch. Não reaproveite a arte da rifa no convite de colação. A família percebe, e a foto fica com cara de propaganda atrasada.',
                    'Moldura de formatura espalha para tia e avó que não estão no grupo da turma. Mande no grupo da sala e peça para uma mãe encaminhar. Não existe conta de aluno para criar, e a foto não fica guardada no nosso servidor. O enquadramento acontece no navegador do celular de quem está usando.',
                ],
            },
            {
                title: 'A foto não sobe para a gente guardar',
                paragraphs: [
                    'Em contexto escolar isso importa. Ninguém precisa cadastrar criança em plataforma nenhuma. Se a direção tem regra contra aplicativo de terceiro, isso ainda roda numa aba do Chrome ou do Safari.',
                    'A secretaria pode colocar o QR no recado da semana e na placa da portaria na hora da saída. Aluno no Chromebook da escola não é o público. Quem está no carro na fila do portão é.',
                ],
            },
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
        guide: { href: '/guides/start-a-campaign', label: 'Como começar uma campanha' },
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
        scenarios: [
            {
                title: 'O vestiário do amador é o grupo do WhatsApp',
                paragraphs: [
                    'Time de base e clube de bairro não vivem no Twitter. Vivem no grupo que o diretor de futebol ou a mãe tesoureira administra. Coloque o link na quinta se o jogo é sábado. Peça para todo mundo do elenco e da comissão colocar a moldura, inclusive quem não vai no campo. A parede de fotos serve para o menino printar, e para o avô que acompanha de outra cidade.',
                    'Pelada de empresa ou time de várzea é o contrário: o jogador mesmo que posta. Mesma ferramenta, outro grupo. Deixe a campanha não listada se a ideia é só esse elenco, sem aparecer no Explore.',
                ],
            },
            {
                title: 'Dia de jogo não é temporada inteira',
                paragraphs: [
                    'Final de campeonato, clássico de bairro ou estreia na Copa merecem campanha com a rodada na arte. Marca da temporada, “somos azul até dezembro”, pode ficar o ano todo. Não misture. Se a moldura da final continua no ano seguinte, família nova acha que a história antiga é a de agora.',
                    'Olhe o contador nas horas antes do apito. É essa a janela. Mandar o link na segunda depois da derrota quase nunca pega.',
                ],
            },
            {
                title: 'Escudo em PNG, não foto da camisa no varal',
                paragraphs: [
                    'Fotografar a camisa e esperar que vire moldura quase sempre fica sujo. Exporte o escudo em PNG transparente, envie no criador e deixe a janela do rosto limpa. Se só tem as cores oficiais, um anel nessas cores fica melhor do que um brasão borrado.',
                    'Se o clube tem uniforme reserva, use as cores da casa a menos que a campanha seja especificamente o jogo fora. Misturar os dois num anel só parece dois times. Pai printa a foto para o avô: o escudo precisa ler no tamanho de um avatar de WhatsApp.',
                ],
            },
        ],
        benefits: [
            { title: 'Escudo ou cores', body: 'Envie um PNG transparente ou escolha as cores exatas.' },
            { title: 'Contador ao vivo', body: 'Veja quantas pessoas já colocaram a moldura.' },
            { title: 'Um toque no celular', body: 'Torcedor abre o link e pronto.' },
        ],
        faqs: [
            { q: 'Posso usar o escudo do clube?', a: 'Sim. Envie o escudo como PNG transparente.' },
            { q: 'Tem marca d\'água?', a: 'Nunca. A foto baixa limpa.' },
            { q: 'Dá para ficar só no grupo do time?', a: 'Sim. Deixe a campanha não listada e mande o link só no WhatsApp do elenco.' },
        ],
        guide: { href: '/guides/start-a-campaign', label: 'Como começar uma campanha' },
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
        scenarios: [
            {
                title: 'Equipe, voluntário e quem a ONG atende',
                paragraphs: [
                    'Página de vaquinha é o pedido de Pix. Página de ONG é quem veste a organização o ano inteiro. Equipe pode colocar a moldura no LinkedIn numa semana de captação. Voluntário coloca no fim de semana do mutirão. Quem a ONG atende não deve ser cobrado a participar. O link é opcional, público e sem login.',
                    'Núcleo do interior que quer a própria marca não precisa esperar o PNG chegar da sede em São Paulo. Cada grupo publica a campanha dele e manda o link no grupo local.',
                ],
            },
            {
                title: 'Causa permanente versus semana de emergência',
                paragraphs: [
                    'Guarde uma moldura quieta, com a identidade visual, se a equipe quer um visual estável. Quando vem enchente, PL na pauta ou mutirão de um fim de semana, publique uma segunda campanha com recado mais seco e outro link. Tire de circulação quando a semana passar, para o recado de emergência não ficar colado na foto em outubro.',
                    'O contador da campanha de emergência é o número que você pode citar no relatório sem vergonha. Não substitui dado de atendimento, e a gente não infla.',
                ],
            },
            {
                title: 'Um link na bio que sobrevive à campanha da semana',
                paragraphs: [
                    'Instagram quer um URL só. O hub é esse URL: botão Entrar na moldura que vocês destacarem neste mês, mais um texto curto. Mande o link /c/ no WhatsApp quando a vaquinha é hoje. Deixe o /u/ na bio para quem chega depois da live.',
                    'Na semana de Pix, a chave vai na mesma mensagem que o link da moldura. No resto do ano, tire dinheiro da arte para a marca da ONG não parecer pedido eterno. Voluntário que já deu fim de semana não precisa se sentir cobrado toda vez que abre o Instagram.',
                ],
            },
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
        guide: { href: '/guides/hub', label: 'O que é um hub de campanhas' },
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
        scenarios: [
            {
                title: 'O e-mail de confirmação, antes de alguém chegar',
                paragraphs: [
                    'Congresso, festival, show e casamento no buffet já têm lista de quem disse sim. Coloque o link da moldura no e-mail de confirmação, do lado do calendário e do mapa. Quem troca a foto antes da viagem está divulgando em todo grupo que já participa. Isso é diferente de aniversário, que vive num fio de família e dura um dia.',
                    'Se o ingresso ainda está à venda, a foto com moldura é prova de que a casa está enchendo. O contador é gente que salvou uma imagem, número mais frio do que “tenho interesse” no Facebook.',
                ],
            },
            {
                title: 'QR na entrada e no slide de espera',
                paragraphs: [
                    'Imprima o QR no crachá, na mesa de credenciamento e no slide que roda antes da palestra. Quem ignorou o e-mail ainda entra no foyer, no wifi do espaço. O download é no celular da pessoa. Não precisa de totem a menos que vocês queiram.',
                    'Durante o evento o mesmo link continua valendo. Depois, deixe a campanha no ar uma semana se quiser recap no feed, e pare de divulgar para a edição do ano que vem nascer com o contador zerado.',
                ],
            },
            {
                title: 'Festa fechada não precisa do Explore',
                paragraphs: [
                    'Evento com ingresso quer ser encontrado. Casamento e confraternização de empresa quase nunca. Deixe não listada, coloque o QR no cardápio ou no programa, e pule o Explore. Convidado que não vai baixar aplicativo de casamento ainda abre um link no navegador.',
                    'No dia, o QR no slide de espera precisa estar enorme. Quem está no fundo do auditório não digita URL. Aponta a câmera nos cinco minutos antes da palestra.',
                ],
            },
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
        guide: { href: '/guides/start-a-campaign', label: 'Como começar uma campanha' },
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
        scenarios: [
            {
                title: 'Outubro Rosa e Setembro Amarelo sem inflar número',
                paragraphs: [
                    'Mês de conscientização funciona porque a cor já é lida: rosa, amarelo, roxo, vermelho. Coloque o hex no criador, ou envie a arte oficial da coalizão se eles publicam PNG. Depois mande o link nos grupos que já acompanham a causa, não num disparo para estranho. Moldura de perfil é sinal de solidariedade, não abaixo-assinado e não doação.',
                    'O contador é gente que salvou uma foto. Trate assim em toda legenda. A gente não vende “alcance”. Se outro site promete número inflado, é por isso que essas páginas viram lixo. Cite o número que o Ollabs mostra, ou não cite.',
                ],
            },
            {
                title: 'A cor nacional e a história da sua cidade',
                paragraphs: [
                    'Campanha nacional de fita pode usar a cor compartilhada para o feed parecer um movimento só. História local (um posto, uma pessoa desaparecida, um projeto de lei na câmara) precisa de arte própria e de link próprio, senão some dentro do mês genérico. Não cole a moldura do Outubro passado numa causa diferente em janeiro.',
                    'Se vocês são núcleo de uma organização maior, perguntem se já existe arte oficial. Subir uma fita aleatória do Google ao lado da marca verdadeira fica barato, e a pessoa não sabe quem está tocando a campanha.',
                ],
            },
            {
                title: 'De pessoa para pessoa, não de hashtag',
                paragraphs: [
                    'Hashtag morre no dia. Foto com moldura fica no perfil até alguém trocar. Depois que a pessoa salva, a página pede para chamar a próxima. Essa corrente é o produto. Continua precisando de um telefone de ajuda ou de uma página real na legenda se a causa exige. A moldura é o sinal, não o serviço.',
                    'Se o mês tem CVV, SAMU ou um 188 na campanha oficial, esse número vai no texto de compartilhar, não um Pix, a menos que vocês também estejam arrecadando. Misturar fita com pedido de dinheiro é o que faz a cor parecer propaganda.',
                ],
            },
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
        guide: { href: '/guides/start-a-campaign', label: 'Como começar uma campanha' },
    },
];

export function getUseCasePt(slug: string): UseCase | undefined {
    return USE_CASES_PT.find((u) => u.slug === slug);
}
