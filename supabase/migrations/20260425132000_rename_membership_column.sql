ALTER TABLE users
DROP CONSTRAINT IF EXISTS users_consumer_vs_commercial_check;

ALTER TABLE users
DROP CONSTRAINT IF EXISTS users_essential_vs_premium_check;

ALTER TABLE users
RENAME COLUMN consumer_vs_commercial TO essential_vs_premium;

ALTER TABLE users
ADD CONSTRAINT users_essential_vs_premium_check
CHECK (
  essential_vs_premium IS NULL
  OR essential_vs_premium IN ('essential', 'premium')
);

COMMENT ON COLUMN users.essential_vs_premium IS 'essential | premium — set at signup from membership selection';
