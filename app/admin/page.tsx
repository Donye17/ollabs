import type { Metadata } from 'next';
import { AdminClient } from '@/components/admin/AdminClient';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
    title: 'Admin',
    robots: { index: false, follow: false },
};

export default function AdminPage() {
    return <AdminClient />;
}
