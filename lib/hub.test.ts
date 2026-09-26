import {
    isHubLinkId,
    planHubLinkReplace,
    type ExistingHubLink,
    type HubLinkInput,
} from './hub';

function assert(cond: unknown, message: string): asserts cond {
    if (!cond) throw new Error(message);
}

function idsOf(
    ops: ReturnType<typeof planHubLinkReplace>['ops'],
    kind: 'update' | 'insert'
) {
    return ops
        .filter((op) => op.kind === kind)
        .map((op) => (op.kind === 'update' ? op.id : `${op.title}|${op.url}`));
}

const instagram: ExistingHubLink = {
    id: '11111111-1111-1111-1111-111111111111',
    title: 'Instagram',
    url: 'https://instagram.com/club',
};
const donate: ExistingHubLink = {
    id: '22222222-2222-2222-2222-222222222222',
    title: 'Donate',
    url: 'https://example.com/donate',
};

// Same title+url, no ids: a stale tab that only sends title/url must keep rows.
{
    const plan = planHubLinkReplace(
        [
            { title: instagram.title, url: instagram.url },
            { title: donate.title, url: donate.url },
        ],
        [instagram, donate]
    );
    assert(plan.deleteIds.length === 0, 'unchanged list should delete nothing');
    assert(plan.ops.every((op) => op.kind === 'update'), 'unchanged list should only update');
    assert(
        idsOf(plan.ops, 'update').join() === `${instagram.id},${donate.id}`,
        'title+url fallback should reuse both ids'
    );
}

// Client sends ids and edits the URL: keep the row so click_count stays.
{
    const plan = planHubLinkReplace(
        [{ id: instagram.id, title: 'Instagram', url: 'https://instagram.com/new' }],
        [instagram, donate]
    );
    assert(plan.deleteIds.join() === donate.id, 'removed donate should be deleted');
    assert(plan.ops.length === 1 && plan.ops[0].kind === 'update', 'edited row should update');
    assert(plan.ops[0].kind === 'update' && plan.ops[0].id === instagram.id, 'edit keeps instagram id');
}

// Reorder with ids: same rows, new sort_order.
{
    const plan = planHubLinkReplace(
        [
            { id: donate.id, title: donate.title, url: donate.url },
            { id: instagram.id, title: instagram.title, url: instagram.url },
        ],
        [instagram, donate]
    );
    assert(plan.deleteIds.length === 0, 'reorder should delete nothing');
    assert(plan.ops[0].kind === 'update' && plan.ops[0].id === donate.id && plan.ops[0].sortOrder === 0, 'donate first');
    assert(plan.ops[1].kind === 'update' && plan.ops[1].id === instagram.id && plan.ops[1].sortOrder === 1, 'instagram second');
}

// Add a new link next to an existing one.
{
    const incoming: HubLinkInput[] = [
        { id: instagram.id, title: instagram.title, url: instagram.url },
        { title: 'X', url: 'https://x.com/club' },
    ];
    const plan = planHubLinkReplace(incoming, [instagram]);
    assert(plan.deleteIds.length === 0, 'add should not delete');
    assert(plan.ops[0].kind === 'update' && plan.ops[0].id === instagram.id, 'keep existing');
    assert(plan.ops[1].kind === 'insert' && plan.ops[1].title === 'X', 'insert the new link');
}

// Empty list removes every row.
{
    const plan = planHubLinkReplace([], [instagram, donate]);
    assert(plan.ops.length === 0, 'empty list has no writes');
    assert(plan.deleteIds.length === 2, 'empty list deletes both');
}

// A foreign id is ignored so one organizer cannot point at another's row.
{
    const plan = planHubLinkReplace(
        [{ id: '99999999-9999-9999-9999-999999999999', title: instagram.title, url: instagram.url }],
        [instagram]
    );
    assert(plan.deleteIds.length === 0, 'foreign id still matches title+url of our row');
    assert(plan.ops[0].kind === 'update' && plan.ops[0].id === instagram.id, 'reuse our row via title+url');
}

{
    const plan = planHubLinkReplace(
        [{ id: '99999999-9999-9999-9999-999999999999', title: 'Other', url: 'https://evil.example' }],
        [instagram]
    );
    assert(plan.deleteIds.join() === instagram.id, 'unrelated foreign id does not keep our row');
    assert(plan.ops[0].kind === 'insert', 'unrelated foreign id inserts a new row');
}

// Duplicate incoming id: second copy cannot steal the same row.
{
    const plan = planHubLinkReplace(
        [
            { id: instagram.id, title: 'A', url: 'https://a.example' },
            { id: instagram.id, title: 'B', url: 'https://b.example' },
        ],
        [instagram]
    );
    assert(plan.ops[0].kind === 'update' && plan.ops[0].id === instagram.id, 'first claim wins');
    assert(plan.ops[1].kind === 'insert' && plan.ops[1].title === 'B', 'second claim inserts');
    assert(plan.deleteIds.length === 0, 'claimed row is not deleted');
}

assert(isHubLinkId(instagram.id), 'real uuid is accepted');
assert(!isHubLinkId('l-abc1234'), 'draft key is rejected');
assert(!isHubLinkId(''), 'empty id is rejected');
assert(!isHubLinkId(null), 'null id is rejected');

console.log('lib/hub.test.ts: all assertions passed');
