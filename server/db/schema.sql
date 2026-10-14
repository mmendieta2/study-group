CREATE TABLE IF NOT EXISTS users (
  id            INTEGER PRIMARY KEY AUTOINCREMENT,
  name          TEXT NOT NULL,
  email         TEXT NOT NULL UNIQUE COLLATE NOCASE,
  password_hash TEXT NOT NULL,
  created_at    TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS sessions (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  organizer_id INTEGER NOT NULL REFERENCES users(id),
  course       TEXT NOT NULL,
  title        TEXT NOT NULL,
  date         TEXT NOT NULL,   -- YYYY-MM-DD
  time         TEXT NOT NULL,   -- HH:MM (24-hour)
  location     TEXT NOT NULL,
  capacity     INTEGER NOT NULL CHECK (capacity >= 1),
  created_at   TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS rsvps (
  session_id INTEGER NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  user_id    INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (session_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_sessions_course ON sessions(course);
CREATE INDEX IF NOT EXISTS idx_sessions_date   ON sessions(date);
CREATE INDEX IF NOT EXISTS idx_rsvps_user      ON rsvps(user_id);