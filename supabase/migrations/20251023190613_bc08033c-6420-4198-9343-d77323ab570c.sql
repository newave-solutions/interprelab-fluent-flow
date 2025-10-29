-- Add validation constraint for pay_rate in user_settings table
ALTER TABLE user_settings
ADD CONSTRAINT pay_rate_valid 
CHECK (pay_rate >= 0 AND pay_rate <= 10000);

-- Add comment explaining the constraint
COMMENT ON CONSTRAINT pay_rate_valid ON user_settings IS 'Ensures pay_rate is within reasonable bounds (0-10000)';