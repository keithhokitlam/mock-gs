-- Profile fields collected at signup (optional columns; safe to run multiple times)
ALTER TABLE users
ADD COLUMN IF NOT EXISTS first_name text,
ADD COLUMN IF NOT EXISTS last_name text,
ADD COLUMN IF NOT EXISTS company text;

COMMENT ON COLUMN users.first_name IS 'Given name from signup';
COMMENT ON COLUMN users.last_name IS 'Family name from signup';
COMMENT ON COLUMN users.company IS 'Company from signup (optional)';
