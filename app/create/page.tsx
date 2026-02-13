import { EditorPage } from '@/components/EditorPage';
import { getFrameById } from '@/lib/data';
import type { Metadata, ResolvingMetadata } from 'next';

type Props = {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata(
    { searchParams }: Props,
    parent: ResolvingMetadata
): Promise<Metadata> {
    const resolvedParams = await searchParams;
    const id = typeof resolvedParams.id === 'string' ? resolvedParams.id : undefined;

    if (id) {
        const frame = await getFrameById(id);
        if (frame) {
            return {
                title: `Remix ${frame.name} | Ollabs`,
                description: frame.description || `Customize this unique ${frame.name} avatar frame on Ollabs.`,
                openGraph: {
                    title: `Remix ${frame.name} - Custom Avatar Frame`,
                    description: frame.description || `Create your own version of ${frame.name}.`,
                    images: frame.preview_url ? [frame.preview_url] : [],
                },
            };
        }
    }

    return {
        title: 'Create Avatar Frame | Ollabs',
        description: 'Design your own custom avatar frame, PFP border, or profile overlay. Use our advanced editor to create unique designs for Discord, Twitter, and more.',
    };
}

export default async function Create({
    searchParams,
}: Props) {
    const resolvedParams = await searchParams;
    const remixId = typeof resolvedParams.id === 'string' ? resolvedParams.id : undefined;

    let jsonLd: any = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        'itemListElement': [
            {
                '@type': 'ListItem',
                'position': 1,
                'name': 'Home',
                'item': 'https://ollabs.studio'
            },
            {
                '@type': 'ListItem',
                'position': 2,
                'name': 'Create',
                'item': 'https://ollabs.studio/create'
            }
        ]
    };

    if (remixId) {
        const frame = await getFrameById(remixId);
        if (frame) {
            // Enhance Breadcrumbs
            jsonLd.itemListElement.push({
                '@type': 'ListItem',
                'position': 3,
                'name': frame.name,
                'item': `https://ollabs.studio/create?id=${frame.id}`
            });

            // Add Product Schema
            // We use an array of schemas if we have multiple
            jsonLd = [
                jsonLd,
                {
                    '@context': 'https://schema.org',
                    '@type': 'Product',
                    'name': frame.name,
                    'image': frame.preview_url,
                    'description': frame.description || `Customizable avatar frame: ${frame.name}`,
                    'brand': {
                        '@type': 'Brand',
                        'name': 'Ollabs'
                    },
                    'offers': {
                        '@type': 'Offer',
                        'url': `https://ollabs.studio/create?id=${frame.id}`,
                        'priceCurrency': 'USD',
                        'price': '0',
                        'availability': 'https://schema.org/InStock',
                        'condition': 'https://schema.org/NewCondition'
                    },
                    ...(frame.creator_name ? {
                        'creator': {
                            '@type': 'Person',
                            'name': frame.creator_name
                        }
                    } : {})
                }
            ];
        }
    }

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <EditorPage remixId={remixId} />
        </>
    );
}
