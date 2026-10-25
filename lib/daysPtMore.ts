import type { DayPtCopy } from '@/lib/daysPt';

/** Portuguese bodies for the day pages that were still English only. */
export const DAY_PT_MORE: Record<string, DayPtCopy> = {
    'national-nonprofit-day': {
        name: 'Dia Nacional das Organizações sem Fins Lucrativos',
        tagline: 'Um dia para agradecer a quem mantém o trabalho de pé.',
        intro: [
            'O Dia Nacional das Organizações sem Fins Lucrativos é 17 de agosto, nos Estados Unidos. A maior parte do trabalho de uma organização é feita por gente que o relatório anual não nomeia, e este é o dia em que o setor aponta para essas pessoas.',
            'Uma moldura deixa isso visível. Equipe, voluntários e doadores colocam a mesma coisa na foto, e por um dia a rede inteira está usando. Grátis, sem cadastro, e nada por cima da foto que a pessoa baixa.',
        ],
        background: [
            'A data marca a contribuição do setor e, tanto quanto isso, as pessoas de dentro que raramente aparecem com nome.',
            'Cai no fim de agosto, depois da calmaria do verão no hemisfério norte e antes da temporada de arrecadação do outono. Serve para reencontrar uma lista que ficou quieta, sem pedir dinheiro na mesma frase.',
        ],
        howToCelebrate: [
            { title: 'Nomeie uma pessoa, em público', body: 'Não um “obrigado a todos”. Um nome, e a coisa específica que essa pessoa fez. É o post que o conselho de fato lê.' },
            { title: 'Ofereça uma hora, não um valor', body: 'Muita organização pequena falta mão antes de faltar dinheiro. Pergunte o que precisa ser feito em agosto, em vez de adivinhar.' },
            { title: 'Compartilhe o post deles, não o seu', body: 'Um repost de uma pessoa real chega a gente que a organização não alcança. Se for fazer uma coisa só, ponha as palavras deles na frente da sua rede.' },
        ],
        howOrgsMark: [
            { title: 'Agradeça quem não está no palco', body: 'Voluntário de recepção, quem fecha a sala, quem responde o grupo de madrugada. O dia é deles.' },
            { title: 'Não misture com pedido de doação', body: 'O agradecimento fica mais crível se o Pix ou o formulário não estiver na mesma frase. Se houver arrecadação, use outra campanha.' },
        ],
        campaignIdeas: [
            'Moldura com o nome da organização e a data 17 de agosto.',
            'Peça para cada pessoa citar um colega na legenda.',
            'Um link só para equipe, conselho e voluntários.',
        ],
        faqs: [
            { q: 'Quando é a data?', a: '17 de agosto, todos os anos, nos Estados Unidos.' },
            { q: 'É o mesmo que o Dia do Voluntário?', a: 'Não. Este dia aponta para o setor inteiro, não só para quem é voluntário.' },
            { q: 'Quem apoia precisa de conta?', a: 'Não. Abre o link, coloca a foto e baixa.' },
        ],
    },
    'national-smores-day': {
        name: 'Dia Nacional do S\'more',
        tagline: 'A última desculpa grande do verão, e a mais fácil de juntar um acampamento inteiro.',
        intro: [
            'O Dia Nacional do S\'more é 10 de agosto, nos Estados Unidos. Marshmallow, biscoito e chocolate viram a foto do acampamento, do grupo de jovens e da loja que vende o kit.',
            'Uma moldura dá um link para o grupo postar junto, em vez de cada um inventar uma arte. Grátis, sem cadastro.',
        ],
        background: [
            'A data cai no auge do acampamento de verão no hemisfério norte. O doce é o pretexto. O que a foto mostra é o grupo.',
            'Não é feriado oficial. É um dia de calendário que lojas, acampamentos e famílias já usam para a mesma imagem.',
        ],
        howToCelebrate: [
            { title: 'Faça um, e nomeie quem trouxe o fogo', body: 'A foto do doce sem a pessoa que organizou o acampamento perde a história. Cite o grupo na legenda.' },
            { title: 'Use as cores do acampamento', body: 'Anel nas cores do grupo, ou um PNG com o nome do acampamento na borda. O centro fica para o rosto.' },
            { title: 'Mande o link no grupo na véspera', body: '10 de agosto passa rápido. O link no grupo na noite anterior é o que faz a parede de fotos existir de manhã.' },
        ],
        howOrgsMark: [
            { title: 'Acampamento e loja no mesmo link', body: 'Se a loja patrocina o kit, o nome dela cabe na borda. O rosto continua da criança ou do monitor, com um adulto publicando.' },
            { title: 'Não transforme em anúncio', body: 'Uma frase sobre o acampamento vale mais do que um preço. O dia é a foto do grupo.' },
        ],
        campaignIdeas: [
            'Moldura com o nome do acampamento e 10 de agosto.',
            'Monitores e famílias no mesmo link.',
            'Legenda com o lugar, não só o doce.',
        ],
        faqs: [
            { q: 'Quando é?', a: '10 de agosto, nos Estados Unidos.' },
            { q: 'Serve para um grupo fora dos EUA?', a: 'Sim. A data é americana, mas qualquer acampamento pode usar a moldura no dia em que faz a fogueira.' },
            { q: 'Precisa de conta?', a: 'Não. O link abre no navegador.' },
        ],
    },
    'national-dog-day': {
        name: 'Dia Nacional do Cachorro',
        tagline: 'O maior dia de adoção do ano, e o mais fácil de fazer as pessoas postarem.',
        intro: [
            'O Dia Nacional do Cachorro é 26 de agosto, nos Estados Unidos. Abrigos e famílias usam o dia para mostrar cães que ainda esperam casa, e para quem já tem um cachorro aparecer junto.',
            'Uma moldura junta o abrigo, os voluntários e as famílias adotivas num link. A foto é da pessoa, ou do cão se for a foto de perfil que ela já usa. Grátis, sem cadastro.',
        ],
        background: [
            'A data foi criada para valorizar cães de abrigo e de família. Cai no fim de agosto, quando muita gente ainda está em foto de verão.',
            'Adoção continua sendo decisão do abrigo e da família. A moldura não é um formulário de adoção e não guarda a foto do animal como galeria.',
        ],
        howToCelebrate: [
            { title: 'Mostre um cão que ainda está no abrigo', body: 'Se o abrigo autorizar, a legenda leva ao perfil desse cão no site deles. A moldura é o sinal. O pedido de adoção fica no link do abrigo.' },
            { title: 'Quem já adotou também entra', body: 'Família com cachorro em casa é a prova de que a adoção aconteceu. Peça a foto deles no mesmo link.' },
            { title: 'Não invente número de adoção', body: 'A contagem do Ollabs é de quem salvou a moldura. O número de cães adotados é o do abrigo.' },
        ],
        howOrgsMark: [
            { title: 'Um abrigo, um link', body: 'Não misture vários abrigos na mesma arte se a pessoa não souber para onde ir. O nome do abrigo vai na borda.' },
            { title: 'Respeite a foto do animal', body: 'Use foto que o abrigo liberou. Não recorte foto de apoiador para virar anúncio.' },
        ],
        campaignIdeas: [
            'Moldura com o nome do abrigo e 26 de agosto.',
            'Voluntários e famílias adotivas no mesmo link.',
            'Legenda com o site de adoção, não com um Pix genérico.',
        ],
        faqs: [
            { q: 'Quando é?', a: '26 de agosto, nos Estados Unidos.' },
            { q: 'A moldura adota o cachorro?', a: 'Não. Ela mostra o apoio. A adoção acontece com o abrigo.' },
            { q: 'Quem apoia cria conta?', a: 'Não.' },
        ],
    },
    'labor-day': {
        name: 'Labor Day',
        tagline: 'Um dia sobre quem trabalha, o que inclui as pessoas que trabalham com você.',
        intro: [
            'O Labor Day nos Estados Unidos é a primeira segunda-feira de setembro. É feriado sobre trabalho, não sobre um produto. Sindicato, comércio local e associação de ofício usam o dia para nomear quem faz o serviço.',
            'Não confunda com 1º de maio, que é o Dia do Trabalhador em grande parte do mundo, inclusive no Brasil. Se a sua campanha é de maio, use essa data na arte. Esta página é a segunda-feira de setembro.',
        ],
        background: [
            'A data americana homenageia o movimento trabalhista e quem está empregado. Desfiles e folgas de fim de verão convivem com o sentido original.',
            'Uma moldura cabe quando o grupo quer o mesmo sinal no perfil: o sindicato, a loja, a equipe. O link é um só.',
        ],
        howToCelebrate: [
            { title: 'Nomeie o ofício', body: '“Obrigado, equipe” é vago. Pedreiro, enfermeiro, caixa, motorista: o nome do trabalho cabe na legenda.' },
            { title: 'Não transforme folga em anúncio', body: 'Se a loja fecha, diga isso. Não use o feriado para parecer que o desconto é a homenagem.' },
            { title: 'Mande o link para quem está na escala', body: 'O grupo do trabalho é o lugar. Um post público sem o grupo não chega em quem está no turno.' },
        ],
        howOrgsMark: [
            { title: 'Sindicato e empresa em campanhas separadas', body: 'Se os dois falam, cada um com a própria arte e o próprio link. Não misture brasão de greve com logo de empregador.' },
            { title: 'Respeite quem não pode postar', body: 'Algumas funções não podem usar foto de trabalho no perfil. O link é convite, não ordem.' },
        ],
        campaignIdeas: [
            'Moldura com o nome do sindicato ou da equipe e a data da segunda-feira.',
            'Legenda que nomeia o ofício.',
            'Campanha não listada se for só interna.',
        ],
        faqs: [
            { q: 'Quando é o Labor Day?', a: 'A primeira segunda-feira de setembro, nos Estados Unidos.' },
            { q: 'É o mesmo que 1º de maio?', a: 'Não. 1º de maio é o Dia do Trabalhador em muitos países. Esta página é a data americana de setembro.' },
            { q: 'Precisa de conta?', a: 'Não.' },
        ],
    },
    'national-coffee-day': {
        name: 'Dia Nacional do Café',
        tagline: 'Um dia em que a internet posta o café. Dê ao seu um lugar para apontar.',
        intro: [
            'O Dia Nacional do Café nos Estados Unidos é 29 de setembro. Muita gente posta uma xícara. Pouca gente diz de onde ela veio. A cafeteria que fez o café é a parte interessante.',
            'Uma moldura dá à loja, ao torrador ou ao grupo do campus um link para a foto apontar para um lugar real. Grátis, sem cadastro.',
        ],
        background: [
            'A data americana é 29 de setembro. Outros países marcam o café em outros dias, inclusive o Dia Internacional do Café em 1º de outubro. Use a data que a sua legenda promete.',
            'A foto de perfil continua sendo o rosto. A xícara pode estar na arte da borda, se couber sem cobrir os olhos.',
        ],
        howToCelebrate: [
            { title: 'Diga o nome da loja', body: '“Café” não localiza. O nome da cafeteria, o bairro ou a origem do grão cabem numa frase.' },
            { title: 'Não prometa desconto que a loja não fez', body: 'Se houver promoção, ela é da loja. A moldura não é cupom.' },
            { title: 'Equipe e clientes no mesmo link', body: 'Quem trabalha no balcão e quem compra de manhã usam a mesma campanha, se a loja quiser.' },
        ],
        howOrgsMark: [
            { title: 'Um endereço, não uma marca genérica', body: 'Rede grande pode usar a campanha da unidade. O nome da cidade evita parecer anúncio nacional sem dono.' },
            { title: 'Hub se a loja posta o ano inteiro', body: 'Para um dia, o link da campanha basta. Para a bio da cafeteria, o hub aponta para a moldura da vez.' },
        ],
        campaignIdeas: [
            'Moldura com o nome da cafeteria e 29 de setembro.',
            'Legenda com o bairro.',
            'Equipe no grupo da loja na véspera.',
        ],
        faqs: [
            { q: 'Quando é o Dia Nacional do Café nos EUA?', a: '29 de setembro.' },
            { q: 'É o mesmo que 1º de outubro?', a: 'Não. 1º de outubro é o Dia Internacional do Café. Se a sua campanha é essa, escreva essa data.' },
            { q: 'A pessoa precisa de conta?', a: 'Não.' },
        ],
    },
    'national-cat-day': {
        name: 'Dia Nacional do Gato',
        tagline: 'Gatos ficam no abrigo mais tempo que cães. Um dia por ano a internet está olhando.',
        intro: [
            'O Dia Nacional do Gato é 29 de outubro, nos Estados Unidos. Abrigos usam a data porque gato costuma esperar adoção mais tempo que cachorro, e neste dia as pessoas estão prestando atenção.',
            'Uma moldura junta abrigo, voluntário e família num link. A contagem é de quem salvou a foto, não de gatos adotados. Esse número é do abrigo.',
        ],
        background: [
            'A data existe para falar de gatos de abrigo e de casa. Cai no fim de outubro, no meio de outras campanhas de cor. A arte precisa dizer “gato” sem competir com fita de outra causa.',
            'Foto de animal só entra se o abrigo ou o tutor autorizar. O Ollabs não monta galeria com upload de apoiador.',
        ],
        howToCelebrate: [
            { title: 'Aponte para um gato específico', body: 'Se o abrigo autorizar, a legenda leva à ficha desse gato. “Adote” sem destino não ajuda.' },
            { title: 'Quem já tem gato entra também', body: 'Tutor em casa mostra que adoção dura. O mesmo link serve.' },
            { title: 'Separe de outras campanhas de outubro', body: 'Outubro já tem rosa e roxo. A arte desta campanha é do abrigo, não um mês genérico.' },
        ],
        howOrgsMark: [
            { title: 'Um abrigo por link', body: 'O nome na borda diz quem recebe a mensagem. Não junte vários abrigos sem combinar.' },
            { title: 'Sem número inventado', body: 'Não escreva quantos gatos foram adotados se o abrigo não publicou isso.' },
        ],
        campaignIdeas: [
            'Moldura com o nome do abrigo e 29 de outubro.',
            'Legenda com a ficha de um gato, se o abrigo autorizar.',
            'Voluntários no grupo do abrigo na véspera.',
        ],
        faqs: [
            { q: 'Quando é?', a: '29 de outubro, nos Estados Unidos.' },
            { q: 'A moldura substitui a adoção?', a: 'Não. Ela mostra apoio. A adoção é com o abrigo.' },
            { q: 'Precisa de conta?', a: 'Não.' },
        ],
    },
    'suicide-prevention-month': {
        name: 'Mês de Prevenção do Suicídio',
        tagline: 'Deixe mais fácil dizer a frase que mais custa começar.',
        intro: [
            'Setembro é o Mês de Prevenção do Suicídio nos Estados Unidos. O ponto não é encher o feed de frase de esperança. É deixar possível perguntar direto, escutar com calma e achar ajuda real.',
            'Uma moldura em verde-azulado e roxo pode deixar esse apoio visível numa escola, num trabalho ou numa comunidade. Ela precisa viajar com um recurso de crise e um convite simples para conversar.',
        ],
        background: [
            'O mês cobre setembro nos Estados Unidos. O Dia Mundial de Prevenção do Suicídio cai dentro dele, em 10 de setembro.',
            'Verde-azulado e roxo são cores usadas juntas nessa causa. A cor não é a mensagem. Campanha útil diz o que fazer: quem ligar, onde ir, e como responder quando alguém diz que não está seguro.',
            'Nos Estados Unidos, a pessoa pode ligar ou enviar mensagem para o 988, o Suicide and Crisis Lifeline. Fora dos EUA, publique o serviço local. Não copie o número americano num post para outro país. No Brasil, o CVV atende pelo 188.',
        ],
        howToCelebrate: [
            { title: 'Guarde o número certo antes de precisar', body: 'Deixe o serviço local e uma pessoa de confiança nos contatos. Nos EUA, 988. No Brasil, CVV 188. Se houver perigo imediato, acione o serviço de emergência local e fique com a pessoa se for seguro.' },
            { title: 'Faça a pergunta direta', body: 'Se você está preocupado, perguntar se a pessoa está pensando em suicídio não planta a ideia. Dá permissão para responder com clareza. Escute sem discutir, sem prometer segredo e sem apressar um motivo para ela “melhorar”.' },
            { title: 'Volte no dia seguinte', body: 'Uma mensagem na manhã seguinte importa. Outra na semana seguinte também. O apoio costuma chegar num pico e sumir enquanto a pessoa ainda está lidando com isso.' },
        ],
        howOrgsMark: [
            { title: 'Publique o caminho de ajuda', body: 'Telefone, chat ou endereço de um serviço real, no idioma de quem vai ler. A moldura sem esse destino é só cor.' },
            { title: 'Não descreva método', body: 'Não detalhe como alguém se machucou. O convite é para ajuda, não para instrução.' },
        ],
        campaignIdeas: [
            'Moldura com a cor da campanha e o nome do serviço local na legenda.',
            'Um adulto responsável publica campanha de escola.',
            'O número de crise no texto de compartilhar, não só na arte.',
        ],
        faqs: [
            { q: 'Quando é o mês?', a: 'Setembro, nos Estados Unidos. O Dia Mundial de Prevenção do Suicídio é 10 de setembro.' },
            { q: 'Qual número usar?', a: 'O do seu país. Nos EUA, 988. No Brasil, CVV 188. Não copie um número estrangeiro para um grupo local.' },
            { q: 'Perguntar direto faz mal?', a: 'Não. Perguntar com clareza não planta a ideia. Dá espaço para uma resposta direta.' },
        ],
    },
    'childhood-cancer-awareness-month': {
        name: 'Mês de Conscientização do Câncer Infantil',
        tagline: 'Dourado pelas crianças em tratamento, e presença para as famílias em volta.',
        intro: [
            'Setembro é o Mês de Conscientização do Câncer Infantil. A cor dourada marca crianças em tratamento. O que a família precisa no dia a dia é carona, comida, escuta e um caminho claro para o serviço que já cuida delas.',
            'Uma moldura dourada pode juntar escola, hospital e vizinhança no mesmo link. Ela não diz quando tratar, nem substitui a equipe clínica.',
        ],
        background: [
            'A fita dourada é o símbolo mais usado para câncer infantil. Organizações diferentes enfatizam pesquisa, apoio à família ou um hospital específico. A campanha deve dizer qual delas é.',
            'Esta página não dá orientação médica. Idade, país e diagnóstico mudam o cuidado. Quem organiza aponta para a instituição que a família já usa.',
        ],
        howToCelebrate: [
            { title: 'Pergunte o que a família precisa esta semana', body: 'Não adivinhe presente. Pergunte carona, marmita ou companhia na sala de espera, se eles quiserem.' },
            { title: 'Diga o nome da instituição', body: '“Câncer infantil” sem hospital ou associação deixa a pessoa sem destino. O nome vai na legenda.' },
            { title: 'Proteja a criança', body: 'Foto de criança só com autorização de quem cuida. Um adulto publica a campanha.' },
        ],
        howOrgsMark: [
            { title: 'Apoio, não conselho clínico', body: 'A moldura mostra solidariedade. Tratamento fica com a equipe de saúde.' },
            { title: 'Não use a história da criança como anúncio', body: 'Se a família não pediu para ser o rosto da campanha, não publique o caso.' },
        ],
        campaignIdeas: [
            'Moldura dourada com o nome do hospital ou da associação.',
            'Legenda com um jeito concreto de ajudar esta semana.',
            'Campanha separada se também houver arrecadação.',
        ],
        faqs: [
            { q: 'Quando é o mês?', a: 'Setembro.' },
            { q: 'A moldura diz como tratar?', a: 'Não. Não é orientação médica. Aponte para a instituição que acompanha a família.' },
            { q: 'Posso usar foto de uma criança?', a: 'Só com autorização de quem é responsável, e com um adulto publicando.' },
        ],
    },
    'world-alzheimers-month': {
        name: 'Mês Mundial do Alzheimer',
        tagline: 'Espaço para quem ainda está aqui, e para quem faz o cuidado de todo dia.',
        intro: [
            'Setembro é o Mês Mundial do Alzheimer. O foco é a pessoa que vive com a doença e quem cuida dela no dia a dia, não um laço genérico.',
            'Uma moldura pode juntar família, associação e serviço local num link. Ela não diagnostica e não substitui o médico.',
        ],
        background: [
            'O mês inclui o Dia Mundial do Alzheimer, em 21 de setembro. Associações usam a data para falar de diagnóstico, cuidado e direitos.',
            'Cuidado diário é repetição: consulta, casa, paciência. A campanha fica melhor quando nomeia um serviço que a família pode ligar, no país dela.',
        ],
        howToCelebrate: [
            { title: 'Fale com a pessoa, não só sobre ela', body: 'Se ela puder participar, a legenda não a apaga. Evite infantilizar.' },
            { title: 'Nomeie quem cuida', body: 'Familiar e profissional de cuidado carregam o mês inteiro. Um agradecimento específico cabe melhor do que um slogan.' },
            { title: 'Aponte para a associação local', body: 'O telefone ou o site da associação do seu país vai na legenda. Não copie um serviço de outro país.' },
        ],
        howOrgsMark: [
            { title: 'Sem promessa de cura', body: 'A moldura não anuncia tratamento. Se houver estudo ou serviço, o link é o da instituição.' },
            { title: 'Privacidade da família', body: 'Não publique rotina de uma casa sem pedido de quem cuida.' },
        ],
        campaignIdeas: [
            'Moldura com o nome da associação e setembro.',
            'Legenda com o serviço local.',
            'Famílias e voluntários no mesmo link, se a associação combinar.',
        ],
        faqs: [
            { q: 'Quando é?', a: 'Setembro. O Dia Mundial do Alzheimer é 21 de setembro.' },
            { q: 'Isto orienta tratamento?', a: 'Não. Converse com um profissional de saúde. A campanha aponta para a associação, não para um protocolo.' },
            { q: 'Precisa de conta para apoiar?', a: 'Não.' },
        ],
    },
    'hispanic-heritage-month': {
        name: 'Mês da Herança Hispânica',
        tagline: 'Um mês para nomes, lugares e comunidades vivas, não uma ideia achatada de cultura.',
        intro: [
            'O Mês da Herança Hispânica nos Estados Unidos vai de 15 de setembro a 15 de outubro. O começo não é aleatório: 15 de setembro é a independência de Costa Rica, El Salvador, Guatemala, Honduras e Nicarágua. México e Chile marcam a independência na mesma semana.',
            'Uma moldura serve quando o grupo nomeia o país, a cidade ou a comunidade. “Hispânico” sozinho achata gente que não usa o mesmo nome para si.',
        ],
        background: [
            'A observância começou como semana em 1968 e passou a 31 dias em 1988.',
            'Hispânico e latino se sobrepõem e não são a mesma coisa, e nenhuma das palavras é a preferida de todo mundo. Use o termo que as pessoas do grupo usam para si.',
        ],
        howToCelebrate: [
            { title: 'Diga o lugar', body: 'Cidade, estado ou país de origem na legenda. Uma bandeira genérica não conta a história da sua associação.' },
            { title: 'Deixe o grupo escolher o idioma', body: 'Espanhol, português, inglês ou os dois. A arte pode ser bilíngue se o PNG couber na borda sem cobrir o rosto.' },
            { title: 'Não reduza a comida', body: 'Um prato pode entrar se você disser de onde ele é. Um prato não representa um continente.' },
        ],
        howOrgsMark: [
            { title: 'Comunidade, não fantasia', body: 'Escola e empresa seguem o que a associação local já faz, em vez de inventar um tema.' },
            { title: 'Campanhas separadas se os países pedirem', body: 'Independência do México e independência da América Central não precisam da mesma arte.' },
        ],
        campaignIdeas: [
            'Moldura com o nome da associação e as datas 15 de setembro a 15 de outubro.',
            'Legenda no idioma que o grupo usa.',
            'Um link por celebração de independência, se forem eventos diferentes.',
        ],
        faqs: [
            { q: 'Quando é?', a: 'De 15 de setembro a 15 de outubro, nos Estados Unidos.' },
            { q: 'Por que começa em 15 de setembro?', a: 'É o aniversário da independência de Costa Rica, El Salvador, Guatemala, Honduras e Nicarágua. México e Chile marcam a data na mesma semana.' },
            { q: 'Hispânico e latino são a mesma coisa?', a: 'Não são idênticos, e ninguém é obrigado a preferir um. Siga o termo que a comunidade usa.' },
        ],
    },
    'breast-cancer-awareness-month': {
        name: 'Mês de Conscientização do Câncer de Mama',
        tagline: 'Use rosa, e ponha a atenção num lugar que a paciente consiga usar.',
        intro: [
            'Outubro é o Mês de Conscientização do Câncer de Mama. Rosa aparece em todo lugar. Informação clara sobre rastreamento, doença metastática, transporte e custo de tratamento é mais difícil de achar.',
            'Uma moldura rosa pode juntar sobreviventes, clínicas, famílias e arrecadação na mesma campanha. Dê a essa visibilidade um destino. A cor sozinha não é o trabalho.',
        ],
        background: [
            'O mês começou nos Estados Unidos em 1985, numa parceria da American Cancer Society com a divisão farmacêutica da Imperial Chemical Industries. O foco inicial era encorajar a mamografia.',
            'A fita rosa virou o símbolo dominante no início dos anos 1990. Hoje o mês cobre prevenção, rastreamento, tratamento, sobrevivência e câncer de mama metastático, embora nem toda organização dê o mesmo peso a cada um.',
            'A recomendação de rastreamento muda com idade, risco e país. Uma página de calendário não diz quando uma pessoa deve fazer exame. Campanha útil aponta para a orientação local e para uma conversa com profissional de saúde.',
        ],
        howToCelebrate: [
            { title: 'Diga para onde a atenção vai', body: 'Clínica, associação ou fundo de transporte. “Rosa” sem destino não ajuda quem está em tratamento.' },
            { title: 'Não dê data de exame', body: 'Não escreva idade ou periodicidade como se fosse regra universal. Aponte para a orientação do país e para o clínico.' },
            { title: 'Separe solidariedade e arrecadação', body: 'Se houver doação, o Pix ou o formulário fica no texto, na ferramenta que vocês já usam. O Ollabs não recebe dinheiro.' },
        ],
        howOrgsMark: [
            { title: 'Paciente não é anúncio', body: 'História pessoal só com pedido da pessoa. Metástase não é um detalhe gráfico para a arte.' },
            { title: 'Arte da clínica', body: 'PNG transparente ou a cor exata da campanha. Paciente e família usam sem conta.' },
        ],
        campaignIdeas: [
            'Moldura rosa com o nome da clínica ou da associação.',
            'Legenda com o serviço local de rastreamento, sem idade inventada.',
            'Campanha de doação separada, se o pedido for dinheiro.',
        ],
        faqs: [
            { q: 'Quando começou o mês?', a: 'Em 1985, nos Estados Unidos, numa parceria da American Cancer Society com a divisão farmacêutica da Imperial Chemical Industries.' },
            { q: 'Quando devo fazer rastreamento?', a: 'Depende do país, da idade e do risco. Use a orientação local e converse com um profissional de saúde sobre a sua história.' },
            { q: 'A clínica pode usar a própria arte?', a: 'Sim. Envie um PNG transparente ou defina a cor. Pacientes e apoiadores usam sem conta.' },
        ],
    },
    'domestic-violence-awareness-month': {
        name: 'Mês de Conscientização da Violência Doméstica',
        tagline: 'Acredite nas pessoas, proteja as escolhas delas e deixe o caminho de ajuda fácil de achar.',
        intro: [
            'Outubro é o Mês de Conscientização da Violência Doméstica. Para quem é monitorado em casa, até buscar ajuda pode ter risco. O que serve são contatos discretos, orientação de aparelho seguro e defensores que não tirem o controle da pessoa.',
            'Uma moldura roxa pode mostrar que um trabalho, um campus ou uma comunidade acredita em quem sobreviveu. A campanha por trás precisa ser tão cuidadosa quanto o símbolo é visível.',
        ],
        background: [
            'O mês cresceu a partir do Dia da Unidade organizado pela National Coalition Against Domestic Violence em outubro de 1981. A primeira edição nacional do mês foi em outubro de 1987.',
            'Roxo é a cor mais usada. O mês homenageia pessoas mortas pela violência, reconhece quem sobreviveu e liga a comunidade a serviços.',
            'Violência doméstica pode incluir violência física e sexual, perseguição, ameaça, controle coercitivo, abuso financeiro e monitoramento por tecnologia. Sair não é um passo único nem seguro para todo mundo. Por isso o plano de segurança liderado pela própria pessoa importa.',
        ],
        howToCelebrate: [
            { title: 'Publique um contato discreto', body: 'Chat, telefone ou endereço que o serviço local recomenda, inclusive aviso sobre aparelho monitorado. Não force a pessoa a ligar na sua frente.' },
            { title: 'Não assuma o controle', body: 'Acredite no relato. Não prometa o que vai acontecer, não confronte o agressor “por ela” e não publique a história sem pedido.' },
            { title: 'Diga o que o lugar faz depois de um relato', body: 'Escola e empresa precisam de um caminho real: quem escuta, o que acontece depois, como evitam retaliação.' },
        ],
        howOrgsMark: [
            { title: 'Serviço local, não número copiado', body: 'Use o serviço do país. No Brasil, a Central de Atendimento à Mulher é 180. Não troque por um número americano se o grupo é daqui.' },
            { title: 'Sem detalhe gráfico', body: 'Não descreva agressão. O post indica ajuda, não reconstitui o que aconteceu.' },
        ],
        campaignIdeas: [
            'Moldura roxa com o nome do serviço, não com a história de uma pessoa.',
            'Legenda com contato discreto e aviso de aparelho seguro, se o serviço orientar assim.',
            'Campanha de campus ou empresa com o caminho interno de relato.',
        ],
        faqs: [
            { q: 'Quando é o mês?', a: 'Outubro. A primeira edição nacional nos Estados Unidos foi em 1987. O Dia da Unidade que originou a data foi em outubro de 1981.' },
            { q: 'Qual contato publicar no Brasil?', a: 'O serviço local. A Central de Atendimento à Mulher atende pelo 180. Confirme no canal oficial antes de imprimir.' },
            { q: 'Posso contar o caso de alguém na arte?', a: 'Não, a menos que a própria pessoa peça. A campanha mostra o caminho de ajuda, não a história.' },
        ],
    },
    'world-mental-health-day': {
        name: 'Dia Mundial da Saúde Mental',
        tagline: 'Um dia para deixar o apoio mais fácil de achar e mais seguro de pedir.',
        intro: [
            'O Dia Mundial da Saúde Mental é 10 de outubro. O trabalho do dia é deixar o apoio encontrável: onde falar, com quem, e sem transformar o pedido numa performance.',
            'Uma moldura pode mostrar que a escola, o trabalho ou o grupo leva isso a sério. Ela precisa de um destino real na legenda.',
        ],
        background: [
            'A data é marcada por organizações de saúde em vários países. O tema do ano muda. Use o tema oficial só se for o da instituição que você representa.',
            'Saúde mental não é slogan. Se a pessoa está em crise, o caminho é o serviço de crise local, não a moldura. No Brasil, o CVV atende pelo 188. Em emergência, o serviço local de urgência.',
        ],
        howToCelebrate: [
            { title: 'Diga onde a pessoa fala', body: 'Serviço de saúde da escola, plano, posto ou linha local. Um coração na arte não é endereço.' },
            { title: 'Não peça para ninguém se expor', body: 'Usar a moldura não é convite para contar diagnóstico no grupo. Quem quiser falar, fala. Quem não quiser, só coloca a foto.' },
            { title: 'Volte depois do dia 10', body: 'Um dia de feed não sustenta cuidado. O link do serviço continua na bio ou no hub se a organização mantém isso o ano inteiro.' },
        ],
        howOrgsMark: [
            { title: 'Política interna visível', body: 'Empresa e campus dizem quem escuta um pedido de ajuda e o que não acontece com quem pede (sem retaliação, sem fofoca de corredor).' },
            { title: 'Sem orientação clínica', body: 'A campanha não prescreve. Aponta para profissional e para o serviço.' },
        ],
        campaignIdeas: [
            'Moldura com 10 de outubro e o nome do serviço local.',
            'Legenda com CVV 188 se o público é do Brasil, ou o equivalente local.',
            'Campanha separada de qualquer arrecadação.',
        ],
        faqs: [
            { q: 'Quando é?', a: '10 de outubro.' },
            { q: 'A moldura trata alguém?', a: 'Não. Em crise, use o serviço local. No Brasil, CVV 188. Em emergência, o serviço de urgência.' },
            { q: 'A pessoa é obrigada a contar a história?', a: 'Não. Colocar a moldura não é depoimento.' },
        ],
    },
    'unity-day': {
        name: 'Dia da Unidade',
        tagline: 'Use laranja, inclua quem ficou de fora e faça o caminho de relato funcionar.',
        intro: [
            'O Dia da Unidade é a terceira quarta-feira de outubro, durante o Mês Nacional de Prevenção ao Bullying nos Estados Unidos. Estudantes e adultos usam laranja para mostrar que bullying não é aceito e que ninguém deve ser empurrado para a borda da vida escolar.',
            'Uma moldura laranja deixa a escola visível nessa promessa. Ela só importa se o estudante também souber qual adulto escuta, o que acontece depois de um relato e como a retaliação é tratada.',
        ],
        background: [
            'O National Bullying Prevention Center da PACER criou o Dia da Unidade em 2011. Laranja foi a cor escolhida para unidade, gentileza, aceitação e inclusão.',
            'A data segue uma regra, não um número fixo: a terceira quarta-feira de outubro. Em 2026, cai em 21 de outubro.',
            'Bullying é agressão repetida com desequilíbrio de poder, real ou percebido. Nem todo conflito é bullying. Tratar exclusão, humilhação ou assédio repetidos como “coisa de criança” deixa o estudante atingido carregando a resposta sozinho.',
        ],
        howToCelebrate: [
            { title: 'Sente com quem está isolado', body: 'Cartaz é abstrato. Almoço não é. Se alguém fica de fora sempre, faça um convite normal e fique tempo bastante para não parecer caridade de um dia.' },
            { title: 'Mostre o caminho de relato', body: 'Qual adulto, em qual sala, o que acontece depois. Se o estudante não sabe, a cor não protege.' },
            { title: 'Inclua família', body: 'Pais e responsáveis no mesmo link, com o texto da escola sobre como relatar. Um adulto publica.' },
        ],
        howOrgsMark: [
            { title: 'A regra escrita', body: 'A campanha aponta para a política da escola, não para um castigo inventado na legenda.' },
            { title: 'Sem expor o estudante', body: 'Não conte um caso com nome ou detalhe. O dia é o caminho, não o episódio.' },
        ],
        campaignIdeas: [
            'Moldura laranja com o nome da escola e a quarta-feira do ano.',
            'Legenda com o adulto e a sala de relato.',
            'Famílias e estudantes no mesmo link, publicado por um adulto.',
        ],
        faqs: [
            { q: 'Quando é?', a: 'A terceira quarta-feira de outubro. Em 2026, 21 de outubro.' },
            { q: 'Quem criou a data?', a: 'O National Bullying Prevention Center da PACER, em 2011.' },
            { q: 'Laranja resolve o bullying?', a: 'Não. A cor mostra o acordo. O que protege é o adulto que escuta e o que a escola faz depois do relato.' },
        ],
    },
    'hari-batik': {
        name: 'Hari Batik Nasional',
        tagline: 'Vista batik, diga de onde veio e repare nas mãos por trás do pano.',
        intro: [
            'O Hari Batik Nasional é 2 de outubro, na Indonésia. Batik é pano e técnica, com origem em lugares e mãos específicas, não um estampado genérico.',
            'Uma moldura deixa escola, associação e negócio compartilharem um link no dia. A legenda diz a região ou a oficina, se você souber.',
        ],
        background: [
            'A UNESCO inscreveu o batik indonésio como patrimônio cultural imaterial em 2009. O dia nacional marca esse reconhecimento.',
            'Padrões diferentes vêm de regiões diferentes. Nomear a origem é o mínimo de respeito com quem faz o pano.',
        ],
        howToCelebrate: [
            { title: 'Diga de onde é o padrão', body: 'Cidade ou região na legenda, se a peça tiver origem conhecida. “Batik” sozinho apaga a oficina.' },
            { title: 'Não trate como fantasia', body: 'Usar a peça no dia é celebração. Recortar um padrão sagrado ou de cortejo sem contexto não é.' },
            { title: 'Cite quem fez', body: 'Se a oficina ou o artesão for público, o nome cabe na frase. Não invente atribuição.' },
        ],
        howOrgsMark: [
            { title: 'Escola e associação', body: 'Um link para a turma ou para a comunidade indonésia na sua cidade.' },
            { title: 'Arte na borda', body: 'O padrão fica na moldura. O rosto fica livre. PNG quadrado com o centro transparente.' },
        ],
        campaignIdeas: [
            'Moldura com o padrão autorizado e 2 de outubro.',
            'Legenda com a região de origem.',
            'Turma ou associação no mesmo link.',
        ],
        faqs: [
            { q: 'Quando é?', a: '2 de outubro.' },
            { q: 'Por que a data existe?', a: 'Marca o reconhecimento do batik indonésio pela UNESCO como patrimônio cultural imaterial, em 2009.' },
            { q: 'Dá para fazer a moldura bilíngue?', a: 'Sim. Indonésio e português, ou indonésio e inglês, se o texto couber na borda.' },
        ],
    },
    'sumpah-pemuda': {
        name: 'Sumpah Pemuda',
        tagline: 'Uma pátria, uma nação, uma língua. Um dia para os jovens decidirem o que a unidade pede agora.',
        intro: [
            'O Sumpah Pemuda, o Juramento da Juventude, é lembrado em 28 de outubro na Indonésia. O congresso de 1928 afirmou uma pátria, uma nação e uma língua, o indonésio.',
            'Escolas, universidades e associações de estudantes usam o dia para falar de unidade sem apagar a língua e a região de cada um. Uma moldura dá um link para esse retrato coletivo.',
        ],
        background: [
            'O segundo Congresso da Juventude se reuniu em 27 e 28 de outubro de 1928, em Batávia, hoje Jacarta. O juramento foi lido em 28 de outubro.',
            'Wage Rudolf Supratman tocou Indonesia Raya ao violino, em versão instrumental, no congresso. A peça depois se tornou o hino nacional.',
        ],
        howToCelebrate: [
            { title: 'Leia o juramento no idioma do grupo', body: 'Indonésio, e a tradução se o grupo for diaspórico. Não troque o texto por um slogan de marca.' },
            { title: 'Nomeie a associação de estudantes', body: 'Campus e cidade na legenda. Unidade sem lugar vira cartaz.' },
            { title: 'Deixe espaço para mais de uma língua', body: 'O juramento escolheu o indonésio como língua comum. Isso não apaga as línguas regionais. Diga as duas se for o caso.' },
        ],
        howOrgsMark: [
            { title: 'Estudantes no centro', body: 'Quem organiza é o grêmio, o centro acadêmico ou a associação, não um anúncio de fora.' },
            { title: 'Arte em vermelho e branco', body: 'As cores da bandeira cabem na borda. O rosto fica no centro.' },
        ],
        campaignIdeas: [
            'Moldura vermelha e branca com 28 de outubro.',
            'Legenda com o nome da associação de estudantes.',
            'Versão bilíngue se a diáspora pedir.',
        ],
        faqs: [
            { q: 'Quando é?', a: '28 de outubro.' },
            { q: 'Indonesia Raya foi tocada no congresso?', a: 'Sim. Wage Rudolf Supratman tocou a versão instrumental no violino. Depois virou o hino da Indonésia.' },
            { q: 'Uma associação de estudantes pode fazer moldura bilíngue?', a: 'Sim. Envie a arte em indonésio e no outro idioma como PNG transparente, ou faça duas campanhas com as mesmas cores.' },
        ],
    },
    'mexico-independence-day': {
        name: 'Dia da Independência do México',
        tagline: '16 de setembro, no México e em todo lugar onde mexicanos se encontram.',
        intro: [
            'O México marca a Independência em 16 de setembro, aniversário do Grito de Dolores. Verde, branco e vermelho aparecem em praças, escolas e famílias dos dois lados da fronteira.',
            'Uma moldura dá a escolas, associações e negócios um link para o dia. O nome da cidade ou da comunidade na legenda faz o post pertencer a gente real.',
        ],
        background: [
            'A tradição do Grito lembra o chamado de Miguel Hidalgo em Dolores, em 16 de setembro de 1810, que abriu a guerra longa pela independência da Espanha.',
            '16 de setembro é feriado nacional no México. A festa muitas vezes começa na noite anterior, com o grito cerimonial nas praças.',
        ],
        howToCelebrate: [
            { title: 'Diga o que o grito marca', body: 'A data é o começo do movimento de independência, não o dia em que a Espanha foi embora. Essa diferença mantém o post honesto.' },
            { title: 'Um prato, com o estado', body: 'Diga de qual estado ou cidade vem a receita. Um prato não é o México inteiro.' },
            { title: 'As cores, com as suas palavras', body: 'Use a moldura e uma legenda em espanhol, português ou os dois, com a sua cidade.' },
        ],
        howOrgsMark: [
            { title: 'Propósito cívico claro', body: 'Verde, branco e vermelho têm sentido nacional. Diga se o evento é cultural ou comunitário.' },
            { title: 'Inclua a diáspora', body: 'Comunidades mexicanas fora do país muitas vezes colocam família e língua no centro. Deixe quem organiza no lugar decidir o programa.' },
        ],
        campaignIdeas: [
            'Moldura verde, branca e vermelha, com o nome da cidade se couber.',
            'Legenda com uma tradição do estado da pessoa.',
            'Link separado se houver arrecadação ou festa.',
        ],
        faqs: [
            { q: 'Quando é?', a: '16 de setembro, todos os anos. Lembra o Grito de Dolores, em 1810.' },
            { q: 'É a mesma coisa que Cinco de Mayo?', a: 'Não. Cinco de Mayo marca a Batalha de Puebla, em 1862. 16 de setembro é o aniversário da independência.' },
            { q: 'Quem apoia precisa de conta?', a: 'Não. Abre o link, coloca a foto e baixa.' },
        ],
    },
    'nigeria-independence-day': {
        name: 'Dia da Independência da Nigéria',
        tagline: '1º de outubro, verde e branco, na Nigéria e fora dela.',
        intro: [
            'A Nigéria marca a Independência em 1º de outubro, quando o país se tornou uma federação soberana, em 1960. Verde e branco aparecem em desfiles, cultos e encontros da diáspora.',
            'Uma moldura dá um link para a associação, o grupo do campus ou a comunidade aparecerem juntos.',
        ],
        background: [
            'A Nigéria tornou-se independente do Reino Unido em 1º de outubro de 1960 e república em 1963.',
            'A bandeira verde e branca foi adotada em 1960. O verde representa a riqueza natural. O branco representa a paz.',
        ],
        howToCelebrate: [
            { title: 'Diga a cidade ou o estado', body: 'A Nigéria é diversa. Uma legenda que nomeia Lagos, Enugu, Kaduna ou a cidade da diáspora deixa o post específico.' },
            { title: 'Apoie uma causa que o grupo já confia', body: 'Se houver projeto, é o que a comunidade já conhece. A moldura não é a vaquinha.' },
            { title: 'Use a bandeira com respeito', body: 'Mantenha cívico ou cultural, não partidário, a menos que o evento seja explicitamente isso.' },
        ],
        howOrgsMark: [
            { title: 'Quem lidera a comunidade fala', body: 'Pastor, liderança estudantil ou presidente da associação explica por que o dia importa para o grupo.' },
            { title: 'Fuso da diáspora', body: 'Marque o horário para quem está fora também participar ao vivo, não só ver o replay.' },
        ],
        campaignIdeas: [
            'Moldura verde e branca com 1º de outubro.',
            'Legenda com a cidade.',
            'Um link para o grupo da associação.',
        ],
        faqs: [
            { q: 'Quando é?', a: '1º de outubro. A independência do Reino Unido foi em 1960.' },
            { q: 'O que as cores significam?', a: 'Verde para a riqueza natural e branco para a paz, na bandeira adotada em 1960.' },
            { q: 'Precisa de conta?', a: 'Não.' },
        ],
    },
    'malaysia-merdeka': {
        name: 'Hari Merdeka',
        tagline: 'Merdeka em 31 de agosto, um link para malaios em qualquer lugar.',
        intro: [
            'A Malásia marca o Hari Merdeka em 31 de agosto, a independência do domínio britânico em 1957. Listras, lua e estrela aparecem em escolas, escritórios e festas de comunidade.',
            'Uma moldura deixa o grupo compartilhar um link no dia, com espaço para o estado ou o nome da organização se couber na borda.',
        ],
        background: [
            'A Federação Malaia declarou independência em 31 de agosto de 1957. A Malásia como existe hoje foi formada em 1963.',
            'As festas de Merdeka costumam incluir desfile, hasteamento da bandeira e encontro de comunidade na semana de 31 de agosto.',
        ],
        howToCelebrate: [
            { title: 'Diga o estado', body: 'A Malásia não é uma cidade só. O estado ou a cidade na legenda localiza a festa.' },
            { title: 'Separe Merdeka de outras datas', body: 'Não misture com o Dia da Malásia (16 de setembro) na mesma arte se forem eventos diferentes.' },
            { title: 'Um link para a associação', body: 'Escola, campus ou negócio da diáspora no mesmo endereço, se for a mesma festa.' },
        ],
        howOrgsMark: [
            { title: 'Cívico, com dono', body: 'O nome de quem organiza vai na arte ou na legenda. Bandeira sem dono parece anúncio.' },
            { title: 'Cores da bandeira na borda', body: 'O rosto fica livre. PNG quadrado ou anel nas cores combinadas.' },
        ],
        campaignIdeas: [
            'Moldura com 31 de agosto e o nome do grupo.',
            'Legenda com o estado.',
            'Campanha separada se 16 de setembro for outro evento.',
        ],
        faqs: [
            { q: 'Quando é o Hari Merdeka?', a: '31 de agosto. A independência da Federação Malaia foi em 1957.' },
            { q: 'É o mesmo que 16 de setembro?', a: 'Não. 16 de setembro marca a formação da Malásia em 1963. Merdeka é 31 de agosto de 1957.' },
            { q: 'Quem apoia cria conta?', a: 'Não.' },
        ],
    },
    'philippines-bonifacio-day': {
        name: 'Dia de Bonifacio',
        tagline: '30 de novembro, em memória de Andres Bonifacio e da luta pela independência.',
        intro: [
            'As Filipinas observam o Dia de Bonifacio em 30 de novembro, aniversário de Andres Bonifacio, liderança da revolução contra o domínio espanhol.',
            'Escolas, grupos de história e comunidades filipinas usam o dia para reflexão e orgulho. Uma moldura liga essas pessoas num link.',
        ],
        background: [
            'Andres Bonifacio é lembrado como liderança do Katipunan e da revolução. A data nacional é o aniversário de nascimento, 30 de novembro.',
            'Não é 12 de junho, o Dia da Independência. São memórias diferentes e merecem artes diferentes.',
        ],
        howToCelebrate: [
            { title: 'Diga quem foi Bonifacio, em uma frase', body: 'Liderança da revolução contra a Espanha. Sem transformar a legenda num verbete, e sem errar a data.' },
            { title: 'Escola e diáspora', body: 'O mesmo link serve para a turma e para a associação na sua cidade, se a festa for a mesma.' },
            { title: 'Azul e vermelho na borda', body: 'As cores da bandeira cabem na moldura. O rosto fica no centro.' },
        ],
        howOrgsMark: [
            { title: 'História, não produto', body: 'Se houver evento cultural, o link do evento vai na legenda. A moldura não vende ingresso.' },
            { title: 'Não misture com 12 de junho', body: 'Independência e Bonifacio são campanhas separadas.' },
        ],
        campaignIdeas: [
            'Moldura azul e vermelha com 30 de novembro.',
            'Legenda com o nome da escola ou da associação.',
            'Link distinto do Dia da Independência.',
        ],
        faqs: [
            { q: 'Quando é?', a: '30 de novembro, aniversário de Andres Bonifacio.' },
            { q: 'É o Dia da Independência?', a: 'Não. A Independência das Filipinas é 12 de junho. Este dia lembra Bonifacio.' },
            { q: 'Precisa de conta?', a: 'Não.' },
        ],
    },
    'thailand-national-day': {
        name: 'Dia Nacional da Tailândia',
        tagline: '5 de dezembro, Dia dos Pais e Dia Nacional na Tailândia.',
        intro: [
            'A Tailândia observa o Dia Nacional em 5 de dezembro, aniversário do rei Bhumibol Adulyadej, também celebrado como Dia dos Pais. Azul e amarelo aparecem em eventos cívicos e de comunidade.',
            'Uma moldura dá a associações, escolas e negócios tailandeses um link para os perfis do dia.',
        ],
        background: [
            '5 de dezembro era o aniversário do rei Bhumibol Adulyadej (Rama IX). O país mantém a data como Dia Nacional e Dia dos Pais.',
            'A cor associada ao dia é o amarelo, ao lado do azul em muitos eventos. Use as cores com o tom cívico do grupo, não como enfeite solto.',
        ],
        howToCelebrate: [
            { title: 'Diga as duas coisas que a data é', body: 'Dia Nacional e Dia dos Pais. Se o seu evento é só um deles, escreva qual.' },
            { title: 'Respeito, sem exagero comercial', body: 'Loja pode participar se a frase for da comunidade, não um desconto disfarçado de homenagem.' },
            { title: 'Cidade na legenda', body: 'Bangkok, Chiang Mai ou a cidade da diáspora. O lugar deixa o post específico.' },
        ],
        howOrgsMark: [
            { title: 'Associação local decide o tom', body: 'Quem mora a celebração escolhe o programa. A moldura segue essa decisão.' },
            { title: 'Um link', body: 'Escola, templo cultural ou negócio no mesmo endereço se for a mesma festa.' },
        ],
        campaignIdeas: [
            'Moldura azul e amarela com 5 de dezembro.',
            'Legenda que diga Dia Nacional, Dia dos Pais, ou os dois.',
            'Nome da associação na borda, se couber.',
        ],
        faqs: [
            { q: 'Quando é?', a: '5 de dezembro.' },
            { q: 'Por que também é Dia dos Pais?', a: 'Porque é o aniversário do rei Bhumibol Adulyadej, e a Tailândia marca essa data como Dia dos Pais e Dia Nacional.' },
            { q: 'Quem apoia precisa de conta?', a: 'Não.' },
        ],
    },
    'philippines-independence-day': {
        name: 'Dia da Independência das Filipinas',
        tagline: '12 de junho, Araw ng Kalayaan, para filipinos em casa e fora.',
        intro: [
            'As Filipinas marcam a Independência em 12 de junho, a declaração de 1898 da independência da Espanha. Azul e vermelho aparecem em desfiles, escolas e festas de comunidade.',
            'Uma moldura dá ao grupo um link para o dia. Não misture com 30 de novembro, o Dia de Bonifacio.',
        ],
        background: [
            'A declaração de independência foi lida em 12 de junho de 1898, em Kawit, Cavite.',
            'Comunidades filipinas fora do país usam a data para família, comida e memória. O nome da cidade na legenda diz qual comunidade é.',
        ],
        howToCelebrate: [
            { title: 'Escreva Araw ng Kalayaan se for a frase do grupo', body: 'O nome em filipino cabe na legenda junto da tradução, se o grupo for misto.' },
            { title: 'Um lugar', body: 'Cidade nas Filipinas ou cidade da diáspora. Os dois, se a festa liga os dois.' },
            { title: 'Arte separada de Bonifacio', body: '12 de junho e 30 de novembro não compartilham a mesma campanha.' },
        ],
        howOrgsMark: [
            { title: 'Escola e associação', body: 'Um link, com quem organiza nomeado na borda ou na primeira frase.' },
            { title: 'Sem conta para quem apoia', body: 'A pessoa abre, coloca a foto e baixa. A página não pede cadastro.' },
        ],
        campaignIdeas: [
            'Moldura azul e vermelha com 12 de junho.',
            'Legenda com a cidade.',
            'Campanha distinta do Dia de Bonifacio.',
        ],
        faqs: [
            { q: 'Quando é?', a: '12 de junho. A declaração de independência da Espanha foi em 1898, em Kawit, Cavite.' },
            { q: 'É o mesmo que o Dia de Bonifacio?', a: 'Não. Bonifacio é 30 de novembro.' },
            { q: 'Precisa de conta?', a: 'Não.' },
        ],
    },
};
