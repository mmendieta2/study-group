const { describe, test, beforeEach } = require('node:test');
const assert = require('node:assert/strict');

// helpers MUST be required before the model: it switches to an in-memory database
const { db, resetDb, makeUser, makeSession, makeRsvp } = require('./helpers');
const {
    validateSession,
    createSession,
    getSessionById,
    getSessions
} = require('../server/models/sessionModel');

beforeEach(resetDb);

const validData = { course: 'CSC300', title: 'Software Development', date: '2026-11-05', time: '10:00', location: 'Room 101', capacity: '5' };

describe('validateSession', {todo: true}, () => {
    // VALID
    test('should return null for valid session data', () => {
        assert.equal(validateSession(validData), null);
    });
    test('should return null when capacity is a number', () => {
        assert.equal(validateSession({ ...validData, capacity: 5 }), null);
    });

    // MISSING FIELDS
    test('returns message for missing course', () => {
        assert.equal(validateSession({ ...validData, course: '' }), 'Course is required');
    });
    test('returns message for course with only whitespace', () => {
        assert.equal(validateSession({ ...validData, course: '   ' }), 'Course is required');
    });
    test('returns message for missing title', () => {
        assert.equal(validateSession({ ...validData, title: '' }), 'Title is required');
    });
    test('returns message for missing date', () => {
        assert.equal(validateSession({ ...validData, date: '' }), 'Date is required');
    });
    test('returns message for missing time', () => {
        assert.equal(validateSession({ ...validData, time: '' }), 'Time is required');
    });
    test('returns message for missing location', () => {
        assert.equal(validateSession({ ...validData, location: '' }), 'Location is required');
    });
    test('returns message for missing capacity', () => {
        assert.equal(validateSession({ ...validData, capacity: '' }), 'Capacity is required');
    });

    // DATE
    test('returns message for date in the wrong format', () => {
        assert.equal(validateSession({ ...validData, date: '11/05/2026' }), 'Date is not valid');
    });
    test('returns message for a date that does not exist (Feb 30)', () => {
        assert.equal(validateSession({ ...validData, date: '2026-02-30' }), 'Date is not valid');
    });

    // TIME
    test('returns message for a time that does not exist (25:00)', () => {
        assert.equal(validateSession({ ...validData, time: '25:00' }), 'Time is not valid');
    });

    // CAPACITY
    test('returns message for capacity of 0', () => {
        assert.equal(validateSession({ ...validData, capacity: 0 }), 'Capacity must be a whole number from 1 to 100');
    });
    test('returns message for capacity above 100', () => {
        assert.equal(validateSession({ ...validData, capacity: 101 }), 'Capacity must be a whole number from 1 to 100');
    });
    test('returns message for capacity that is not a whole number', () => {
        assert.equal(validateSession({ ...validData, capacity: 2.5 }), 'Capacity must be a whole number from 1 to 100');
    });
    test('should return null for the smallest and largest capacity (1 and 100)', () => {
        assert.equal(validateSession({ ...validData, capacity: 1 }), null);
        assert.equal(validateSession({ ...validData, capacity: 100 }), null);
    });
});

// ANGEL
describe('createSession', {todo: true}, () => {
    test('returns the id of the new session', () => {
        const result = createSession(makeUser(), validData);
        const row = db.prepare('SELECT * FROM sessions WHERE id = ?').get(result.id);
        assert.equal(row.title, 'Software Development');
    });
    test('saves the values from the data', () => {
        const organizerId = makeUser();
        const { id } = createSession(organizerId, validData);
        const row = db.prepare('SELECT * FROM sessions WHERE id = ?').get(id);
        assert.equal(row.organizer_id, organizerId);
        assert.equal(row.course, 'CSC300');
        assert.equal(row.date, '2026-11-05');
        assert.equal(row.time, '10:00');
        assert.equal(row.location, 'Room 101');
        assert.equal(row.capacity, 5);
    });
    test('removes surrounding spaces from course, title and location', () => {
        const spaced = { ...validData, course: ' CSC300 ', title: ' Review ', location: ' Room 101 ' };
        const { id } = createSession(makeUser(), spaced);
        const row = db.prepare('SELECT * FROM sessions WHERE id = ?').get(id);
        assert.equal(row.course, 'CSC300');
        assert.equal(row.title, 'Review');
        assert.equal(row.location, 'Room 101');
    });
    test('throws when the organizer does not exist', () => {
        assert.throws(() => createSession(9999, validData));
    });
});

// ANTHONY
describe('getSessionById', {todo: true}, () => {
    test('returns the session with its rsvpCount', () => {
        const id = makeSession({ course: 'CSC300', title: 'Review', date: '2026-11-05', time: '10:00', location: 'Room 101', capacity: 5 });
        assert.deepEqual(getSessionById(id), {
            id, course: 'CSC300', title: 'Review', date: '2026-11-05', time: '10:00', location: 'Room 101', capacity: 5, rsvpCount: 0
        });
    });
    test('counts the rsvps for that session only', () => {
        const id = makeSession();
        makeRsvp(id, makeUser());
        makeRsvp(id, makeUser());
        makeRsvp(makeSession(), makeUser());
        assert.equal(getSessionById(id).rsvpCount, 2);
    });
    test('returns undefined when the session does not exist', () => {
        assert.equal(getSessionById(9999), undefined);
    });
});

// ANTHONY
describe('getSessions', {todo: true}, () => {
    const titles = (sessions) => sessions.map((s) => s.title);

    test('returns every session when there are no filters', () => {
        makeSession({ title: 'A' });
        makeSession({ title: 'B' });
        assert.equal(getSessions({}).length, 2);
    });
    test('sorts by date, then by time (earliest first)', () => {
        makeSession({ title: 'third', date: '2026-11-06', time: '09:00' });
        makeSession({ title: 'second', date: '2026-11-05', time: '15:00' });
        makeSession({ title: 'first', date: '2026-11-05', time: '09:00' });
        assert.deepEqual(titles(getSessions({})), ['first', 'second', 'third']);
    });
    test('filters by course, ignoring letter case', () => {
        makeSession({ title: 'match', course: 'CSC300' });
        makeSession({ title: 'other', course: 'MATH101' });
        assert.deepEqual(titles(getSessions({ course: 'csc' })), ['match']);
    });
    test('filters by location, ignoring letter case', () => {
        makeSession({ title: 'match', location: 'Library 2nd floor' });
        makeSession({ title: 'other', location: 'Room 101' });
        assert.deepEqual(titles(getSessions({ location: 'library' })), ['match']);
    });
    test('filters by exact date', () => {
        makeSession({ title: 'match', date: '2026-11-05' });
        makeSession({ title: 'other', date: '2026-11-06' });
        assert.deepEqual(titles(getSessions({ date: '2026-11-05' })), ['match']);
    });
    test('combines filters (all of them must match)', () => {
        makeSession({ title: 'match', course: 'CSC300', date: '2026-11-05' });
        makeSession({ title: 'wrong date', course: 'CSC300', date: '2026-11-06' });
        makeSession({ title: 'wrong course', course: 'MATH101', date: '2026-11-05' });
        assert.deepEqual(titles(getSessions({ course: 'csc', date: '2026-11-05' })), ['match']);
    });
    test('ignores blank filters', () => {
        makeSession({ title: 'A' });
        makeSession({ title: 'B' });
        assert.equal(getSessions({ course: '', date: '', location: '' }).length, 2);
    });
    test('treats % and quotes as plain text, not as special characters', () => {
        makeSession();
        assert.deepEqual(getSessions({ course: '%' }), []);
        assert.deepEqual(getSessions({ course: "'; DROP TABLE sessions; --" }), []);
        assert.equal(getSessions({}).length, 1);
    });
});
