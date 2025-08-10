-- PREREQUISITE: Make sure your profiles table has a 'role' column
-- If not, run this first:
-- ALTER TABLE profiles ADD COLUMN role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'admin'));
-- UPDATE profiles SET role = 'admin' WHERE email = 'your-admin-email@example.com';

-- Create problem_reports table for bug reports, feedback, and issues
CREATE TABLE problem_reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  user_email VARCHAR(255) NOT NULL,
  user_name VARCHAR(255),
  problem_type VARCHAR(50) NOT NULL CHECK (problem_type IN ('bug', 'feature', 'ui', 'performance', 'other')),
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  steps_to_reproduce TEXT,
  expected_behavior TEXT,
  actual_behavior TEXT,
  browser_info TEXT,
  device_info TEXT,
  urgency VARCHAR(20) DEFAULT 'medium' CHECK (urgency IN ('low', 'medium', 'high', 'critical')),
  status VARCHAR(20) DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
  attachments JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  resolved_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes for better performance
CREATE INDEX idx_problem_reports_user_id ON problem_reports(user_id);
CREATE INDEX idx_problem_reports_problem_type ON problem_reports(problem_type);
CREATE INDEX idx_problem_reports_status ON problem_reports(status);
CREATE INDEX idx_problem_reports_urgency ON problem_reports(urgency);
CREATE INDEX idx_problem_reports_created_at ON problem_reports(created_at DESC);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_problem_reports_updated_at 
  BEFORE UPDATE ON problem_reports 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE problem_reports ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Allow users to insert problem reports (but not view them)
CREATE POLICY "Users can insert problem reports" 
ON problem_reports FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Allow anonymous users to insert reports (for non-authenticated users)
CREATE POLICY "Anonymous users can insert problem reports" 
ON problem_reports FOR INSERT 
WITH CHECK (user_id IS NULL);

-- Only admins can view all problem reports
CREATE POLICY "Only admins can view problem reports" 
ON problem_reports FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

-- Only admins can update problem reports
CREATE POLICY "Only admins can update problem reports" 
ON problem_reports FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

-- Only admins can delete problem reports
CREATE POLICY "Only admins can delete problem reports" 
ON problem_reports FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.role = 'admin'
  )
);

-- Optional: Create a view for report statistics
CREATE OR REPLACE VIEW problem_report_stats AS
SELECT 
  problem_type,
  status,
  urgency,
  COUNT(*) as count,
  DATE_TRUNC('day', created_at) as report_date
FROM problem_reports 
GROUP BY problem_type, status, urgency, DATE_TRUNC('day', created_at)
ORDER BY report_date DESC;

-- Grant permissions to authenticated users (INSERT only for regular users)
GRANT INSERT ON problem_reports TO authenticated;

-- Grant permissions to anonymous users (for inserting reports only)
GRANT INSERT ON problem_reports TO anon;

-- Note: SELECT, UPDATE, DELETE permissions are controlled by RLS policies
-- Only admins with role='admin' in profiles table can view/manage reports

-- Grant access to statistics view only for admins (controlled by RLS)
GRANT SELECT ON problem_report_stats TO authenticated;
