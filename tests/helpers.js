// Shared test helpers (this file is not a test).
//
// Require this BEFORE any model in a test file. It switches the app to a
// throwaway in-memory database, so tests never touch the real study-group.db.
process.env.DB_PATH = ':memory:';

const db = require('../server/db/database');

let count = 0;

// Empties every table. Use it as: beforeEach(resetDb)
function resetDb() {
    db.exec('DELETE FROM rsvps; DELETE FROM sessions; DELETE FROM users;');
}

// Inserts a user with plain SQL (no other model needed). Returns the new id.
function makeUser(overrides = {}) {
    count++;
    const user = { name: `User ${count}`, email: `user${count}@example.com`, ...overrides };
    return db
        .prepare('INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)')
        .run(user.name, user.email, 'not-a-real-hash').lastInsertRowid;
}

// Inserts a session with plain SQL. Any field can be overridden.
// If you do not pass organizerId, a new user is created as the organizer.
// Returns the new id.
function makeSession(overrides = {}) {
    const s = {
        course: 'CSC300', title: 'Study', date: '2026-11-05', time: '10:00',
        location: 'Room 101', capacity: 5, ...overrides,
    };
    const organizerId = s.organizerId ?? makeUser();
    return db
        .prepare('INSERT INTO sessions (organizer_id, course, title, date, time, location, capacity) VALUES (?, ?, ?, ?, ?, ?, ?)')
        .run(organizerId, s.course, s.title, s.date, s.time, s.location, s.capacity).lastInsertRowid;
}

// Inserts an RSVP with plain SQL.
function makeRsvp(sessionId, userId) {
    db.prepare('INSERT INTO rsvps (session_id, user_id) VALUES (?, ?)').run(sessionId, userId);
}

module.exports = { db, resetDb, makeUser, makeSession, makeRsvp };
