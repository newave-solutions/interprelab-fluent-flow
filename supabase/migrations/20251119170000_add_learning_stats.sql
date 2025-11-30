-- Create learning_stats table for tracking user learning progress
CREATE TABLE IF NOT EXISTS learning_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  study_hours DECIMAL(10, 2) DEFAULT 0,
  terms_learned INTEGER DEFAULT 0,
  quizzes_completed INTEGER DEFAULT 0,
  scenarios_practiced INTEGER DEFAULT 0,
  bot_conversations INTEGER DEFAULT 0,
  streak INTEGER DEFAULT 0,
  total_points INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Create learning_activities table for tracking individual activities
CREATE TABLE IF NOT EXISTS learning_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  activity_type VARCHAR(50) NOT NULL, -- 'study', 'quiz', 'scenario', 'bot', 'term_learned'
  activity_name VARCHAR(255),
  points_earned INTEGER DEFAULT 0,
  duration_minutes INTEGER,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_learning_stats_user_id ON learning_stats(user_id);
CREATE INDEX IF NOT EXISTS idx_learning_activities_user_id ON learning_activities(user_id);
CREATE INDEX IF NOT EXISTS idx_learning_activities_created_at ON learning_activities(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_learning_activities_activity_type ON learning_activities(activity_type);

-- Enable Row Level Security
ALTER TABLE learning_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE learning_activities ENABLE ROW LEVEL SECURITY;

-- RLS Policies for learning_stats
CREATE POLICY "Users can view their own learning stats"
  ON learning_stats FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own learning stats"
  ON learning_stats FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own learning stats"
  ON learning_stats FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for learning_activities
CREATE POLICY "Users can view their own learning activities"
  ON learning_activities FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own learning activities"
  ON learning_activities FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Function to update learning stats
CREATE OR REPLACE FUNCTION update_learning_stats()
RETURNS TRIGGER AS $$
BEGIN
  -- Update the corresponding learning_stats record
  INSERT INTO learning_stats (
    user_id,
    study_hours,
    terms_learned,
    quizzes_completed,
    scenarios_practiced,
    bot_conversations,
    total_points,
    updated_at
  )
  VALUES (
    NEW.user_id,
    CASE WHEN NEW.activity_type = 'study' THEN COALESCE(NEW.duration_minutes, 0) / 60.0 ELSE 0 END,
    CASE WHEN NEW.activity_type = 'term_learned' THEN 1 ELSE 0 END,
    CASE WHEN NEW.activity_type = 'quiz' THEN 1 ELSE 0 END,
    CASE WHEN NEW.activity_type = 'scenario' THEN 1 ELSE 0 END,
    CASE WHEN NEW.activity_type = 'bot' THEN 1 ELSE 0 END,
    COALESCE(NEW.points_earned, 0),
    NOW()
  )
  ON CONFLICT (user_id) DO UPDATE SET
    study_hours = learning_stats.study_hours + CASE WHEN NEW.activity_type = 'study' THEN COALESCE(NEW.duration_minutes, 0) / 60.0 ELSE 0 END,
    terms_learned = learning_stats.terms_learned + CASE WHEN NEW.activity_type = 'term_learned' THEN 1 ELSE 0 END,
    quizzes_completed = learning_stats.quizzes_completed + CASE WHEN NEW.activity_type = 'quiz' THEN 1 ELSE 0 END,
    scenarios_practiced = learning_stats.scenarios_practiced + CASE WHEN NEW.activity_type = 'scenario' THEN 1 ELSE 0 END,
    bot_conversations = learning_stats.bot_conversations + CASE WHEN NEW.activity_type = 'bot' THEN 1 ELSE 0 END,
    total_points = learning_stats.total_points + COALESCE(NEW.points_earned, 0),
    updated_at = NOW();

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically update learning stats when activities are logged
CREATE TRIGGER trigger_update_learning_stats
  AFTER INSERT ON learning_activities
  FOR EACH ROW
  EXECUTE FUNCTION update_learning_stats();

-- Function to calculate and update streak
CREATE OR REPLACE FUNCTION calculate_learning_streak(p_user_id UUID)
RETURNS INTEGER AS $$
DECLARE
  v_streak INTEGER := 0;
  v_current_date DATE := CURRENT_DATE;
  v_check_date DATE;
BEGIN
  -- Calculate streak by checking consecutive days with activities
  v_check_date := v_current_date;
  
  WHILE EXISTS (
    SELECT 1 FROM learning_activities
    WHERE user_id = p_user_id
    AND DATE(created_at) = v_check_date
  ) LOOP
    v_streak := v_streak + 1;
    v_check_date := v_check_date - INTERVAL '1 day';
  END LOOP;
  
  -- Update the streak in learning_stats
  UPDATE learning_stats
  SET streak = v_streak, updated_at = NOW()
  WHERE user_id = p_user_id;
  
  RETURN v_streak;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant necessary permissions
GRANT SELECT, INSERT, UPDATE ON learning_stats TO authenticated;
GRANT SELECT, INSERT ON learning_activities TO authenticated;
GRANT EXECUTE ON FUNCTION calculate_learning_streak TO authenticated;

-- Add helpful comments
COMMENT ON TABLE learning_stats IS 'Stores aggregated learning progress metrics for each user';
COMMENT ON TABLE learning_activities IS 'Logs individual learning activities for detailed tracking and point calculation';
COMMENT ON COLUMN learning_stats.study_hours IS 'Total hours spent in InterpreStudy sessions';
COMMENT ON COLUMN learning_stats.terms_learned IS 'Count of medical terms learned and mastered';
COMMENT ON COLUMN learning_stats.quizzes_completed IS 'Number of quizzes completed';
COMMENT ON COLUMN learning_stats.scenarios_practiced IS 'Number of mock scenarios practiced';
COMMENT ON COLUMN learning_stats.bot_conversations IS 'Number of conversations with InterpreBot';
COMMENT ON COLUMN learning_stats.streak IS 'Current consecutive days streak of learning activities';
COMMENT ON COLUMN learning_stats.total_points IS 'Total points earned across all learning activities';
