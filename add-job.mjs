#!/usr/bin/env node

import postgres from 'postgres';
import readline from 'readline';
import dotenv from 'dotenv';

dotenv.config();

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('❌ ERROR: DATABASE_URL environment variable is not set');
  process.exit(1);
}

const sql = postgres(DATABASE_URL);

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Helper function to ask questions
function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, (answer) => {
      resolve(answer);
    });
  });
}

async function addJobOpening() {
  try {
    console.log('\n📋 Add New Job Opening to Database');
    console.log('═'.repeat(50));
    console.log('Leave any field empty to skip it (except title)\n');

    // Collect job details from user
    let title = '';
    while (!title) {
      title = await question('Job Title (required): ');
      if (!title) {
        console.log('⚠️  Title is required!');
      }
    }

    const description = await question('Description: ');
    const department = await question('Department: ');
    const location = await question('Location: ');
    const salary_range = await question('Salary Range (e.g., 850-950 RS): ');
    const job_type = await question('Job Type (Full-time/Part-time/Contract): ');
    const requirements = await question('Requirements: ');
    const benefits = await question('Benefits: ');
    const image_url = await question('Image URL (optional): ');
    const status = await question('Status (active/inactive) [default: active]: ') || 'active';

    // Validate status
    if (!['active', 'inactive'].includes(status)) {
      console.log('⚠️  Invalid status. Using "active" as default.');
    }

    // Display summary
    console.log('\n📝 Job Opening Summary:');
    console.log('─'.repeat(50));
    console.log(`Title:       ${title}`);
    console.log(`Department:  ${department || '(not specified)'}`);
    console.log(`Location:    ${location || '(not specified)'}`);
    console.log(`Salary:      ${salary_range || '(not specified)'}`);
    console.log(`Type:        ${job_type || '(not specified)'}`);
    console.log(`Status:      ${status}`);
    console.log('─'.repeat(50));

    const confirm = await question('\n✅ Add this job opening? (yes/no): ');

    if (confirm.toLowerCase() !== 'yes' && confirm.toLowerCase() !== 'y') {
      console.log('❌ Job opening not added.');
      rl.close();
      await sql.end();
      return;
    }

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
        ${title},
        ${description || null},
        ${department || null},
        ${location || null},
        ${salary_range || null},
        ${job_type || null},
        ${requirements || null},
        ${benefits || null},
        ${image_url || null},
        ${status},
        ${new Date()},
        ${new Date()}
      )
      RETURNING *;
    `;

    console.log('\n✅ Job opening successfully added!\n');
    console.log('Job Details:');
    console.log('─'.repeat(50));
    console.log(`ID:          ${result[0].id}`);
    console.log(`Title:       ${result[0].title}`);
    console.log(`Department:  ${result[0].department}`);
    console.log(`Location:    ${result[0].location}`);
    console.log(`Salary:      ${result[0].salary_range}`);
    console.log(`Type:        ${result[0].job_type}`);
    console.log(`Status:      ${result[0].status}`);
    console.log(`Created:     ${result[0].created_at}`);
    console.log('─'.repeat(50));
    console.log('\n✨ Done!\n');

  } catch (error) {
    console.error('\n❌ Error adding job opening:', error.message);
    process.exit(1);
  } finally {
    rl.close();
    await sql.end();
  }
}

addJobOpening();
