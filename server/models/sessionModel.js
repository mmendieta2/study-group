const db = require('../db/database');

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/; // Regex pattern for date validation (YYYY-MM-DD)
const TIME_PATTERN = /^([01]\d|2[0-3]):[0-5]\d$/; // Regex pattern for time validation (HH:MM)
const MIN_CAPACITY = 1;
const MAX_CAPACITY = 100;

// DATA EXAMPLE
// data ={ course: 'CSC300', title: 'Software Development', date: 'YYYY-MM-DD', time: 'HH:MM', location: 'Room 101', capacity: '5' }

// Returns null if the data is valid.
// Otherwise returns a string: the message for the FIRST problem found.
// Check order: course, title, date, time, location, capacity.
function validateSession(data) {
    throw new Error('TODO: implementation needed');
}

// Saves a session and returns { id } of the new row. The data is already validated.
// - saves course, title and location with surrounding spaces removed
// - saves capacity as a whole number (the string '5' is saved as 5)
// - throws if organizerId is not an existing user (the database rejects it)
function createSession(organizerId, data) {
    throw new Error('TODO: implementation needed');
}


// A session in the results looks like:
// { id, course, title, date, time, location, capacity, rsvpCount }
// rsvpCount is the number of rows in the rsvps table for that session.

// Returns the session with that id, or undefined if there is none.
function getSessionById(id) {
    throw new Error('TODO: implementation needed');
}

// filters = { course, date, location } (all optional)
// Returns an array of sessions sorted by date, then time (earliest first).
// Returns [] when nothing matches.
// - course and location: case-insensitive "contains" match
// - date: exact match (YYYY-MM-DD)
// - filters are combined with AND; missing or blank filters are ignored
function getSessions(filters) {
    throw new Error('TODO: implementation needed');
}

module.exports = {
    validateSession,
    createSession,
    getSessionById,
    getSessions
};