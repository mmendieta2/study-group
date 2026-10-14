const fs = require('node:fs');
const path = require('node:path');
const Database = require('better-sqlite3');

const dbPath = process.env.DB_PATH || path.join(__dirname, 'study-group.db');

const db = new Database(dbPath);
db.pragma('foreign_keys = ON');
db.exec(fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8'));

module.exports = db;