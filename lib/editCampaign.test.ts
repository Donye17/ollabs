import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { editFrameHref, manageApiHref, manageDashboardHref } from './editCampaign';

describe('editFrameHref', () => {
    it('omits k= when the manage cookie is the only proof', () => {
        assert.equal(editFrameHref('festa-junina'), '/create?edit=festa-junina');
        assert.equal(editFrameHref('festa-junina', ''), '/create?edit=festa-junina');
        assert.equal(editFrameHref('festa-junina', null), '/create?edit=festa-junina');
    });

    it('keeps k= when the organizer still has the key', () => {
        assert.equal(
            editFrameHref('festa-junina', 'abc123'),
            '/create?edit=festa-junina&k=abc123'
        );
    });
});

describe('manageApiHref', () => {
    it('falls back to the cookie-only manage endpoint', () => {
        assert.equal(manageApiHref('festa-junina'), '/api/campaigns/festa-junina/manage');
        assert.equal(
            manageApiHref('festa-junina', 'abc123'),
            '/api/campaigns/festa-junina/manage?token=abc123'
        );
    });
});

describe('manageDashboardHref', () => {
    it('does not append an empty k=', () => {
        assert.equal(manageDashboardHref('festa-junina'), '/c/festa-junina/manage');
        assert.equal(
            manageDashboardHref('festa-junina', 'abc123'),
            '/c/festa-junina/manage?k=abc123'
        );
    });
});
