const db = require('../db/database');

// Returns how many people have an RSVP for the session (a number, 0 if none).
function getRsvpCount(sessionId) {
    throw new Error('TODO: implementation needed');
}

module.exports = {
    getRsvpCount
};
