-- ============================================================================
-- INSERT HOUSE HELP JOB POSITION
-- ============================================================================
-- Run this SQL script in phpPgAdmin to add the House Help job to your database
-- 
-- Steps:
-- 1. Open phpPgAdmin
-- 2. Select your database (localhost_local_limited)
-- 3. Go to SQL tab
-- 4. Copy and paste this entire script
-- 5. Click "Execute"
-- ============================================================================

INSERT INTO "job_openings" (
  "title",
  "description",
  "department",
  "location",
  "salary_range",
  "job_type",
  "requirements",
  "benefits",
  "image_url",
  "status",
  "created_at",
  "updated_at"
) VALUES (
  'House Help',
  'We are looking for a reliable and hardworking House Help to join our household in Riyadh. The ideal candidate will be responsible for maintaining cleanliness, organizing household items, preparing meals, and providing general household assistance. Must be trustworthy, punctual, and able to work independently. Experience in household management is preferred.',
  'Domestic Services',
  'Riyadh, Saudi Arabia',
  '850-950 RS',
  'Full-time',
  'Minimum 2 years of household management experience. Excellent cleaning and organizational skills. Ability to prepare basic meals. Strong communication skills. Trustworthy and reliable. Physical ability to perform household tasks. Flexibility with working hours. Must be willing to work 6 days a week.',
  'Competitive salary (850-950 RS). Accommodation provided. Meals included. Weekly off day. Health insurance coverage. Friendly and supportive work environment.',
  'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=500&h=300&fit=crop',
  'active',
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
);

-- ============================================================================
-- Confirmation: Check if the job was inserted successfully
-- ============================================================================
-- Run this query to verify the job was added:
-- SELECT * FROM "job_openings" WHERE "title" = 'House Help';
