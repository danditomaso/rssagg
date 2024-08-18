-- this file is a workaround for an issue 
CREATE TABLE users (
  id UUID PRIMARY KEY,
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL,
  name TEXT NOT NULL,
  api_key VARCHAR(64) UNIQUE NOT NULL DEFAULT (
  encode(sha256(random()::text::bytea), 'hex')
)
);

CREATE TABLE feeds (
  id UUID PRIMARY KEY,
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL,
  name TEXT NOT NULL,
  url TEXT UNIQUE NOT NULL,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE 
);

CREATE TABLE feed_follows (
  id UUID PRIMARY KEY,
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  feed_id UUID NOT NULL REFERENCES feeds(id) ON DELETE CASCADE,
  last_fetched_at TIMESTAMP,
  UNIQUE(user_id, feed_id)
);