CREATE TABLE call_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  duration INT NOT NULL,
  earnings NUMERIC(10, 2) NOT NULL,
  platform TEXT,
  call_type TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE user_preferences (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id),
  pay_per_minute_usd NUMERIC(10, 2) DEFAULT 0.75,
  target_currency TEXT DEFAULT 'MXN',
  rounding TEXT DEFAULT 'up'
);
