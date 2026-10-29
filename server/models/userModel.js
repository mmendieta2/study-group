const bcrypt = require('bcryptjs');
const db = require('../db/database');

const SALT_ROUNDS = 10;
const MIN_PASSWORD_LENGTH = 8;
const MAX_PASSWORD_LENGTH = 72; // bcrypt ignores anything past 72 bytes
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Regex pattern for email validation


// DATA EXAMPLE
// data = {name: 'name222', email: 'user@example.com', password: 'something' }

// Returns null if nothing is invalid
// Returns a string with a message for each invalid field
function validateRegistration(data) {
    throw new Error('TODO: implementation needed');
}

module.exports = {
    validateRegistration,
};