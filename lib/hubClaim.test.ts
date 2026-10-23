import assert from 'node:assert/strict';
import { test } from 'node:test';
import { firstTimeHandleClaim } from './hub';

test('does not replace a handle the organizer already claimed', () => {
    assert.equal(firstTimeHandleClaim('coolbrand', 'john'), null);
    assert.equal(firstTimeHandleClaim('coolbrand', 'coolbrand'), null);
});

test('claims a valid handle when none is set', () => {
    assert.equal(firstTimeHandleClaim(null, 'john-doe'), 'john-doe');
    assert.equal(firstTimeHandleClaim(undefined, 'Jane Doe'), 'jane-doe');
    assert.equal(firstTimeHandleClaim('', 'john'), 'john');
});

test('rejects reserved, short, or empty suggestions', () => {
    assert.equal(firstTimeHandleClaim(null, 'admin'), null);
    assert.equal(firstTimeHandleClaim(null, 'ab'), null);
    assert.equal(firstTimeHandleClaim(null, ''), null);
    assert.equal(firstTimeHandleClaim(null, null), null);
});
