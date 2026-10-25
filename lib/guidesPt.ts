import type { GuideCopy } from '@/lib/guides';

/** Portuguese bodies for guides that started in English. Same steps and FAQs, so HowTo and FAQ schema match. */
export const GUIDE_PT: Record<string, GuideCopy> = {
    'custom-png-frame-photo-window': {
        title: 'Como fazer uma moldura PNG que deixa espaço para o rosto',
        description:
            'Envie um PNG quadrado e transparente, abra a janela da foto para o rosto não ficar esmagado, e saiba quando um anel de cor basta.',
        subtitle:
            'Para fazer uma moldura PNG com espaço para o rosto, envie um PNG quadrado com o meio transparente, abra a janela até o rosto ficar legível no tamanho de avatar, dê um nome e publique. Um JPEG de cartaz costuma esmagar o rosto. Um anel de cor basta quando ainda não há arte.',
        sections: [
            {
                title: 'Deixe espaço para o rosto',
                steps: [
                    {
                        title: 'Envie um PNG quadrado',
                        body: 'Vá em Criar. Use um PNG quadrado com transparência. Um JPEG de cartaz ou uma foto de logo costuma ficar turvo no tamanho de avatar.',
                    },
                    {
                        title: 'Abra a janela da foto',
                        body: 'Arraste a janela até um rosto caber sem a arte cobrir os olhos. A prévia fica na tela enquanto você ajusta. Deixe o centro vazio de propósito.',
                    },
                    {
                        title: 'Dê um nome e publique',
                        body: 'Escolha um título que as pessoas reconheçam, publique e mande um link. Se o brasão não se lê no tamanho do WhatsApp, a moldura ainda não está pronta.',
                    },
                ],
            },
            {
                title: 'Comece com um PNG quadrado, não com a foto de um cartaz',
                paragraphs: [
                    'Foto de perfil é quadrada e o aplicativo corta em círculo depois. Arte desenhada para um cartaz vertical perde o meio quando vira avatar. O PNG precisa de um buraco transparente, ou de uma área que a janela da foto cubra.',
                    'Se a única arte que você tem é um JPEG opaco, o aviso em coral explica isso. Não é um cadeado. Você ainda pode publicar depois de abrir a janela. O resultado fica melhor se você cortar o centro no editor de imagem e reenviar.',
                ],
            },
            {
                title: 'Abra a janela para o rosto ser o assunto',
                paragraphs: [
                    'Texto, logo e data ficam na borda. Olhos e boca ficam na janela. Se a arte cobre a testa, afaste a janela ou diminua o elemento, não o rosto da pessoa.',
                ],
            },
            {
                title: 'O aviso de arquivo opaco, e o que fazer com ele',
                paragraphs: [
                    'O aviso aparece quando o arquivo não tem transparência. Abra a janela com o controle de tamanho, ou volte e exporte de novo com o meio transparente. Publicar por cima do aviso não apaga a arte. Só coloca a foto por cima do que estiver opaco.',
                ],
            },
            {
                title: 'Dê um nome que a prévia do chat reconheça',
                paragraphs: [
                    'O título vira a primeira linha do link. “Campanha 2” não diz nada no grupo. Use o nome da série, do time ou do dia, curto o bastante para caber na prévia do WhatsApp.',
                ],
            },
            {
                title: 'Mande o link antes de polir o anel de novo',
                paragraphs: [
                    'A primeira hora depois de publicar é quando a campanha costuma ganhar alguém, ou não ganha mais. Envie o link para um grupo real. Ajuste a arte depois, no gerenciar, sem criar uma segunda campanha.',
                ],
            },
        ],
        faqs: [
            {
                q: 'O PNG precisa ser transparente?',
                a: 'Funciona melhor assim. Um arquivo opaco ainda pode ser publicado se você abrir a janela da foto. O aviso em coral é um aviso, não um cadeado.',
            },
            {
                q: 'Posso corrigir a arte depois que as pessoas entram?',
                a: 'Sim. Troque a moldura em gerenciar. O link e a contagem de apoiadores ficam. Não crie uma segunda campanha só para mudar o visual.',
            },
            {
                q: 'Preciso de conta para criar?',
                a: 'Não. Publique primeiro. Um email opcional permite gerenciar a mesma campanha em outro celular.',
            },
            {
                q: 'Quando o anel de cor serve?',
                a: 'Quando ainda não há arte. O PNG personalizado é o caminho principal. Você pode trocar um anel depois, em gerenciar.',
            },
        ],
        cta: { href: '/create', label: 'Criar campanha' },
    },
    'read-campaign-dashboard': {
        title: 'Como ler o painel da campanha depois de publicar',
        description:
            'O que visualizações, apoiadores e conversão significam, como usar o gráfico e a lista de países, e como guardar a chave de gerenciar só para você.',
        subtitle:
            'Para ler o painel, abra o link privado de gerenciar, não a página pública. Visualizações são pessoas que abriram a página. Apoiadores são pessoas que salvaram ou compartilharam a foto com moldura. Se há muitas visualizações e poucos apoiadores, mude a moldura e mantenha o mesmo link.',
        sections: [
            {
                title: 'Leia os três números',
                steps: [
                    {
                        title: 'Abra gerenciar, não a página pública',
                        body: 'O endereço de gerenciar parece a campanha mais /manage, muitas vezes com ?k= no fim. Essa chave prova que você criou a campanha. Não cole essa parte no mesmo chat do link público /c/.',
                    },
                    {
                        title: 'Compare visualizações e apoiadores',
                        body: 'Visualização é abertura da página. Apoiador é quem salvou ou compartilhou a foto. Conversão é essa razão em porcentagem. Um número alto de visualizações com zero salvamentos aponta para a moldura ou para o salvamento, não para um link novo.',
                    },
                    {
                        title: 'Mude a moldura ou reenvie o link',
                        body: 'Se as pessoas abrem e não salvam, ajuste a janela da foto ou o texto da borda e mantenha o slug. Se quase ninguém abre, mande o link de novo no grupo, na primeira hora.',
                    },
                ],
            },
            {
                title: 'Como chegar em gerenciar',
                paragraphs: [
                    'O link aparece na hora de publicar. O email de boas-vindas traz o mesmo endereço se você deixou um email. Guarde nos favoritos. Sem email e sem favorito, o histórico do navegador é o caminho de volta.',
                ],
            },
            {
                title: 'Visualizações, apoiadores e conversão',
                paragraphs: [
                    'A conversão não é curtida de rede social. É a parcela de quem abriu a página e saiu com a imagem. Use isso para decidir se o problema é o convite ou a moldura.',
                ],
            },
            {
                title: 'O gráfico de 14 dias e a lista de países',
                paragraphs: [
                    'O gráfico mostra os salvamentos recentes, não a história inteira. A lista de países mostra de onde veio o apoiador quando o pedido traz um país. Os dois servem para ver se o grupo que você imagina é o grupo que chegou.',
                ],
            },
            {
                title: 'Troque a moldura, o título e o endereço',
                paragraphs: [
                    'Trocar a moldura ou o título não zera a contagem. Se você mudar o slug, o endereço antigo redireciona. Não publique uma campanha nova só para “recomeçar o visual”.',
                ],
            },
            {
                title: 'O que gerenciar não é',
                paragraphs: [
                    'Não é uma lista de emails, não cobra ninguém e não mostra o rosto de quem baixou como uma galeria consentida. É o lugar para ver se o link está funcionando e para corrigir a moldura.',
                ],
            },
        ],
        faqs: [
            {
                q: 'Qual a diferença entre visualizações e apoiadores?',
                a: 'Visualizações são aberturas da página. Apoiadores são pessoas que salvaram ou compartilharam a foto com moldura. Conversão é essa razão em porcentagem.',
            },
            {
                q: 'Posso mudar a moldura sem perder a contagem?',
                a: 'Sim. Mude a moldura em gerenciar. O link e o número de apoiadores ficam.',
            },
            {
                q: 'E se eu perder o link de gerenciar?',
                a: 'Se você salvou um email na publicação, use Recuperar. Se não salvou, o endereço no histórico do navegador é o único caminho de volta.',
            },
            {
                q: 'Devo mandar o endereço de gerenciar no grupo?',
                a: 'Não. Compartilhe /c/seu-endereco. Guarde ?k= e /manage para você.',
            },
        ],
        cta: { href: '/guides/start-a-campaign', label: 'Como começar uma campanha' },
    },
    'keep-campaign-when-you-switch-phones': {
        title: 'Como manter a campanha quando você troca de celular',
        description:
            'Favorito do link de gerenciar, email para recuperar, e como vincular a campanha a um login sem mudar o endereço público.',
        subtitle:
            'Para manter a mesma campanha em outro celular, guarde o link de gerenciar, deixe um email na publicação, ou entre com um código e reivindique a campanha. Quem apoia continua sem conta. O endereço /c/ não muda.',
        sections: [
            {
                title: 'Fique com a mesma campanha',
                steps: [
                    {
                        title: 'Favorite o link de gerenciar',
                        body: 'Na hora de publicar, o navegador mostra o endereço privado. Salve nos favoritos antes de fechar a aba. Esse link é a prova de que a campanha é sua.',
                    },
                    {
                        title: 'Deixe um email para Recuperar',
                        body: 'O email é opcional na criação. Se você deixar um, Recuperar manda o caminho de volta quando o favorito some. Sem email, o histórico do navegador é o que resta.',
                    },
                    {
                        title: 'Vincule a um login',
                        body: 'Entrar usa um código de 6 dígitos no email, sem senha. Reivindicar cola a campanha já publicada nessa conta. O link público /c/ continua o mesmo.',
                    },
                ],
            },
            {
                title: 'Dá para publicar só com a moldura',
                paragraphs: [
                    'Criar uma campanha não exige conta. A conta existe para achar a campanha de novo em outro aparelho. Quem apoia nunca entra.',
                ],
            },
            {
                title: 'Guarde o acesso com um código de email',
                paragraphs: [
                    'O código prova que o email é seu. Não há senha para lembrar. É assim que “salvar suas campanhas” funciona.',
                ],
            },
            {
                title: 'Recupere quando o favorito sumiu',
                paragraphs: [
                    'Abra Recuperar e use o email da publicação. Sem esse email, Recuperar não tem o que procurar.',
                ],
            },
            {
                title: 'Reivindique uma campanha que você já publicou',
                paragraphs: [
                    'Reivindicar usa o token do link de gerenciar. Serve para campanhas feitas sem email, que são a maioria. Não muda o endereço que você já mandou no grupo.',
                ],
            },
            {
                title: 'O que fazer hoje e o que fazer nesta semana',
                paragraphs: [
                    'Hoje: favorite o gerenciar e mande o link público. Nesta semana: se a campanha vai continuar, entre com o código e reivindique, para o próximo celular achar a lista em Minhas.',
                ],
            },
        ],
        faqs: [
            {
                q: 'Preciso entrar para publicar?',
                a: 'Não. Entrar é como achar a campanha de novo em outro celular. Quem apoia nunca entra.',
            },
            {
                q: 'Para que serve o código de 6 dígitos?',
                a: 'Prova que o email é seu. Não há senha. O código é o jeito de salvar as campanhas.',
            },
            {
                q: 'Recuperar funciona sem email?',
                a: 'Não. Sem email, só o link de gerenciar que você guardou, em geral no histórico, abre o painel.',
            },
            {
                q: 'Reivindicar muda o endereço público?',
                a: 'Não. /c/seu-endereco continua. Reivindicar cola a campanha na sua conta e pode destacá-la num hub se você criar um.',
            },
        ],
        cta: { href: '/recover', label: 'Recuperar campanhas' },
    },
    'run-a-campaign-people-join': {
        title: 'Como fazer uma campanha de foto de perfil em que as pessoas entram',
        description:
            'Publique uma moldura, mande o link na primeira hora, e conserte o salvamento em vez de começar outra campanha.',
        subtitle:
            'Para uma campanha em que as pessoas entram, publique uma moldura só, mande o link no WhatsApp na primeira hora, e se o salvamento falhar, conserte o salvamento. Não abra uma segunda campanha. Quem apoia não cria conta.',
        sections: [
            {
                title: 'Consiga o primeiro apoiador',
                steps: [
                    {
                        title: 'Publique uma moldura',
                        body: 'Uma arte, um título, um link. Duas campanhas para a mesma causa dividem a contagem e confundem o grupo.',
                    },
                    {
                        title: 'Mande o link na primeira hora',
                        body: 'A maior parte das campanhas que ganham alguém ganha essa pessoa na primeira hora. Abrir o WhatsApp na hora de publicar é o caminho curto.',
                    },
                    {
                        title: 'Conserte o salvamento, não comece de novo',
                        body: 'Se a pessoa não consegue salvar no navegador de dentro do WhatsApp, o guia do iPhone explica Compartilhar foto e Salvar imagem. Um link novo não resolve um salvamento quebrado.',
                    },
                ],
            },
            {
                title: 'O que a moldura precisa dizer',
                paragraphs: [
                    'Nome da causa, data ou lugar, na borda. O rosto fica livre. Se o texto só se lê no computador, ele não existe no grupo.',
                ],
            },
            {
                title: 'A primeira hora no WhatsApp decide',
                paragraphs: [
                    'Campanha que não é enviada não é vista. Um post solto numa rede sem o link no grupo onde as pessoas já estão quase nunca vira o primeiro salvamento.',
                ],
            },
            {
                title: 'Escreva o pedido que viaja com o link',
                paragraphs: [
                    'Uma frase: o que é, e o que a pessoa faz. “Coloque a moldura na sua foto” mais o link. Sem apresentação de marca.',
                ],
            },
            {
                title: 'Quando o contador para na casa dos dez',
                paragraphs: [
                    'Mande de novo no mesmo grupo, com a contagem que já existe. Troque a moldura se as pessoas abrem e não salvam. Não zere a história com uma campanha nova.',
                ],
            },
            {
                title: 'Quando o link do hub vale mais que o da campanha',
                paragraphs: [
                    'Hub é o endereço estável da bio, com um botão Entrar para a moldura da vez. Para um empurrão único no WhatsApp, o link /c/ basta.',
                ],
            },
        ],
        faqs: [
            {
                q: 'Quem apoia precisa de conta?',
                a: 'Não. A pessoa abre o link, coloca a foto e baixa ou compartilha. A página da campanha não tem parede de cadastro.',
            },
            {
                q: 'Posso mudar a moldura depois que as pessoas entram?',
                a: 'Sim. Use a troca de moldura em gerenciar. O link, a contagem e os compartilhamentos antigos continuam.',
            },
            {
                q: 'Por que publicar abre o WhatsApp em vez de um botão de copiar primeiro?',
                a: 'Quem consegue o primeiro apoiador quase sempre consegue na primeira hora. Abrir o WhatsApp é o caminho mais curto da moldura pronta até um grupo que pode agir.',
            },
            {
                q: 'Preciso de hub para uma campanha única?',
                a: 'Não. Hub é para um endereço estável de bio. Para um envio único no WhatsApp, o link da campanha basta.',
            },
        ],
        cta: { href: '/create', label: 'Criar campanha' },
    },
    hub: {
        title: 'O que é um hub de campanha?',
        description:
            'Um endereço estável para a bio, com quem você é, links opcionais e um botão Entrar para a moldura em destaque.',
        subtitle:
            'Um hub é a página ollabs.studio/u/seu-nome. Ela mostra quem você é, links opcionais e um botão Entrar que abre a campanha em destaque. Use na bio do Instagram, do TikTok ou em qualquer lugar que pede um link. A campanha em si continua em /c/.',
        sections: [
            {
                title: 'Link da campanha e link do hub',
                paragraphs: [
                    'O link /c/ é para o grupo, agora. O link /u/ é para a bio, sempre. Entrar no hub manda a pessoa para a campanha que você destacou. Você ainda pode mandar o /c/ direto quando quiser.',
                ],
            },
            {
                title: 'Monte o hub em quatro passos',
                steps: [
                    {
                        title: 'Reivindique o endereço',
                        body: 'Entre com o código do email e escolha um nome curto. Esse nome vira ollabs.studio/u/seu-nome.',
                    },
                    {
                        title: 'Escolha a campanha em destaque',
                        body: 'O botão Entrar abre essa campanha. Troque o destaque quando a série mudar, sem mudar o endereço da bio.',
                    },
                    {
                        title: 'Escreva a bio e os links',
                        body: 'Uma linha de quem você é, e os links que as pessoas já precisam (site, boletim, grupo). O hub não substitui esses destinos.',
                    },
                    {
                        title: 'Salve e cole o endereço do hub',
                        body: 'Salve antes de copiar. A página pública só mostra o último salvamento. Cole o /u/ na bio.',
                    },
                ],
            },
            {
                title: 'O que quem apoia vê',
                paragraphs: [
                    'Um nome, uma bio curta, o botão Entrar e os links que você deixou. Não há cadastro para quem só vai colocar a moldura. Campanhas antigas podem ficar ocultas na lista. Entrar continua usando a que está em destaque.',
                ],
            },
        ],
        faqs: [
            {
                q: 'Preciso de hub se já tenho o link da campanha?',
                a: 'Não. O link da campanha basta para um envio único. O hub ajuda quando você quer um endereço estável de bio que sempre aponta para a moldura atual.',
            },
            {
                q: 'O hub substitui o link da campanha?',
                a: 'Não. Entrar no hub manda as pessoas para a página /c/ em destaque. Você ainda pode compartilhar o link da campanha direto.',
            },
            {
                q: 'Posso esconder campanhas antigas no hub?',
                a: 'Sim. No editor do hub dá para ocultar as que você não quer na lista. Entrar continua usando a campanha em destaque.',
            },
            {
                q: 'O hub é grátis?',
                a: 'Sim. Reivindicar e compartilhar o hub é grátis, como criar uma campanha.',
            },
        ],
        cta: { href: '/hub', label: 'Editar seu hub' },
    },
    'start-a-campaign': {
        title: 'Como começar uma campanha',
        description:
            'Faça a moldura, dê um nome, publique e mande um link na primeira hora. Sem conta obrigatória e sem marca d\'água.',
        subtitle:
            'Para começar uma campanha, abra Criar, faça a moldura, dê um nome que o grupo reconheça, publique e mande o link no WhatsApp na primeira hora. Quem apoia não cria conta. Não há marca d\'água na foto.',
        sections: [
            {
                title: 'Antes de começar',
                paragraphs: [
                    'Tenha um PNG quadrado com o meio transparente, ou comece por um anel de cor. Saiba o nome da causa e o grupo onde o link vai entrar. Conta é opcional.',
                ],
            },
            {
                title: 'Passos',
                steps: [
                    {
                        title: 'Faça a moldura',
                        body: 'Em Criar, envie a arte ou escolha um anel. A prévia fica visível enquanto você ajusta a janela da foto.',
                    },
                    {
                        title: 'Dê um nome à campanha',
                        body: 'O título aparece no link e na prévia do chat. Use o nome que as pessoas já usam para a causa.',
                    },
                    {
                        title: 'Publique',
                        body: 'Publicar devolve o link público e o link privado de gerenciar. Guarde o privado. O email é opcional.',
                    },
                    {
                        title: 'Compartilhe na primeira hora',
                        body: 'Mande o link /c/ para um grupo real. A maior parte dos primeiros apoiadores chega nessa hora, ou não chega.',
                    },
                ],
            },
            {
                title: 'Depois de publicar',
                paragraphs: [
                    'Olhe o painel se as pessoas abrem e não salvam. Troque a moldura sem trocar o link. Se ninguém entra, mande de novo no WhatsApp. A página de gerenciar avisa se a campanha continua com zero apoiadores.',
                ],
            },
        ],
        faqs: [
            {
                q: 'Preciso de conta?',
                a: 'Não para publicar, e nunca para quem só vai colocar a moldura. A conta serve para achar a campanha em outro celular.',
            },
            {
                q: 'E se ninguém entrar?',
                a: 'Compartilhe de novo no WhatsApp. Uma mensagem no grupo vale mais do que postar uma vez e esperar. O gerenciar avisa se ainda não há apoiadores.',
            },
            {
                q: 'Tem marca d\'água?',
                a: 'Não. Quem apoia recebe a imagem limpa. O Ollabs não cobra para tirar uma marca.',
            },
        ],
        cta: { href: '/create', label: 'Criar campanha' },
    },
};
