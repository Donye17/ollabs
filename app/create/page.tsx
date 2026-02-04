import { EditorPage } from '@/components/EditorPage';

export default async function Create({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const resolvedParams = await searchParams;
    const remixId = typeof resolvedParams.id === 'string' ? resolvedParams.id : undefined;

    return <EditorPage remixId={remixId} />;
}
