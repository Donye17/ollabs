import { SetLocale } from '@/components/i18n/SetLocale';

export default function EsLayout({ children }: { children: React.ReactNode }) {
    return (
        <div lang="es">
            <SetLocale locale="es" />
            {children}
        </div>
    );
}
