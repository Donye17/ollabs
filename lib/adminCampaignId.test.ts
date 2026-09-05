import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { parseAdminCampaignId } from './adminCampaignId';

describe('parseAdminCampaignId', () => {
    it('accepts a campaigns.id UUID', () => {
        assert.equal(
            parseAdminCampaignId('a1b2c3d4-e5f6-7890-abcd-ef1234567890'),
            'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
        );
    });

    it('rejects a report-time slug so hide cannot follow a reused name', () => {
        assert.equal(parseAdminCampaignId('election-2026'), null);
        assert.equal(parseAdminCampaignId('somos-200mil-vidas-p02b'), null);
        assert.equal(parseAdminCampaignId(''), null);
        assert.equal(parseAdminCampaignId(null), null);
        assert.equal(parseAdminCampaignId({ id: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890' }), null);
    });
});
