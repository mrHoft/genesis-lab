CREATE TABLE IF NOT EXISTS users (
  id CHAR(8) PRIMARY KEY DEFAULT generate_base62_uid(),
  name VARCHAR(80),
  login VARCHAR(24),
  password VARCHAR(100),
  version INTEGER DEFAULT 1,
  created_at INTEGER DEFAULT EXTRACT(EPOCH FROM NOW())::integer,
  updated_at INTEGER DEFAULT EXTRACT(EPOCH FROM NOW())::integer
);
