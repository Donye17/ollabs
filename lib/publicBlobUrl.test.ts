import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { isPublicBlobUrl } from './publicBlobUrl';
import { parseSupporterPhotos } from './supporterPhotosSql';

const ok = 'https://abc123xyz.public.blob.vercel-storage.com/explore-1.jpg';

describe('isPublicBlobUrl', () => {
    it('accepts a Vercel Blob public object URL', () => {
        assert.equal(isPublicBlobUrl(ok), true);
        assert.equal(isPublicBlobUrl('https://public.blob.vercel-storage.com/frame.png'), true);
    });

    it('rejects off-site and non-https URLs that would render on Explore or OG', () => {
        assert.equal(isPublicBlobUrl('https://evil.example/nsfw.jpg'), false);
        assert.equal(isPublicBlobUrl('http://abc123xyz.public.blob.vercel-storage.com/x.jpg'), false);
        assert.equal(isPublicBlobUrl('javascript:alert(1)'), false);
        assert.equal(isPublicBlobUrl('data:image/jpeg;base64,aaaa'), false);
        assert.equal(
            isPublicBlobUrl('https://abc123xyz.public.blob.vercel-storage.com.evil.example/x.jpg'),
            false,
        );
        assert.equal(
            isPublicBlobUrl('https://evil.example/.public.blob.vercel-storage.com/x.jpg'),
            false,
        );
        assert.equal(isPublicBlobUrl('https://a.b.public.blob.vercel-storage.com/x.jpg'), false);
        assert.equal(isPublicBlobUrl(''), false);
        assert.equal(isPublicBlobUrl(null), false);
        assert.equal(isPublicBlobUrl(`${ok}${'x'.repeat(500)}`), false);
    });

    it('parseSupporterPhotos drops off-site URLs so Explore never paints them', () => {
        assert.deepEqual(
            parseSupporterPhotos([ok, 'https://evil.example/x.jpg', 'not-a-url', null]),
            [ok],
        );
        assert.deepEqual(parseSupporterPhotos('https://evil.example/x.jpg'), []);
    });
});
