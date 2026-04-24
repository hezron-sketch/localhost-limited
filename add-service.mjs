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

async function addService() {
  try {
    console.log('\n🎯 Add New Marketing Service to Database');
    console.log('═'.repeat(50));
    console.log('Leave any field empty to skip it (except title)\n');

    // Collect service details from user
    let title = '';
    while (!title) {
      title = await question('Service Title (required): ');
      if (!title) {
        console.log('⚠️  Title is required!');
      }
    }

    let description = '';
    while (!description) {
      description = await question('Description (required): ');
      if (!description) {
        console.log('⚠️  Description is required!');
      }
    }

    // Show available categories
    console.log('\n📁 Available Categories:');
    console.log('  1. social-media');
    console.log('  2. seo');
    console.log('  3. content');
    console.log('  4. other');

    let category = '';
    const validCategories = ['social-media', 'seo', 'content', 'other'];
    while (!category || !validCategories.includes(category)) {
      const categoryInput = await question('\nSelect category (1-4 or type name): ');
      if (categoryInput === '1') category = 'social-media';
      else if (categoryInput === '2') category = 'seo';
      else if (categoryInput === '3') category = 'content';
      else if (categoryInput === '4') category = 'other';
      else if (validCategories.includes(categoryInput)) category = categoryInput;
      else console.log('⚠️  Invalid category. Please select 1-4 or type a valid category name.');
    }

    const benefits = await question('Benefits (comma-separated): ');
    const price = await question('Price (e.g., $500/month, $1000-2000): ');
    const imageUrl = await question('Image URL (optional): ');
    const status = await question('Status (active/archived) [default: active]: ') || 'active';

    // Validate status
    if (!['active', 'archived'].includes(status)) {
      console.log('⚠️  Invalid status. Using "active" as default.');
    }

    // Display summary
    console.log('\n📝 Service Summary:');
    console.log('─'.repeat(50));
    console.log(`Title:       ${title}`);
    console.log(`Category:    ${category}`);
    console.log(`Description: ${description.substring(0, 50)}${description.length > 50 ? '...' : ''}`);
    console.log(`Benefits:    ${benefits || '(not specified)'}`);
    console.log(`Price:       ${price || '(not specified)'}`);
    console.log(`Status:      ${status}`);
    console.log('─'.repeat(50));

    const confirm = await question('\n✅ Add this service? (yes/no): ');

    if (confirm.toLowerCase() !== 'yes' && confirm.toLowerCase() !== 'y') {
      console.log('❌ Service not added.');
      rl.close();
      await sql.end();
      return;
    }

    // Insert into database
    const result = await sql`
      INSERT INTO "marketing_services" (
        "title",
        "description",
        "category",
        "benefits",
        "price",
        "image_url",
        "status",
        "created_at",
        "updated_at"
      ) VALUES (
        ${title},
        ${description},
        ${category},
        ${benefits || null},
        ${price || null},
        ${imageUrl || null},
        ${status},
        ${new Date()},
        ${new Date()}
      )
      RETURNING *;
    `;

    console.log('\n✅ Service successfully added!\n');
    console.log('Service Details:');
    console.log('─'.repeat(50));
    console.log(`ID:          ${result[0].id}`);
    console.log(`Title:       ${result[0].title}`);
    console.log(`Category:    ${result[0].category}`);
    console.log(`Price:       ${result[0].price || '(not specified)'}`);
    console.log(`Status:      ${result[0].status}`);
    console.log(`Created:     ${result[0].created_at}`);
    console.log('─'.repeat(50));
    console.log('\n✨ Done!\n');

  } catch (error) {
    console.error('\n❌ Error adding service:', error.message);
    process.exit(1);
  } finally {
    rl.close();
    await sql.end();
  }
}

addService();
