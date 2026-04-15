-- Account intent: food-category (consumer) vs paid / master-table tier (commercial).
ALTER TABLE users
ADD COLUMN IF NOT EXISTS consumer_vs_commercial text;

ALTER TABLE users
DROP CONSTRAINT IF EXISTS users_consumer_vs_commercial_check;

ALTER TABLE users
ADD CONSTRAINT users_consumer_vs_commercial_check
CHECK (
  consumer_vs_commercial IS NULL
  OR consumer_vs_commercial IN ('consumer', 'commercial')
);

COMMENT ON COLUMN users.consumer_vs_commercial IS 'consumer | commercial — set at signup from account flow';
