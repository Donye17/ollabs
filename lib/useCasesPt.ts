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
    {
        slug: 'arrecadacao',
        audience: 'Arrecadação',
        h1: 'Moldura de foto de perfil para arrecadação',
        subtitle: 'Um link para a causa aparecer nos perfis antes do prazo.',
        keyword: 'moldura foto perfil arrecadação',
        intro: [
            'Para uma arrecadação, faça uma moldura, mande um link e deixe as pessoas colocarem na foto. O Ollabs não recebe o dinheiro. Pix, boleto ou a página de doação continuam no texto que você já envia.',
            'Grátis, sem cadastro e sem marca d\'água. A contagem é de quem salvou a foto, não de curtida.',
        ],
        scenarios: [
            {
                title: 'Doação dobrada com prazo na sexta',
                paragraphs: [
                    'Quando alguém dobra as doações até sexta à noite, o relógio é a campanha. Coloque o link da moldura no mesmo email do botão de doar. Muita gente não clica em doar na primeira leitura, mas troca a foto em dez segundos no celular. Os amigos veem o pedido no WhatsApp e no Instagram.',
                    'No sábado, cole a contagem de apoiadores no recado que você manda para quem está dobrando. É gente que abriu o link e salvou a imagem. O Ollabs não processa pagamento. Deixe o Pix ou o formulário na legenda e no email, junto do link da moldura.',
                ],
            },
            {
                title: 'O grupo da comissão, não a newsletter',
                paragraphs: [
                    'Um PDF de mural de doadores fica no site. A moldura fica no grupo onde a comissão já discute as mesas. Leilão da escola, telhado da igreja ou rifa do bairro: peça para cada organizador colocar a moldura na noite do lançamento, e mande o mesmo link no WhatsApp de pais ou voluntários.',
                    'Você não está coletando email e não está montando uma lista nova. Está deixando a arrecadação visível no fio onde o dinheiro já circula.',
                ],
            },
            {
                title: 'O que esta página não é',
                paragraphs: [
                    'Se a organização precisa de uma casa pública estável, com bio e um botão Entrar para a moldura da vez, isso é um hub. Se precisa de página de pagamento, isso é a ferramenta de doação que vocês já usam. Esta página é o empurrão curto: um link, uma contagem visível e uma foto que a pessoa coloca antes do prazo.',
                ],
            },
        ],
        benefits: [
            { title: 'Um link só', body: 'O mesmo endereço no email, no texto e no grupo.' },
            { title: 'A contagem é real', body: 'Mostra quem salvou a foto, e atualiza conforme as pessoas entram.' },
            { title: 'A marca é a sua', body: 'Envie o logo ou escolha as cores da campanha.' },
        ],
        faqs: [
            { q: 'É grátis para arrecadação e ONG?', a: 'Sim. Grátis, sem cadastro e sem marca d\'água, para quem organiza e para quem apoia.' },
            { q: 'A pessoa pode postar a foto em qualquer lugar?', a: 'Sim. Ela baixa uma imagem normal e usa como foto de perfil ou em qualquer rede.' },
            { q: 'O Ollabs recebe a doação?', a: 'Não. A campanha é uma ferramenta de imagem. Coloque o link de doação no texto de compartilhar e no email.' },
        ],
        guide: { href: '/guides/start-a-campaign', label: 'Como começar uma campanha' },
    },
    {
        slug: 'aniversarios',
        audience: 'Aniversários',
        h1: 'Moldura de foto de perfil para aniversário',
        subtitle: 'Todo mundo com a mesma moldura no dia da festa.',
        keyword: 'moldura foto perfil aniversário',
        intro: [
            'Para um aniversário, crie a moldura, deixe a campanha fora da lista pública e mande o link só no grupo da surpresa. Cada pessoa coloca a foto de manhã, ou na véspera se o fuso atrapalha.',
            'Grátis e sem cadastro. Até quem não instala aplicativo de festa consegue, porque é um link no navegador.',
        ],
        exampleNote:
            'Os exemplos ao vivo vêm de campanhas de evento quando não há uma de aniversário na lista. A ferramenta é a mesma: um link no grupo da família.',
        scenarios: [
            {
                title: 'A surpresa no grupo da família',
                paragraphs: [
                    'Moldura de aniversário é logística, não marketing. Crie em particular, marque como não listada e cole o link só no grupo que está na surpresa. Peça para trocar a foto na manhã do dia, ou na noite anterior. A pessoa homenageada não deve ver o link antes das fotos estarem no ar.',
                    'Não é QR de local e não é lista de ingresso. Não há email de inscrição. A distribuição inteira é um fio de tios, primos e amigos que não vão baixar um aplicativo de festa para um sábado.',
                ],
            },
            {
                title: 'Segunda-feira a festa acabou',
                paragraphs: [
                    'Diferente de temporada de time ou de série da igreja, o aniversário acaba na segunda. Avise o grupo que pode voltar a foto antiga. Deixe a campanha no ar se quiser, mas pare de mandar o link. Moldura de aniversário em março parece spam, não carinho.',
                    'Fixe o link no grupo na véspera, com o horário em que as fotos devem virar. Um lembrete. Uma sequência de “já fez?” é como a surpresa vaza.',
                ],
            },
        ],
        benefits: [
            { title: 'A surpresa', body: 'Combine para todo mundo trocar a foto ao mesmo tempo.' },
            { title: 'Com o nome da pessoa', body: 'Envie uma arte com o nome, ou escolha uma cor e mantenha simples.' },
            { title: 'Qualquer um entra', body: 'Sem aplicativo e sem login. Abre o link e coloca a foto.' },
        ],
        faqs: [
            { q: 'Dá para colocar o nome de quem faz aniversário?', a: 'Sim. Envie uma moldura com o nome, ou escolha uma cor e deixe simples.' },
            { q: 'É grátis?', a: 'Sim, de graça, e sem marca d\'água na foto.' },
            { q: 'Dá para esconder da página Explorar para a pessoa não ver antes?', a: 'Sim. Deixe a campanha não listada e compartilhe o link só no grupo da surpresa.' },
        ],
        guide: { href: '/guides/start-a-campaign', label: 'Como começar uma campanha' },
    },
    {
        slug: 'empresas',
        audience: 'Empresas',
        h1: 'Moldura de foto de perfil para empresas',
        subtitle: 'Um marco, um lançamento ou uma semana interna, com um link para o time.',
        keyword: 'moldura foto perfil empresa',
        intro: [
            'Para um momento interno, dê ao time um link. Aniversário da empresa, rodada, lançamento ou semana de valores: cada pessoa coloca na própria foto, no LinkedIn ou onde já posta.',
            'Sem cadastro e sem marca d\'água. Envie o logo ou as cores da marca. A foto sai como se tivesse vindo do time de design.',
        ],
        scenarios: [
            {
                title: 'LinkedIn na semana de lançamento',
                paragraphs: [
                    'Lançamento, anúncio de rodada e semana de aniversário aparecem no LinkedIn antes do Instagram. Quem já posta sobre o trabalho coloca a moldura se ela segue o guia da marca e não marca o rosto. Terceiros e agência usam o mesmo link. Você não está ligando login corporativo numa ferramenta de foto.',
                    'Use o hex aprovado ou o PNG que a marca já liberou. Um anel “quase a cor” ao lado do logotipo parece que alguém pulou o jurídico. O modo não listado tira a campanha da página Explorar, para uma semana discreta ficar dentro da empresa.',
                ],
            },
            {
                title: 'Reunião geral, não um gesto público',
                paragraphs: [
                    'Semana de valores, campanha de segurança ou ensaio de marca nova pode ser só para funcionários. Não listada mais o link na intranet basta. Não há aplicativo para a TI revisar. A pessoa abre o navegador, coloca a foto e baixa. Se o celular da empresa bloqueia download, a folha de compartilhar ainda leva a imagem para Fotos ou Drive.',
                    'Não publique uma moldura interna na Explorar “para visibilidade”. O time vai tratar como vazamento.',
                ],
            },
            {
                title: 'O que isto não substitui',
                paragraphs: [
                    'Não é chat interno, não é diretório e não é pasta de marca. Se você precisa de um endereço estável de carreiras que sempre abre a moldura atual, use um hub. Se precisa do logo em cinquenta tamanhos, continue na pasta da marca. A campanha é a semana em que a empresa inteira deveria parecer o mesmo feed.',
                ],
            },
        ],
        benefits: [
            { title: 'As pessoas entram por escolha', body: 'Ninguém é obrigado a trocar a foto. O link está lá para quem quer.' },
            { title: 'Sem marca d\'água', body: 'A imagem baixa limpa, sem logo do Ollabs por cima do rosto.' },
            { title: 'Cores da marca', body: 'Hex exato ou PNG que o guia já aprovou.' },
        ],
        faqs: [
            { q: 'A foto do funcionário sai com marca d\'água?', a: 'Não. A foto baixa limpa, sem marca e sem o nome do Ollabs. Ninguém precisa criar conta, e quem apoia não paga.' },
            { q: 'Dá para fazer só para dentro da empresa?', a: 'Sim. Deixe a campanha não listada para ela não aparecer na Explorar, e compartilhe o link por dentro.' },
        ],
        guide: { href: '/guides/hub', label: 'O que é um hub de campanha' },
    },
    {
        slug: 'universidades',
        audience: 'Universidades',
        h1: 'Moldura de foto de perfil para universidades',
        subtitle: 'Volta às aulas, formatura, calouros e dia de doação, cada um com o próprio link.',
        keyword: 'moldura foto perfil universidade',
        intro: [
            'Para um momento de campus, faça uma moldura e mande um link. Volta às aulas, formatura, dia dos aprovados e a campanha anual de doação funcionam do mesmo jeito. Quem já saiu do campus não cria conta.',
            'Grátis para estudante, ex-aluno e equipe. Use as cores da escola. A contagem desta edição começa do zero se você publicar uma campanha nova.',
        ],
        exampleNote:
            'Os exemplos ao vivo vêm de campanhas marcadas como escola. A moldura de universidade é o mesmo produto, para ex-alunos e grupos do campus, não para pais do ensino fundamental.',
        scenarios: [
            {
                title: 'Ex-aluno que não vai criar conta',
                paragraphs: [
                    'Dia de doação e volta ao campus falham quando o pedido exige uma conta nova. Muita gente já ignora o site da campanha. Um link de moldura no grupo da turma ou no WhatsApp de ex-alunos termina no celular, no estacionamento. A pessoa baixa uma foto. Não cria login de portal.',
                    'A reitoria ainda pode usar a marca oficial. Diretórios, atlética e departamentos fazem a própria campanha sem fila no site da universidade, porque criar não exige conta no CMS.',
                ],
            },
            {
                title: 'Formatura não é dia de doação',
                paragraphs: [
                    'Formatura e dia dos aprovados são orgulho. Dia de doação é um pedido. Use arte diferente e links diferentes. Família imprimindo foto de formatura não quer fita de doação na moldura. Quem doa não quer o chapéu de formatura em novembro.',
                    'Reaproveite o desenho no ano que vem se quiser, mas publique uma campanha nova para a contagem começar em zero. O número do ano passado nesta página é como essas páginas passam a parecer porta de entrada velha.',
                ],
            },
            {
                title: 'Atlética e centros acadêmicos sem chamado central',
                paragraphs: [
                    'Um centro que quer moldura para a semana de recepção não precisa abrir chamado no marketing da universidade. Faz a campanha, manda um link no grupo e para depois. O hub só serve se o grupo quer um endereço estável de bio. Para três dias, o link da campanha basta.',
                    'Não é semana cívica de escola de criança. O público é estudante, ex-aluno, professor e equipe. Mantenha o texto e a arte nesse registro.',
                ],
            },
        ],
        benefits: [
            { title: 'Um momento, um link', body: 'Volta às aulas, formatura e doação ficam separados, cada um com a própria contagem.' },
            { title: 'Ex-aluno sem conta', body: 'Quem menos cria cadastro é justamente quem você precisa. Não precisa.' },
            { title: 'O grupo faz sozinho', body: 'Atlética, departamento e centro acadêmico não esperam a fila do marketing central.' },
        ],
        faqs: [
            { q: 'Um centro ou departamento pode fazer a própria?', a: 'Sim. Criar é grátis e leva um minuto. Qualquer grupo do campus faz a sua sem passar por um time central.' },
            { q: 'O estudante precisa instalar algo?', a: 'Não. Funciona no navegador do celular. Abre o link, coloca a foto e baixa.' },
            { q: 'Dá para reusar a mesma arte no ano que vem?', a: 'Sim. Publique uma campanha nova com o mesmo desenho, para a contagem ser desta edição.' },
        ],
        guide: { href: '/guides/start-a-campaign', label: 'Como começar uma campanha' },
    },
];

export function getUseCasePt(slug: string): UseCase | undefined {
    return USE_CASES_PT.find((u) => u.slug === slug);
}
