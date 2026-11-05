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

module.exports = {
    validateRegistration,
};
