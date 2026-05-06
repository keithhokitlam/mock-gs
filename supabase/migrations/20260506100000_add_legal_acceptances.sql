-- Audit records for signup legal consent.
CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS legal_acceptances (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  email text NOT NULL,
  accepted_at timestamptz NOT NULL DEFAULT now(),
  ip_address text,
  user_agent text,
  terms_version text NOT NULL,
  privacy_version text NOT NULL,
  acceptance_text text NOT NULL,
  locale text,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT legal_acceptances_locale_check
    CHECK (locale IS NULL OR locale IN ('en', 'zh'))
);

CREATE INDEX IF NOT EXISTS legal_acceptances_user_id_idx
  ON legal_acceptances(user_id);

CREATE INDEX IF NOT EXISTS legal_acceptances_email_idx
  ON legal_acceptances(email);

CREATE INDEX IF NOT EXISTS legal_acceptances_accepted_at_idx
  ON legal_acceptances(accepted_at DESC);

ALTER TABLE legal_acceptances ENABLE ROW LEVEL SECURITY;

COMMENT ON TABLE legal_acceptances IS 'Signup audit trail for Terms of Service and Privacy Policy acceptance.';
COMMENT ON COLUMN legal_acceptances.user_id IS 'User who accepted the legal documents.';
COMMENT ON COLUMN legal_acceptances.email IS 'Email address used at the time of acceptance.';
COMMENT ON COLUMN legal_acceptances.accepted_at IS 'Server timestamp when acceptance was recorded.';
COMMENT ON COLUMN legal_acceptances.ip_address IS 'Client IP address captured from trusted request headers when available.';
COMMENT ON COLUMN legal_acceptances.user_agent IS 'Browser user agent captured at signup when available.';
COMMENT ON COLUMN legal_acceptances.terms_version IS 'Terms of Service version accepted.';
COMMENT ON COLUMN legal_acceptances.privacy_version IS 'Privacy Policy version accepted.';
COMMENT ON COLUMN legal_acceptances.acceptance_text IS 'Exact checkbox text accepted by the user.';
