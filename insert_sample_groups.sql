-- Insert 20 random study groups for testing
-- Make sure to replace the creator_id UUIDs with actual user IDs from your profiles table

INSERT INTO study_groups (name, subject, description, frequency, platform, schedule, max_members, creator_id) VALUES
('Advanced Calculus Study Circle', 'Mathematics', 'Weekly sessions focusing on limits, derivatives, and integrals. Perfect for students struggling with advanced calculus concepts.', 'Weekly', 'Discord', 'Saturdays 2:00 PM - 4:00 PM', 12, 'YOUR_USER_ID_1'),

('React Frontend Bootcamp', 'Computer Science', 'Learn modern React development including hooks, context, and state management. Build real projects together.', 'Twice weekly', 'Zoom', 'Mon/Wed 7:00 PM - 8:30 PM', 15, 'YOUR_USER_ID_2'),

('Organic Chemistry Lab Prep', 'Chemistry', 'Prepare for organic chemistry lab experiments and understand reaction mechanisms through collaborative learning.', 'Weekly', 'Google Meet', 'Sundays 3:00 PM - 5:00 PM', 8, 'YOUR_USER_ID_1'),

('Data Structures & Algorithms', 'Computer Science', 'Master coding interviews and competitive programming. We solve LeetCode problems and discuss optimal solutions.', 'Twice weekly', 'Discord', 'Tue/Thu 8:00 PM - 9:30 PM', 20, 'YOUR_USER_ID_2'),

('Financial Accounting Fundamentals', 'Business', 'Learn the basics of financial accounting, balance sheets, and income statements for business students.', 'Weekly', 'Microsoft Teams', 'Fridays 4:00 PM - 6:00 PM', 10, 'YOUR_USER_ID_1'),

('Physics Problem Solvers', 'Physics', 'Tackle challenging physics problems from mechanics to quantum physics. All levels welcome!', 'Bi-weekly', 'Zoom', 'Every other Saturday 1:00 PM - 3:00 PM', 12, 'YOUR_USER_ID_2'),

('Spanish Conversation Club', 'Business', 'Practice Spanish conversation skills in a supportive environment. Focus on business Spanish terminology.', 'Twice weekly', 'Google Meet', 'Mon/Fri 6:00 PM - 7:00 PM', 8, 'YOUR_USER_ID_1'),

('Machine Learning Study Group', 'Computer Science', 'Explore machine learning algorithms, neural networks, and AI applications. Hands-on projects included.', 'Weekly', 'Discord', 'Wednesdays 7:30 PM - 9:00 PM', 16, 'YOUR_USER_ID_2'),

('Microeconomics Discussion Forum', 'Business', 'Discuss economic theories, market structures, and real-world applications of microeconomic principles.', 'Weekly', 'Zoom', 'Thursdays 5:00 PM - 6:30 PM', 14, 'YOUR_USER_ID_1'),

('Cell Biology Research Group', 'Biology', 'Study cellular processes, molecular biology, and latest research in cell biology. Great for pre-med students.', 'Weekly', 'In-person', 'Tuesdays 3:00 PM - 5:00 PM', 6, 'YOUR_USER_ID_2'),

('Database Design Workshop', 'Computer Science', 'Learn SQL, database normalization, and design patterns. Build real database projects together.', 'Weekly', 'Microsoft Teams', 'Saturdays 10:00 AM - 12:00 PM', 12, 'YOUR_USER_ID_1'),

('Statistics and Probability', 'Mathematics', 'Master statistical concepts, probability distributions, and data analysis techniques for various fields.', 'Twice weekly', 'Google Meet', 'Mon/Wed 4:00 PM - 5:30 PM', 15, 'YOUR_USER_ID_2'),

('Marketing Strategy Brainstorm', 'Business', 'Analyze marketing campaigns, discuss consumer behavior, and develop marketing strategies for case studies.', 'Bi-weekly', 'Zoom', 'Every other Friday 6:00 PM - 8:00 PM', 10, 'YOUR_USER_ID_1'),

('Web Development Full Stack', 'Computer Science', 'Complete web development from frontend to backend. Learn HTML, CSS, JavaScript, Node.js, and databases.', 'Twice weekly', 'Discord', 'Tue/Sat 7:00 PM - 9:00 PM', 18, 'YOUR_USER_ID_2'),

('Thermodynamics Study Session', 'Engineering', 'Understand heat transfer, energy systems, and thermodynamic cycles. Perfect for mechanical engineering students.', 'Weekly', 'In-person', 'Thursdays 2:00 PM - 4:00 PM', 8, 'YOUR_USER_ID_1'),

('Psychology Research Methods', 'Biology', 'Learn research methodology, statistical analysis, and experimental design in psychology studies.', 'Weekly', 'Google Meet', 'Wednesdays 5:00 PM - 6:30 PM', 12, 'YOUR_USER_ID_2'),

('Linear Algebra Applications', 'Mathematics', 'Explore vectors, matrices, eigenvalues, and real-world applications in engineering and computer science.', 'Weekly', 'Zoom', 'Mondays 6:00 PM - 7:30 PM', 14, 'YOUR_USER_ID_1'),

('Investment and Portfolio Management', 'Business', 'Study investment strategies, portfolio theory, and financial markets. Analyze real investment cases.', 'Weekly', 'Microsoft Teams', 'Sundays 4:00 PM - 6:00 PM', 12, 'YOUR_USER_ID_2'),

('Software Engineering Principles', 'Computer Science', 'Learn software design patterns, agile methodology, and best practices for large-scale software development.', 'Weekly', 'Discord', 'Fridays 7:00 PM - 8:30 PM', 16, 'YOUR_USER_ID_1'),

('Environmental Science Lab', 'Biology', 'Study environmental issues, sustainability, and ecological systems. Includes field study discussions.', 'Bi-weekly', 'Hybrid', 'Every other Sunday 2:00 PM - 4:00 PM', 10, 'YOUR_USER_ID_2');

-- Optional: Add some sample tags for these groups
-- Note: You'll need to get the actual group IDs after inserting the groups above

-- Example tags insert (replace GROUP_ID_X with actual IDs):
/*
INSERT INTO tags (name, group_id) VALUES
('Calculus', 'GROUP_ID_1'),
('Math', 'GROUP_ID_1'),
('Advanced', 'GROUP_ID_1'),
('React', 'GROUP_ID_2'),
('JavaScript', 'GROUP_ID_2'),
('Frontend', 'GROUP_ID_2'),
('Organic', 'GROUP_ID_3'),
('Lab', 'GROUP_ID_3'),
('Chemistry', 'GROUP_ID_3'),
('Algorithms', 'GROUP_ID_4'),
('LeetCode', 'GROUP_ID_4'),
('Interview Prep', 'GROUP_ID_4'),
('Accounting', 'GROUP_ID_5'),
('Finance', 'GROUP_ID_5'),
('Business', 'GROUP_ID_5');
*/
