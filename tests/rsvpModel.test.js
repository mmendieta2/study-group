const { describe, test, beforeEach } = require('node:test');
const assert = require('node:assert/strict');

// helpers MUST be required before the model: it switches to an in-memory database
const { db, resetDb, makeUser, makeSession, makeRsvp } = require('./helpers');
const {
    getRsvpCount,
    addRsvp,
    removeRsvp,
    getMySessions
} = require('../server/models/rsvpModel');

beforeEach(resetDb);

// Counts rsvps with plain SQL, so these tests do not depend on getRsvpCount
const countRsvps = (sessionId) =>
    db.prepare('SELECT COUNT(*) AS n FROM rsvps WHERE session_id = ?').get(sessionId).n;

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

describe('addRsvp', {todo: true}, () => {
    test('adds the rsvp and returns ok', () => {
        const sessionId = makeSession();
        assert.deepEqual(addRsvp(sessionId, makeUser()), { ok: true });
        assert.equal(countRsvps(sessionId), 1);
    });
    test('rejects the rsvp when the session is full', () => {
        const sessionId = makeSession({ capacity: 2 });
        assert.deepEqual(addRsvp(sessionId, makeUser()), { ok: true });
        assert.deepEqual(addRsvp(sessionId, makeUser()), { ok: true });
        assert.deepEqual(addRsvp(sessionId, makeUser()), { ok: false, error: 'Session full' });
        assert.equal(countRsvps(sessionId), 2);
    });
    test('rejects a second rsvp from the same user', () => {
        const sessionId = makeSession();
        const userId = makeUser();
        addRsvp(sessionId, userId);
        assert.deepEqual(addRsvp(sessionId, userId), { ok: false, error: 'Already RSVPed' });
        assert.equal(countRsvps(sessionId), 1);
    });
    test('rejects an rsvp for a session that does not exist', () => {
        assert.deepEqual(addRsvp(9999, makeUser()), { ok: false, error: 'Session not found' });
    });
});

describe('removeRsvp', {todo: true}, () => {
    test('removes the rsvp and returns ok', () => {
        const sessionId = makeSession();
        const userId = makeUser();
        makeRsvp(sessionId, userId);
        assert.deepEqual(removeRsvp(sessionId, userId), { ok: true });
        assert.equal(countRsvps(sessionId), 0);
    });
    test('returns ok even when the user had not joined', () => {
        assert.deepEqual(removeRsvp(makeSession(), makeUser()), { ok: true });
    });
    test('keeps the rsvps of other users', () => {
        const sessionId = makeSession();
        const leaving = makeUser();
        makeRsvp(sessionId, leaving);
        makeRsvp(sessionId, makeUser());
        removeRsvp(sessionId, leaving);
        assert.equal(countRsvps(sessionId), 1);
    });
});

describe('getMySessions', {todo: true}, () => {
    test('returns only the sessions the user joined, with their rsvpCount', () => {
        const userId = makeUser();
        const joined = makeSession({ title: 'joined', course: 'CSC300', date: '2026-11-05', time: '10:00', location: 'Room 101', capacity: 5 });
        makeSession({ title: 'not joined' });
        makeRsvp(joined, userId);
        makeRsvp(joined, makeUser());
        assert.deepEqual(getMySessions(userId), [
            { id: joined, course: 'CSC300', title: 'joined', date: '2026-11-05', time: '10:00', location: 'Room 101', capacity: 5, rsvpCount: 2 }
        ]);
    });
    test('returns an empty array when the user has not joined anything', () => {
        makeSession();
        assert.deepEqual(getMySessions(makeUser()), []);
    });
    test('sorts by date, then by time (earliest first)', () => {
        const userId = makeUser();
        makeRsvp(makeSession({ title: 'third', date: '2026-11-06', time: '09:00' }), userId);
        makeRsvp(makeSession({ title: 'second', date: '2026-11-05', time: '15:00' }), userId);
        makeRsvp(makeSession({ title: 'first', date: '2026-11-05', time: '09:00' }), userId);
        assert.deepEqual(getMySessions(userId).map((s) => s.title), ['first', 'second', 'third']);
    });
});
