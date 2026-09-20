import assert from 'node:assert/strict';
import { test } from 'node:test';
import { preferLiveCampaign } from './campaignSlugChoice';

test('a live campaign at that slug wins over a leftover redirect', () => {
    const live = { id: 'new-owner', slug: 'festa' };
    const redirected = { id: 'original', slug: 'festa-ab12' };
    assert.equal(preferLiveCampaign(live, redirected)?.id, 'new-owner');
});

test('after a rename, the old slug still resolves to the original campaign', () => {
    const redirected = { id: 'original', slug: 'festa' };
    assert.equal(preferLiveCampaign(null, redirected)?.id, 'original');
    assert.equal(preferLiveCampaign(null, redirected)?.slug, 'festa');
});

test('unknown slugs stay missing', () => {
    assert.equal(preferLiveCampaign(null, null), null);
    assert.equal(preferLiveCampaign(undefined, undefined), null);
});
