import type { UseCase } from '@/lib/useCases';

/** Spanish use-case landings at /es/for/<slug>. */
export const USE_CASES_ES: UseCase[] = [
    {
        slug: 'iglesias',
        audience: 'Iglesias',
        h1: 'Marco de foto de perfil para iglesias',
        subtitle: 'Une a la congregación en torno a una serie, misión o campaña.',
        keyword: 'marco foto perfil iglesia',
        intro: [
            'Serie nueva, misión, retiro o campaña comunitaria: un marco compartido ayuda a que toda la iglesia se vea junta. Ollabs te deja crear un marco, enviar un enlace y cada persona lo pone en su foto en segundos.',
            'Gratis y sin registro. Usa los colores de la iglesia o el logo, comparte en WhatsApp y en el boletín.',
        ],
        benefits: [
            { title: 'Ideal para series', body: 'Crea un marco por serie o evento y cámbialo cuando termine.' },
            { title: 'Funciona para todos', body: 'Cualquier edad puede poner el marco desde el celular.' },
            { title: 'Con la identidad de la iglesia', body: 'Colores o logo de tu comunidad en cada foto.' },
        ],
        faqs: [
            { q: '¿Hay que registrarse para apoyar?', a: 'No. La persona abre el enlace, pone su foto y descarga. Eso es todo.' },
            { q: '¿Es gratis?', a: 'Sí. Sin marca de agua y sin cobrar a quien apoya.' },
        ],
    },
    {
        slug: 'escuelas',
        audience: 'Escuelas',
        h1: 'Marco de foto de perfil para escuelas',
        subtitle: 'Semana temática, graduación y orgullo de clase en un enlace.',
        keyword: 'marco foto perfil escuela',
        intro: [
            'Semana temática, recaudación o graduación: un marco compartido pone a alumnos, padres y profesores en la misma campaña visual.',
            'Gratis, sin app y sin login. Todos entran por el enlace en el celular.',
        ],
        benefits: [
            { title: 'Colores del colegio', body: 'Define los colores o sube el escudo como marco.' },
            { title: 'Perfecto para semanas temáticas', body: 'Un marco nuevo en cada evento.' },
            { title: 'Sin barreras', body: 'Nadie necesita instalar nada.' },
        ],
        faqs: [
            { q: '¿Padres y personal pueden usarlo?', a: 'Sí. Cualquier persona con el enlace puede participar.' },
            { q: '¿Las fotos quedan en el servidor?', a: 'No. El procesamiento es en el navegador de cada persona.' },
        ],
    },
    {
        slug: 'equipos',
        audience: 'Equipos',
        h1: 'Marco de foto de perfil para equipos',
        subtitle: 'Afición y plantel con los colores del equipo el día del partido.',
        keyword: 'marco foto perfil equipo deporte',
        intro: [
            'La energía del partido empieza cuando la afición viste los mismos colores. Crea un marco, manda el enlace al grupo y mira subir el contador antes del juego.',
            'Gratis y sin registro. Usa escudo o colores oficiales.',
        ],
        benefits: [
            { title: 'Escudo o colores', body: 'Sube un PNG transparente o elige los colores exactos.' },
            { title: 'Contador en vivo', body: 'Ve cuántas personas ya pusieron el marco.' },
            { title: 'Un toque en el celular', body: 'El hincha abre el enlace y listo.' },
        ],
        faqs: [
            { q: '¿Puedo usar el escudo del club?', a: 'Sí. Sube el escudo como PNG transparente.' },
            { q: '¿Hay marca de agua?', a: 'Nunca. La foto se descarga limpia.' },
        ],
    },
    {
        slug: 'ongs',
        audience: 'ONGs',
        h1: 'Marco de foto de perfil para ONGs',
        subtitle: 'Moviliza apoyadores en torno a tu causa con un enlace.',
        keyword: 'marco foto perfil ONG',
        intro: [
            'La conciencia se expande cuando la gente lleva la causa en su perfil. Ollabs deja que tu ONG cree un marco con su identidad visual y comparta un solo enlace.',
            'Gratis para ti y para quien apoya. Sin cuenta obligatoria.',
        ],
        benefits: [
            { title: 'Tu marca en minutos', body: 'Logo o colores de la organización en el marco.' },
            { title: 'Sin login para apoyar', body: 'Menos fricción, más gente entra.' },
            { title: 'Números reales', body: 'El contador muestra apoyo de verdad, no inflado.' },
        ],
        faqs: [
            { q: '¿Es gratis para ONGs?', a: 'Sí. Sin límite de apoyadores ni de campañas.' },
            { q: '¿Inflan el contador?', a: 'Nunca. Solo cuenta quien descargó de verdad.' },
        ],
    },
    {
        slug: 'eventos',
        audience: 'Eventos',
        h1: 'Marco de foto de perfil para eventos',
        subtitle: 'Genera buzz antes, durante y después del evento.',
        keyword: 'marco foto perfil evento',
        intro: [
            'Los asistentes se convierten en promotores cuando llevan el marco del evento. Un enlace más QR en el venue, y la gente se une en el momento.',
            'Gratis sin registro. Branding del evento en cada foto.',
        ],
        benefits: [
            { title: 'QR listo para imprimir', body: 'Descarga el QR de la campaña para banners y pantallas.' },
            { title: 'Prueba de asistencia', body: 'Quien descarga invita a más gente.' },
            { title: 'Diseño del evento', body: 'Logo o colores oficiales del evento.' },
        ],
        faqs: [
            { q: '¿Sirve durante el evento?', a: 'Sí. Muestra el QR en pantalla para que la gente se una en el lugar.' },
            { q: '¿Hace falta una app?', a: 'No. El navegador del celular basta.' },
        ],
    },
    {
        slug: 'campanas',
        audience: 'Campañas',
        h1: 'Marco de foto de perfil para campañas',
        subtitle: 'Difunde una causa con un enlace fácil de compartir.',
        keyword: 'marco campaña conciencia twibbon',
        intro: [
            'Las campañas de conciencia crecen cuando la gente las lleva puestas. Crea un marco para tu causa y compártelo en redes.',
            'Gratis sin marca de agua. Alternativa a Twibbonize sin cobrar a quien apoya.',
        ],
        benefits: [
            { title: 'Colores listos', body: 'Anillos de color limpios o arte personalizada.' },
            { title: 'Se esparce de persona en persona', body: 'Quien descarga puede compartir después.' },
            { title: 'Conteo honesto', body: 'Cada número es alguien que realmente usó el marco.' },
        ],
        faqs: [
            { q: '¿Puedo usar el color exacto de la cinta?', a: 'Sí. Define el color o sube tu arte.' },
            { q: '¿Inflan el contador?', a: 'Nunca. Solo cuenta quien descargó de verdad.' },
        ],
    },
];

const EN_SLUG: Record<string, string> = {
    iglesias: 'churches',
    escuelas: 'schools',
    equipos: 'sports-teams',
    ongs: 'nonprofits',
    eventos: 'events',
    campanas: 'awareness-campaigns',
};

export function englishUseCaseSlug(esSlug: string): string {
    return EN_SLUG[esSlug] || esSlug;
}

export function getUseCaseEs(slug: string): UseCase | undefined {
    return USE_CASES_ES.find((u) => u.slug === slug);
}
