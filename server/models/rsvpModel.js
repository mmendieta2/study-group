const db = require('../db/database');

// Returns how many people have an RSVP for the session (a number, 0 if none).
function getRsvpCount(sessionId) {
    throw new Error('TODO: implementation needed');
}

// Adds an RSVP for the user. Returns an object, and does not throw for these cases:
//   { ok: true }
//   { ok: false, error: 'Session not found' }  the session id does not exist
//   { ok: false, error: 'Already RSVPed' }     this user already has an RSVP for it
//   { ok: false, error: 'Session full' }       the RSVP count has reached the capacity
// Check in that order. The capacity check and the insert must happen inside ONE
// db.transaction(), so two people cannot take the last spot at the same time.
function addRsvp(sessionId, userId) {
    throw new Error('TODO: implementation needed');
}

// Removes the user's RSVP. Always returns { ok: true },
// even when the user had no RSVP for that session.
function removeRsvp(sessionId, userId) {
    throw new Error('TODO: implementation needed');
}

// Returns the sessions the user has an RSVP for, sorted by date, then time (earliest first).
// Returns [] if there are none. Each session looks like:
// { id, course, title, date, time, location, capacity, rsvpCount }
// rsvpCount counts ALL RSVPs for that session, not only this user's.
function getMySessions(userId) {
    throw new Error('TODO: implementation needed');
}

module.exports = {
    getRsvpCount,
    addRsvp,
    removeRsvp,
    getMySessions
};
