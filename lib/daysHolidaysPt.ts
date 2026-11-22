import type { DayPtCopy } from '@/lib/daysPt';

/** Portuguese bodies for Christmas, New Year and Carnaval. See lib/daysHolidays.ts. */
export const DAY_PT_HOLIDAYS: Record<string, DayPtCopy> = {
    christmas: {
        name: 'Natal',
        tagline: 'Uma moldura para a paróquia, a escola, a empresa ou o grupo da família.',
        intro: [
            'O Natal é 25 de dezembro, mas no Brasil a festa de verdade é a ceia da noite do dia 24, no meio do verão. É a data em que igreja, escola, empresa e família se juntam ao mesmo tempo.',
            'Uma moldura dá a todo mundo o mesmo link para a temporada. Cada pessoa coloca a foto, baixa e posta. Grátis, sem cadastro, e nada por cima da foto que a pessoa baixa.',
        ],
        background: [
            'O Natal celebra o nascimento de Jesus e é feriado nacional no Brasil. Para muita gente é tanto uma data de família e comunidade quanto religiosa.',
            'Todo ano os Correios fazem o Papai Noel dos Correios: crianças escrevem cartas, e qualquer pessoa pode adotar uma e entregar o presente. Escolas, empresas e grupos de bairro se organizam em torno disso desde novembro.',
            'Nas Filipinas a temporada começa em setembro e vai até janeiro, e a Simbang Gabi reúne nove missas de 16 a 24 de dezembro. É o Natal mais longo do mundo.',
        ],
        howToCelebrate: [
            { title: 'Adote uma carta, não uma causa', body: 'Caridade no Natal funciona melhor quando é específica. Uma carta de uma criança, uma família da lista da paróquia, um pedido de um abrigo. Dá para terminar.' },
            { title: 'Escreva o cartão que você nunca manda', body: 'Escolha uma pessoa que facilitou seu ano, uma professora, um vizinho, uma enfermeira, e diga o que ela fez. Leva dez minutos e ninguém esquece.' },
            { title: 'Anote a receita que só aparece em dezembro', body: 'Toda família tem um prato de Natal. Pergunte quem ensinou e escreva este ano, enquanto quem sabe ainda está na mesa.' },
            { title: 'Coloque o seu grupo na foto', body: 'Use a moldura da igreja, da escola ou da família, para quem passar pelo seu perfil saber em qual mesa você está este ano.' },
        ],
        howOrgsMark: [
            { title: 'Comece cedo', body: 'Campanha de brinquedo e adoção de cartinha precisa de semanas, não de dias. Uma moldura lançada no fim de novembro tem tempo de circular antes das viagens.' },
            { title: 'Diga para que serve a moldura', body: 'Moldura com propósito, uma arrecadação, o horário da missa, uma campanha, circula mais que uma borda natalina genérica. Ponha na legenda a única coisa que você quer que a pessoa faça.' },
            { title: 'Deixe todo mundo à vontade', body: 'Sua comunidade pode ter gente que vive a data de outro jeito. Uma moldura com o nome da paróquia ou da campanha funciona para quem quiser participar.' },
        ],
        campaignIdeas: [
            'Moldura da escola ou da empresa para o Papai Noel dos Correios, com a data de entrega na legenda.',
            'Moldura da paróquia para a missa do galo ou para a novena.',
            'Moldura da empresa para a confraternização de fim de ano.',
            'Moldura da família com o sobrenome e o ano, para o grupo e para a ceia.',
            'Moldura da loja para a campanha de Natal, usada pela equipe no próprio perfil.',
        ],
        faqs: [
            { q: 'Quando é o Natal?', a: 'Dia 25 de dezembro. No Brasil a comemoração principal costuma ser a ceia da noite do dia 24.' },
            { q: 'Dá para fazer uma moldura para uma arrecadação ou para o Papai Noel dos Correios?', a: 'Sim. Faça uma moldura, mande um link, e coloque a data ou as instruções na legenda de compartilhamento.' },
            { q: 'Quem apoia precisa de conta?', a: 'Não. Abre o link, coloca a foto e baixa. Sem cadastro, sem marca d\'água.' },
            { q: 'Dá para usar de novo no ano que vem?', a: 'Sim. Guarde a campanha e troque só o ano ou a legenda em dezembro.' },
        ],
    },
    'new-year': {
        name: 'Réveillon e Ano Novo',
        tagline: 'Comece o ano com quem vai começar ele com você.',
        intro: [
            'O Ano Novo é 1º de janeiro, mas para quase todo grupo a festa é a noite de 31 de dezembro. No Brasil é Réveillon, roupa branca, fogos na praia e muita gente pulando sete ondas à meia-noite.',
            'Uma moldura do ano deixa o grupo visível: o time que chegou até aqui, a turma que se forma este ano, a igreja que começa o ano junta. Um link, sem cadastro para ninguém que você convidar.',
        ],
        background: [
            '1º de janeiro é feriado nacional no Brasil. O que as pessoas lembram, porém, são as tradições da noite anterior, e elas mudam de lugar para lugar.',
            'O branco é usado pela paz e por um recomeço. Nas cidades do litoral há grandes queimas de fogos, a de Copacabana, no Rio, é a mais conhecida, e pular sete ondas é um costume ligado a Iemanjá.',
            'Em outros países os costumes mudam: nas Filipinas a mesa tem doze frutas redondas, uma para cada mês, e as crianças pulam à meia-noite para crescer.',
        ],
        howToCelebrate: [
            { title: 'Anote três coisas, não promessas', body: 'Três coisas que deram certo este ano, cada uma com o nome de alguém. É um começo melhor que uma lista do que consertar.' },
            { title: 'Mantenha uma tradição de onde você veio', body: 'Roupa branca, sete ondas, lentilha, romã. Se a família está longe, manter o costume deles é um jeito de estar na mesma mesa.' },
            { title: 'Mande a mensagem antes da meia-noite', body: 'A rede trava às 00:00. Mande a mensagem para quem importa às 23:30 e esteja presente de verdade na virada.' },
            { title: 'Coloque o ano na foto', body: 'Use a moldura do time, da turma ou do grupo, para a primeira foto do ano dizer com quem você está começando.' },
        ],
        howOrgsMark: [
            { title: 'Use para abrir a temporada', body: 'Janeiro é quando clube, escola e igreja começam um ciclo novo. Uma moldura com o ano e o nome do grupo funciona como lançamento.' },
            { title: 'Agradeça quem ficou o ano todo', body: 'Uma moldura para membros, voluntários ou equipe que estiveram presentes o ano inteiro funciona melhor que uma mensagem genérica. Diga obrigado na legenda.' },
            { title: 'Mande o link na manhã do dia 31', body: 'Publique um ou dois dias antes e mande o link de manhã, antes de todo mundo estar na festa e longe do celular.' },
        ],
        campaignIdeas: [
            'Moldura do time com o ano novo e o escudo, para o começo da temporada.',
            'Moldura da turma que se forma este ano.',
            'Moldura da igreja para o primeiro culto ou a primeira missa do ano.',
            'Moldura da empresa agradecendo a equipe pelo ano que passou.',
            'Moldura da festa de Réveillon com o nome do lugar, mandada na manhã do dia 31.',
        ],
        faqs: [
            { q: 'Quando devo publicar uma moldura de Ano Novo?', a: 'Um ou dois dias antes de 31 de dezembro, e mande o link de manhã. A maioria das molduras recebe os primeiros apoiadores na primeira hora depois que o link sai.' },
            { q: 'Por que se usa branco no Réveillon?', a: 'O branco simboliza paz e recomeço, e no litoral também está ligado às oferendas para Iemanjá.' },
            { q: 'Quem apoia precisa de conta?', a: 'Não. Abre o link, coloca a foto e baixa.' },
        ],
    },
    carnaval: {
        name: 'Carnaval',
        tagline: 'Todo bloco tem bandeira. Esta vai na foto de todo mundo.',
        intro: [
            'O Carnaval vai do sábado à terça-feira antes da Quarta-feira de Cinzas, e a data muda todo ano junto com a Páscoa. Em 2027 é de 6 a 9 de fevereiro, com muita cidade fazendo festa dias antes e depois.',
            'Bloco, escola de samba ou grupo de amigos pode dar a todo mundo a mesma moldura antes do primeiro dia, e o grupo inteiro fica reconhecível em todas as fotos da semana.',
        ],
        background: [
            'O Carnaval acontece nos dias antes da Quaresma. No Brasil é a maior festa do ano, e a terça-feira é ponto facultativo na maior parte do país.',
            'Cada cidade tem o seu Carnaval. O Rio tem os desfiles das escolas de samba no Sambódromo e centenas de blocos de rua. Salvador tem os trios elétricos. Recife e Olinda têm o frevo e o maracatu. São Paulo virou um dos maiores Carnavais de rua do país.',
            'Bloco de rua é desfile aberto, quase sempre organizado por um grupo de amigos, um bairro ou uma banda. Muitos têm nome, cores e identidade próprios, que é justamente o que uma moldura carrega.',
        ],
        howToCelebrate: [
            { title: 'Escolha os blocos antes da semana', body: 'As prefeituras publicam a programação com semanas de antecedência. Escolha os dois ou três que você quer de verdade e se organize em volta deles.' },
            { title: 'Combine ponto de encontro e horário', body: 'Bateria acaba e rede trava. Decida onde o grupo se encontra se alguém se perder antes de sair de casa.' },
            { title: 'Aprenda uma música direito', body: 'Todo bloco tem o seu hino. Saber a letra é a diferença entre assistir ao desfile e estar nele.' },
            { title: 'Leve as cores para o perfil também', body: 'Use a moldura do bloco ou do grupo, para quem não estava lá ver em qual turma você estava.' },
        ],
        howOrgsMark: [
            { title: 'Lance a moldura com a data', body: 'Anuncie o dia e o trajeto junto com o link da moldura. As pessoas compartilham a moldura e a informação vai junto.' },
            { title: 'Use as cores do bloco, não um tema genérico', body: 'Moldura com o nome e as cores do bloco é o que faz o pessoal ter orgulho de usar. Envie o logo ou a arte como PNG transparente.' },
            { title: 'Bar e casa de show: uma moldura para a equipe toda', body: 'Equipe e frequentadores usando a mesma moldura transformam o lugar em ponto de encontro da semana, sem custo.' },
        ],
        campaignIdeas: [
            'Moldura do bloco com o nome, o ano e o dia do desfile.',
            'Moldura da escola de samba para os componentes, lançada antes do desfile.',
            'Moldura do grupo de amigos com a piada interna que todo mundo entende.',
            'Moldura do bar ou da casa de show para equipe e frequentadores.',
            'Moldura da cidade ou do bairro para o Carnaval de rua local.',
        ],
        faqs: [
            { q: 'Quando é o Carnaval de 2027?', a: 'Os dias principais são de sábado, 6 de fevereiro, a terça-feira, 9 de fevereiro de 2027. A Quarta-feira de Cinzas é 10 de fevereiro. A data muda todo ano porque acompanha a Páscoa.' },
            { q: 'O bloco pode usar o próprio logo?', a: 'Sim. Envie a arte como PNG transparente, ou escolha as cores no editor.' },
            { q: 'Quem usa a moldura precisa de conta?', a: 'Não. Abre o link, coloca a foto e baixa. Sem cadastro, sem marca d\'água.' },
        ],
    },
};
