const { describe, test, beforeEach } = require('node:test');
const assert = require('node:assert/strict');

const {
    validateRegistration
} = require('../server/models/userModel');

const validData = { name: 'name222', email: 'example@example.com', password: 'some-password' };

describe('validateRegistration', {todo: true}, () => {
    // VALID
    test('should return null for valid registration data', () => {
        assert.equal(validateRegistration(validData), null);
    });

    //NAME
    test('returns message for missing name', () => {
        const missingNameData = { name: '', email: 'user@example.com', password: 'some-password' };
        assert.equal(validateRegistration(missingNameData), 'Name is required');
    });
    test('returns message for invalid name', () => {
        const invalidNameData = { name: '   ', email: 'user@example.com', password: 'some-password' };
        assert.equal(validateRegistration(invalidNameData), 'Name cannot be empty or whitespace only');
    });

    //EMAIL
    test('returns message for missing email', () => { 
        const missingEmailData = { name: 'name222', email: '', password: 'some-password' };
        assert.equal(validateRegistration(missingEmailData), 'Email is required');
    });
    test('returns message for invalid email', () => { 
        const invalidEmailData = { name: 'name222', email: 'invalid-email', password: 'some-password' };
        assert.equal(validateRegistration(invalidEmailData), 'Email is not valid');
    });

    //PASSWORD
    test('returns message for missing password', () => { 
        const missingPasswordData = { name: 'name222', email: 'user@example.com', password: '' };
        assert.equal(validateRegistration(missingPasswordData), 'Password is required');
    });
    test('returns message for password too short', () => { 
        const shortPasswordData = { name: 'name222', email: 'user@example.com', password: '1234' };
        assert.equal(validateRegistration(shortPasswordData), 'Password must be at least 8 characters long');
    });
    test('returns message for password too long', () => { 
        const longPassword = 'a'.repeat(73);
        const longPasswordData = { name: 'name222', email: 'user@example.com', password: longPassword };
        assert.equal(validateRegistration(longPasswordData), 'Password must be no more than 72 characters long');
    });
});