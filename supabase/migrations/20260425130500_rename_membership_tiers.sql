ALTER TABLE users
DROP CONSTRAINT IF EXISTS users_consumer_vs_commercial_check;

-- Rename persisted account tiers:
-- consumer -> essential, commercial -> premium.
UPDATE users
SET consumer_vs_commercial = 'essential'
WHERE consumer_vs_commercial = 'consumer';

UPDATE users
SET consumer_vs_commercial = 'premium'
WHERE consumer_vs_commercial = 'commercial';

ALTER TABLE users
ADD CONSTRAINT users_consumer_vs_commercial_check
CHECK (
  consumer_vs_commercial IS NULL
  OR consumer_vs_commercial IN ('essential', 'premium')
);

COMMENT ON COLUMN users.consumer_vs_commercial IS 'essential | premium — set at signup from membership selection';
