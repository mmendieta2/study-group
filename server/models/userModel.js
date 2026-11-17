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
function validateRegistration(data) 
{
   if (data.name === "")
   { 
     return "Name is required";
   }

  if (data.name.trim() === "")
  {
    return "Name cannot be empty or whitespace only";
  }

  if (data.email === "")
  {
    return "Email is required";
  }
  if (!EMAIL_PATTERN.test(data.email))
  {
    return "Email is not valid";
  }

  if (data.password ==="")
  {
    return "Password is required";
  }

  if (data.password.length < MIN_PASSWORD_LENGTH)
  {
    return "Password must be at least 8 characters long";
  }

  if (data.password.length > MAX_PASSWORD_LENGTH)
  {
    return "Password must be no more than 72 characters long";
  }

  return null;

}

// Looks up a user by email. Ignores upper and lower case ('ANA@x.com' finds 'ana@x.com').
// Returns { id, name, email }, or undefined if no user has that email.
// Never include the password hash in the result.
function findUserByEmail(email)
{
    throw new Error('TODO: implementation needed');
}

// Looks up a user by id.
// Returns { id, name }, or undefined if no user has that id.
// Never include the password hash in the result.
function findUserById(id) 
{
    throw new Error('TODO: implementation needed');
}

// Creates a user. The data is already validated (see validateRegistration).
// - saves name and email with surrounding spaces removed
// - saves a bcrypt hash of the password, never the password itself:
//   bcrypt.hashSync(password, SALT_ROUNDS)
// - returns { id, name } of the new user
// - throws Error('Email already registered') if the email is already used
//   (a different letter case counts as the same email)
function createUser(data) 
{
  const name = data.name.trim();
  const email = data.email.trim();
  const hash = bcrypt.hashSync(data.password, SALT_ROUNDS);

  try {
  const result = db.prepare(
    'INSERT INTO users (name, email, password_hash) VALUES (?,?,?)'
    ).run(name, email, hash);
    
    return { id: Number(result.lastInsertRowid), name: name};
  }
catch (error)
  {
    if error.code === 'SQLITE_CONSTRAINT_UNIQUE')
    {
  throws new Error('Email already registered');
    }
    throws error;
  }
    throw new Error('TODO: implementation needed');
}

// Checks an email and password for login.
// Returns { id, name } when both are correct. Ignores letter case in the email.
// Returns null when the email is unknown OR the password is wrong.
// Both cases must give the same result, so the login page cannot tell which one failed.
function verifyLogin(email, password) 
{
  const row = db.prepare('SELECT id, name, password_hash FROM users WHERE email = ?').get(email);

  //checking if they exist, if we found them
  if (!row)
  {
    return null;
  }
  //checking if to verify the password
  if (!bcrypt.compareSync(password, row.password_hash))
  {
    return null;
  }

  //now returning id and name
    return {id:row.id, name: row.name};
}

module.exports = 
{
    validateRegistration,
    findUserByEmail,
    findUserById,
    createUser,
    verifyLogin,
};
