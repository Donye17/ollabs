import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { resolveSupporterLocale, supporterLocaleCountry } from './locale';

describe('supporterLocaleCountry', () => {
    it('uses publisher country only', () => {
        assert.equal(supporterLocaleCountry('BR'), 'BR');
        assert.equal(supporterLocaleCountry('US'), 'US');
        assert.equal(supporterLocaleCountry(null), null);
        assert.equal(supporterLocaleCountry(undefined), null);
        assert.equal(supporterLocaleCountry(''), null);
    });
});

describe('resolveSupporterLocale', () => {
    it('keeps untagged campaigns Portuguese even when WhatsApp reports English', () => {
        const country = supporterLocaleCountry(null);
        assert.equal(
            resolveSupporterLocale({ campaignCountry: country, languages: ['en-US'] }),
            'pt'
        );
    });

    it('does not treat a first-supporter geo as a publisher tag', () => {
        // first_supporter_country is stats. Passing it (the old page.tsx helper)
        // flipped untagged campaigns to English after one US test save.
        const country = supporterLocaleCountry(null);
        assert.notEqual(country, 'US');
        assert.equal(
            resolveSupporterLocale({
                campaignCountry: country,
                languages: ['en-US'],
                cookie: 'en',
            }),
            'pt'
        );
    });

    it('keeps Brazilian publisher campaigns in Portuguese', () => {
        assert.equal(
            resolveSupporterLocale({
                campaignCountry: supporterLocaleCountry('BR'),
                languages: ['en-US'],
            }),
            'pt'
        );
    });

    it('uses browser/cookie locale when the publisher tagged another country', () => {
        assert.equal(
            resolveSupporterLocale({
                campaignCountry: supporterLocaleCountry('US'),
                languages: ['en-US'],
            }),
            'en'
        );
        assert.equal(
            resolveSupporterLocale({
                campaignCountry: supporterLocaleCountry('NG'),
                languages: ['pt-BR'],
            }),
            'pt'
        );
    });
});
