// Fixed set of campaign categories, used for Explore filtering and light tagging.
export const CATEGORIES = [
    { key: 'cause', label: 'Causes' },
    { key: 'sports', label: 'Sports' },
    { key: 'event', label: 'Events' },
    { key: 'fundraiser', label: 'Fundraisers' },
    { key: 'community', label: 'Community' },
    { key: 'faith', label: 'Faith' },
    { key: 'school', label: 'Schools' },
    { key: 'awareness', label: 'Awareness' },
    { key: 'business', label: 'Business' },
    { key: 'other', label: 'Other' },
] as const;

export type CategoryKey = (typeof CATEGORIES)[number]['key'];

export const CATEGORY_KEYS: string[] = CATEGORIES.map((c) => c.key);

export function categoryLabel(key: string | null | undefined): string | null {
    if (!key) return null;
    return CATEGORIES.find((c) => c.key === key)?.label ?? null;
}
