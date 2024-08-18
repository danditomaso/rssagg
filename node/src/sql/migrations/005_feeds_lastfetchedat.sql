-- Up Migration
ALTER TABLE feeds ADD COLUMN last_fetched_at TIMESTAMP;

-- Down Migration
ALTER TABLE feeds DROP COLUMN last_fetched_at;