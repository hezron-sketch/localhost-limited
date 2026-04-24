import postgres from 'postgres';
import dotenv from 'dotenv';

dotenv.config();

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('ERROR: DATABASE_URL environment variable is not set');
  process.exit(1);
}

const sql = postgres(DATABASE_URL);

async function seedHouseHelpJob() {
  try {
    console.log('🌱 Seeding House Help job position...\n');

    // Insert the House Help job
    const result = await sql`
      INSERT INTO jobs (
        title,
        description,
        department,
        salary_range,
        job_type,
        location,
        requirements,
        benefits,
        image_url,
        status,
        created_at,
        updated_at
      ) VALUES (
        ${'House Help'},
        ${'We are looking for a reliable and hardworking House Help to join our household in Riyadh. The ideal candidate will be responsible for maintaining cleanliness, organizing household items, preparing meals, and providing general household assistance. Must be trustworthy, punctual, and able to work independently. Experience in household management is preferred.'},
        ${'Domestic Services'},
        ${'850-950 RS'},
        ${'Full-time'},
        ${'Riyadh, Saudi Arabia'},
        ${'- Minimum 2 years of household management experience\n- Excellent cleaning and organizational skills\n- Ability to prepare basic meals\n- Strong communication skills\n- Trustworthy and reliable\n- Physical ability to perform household tasks\n- Flexibility with working hours\n- Must be willing to work 6 days a week'},
        ${'- Competitive salary (850-950 RS)\n- Accommodation provided\n- Meals included\n- Weekly off day\n- Health insurance coverage\n- Friendly and supportive work environment'},
        ${'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=500&h=300&fit=crop'},
        ${'active'},
        ${new Date()},
        ${new Date()}
      )
      RETURNING *;
    `;

    console.log('✅ House Help job successfully added to database!\n');
    console.log('Job Details:');
    console.log('─'.repeat(50));
    console.log(`Title: ${result[0].title}`);
    console.log(`Department: ${result[0].department}`);
    console.log(`Salary Range: ${result[0].salary_range}`);
    console.log(`Job Type: ${result[0].job_type}`);
    console.log(`Location: ${result[0].location}`);
    console.log(`Status: ${result[0].status}`);
    console.log(`ID: ${result[0].id}`);
    console.log('─'.repeat(50));
    console.log('\n✨ Job seeding complete!');

  } catch (error) {
    console.error('❌ Error seeding job:', error.message);
    process.exit(1);
  } finally {
    await sql.end();
  }
}

seedHouseHelpJob();
