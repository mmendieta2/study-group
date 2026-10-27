const bcrypt = require('bcryptjs');
const db = require('../db/database');

const SALT_ROUNDS = 10;
const MIN_PASSWORD_LENGTH = 8;
const MAX_PASSWORD_LENGTH = 72; // bcrypt ignores anything past 72 bytes
const EMAIL_PATTERN = null; // TODO: Add a regex pattern for email validation


// DATA EXAMPLE
// data = { name: 'Ana Lopez', email: 'user@example.com', password: 'something' }

// Returns null if the data is valid.
// Otherwise returns a string: the message for the FIRST problem found.
// Check order: name, then email, then password.
function validateRegistration(data) {
    throw new Error('TODO: implementation needed');
}

module.exports = {
    validateRegistration,
};