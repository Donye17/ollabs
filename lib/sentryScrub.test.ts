import assert from 'node:assert/strict';
import { scrubSentryEvent, scrubString } from './sentryScrub';

function run() {
    assert.equal(
        scrubString('https://ollabs.studio/api/campaigns/abc/manage?token=deadbeefcafebabe'),
        'https://ollabs.studio/api/campaigns/abc/manage?token=[redacted]'
    );
    assert.equal(
        scrubString('https://ollabs.studio/c/abc/manage?k=0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef'),
        'https://ollabs.studio/c/abc/manage?k=[redacted]'
    );
    assert.equal(
        scrubString('https://ollabs.studio/api/admin/reports?key=super-secret-admin'),
        'https://ollabs.studio/api/admin/reports?key=[redacted]'
    );
    assert.equal(
        scrubString('https://ollabs.studio/recover/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'),
        'https://ollabs.studio/recover/[redacted]'
    );
    assert.equal(
        scrubString('hello user@example.com'),
        'hello [email]'
    );

    const event = scrubSentryEvent({
        request: {
            url: 'https://ollabs.studio/api/campaigns/abc/manage?token=sekrit',
            query_string: 'token=sekrit&other=ok',
            data: { token: 'sekrit', title: 'Rally' },
            cookies: { ollabs_org: 'session' },
            headers: {
                cookie: 'ollabs_org=session',
                'x-owner-token': 'sekrit',
                'x-admin-key': 'admin',
                'user-agent': 'WhatsApp',
            },
        },
        extra: { owner_token: 'sekrit', slug: 'abc' },
        breadcrumbs: [
            {
                message: 'GET /api/campaigns/abc/manage?token=sekrit',
                data: { url: 'https://ollabs.studio/recover/aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa' },
            },
        ],
        user: { email: 'a@b.com', ip_address: '1.2.3.4', id: 'u1' },
        culprit: '/api/campaigns/abc/manage?token=sekrit',
    });

    assert.equal(event.request?.url, 'https://ollabs.studio/api/campaigns/abc/manage?token=[redacted]');
    assert.equal(event.request?.query_string, 'token=[redacted]&other=ok');
    assert.equal((event.request?.data as { token: string; title: string }).token, '[redacted]');
    assert.equal((event.request?.data as { title: string }).title, 'Rally');
    assert.equal(event.request?.cookies, undefined);
    assert.equal(event.request?.headers?.['x-owner-token'], '[redacted]');
    assert.equal(event.request?.headers?.['x-admin-key'], '[redacted]');
    assert.equal(event.request?.headers?.cookie, '[redacted]');
    assert.equal(event.request?.headers?.['user-agent'], 'WhatsApp');
    assert.equal(event.extra?.owner_token, '[redacted]');
    assert.equal(event.extra?.slug, 'abc');
    assert.equal(event.breadcrumbs?.[0].message, 'GET /api/campaigns/abc/manage?token=[redacted]');
    assert.equal(
        event.breadcrumbs?.[0].data?.url,
        'https://ollabs.studio/recover/[redacted]'
    );
    assert.equal(event.user?.email, undefined);
    assert.equal(event.user?.ip_address, undefined);
    assert.equal(event.culprit, '/api/campaigns/abc/manage?token=[redacted]');

    const tupleQuery = scrubSentryEvent({
        request: { query_string: [['token', 'sekrit'], ['slug', 'abc']] },
    });
    assert.deepEqual(tupleQuery.request?.query_string, [['token', '[redacted]'], ['slug', 'abc']]);

    console.log('sentryScrub tests passed');
}

run();
