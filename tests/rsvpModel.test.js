const { describe, test, beforeEach } = require('node:test');
const assert = require('node:assert/strict');

// helpers MUST be required before the model: it switches to an in-memory database
const { resetDb, makeUser, makeSession, makeRsvp } = require('./helpers');
const {
    getRsvpCount
} = require('../server/models/rsvpModel');

beforeEach(resetDb);

describe('getRsvpCount', {todo: true}, () => {
    test('returns 0 when nobody has joined', () => {
        assert.equal(getRsvpCount(makeSession()), 0);
    });
    test('counts only the rsvps for that session', () => {
        const sessionId = makeSession();
        makeRsvp(sessionId, makeUser());
        makeRsvp(sessionId, makeUser());
        makeRsvp(makeSession(), makeUser());
        assert.equal(getRsvpCount(sessionId), 2);
    });
});
