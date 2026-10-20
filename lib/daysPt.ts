/** Portuguese bodies for calendar days that have one. English stays on the day entry. */

export type DayPtCopy = {
    name: string;
    tagline: string;
    intro: string[];
    background: string[];
    howToCelebrate: { title: string; body: string }[];
    howOrgsMark: { title: string; body: string }[];
    campaignIdeas: string[];
    faqs: { q: string; a: string }[];
};

const DAY_PT: Record<string, DayPtCopy> = {
    'independencia-do-brasil': {
        name: 'Independência do Brasil',
        tagline: 'Sete de Setembro, carregado por brasileiros em casa e em qualquer outro lugar.',
        intro: [
            'O Brasil marca a Independência em 7 de setembro, o Sete de Setembro ou Dia da Independência. O verde e o amarelo aparecem em toda parte, das cerimônias cívicas no país aos encontros de comunidade no exterior.',
            'Uma moldura compartilhada dá a escolas, famílias, associações e negócios brasileiros um link para o dia. Use para nomear o lugar, as pessoas ou a tradição a que a sua celebração pertence.',
        ],
        background: [
            'Em 7 de setembro de 1822, o príncipe Pedro declarou a separação do Brasil de Portugal perto do rio Ipiranga, em São Paulo. Ele se tornou Pedro I, o primeiro imperador do Brasil, ainda naquele ano.',
            'A declaração não encerrou o processo na hora. Houve luta em várias províncias, e Portugal reconheceu formalmente a independência em 1825.',
            '7 de setembro é feriado nacional. Os desfiles oficiais são só uma parte do dia. Escolas, grupos de bairro e comunidades brasileiras no exterior também usam a data para falar de identidade e da história que ficou incompleta.',
        ],
        howToCelebrate: [
            {
                title: 'Aprenda o que veio depois da declaração',
                body: 'A imagem conhecida é Pedro à beira do Ipiranga, mas a independência envolveu luta em várias províncias e só foi reconhecida por Portugal em 1825. A versão curta é um começo, não o processo inteiro.',
            },
            {
                title: 'Cozinhe um prato com lugar',
                body: 'Comida brasileira é regional. Nomeie Minas Gerais, Bahia, Pará, Rio Grande do Sul ou o lugar de onde a receita vem, em vez de apresentar um prato como se fosse o país.',
            },
            {
                title: 'Ouça além da playlist nacional',
                body: 'Escolha um artista de um estado ou de uma tradição que você ainda não conhece, e leia o bastante para situar a música. O Brasil é grande demais para um som só carregar o dia.',
            },
            {
                title: 'Ligue para quem te ensinou o que é casa',
                body: 'Para brasileiros no exterior, 7 de setembro pode ser menos cerimônia e mais língua, comida e gente. Uma ligação para a família, ou para quem segura a comunidade, é uma celebração que atravessa a distância.',
            },
            {
                title: 'Vista verde e amarelo com as suas palavras',
                body: 'Use a moldura e escreva a legenda em português, em inglês ou nos dois. Nomeie a cidade, o estado, a família ou a associação, para o post pertencer a uma comunidade real.',
            },
        ],
        howOrgsMark: [
            {
                title: 'Dê à história mais de uma cena',
                body: 'A escola pode começar no Ipiranga sem terminar ali. Inclua as lutas regionais, o período imperial e as pessoas que ficaram fora do acordo político.',
            },
            {
                title: 'Deixe quem está fora do Brasil definir o evento',
                body: 'Um encontro da diáspora pode girar em torno de comida, música, língua ou crianças conhecendo outras famílias brasileiras. Entregue o orçamento a quem organiza no local.',
            },
            {
                title: 'Mantenha as cores nacionais fora da briga partidária',
                body: 'Verde e amarelo são do país, mas o público pode ler um sentido político atual neles. Diga o propósito cívico ou comunitário com clareza, e evite slogan de partido, a menos que o evento seja explicitamente esse.',
            },
            {
                title: 'Faça o programa bilíngue quando precisar',
                body: 'O português carrega o dia. O inglês pode ajudar parceiros e quem cresceu fora. Uma boa tradução inclui os dois, sem tratar um público como sobra.',
            },
        ],
        campaignIdeas: [
            'Crie uma moldura verde e amarela com Sete de Setembro e, se quiser, o nome da cidade ou do estado.',
            'Convide a comunidade a publicar uma foto do Brasil que ela quer que os outros entendam.',
            'Monte na escola uma linha do tempo de 1822 até o reconhecimento português em 1825, sem parar na declaração.',
            'Peça a negócios de brasileiros que usem a mesma moldura e nomeiem a própria raiz regional.',
            'Faça uma série de retratos bilíngues, com cada pessoa aprovando o texto em português e em inglês.',
            'Guarde a arte e, em setembro que vem, troque só a data ou o nome da comunidade.',
        ],
        faqs: [
            { q: 'Quando é a Independência do Brasil?', a: 'Todo 7 de setembro. Em português, o nome comum é Sete de Setembro ou Dia da Independência.' },
            { q: 'O que aconteceu em 7 de setembro de 1822?', a: 'O príncipe Pedro declarou a separação do Brasil de Portugal perto do rio Ipiranga, em São Paulo. Ele se tornou o imperador Pedro I ainda naquele ano.' },
            { q: 'O Brasil ficou independente na hora?', a: 'A declaração foi o momento decisivo, mas houve luta em várias províncias e Portugal só reconheceu a independência em 1825.' },
            { q: '7 de setembro é feriado?', a: 'Sim. É feriado nacional, com atos cívicos e festas de comunidade.' },
            { q: 'A associação pode fazer uma moldura em português?', a: 'Sim. Envie a arte em português ou bilíngue como PNG transparente, ou use verde e amarelo no criador. Quem apoia não precisa de conta.' },
        ],
    },
    'dia-das-criancas': {
        name: 'Dia das Crianças',
        tagline: 'Um dia das crianças no Brasil para brincar, prestar atenção e para os adultos que abrem espaço para os dois.',
        intro: [
            'O Brasil celebra o Dia das Crianças em 12 de outubro. Presente faz parte do dia, mas a criança em geral lembra do adulto que parou, desceu ao chão e entrou na brincadeira.',
            'Uma moldura colorida pode juntar escola, família, projeto infantil ou comunidade brasileira em torno da festa. Deixe as crianças ajudarem a escolher cores e palavras, em vez de desenhar tudo por cima delas.',
        ],
        background: [
            'O Brasil fixou 12 de outubro como Dia das Crianças por decreto em 1924, na presidência de Arthur Bernardes. A data ficou popular décadas depois, com campanhas comerciais da Estrela e da Johnson & Johnson.',
            '12 de outubro também é o dia de Nossa Senhora Aparecida, padroeira do Brasil, e feriado nacional. A coincidência faz eventos de família, de fé e de crianças dividirem o mesmo dia.',
            'O Dia das Crianças não é o Dia Mundial da Criança das Nações Unidas, em 20 de novembro. A tradição brasileira de outubro tem história própria e está firmada em escolas, lojas e calendários de família.',
        ],
        howToCelebrate: [
            {
                title: 'Deixe a criança escolher o plano',
                body: 'Ofereça duas ou três opções reais e aceite a resposta. Uma tarde escolhida pela criança é diferente de um programa de adulto com criança de enfeite.',
            },
            {
                title: 'Dê atenção sem interrupção',
                body: 'Guarde o celular durante um jogo, uma história ou uma caminhada, e siga o ritmo dela. Não custa nada, e costuma ser mais raro do que mais um objeto numa sacola.',
            },
            {
                title: 'Passe adiante o que ainda serve para brincar',
                body: 'Brinquedos e livros limpos e completos podem ir para um projeto que pediu isso. Doação não é descarte. Peça faltando vira trabalho para outra pessoa.',
            },
            {
                title: 'Pergunte antes de publicar o rosto de uma criança',
                body: 'Criança também tem privacidade num dia de festa. Peça permissão a quem é responsável, ouça se a criança disser não, e evite nome, uniforme ou lugar que revele mais do que você queria.',
            },
            {
                title: 'Façam a moldura juntos',
                body: 'Deixe as crianças escolherem cores, palavras ou desenhos, e usem o resultado nas fotos da família ou do projeto. Participar marca mais do que receber um gráfico pronto.',
            },
        ],
        howOrgsMark: [
            {
                title: 'Desenhe a partir da altura da criança',
                body: 'Percorra o evento olhando placas, filas, banheiros, barulho e assentos do ponto de vista de uma criança. Acessibilidade aparece quando o adulto para de achar que o próprio caminho serve para todo mundo.',
            },
            {
                title: 'Pergunte ao projeto o que ele precisa',
                body: 'Serviços para crianças podem precisar de material escolar, transporte ou dinheiro sem amarra, mais do que de brinquedo. Publique o pedido que eles fizeram, não a campanha que fica melhor na foto.',
            },
            {
                title: 'Proteja imagem e nome',
                body: 'Use consentimento registrado e ofereça um jeito de participar sem aparecer na internet. Nunca junte a imagem de uma criança a dado médico, financeiro ou familiar para efeito de campanha.',
            },
            {
                title: 'Dê às crianças uma decisão de verdade',
                body: 'Escolher a cor de um cartaz não é participação se toda decisão importante já foi tomada. Deixe um grupo pequeno de jovens definir uma atividade, uma linha de orçamento ou uma frase que os adultos vão seguir.',
            },
        ],
        campaignIdeas: [
            'Crie uma moldura colorida escolhida com um grupo pequeno de crianças e aprovada por quem cuida da proteção.',
            'Peça às famílias que publiquem um jogo ou um livro favorito, em vez de uma foto que revela onde a criança está.',
            'Junte a moldura a um pedido exato de um projeto infantil local.',
            'Faça uma tarde de brincadeira sem custo, com opção quieta, sensorial e acessível.',
            'Convide famílias brasileiras no exterior a colocar o nome da cidade numa moldura em português ou bilíngue.',
            'Publique o que as crianças pediram para a organização mudar, e conte quando estiver feito.',
        ],
        faqs: [
            { q: 'Quando é o Dia das Crianças no Brasil?', a: 'É 12 de outubro todo ano, a mesma data de Nossa Senhora Aparecida e feriado nacional.' },
            { q: 'Quando o Dia das Crianças foi criado?', a: '12 de outubro foi fixado como Dia das Crianças por decreto presidencial em 1924. A festa ficou popular depois, com campanhas comerciais.' },
            { q: 'É a mesma coisa que o Dia Mundial da Criança?', a: 'Não. As Nações Unidas observam o Dia Mundial da Criança em 20 de novembro. A celebração brasileira consolidada é 12 de outubro.' },
            { q: 'A festa precisa ter presente?', a: 'Não. Brincadeira, atenção, um passeio em família ou apoio a um projeto infantil marcam o dia sem comprar brinquedo.' },
            { q: 'As crianças podem ajudar a desenhar a moldura?', a: 'Sim, desde que um adulto cuide da proteção e da publicação. Escola ou projeto pode enviar o desenho pronto como PNG transparente.' },
        ],
    },
};

export function getDayPt(slug: string): DayPtCopy | undefined {
    return DAY_PT[slug];
}

export function dayPtSlugs(): string[] {
    return Object.keys(DAY_PT);
}
