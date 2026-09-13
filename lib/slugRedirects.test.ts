import { test } from 'node:test';
import assert from 'node:assert/strict';
import { slugRedirectBlocksRename } from './slugRedirects';

test('a free name is claimable', () => {
    assert.equal(slugRedirectBlocksRename(null, 'campaign-b'), false);
    assert.equal(slugRedirectBlocksRename(undefined, 'campaign-b'), false);
});

test('another campaign\'s still-shared old slug is taken', () => {
    assert.equal(slugRedirectBlocksRename('campaign-a', 'campaign-b'), true);
});

test('taking back a name we ourselves redirected is allowed', () => {
    assert.equal(slugRedirectBlocksRename('campaign-a', 'campaign-a'), false);
});
