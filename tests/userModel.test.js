const { describe, test, beforeEach } = require('node:test');
const assert = require('node:assert/strict');
const bcrypt = require('bcryptjs');

// helpers MUST be required before the model: it switches to an in-memory database
const { db, resetDb, makeUser } = require('./helpers');
const {
    validateRegistration,
    findUserByEmail,
    findUserById,
    createUser,
    verifyLogin
} = require('../server/models/userModel');

beforeEach(resetDb);

const validData = { name: 'name222', email: 'example@example.com', password: 'some-password' };

describe('validateRegistration', () => {
    // VALID
    test('should return null for valid registration data', () => {
        assert.equal(validateRegistration(validData), null);
    });

    // NAME
    test('returns message for missing name', () => {
        const missingNameData = { name: '', email: 'user@example.com', password: 'some-password' };
        assert.equal(validateRegistration(missingNameData), 'Name is required');
    });
    test('returns message for invalid name', () => {
        const invalidNameData = { name: '   ', email: 'user@example.com', password: 'some-password' };
        assert.equal(validateRegistration(invalidNameData), 'Name cannot be empty or whitespace only');
    });

    // EMAIL
    test('returns message for missing email', () => { 
        const missingEmailData = { name: 'name222', email: '', password: 'some-password' };
        assert.equal(validateRegistration(missingEmailData), 'Email is required');
    });
    test('returns message for invalid email', () => { 
        const invalidEmailData = { name: 'name222', email: 'invalid-email', password: 'some-password' };
        assert.equal(validateRegistration(invalidEmailData), 'Email is not valid');
    });

    // PASSWORD
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

describe('findUserByEmail', () => {
    test('returns the user without the password hash', () => {
        const id = makeUser({ name: 'Ana Lopez', email: 'ana@example.com' });
        assert.deepEqual(findUserByEmail('ana@example.com'), { id, name: 'Ana Lopez', email: 'ana@example.com' });
    });
    test('finds the user ignoring letter case', () => {
        const id = makeUser({ email: 'ana@example.com' });
        assert.equal(findUserByEmail('ANA@Example.COM').id, id);
    });
    test('returns undefined when no user has that email', () => {
        assert.equal(findUserByEmail('nobody@example.com'), undefined);
    });
});

describe('findUserById', {todo: true}, () => {
    test('returns only the id and name of the user', () => {
        const id = makeUser({ name: 'Ana Lopez' });
        assert.deepEqual(findUserById(id), { id, name: 'Ana Lopez' });
    });
    test('returns undefined when the user does not exist', () => {
        assert.equal(findUserById(9999), undefined);
    });
});

describe('createUser', () => {
    const savedUser = (email) => db.prepare('SELECT * FROM users WHERE email = ?').get(email);

    test('returns the id and name of the new user', () => {
        const result = createUser(validData);
        assert.deepEqual(result, { id: savedUser(validData.email).id, name: 'name222' });
    });
    test('saves a bcrypt hash, not the password', () => {
        createUser(validData);
        const row = savedUser(validData.email);
        assert.notEqual(row.password_hash, validData.password);
        assert.equal(bcrypt.compareSync(validData.password, row.password_hash), true);
    });
    test('removes surrounding spaces from name and email', () => {
        createUser({ ...validData, name: '  Ana  ', email: '  ana@example.com  ' });
        const row = savedUser('ana@example.com');
        assert.equal(row.name, 'Ana');
        assert.equal(row.email, 'ana@example.com');
    });
    test('throws when the email is already used', () => {
        createUser(validData);
        assert.throws(() => createUser(validData), { message: 'Email already registered' });
    });
    test('treats the same email in a different letter case as already used', () => {
        createUser(validData);
        assert.throws(() => createUser({ ...validData, email: validData.email.toUpperCase() }), { message: 'Email already registered' });
    });
});

describe('verifyLogin', () => {
    let id;
    beforeEach(() => {
        id = makeUser({ name: 'Ana Lopez', email: 'ana@example.com', passwordHash: bcrypt.hashSync('some-password', 4) });
    });

    test('returns the id and name for a correct email and password', () => {
        assert.deepEqual(verifyLogin('ana@example.com', 'some-password'), { id, name: 'Ana Lopez' });
    });
    test('returns null for a wrong password', () => {
        assert.equal(verifyLogin('ana@example.com', 'wrong-password'), null);
    });
    test('returns null for an unknown email', () => {
        assert.equal(verifyLogin('nobody@example.com', 'some-password'), null);
    });
    test('ignores letter case in the email', () => {
        assert.deepEqual(verifyLogin('ANA@Example.COM', 'some-password'), { id, name: 'Ana Lopez' });
    });
});
