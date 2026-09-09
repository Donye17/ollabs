import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { isRecoveryToken, RECOVERY_REPLAY_MINUTES } from './recoverToken';

describe('isRecoveryToken', () => {
    it('accepts a 64-char lowercase hex token', () => {
        assert.equal(isRecoveryToken('a'.repeat(64)), true);
        assert.equal(isRecoveryToken('0123456789abcdef'.repeat(4)), true);
    });

    it('rejects anything a scanner or typo might present', () => {
        assert.equal(isRecoveryToken(''), false);
        assert.equal(isRecoveryToken('a'.repeat(63)), false);
        assert.equal(isRecoveryToken('a'.repeat(65)), false);
        assert.equal(isRecoveryToken('A'.repeat(64)), false);
        assert.equal(isRecoveryToken('g'.repeat(64)), false);
        assert.equal(isRecoveryToken(null), false);
        assert.equal(isRecoveryToken({ token: 'a'.repeat(64) }), false);
    });

    it('keeps a replay window so a double tap after confirm still works', () => {
        assert.equal(RECOVERY_REPLAY_MINUTES, 30);
    });
});
