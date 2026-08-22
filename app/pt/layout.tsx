import type { Metadata } from 'next';
import { SetLocale } from '@/components/i18n/SetLocale';

export const metadata: Metadata = {
    title: 'Ollabs: moldura grátis para foto de perfil e campanhas',
    description:
        'Crie uma moldura de foto de perfil para a sua causa, time ou evento. Compartilhe um link e as pessoas adicionam na foto em segundos. Grátis, sem cadastro, sem marca d\'água.',
    alternates: {
        canonical: 'https://ollabs.studio/pt',
        languages: {
            'pt-BR': 'https://ollabs.studio/pt',
            en: 'https://ollabs.studio',
            'x-default': 'https://ollabs.studio',
        },
    },
    openGraph: {
        locale: 'pt_BR',
        url: 'https://ollabs.studio/pt',
        title: 'Ollabs: moldura grátis para foto de perfil e campanhas',
        description:
            'Crie uma moldura de foto de perfil para a sua causa, time ou evento. Compartilhe um link. Grátis, sem marca d\'água.',
    },
};

export default function PtLayout({ children }: { children: React.ReactNode }) {
    return (
        <div lang="pt-BR">
            <SetLocale locale="pt" />
            {children}
        </div>
    );
}
