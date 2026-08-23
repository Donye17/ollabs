import { SetLocale } from '@/components/i18n/SetLocale';

export default function TlLayout({ children }: { children: React.ReactNode }) {
    return (
        <div lang="fil">
            <SetLocale locale="tl" />
            {children}
        </div>
    );
}
