#!/usr/bin/env node

import postgres from 'postgres';
import dotenv from 'dotenv';

dotenv.config();

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('❌ ERROR: DATABASE_URL environment variable is not set');
  process.exit(1);
}

const sql = postgres(DATABASE_URL);

async function addHouseHelpJob() {
  try {
    console.log('\n🏠 Adding House Help Job Position...\n');

    const jobData = {
      title: 'House Help',
      description: 'We are looking for a reliable and hardworking House Help to join our household in Riyadh. The ideal candidate will be responsible for maintaining cleanliness, organizing household items, preparing meals, and providing general household assistance. Must be trustworthy, punctual, and able to work independently. Experience in household management is preferred.',
      department: 'Domestic Services',
      location: 'Riyadh, Saudi Arabia',
      salary_range: '850-950 RS',
      job_type: 'Full-time',
      requirements: 'Minimum 2 years of household management experience. Excellent cleaning and organizational skills. Ability to prepare basic meals. Strong communication skills. Trustworthy and reliable. Physical ability to perform household tasks. Flexibility with working hours. Must be willing to work 6 days a week.',
      benefits: 'Competitive salary (850-950 RS). Accommodation provided. Meals included. Weekly off day. Health insurance coverage. Friendly and supportive work environment.',
      image_url: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=500&h=300&fit=crop',
      status: 'active'
    };

    // Insert into database
    const result = await sql`
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
        ${jobData.title},
        ${jobData.description},
        ${jobData.department},
        ${jobData.location},
        ${jobData.salary_range},
        ${jobData.job_type},
        ${jobData.requirements},
        ${jobData.benefits},
        ${jobData.image_url},
        ${jobData.status},
        ${new Date()},
        ${new Date()}
      )
      RETURNING *;
    `;

    console.log('✅ House Help job successfully added!\n');
    console.log('Job Details:');
    console.log('─'.repeat(60));
    console.log(`ID:          ${result[0].id}`);
    console.log(`Title:       ${result[0].title}`);
    console.log(`Department:  ${result[0].department}`);
    console.log(`Location:    ${result[0].location}`);
    console.log(`Salary:      ${result[0].salary_range}`);
    console.log(`Type:        ${result[0].job_type}`);
    console.log(`Status:      ${result[0].status}`);
    console.log(`Created:     ${result[0].created_at}`);
    console.log('─'.repeat(60));
    console.log('\n✨ Done!\n');

  } catch (error) {
    console.error('\n❌ Error adding House Help job:', error.message);
    process.exit(1);
  } finally {
    await sql.end();
  }
}

addHouseHelpJob();
