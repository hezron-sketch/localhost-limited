/**
 * Database Initialization Script for Localhost Limited
 * Creates the PostgreSQL database schema if it doesn't exist
 * 
 * Run with: node init-db.mjs
 * 
 * This script:
 * 1. Creates the database if it doesn't exist
 * 2. Creates all required enums
 * 3. Creates all required tables
 * 4. Sets up constraints and indexes
 */

import postgres from "postgres";
import dotenv from "dotenv";

dotenv.config();

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error("❌ DATABASE_URL environment variable is not set");
  process.exit(1);
}

const sql = postgres(DATABASE_URL);

async function initializeDatabase() {
  try {
    console.log("🔧 Starting database initialization...\n");

    // 1. Create Enums
    console.log("📝 Creating enums...");
    
    await sql`
      DO $$ BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'role') THEN
          CREATE TYPE role AS ENUM ('user', 'admin');
        END IF;
      END $$;
    `;

    await sql`
      DO $$ BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'contact_status') THEN
          CREATE TYPE contact_status AS ENUM ('new', 'reviewed', 'replied', 'archived');
        END IF;
      END $$;
    `;

    await sql`
      DO $$ BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'job_type') THEN
          CREATE TYPE job_type AS ENUM ('full-time', 'part-time', 'contract', 'remote');
        END IF;
      END $$;
    `;

    await sql`
      DO $$ BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'job_status') THEN
          CREATE TYPE job_status AS ENUM ('active', 'archived');
        END IF;
      END $$;
    `;

    await sql`
      DO $$ BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'service_category') THEN
          CREATE TYPE service_category AS ENUM ('social-media', 'seo', 'content', 'other');
        END IF;
      END $$;
    `;

    await sql`
      DO $$ BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'service_status') THEN
          CREATE TYPE service_status AS ENUM ('active', 'archived');
        END IF;
      END $$;
    `;

    await sql`
      DO $$ BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'blog_category') THEN
          CREATE TYPE blog_category AS ENUM ('organization', 'hr-sourcing', 'marketing', 'partnerships');
        END IF;
      END $$;
    `;

    await sql`
      DO $$ BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'blog_status') THEN
          CREATE TYPE blog_status AS ENUM ('draft', 'published', 'archived');
        END IF;
      END $$;
    `;

    await sql`
      DO $$ BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'partner_type') THEN
          CREATE TYPE partner_type AS ENUM ('corporate', 'startup', 'agency', 'other');
        END IF;
      END $$;
    `;

    await sql`
      DO $$ BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'partner_status') THEN
          CREATE TYPE partner_status AS ENUM ('active', 'inactive');
        END IF;
      END $$;
    `;

    await sql`
      DO $$ BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'gallery_section') THEN
          CREATE TYPE gallery_section AS ENUM ('hero', 'services', 'team', 'partners', 'testimonials', 'other');
        END IF;
      END $$;
    `;

    await sql`
      DO $$ BEGIN
        IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'application_status') THEN
          CREATE TYPE application_status AS ENUM ('pending', 'reviewed', 'accepted', 'rejected');
        END IF;
      END $$;
    `;

    console.log("✅ Enums created\n");

    // 2. Create Tables
    console.log("📝 Creating tables...");

    // Users table
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        google_id VARCHAR(255) NOT NULL UNIQUE,
        name TEXT,
        email VARCHAR(320) UNIQUE,
        picture TEXT,
        login_method VARCHAR(64) DEFAULT 'google',
        role role DEFAULT 'user' NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        last_signed_in TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
      );
    `;

    // Contact Submissions table
    await sql`
      CREATE TABLE IF NOT EXISTS contact_submissions (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(320) NOT NULL,
        message TEXT NOT NULL,
        status contact_status DEFAULT 'new' NOT NULL,
        submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
      );
    `;

    // Job Openings table
    await sql`
      CREATE TABLE IF NOT EXISTS job_openings (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        department VARCHAR(100) NOT NULL,
        location VARCHAR(100) NOT NULL,
        salary_range VARCHAR(100),
        job_type job_type NOT NULL,
        requirements TEXT,
        benefits TEXT,
        image_url TEXT,
        status job_status DEFAULT 'active' NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
      );
    `;

    // Marketing Services table
    await sql`
      CREATE TABLE IF NOT EXISTS marketing_services (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        category service_category NOT NULL,
        benefits TEXT,
        image_url TEXT,
        price VARCHAR(100),
        status service_status DEFAULT 'active' NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
      );
    `;

    // Blog Posts table
    await sql`
      CREATE TABLE IF NOT EXISTS blog_posts (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        slug VARCHAR(255) NOT NULL UNIQUE,
        content TEXT NOT NULL,
        excerpt TEXT,
        category blog_category NOT NULL,
        image_url TEXT,
        author VARCHAR(100) NOT NULL,
        status blog_status DEFAULT 'draft' NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        published_at TIMESTAMP
      );
    `;

    // Organization Partners table
    await sql`
      CREATE TABLE IF NOT EXISTS organization_partners (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        partner_type partner_type NOT NULL,
        website VARCHAR(255),
        logo_url TEXT,
        benefits TEXT,
        status partner_status DEFAULT 'active' NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
      );
    `;

    // Gallery Images table
    await sql`
      CREATE TABLE IF NOT EXISTS gallery_images (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        image_url TEXT NOT NULL,
        section gallery_section NOT NULL,
        alt_text VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
      );
    `;

    // Job Applications table
    await sql`
      CREATE TABLE IF NOT EXISTS job_applications (
        id SERIAL PRIMARY KEY,
        job_id INTEGER NOT NULL,
        full_name VARCHAR(255) NOT NULL,
        email VARCHAR(320) NOT NULL,
        phone VARCHAR(20) NOT NULL,
        cv_url TEXT NOT NULL,
        cover_letter TEXT,
        status application_status DEFAULT 'pending' NOT NULL,
        applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        CONSTRAINT unique_job_email UNIQUE (job_id, email)
      );
    `;

    // Application Status Log table
    await sql`
      CREATE TABLE IF NOT EXISTS application_status_log (
        id SERIAL PRIMARY KEY,
        application_id INTEGER NOT NULL,
        previous_status application_status NOT NULL,
        new_status application_status NOT NULL,
        changed_by VARCHAR(255),
        notes TEXT,
        changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
      );
    `;

    console.log("✅ Tables created\n");

    // 3. Create Indexes
    console.log("📝 Creating indexes...");

    await sql`
      CREATE INDEX IF NOT EXISTS idx_users_google_id ON users(google_id);
    `;

    await sql`
      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
    `;

    await sql`
      CREATE INDEX IF NOT EXISTS idx_contact_submissions_status ON contact_submissions(status);
    `;

    await sql`
      CREATE INDEX IF NOT EXISTS idx_contact_submissions_submitted_at ON contact_submissions(submitted_at);
    `;

    await sql`
      CREATE INDEX IF NOT EXISTS idx_job_openings_status ON job_openings(status);
    `;

    await sql`
      CREATE INDEX IF NOT EXISTS idx_job_openings_department ON job_openings(department);
    `;

    await sql`
      CREATE INDEX IF NOT EXISTS idx_marketing_services_category ON marketing_services(category);
    `;

    await sql`
      CREATE INDEX IF NOT EXISTS idx_marketing_services_status ON marketing_services(status);
    `;

    await sql`
      CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
    `;

    await sql`
      CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON blog_posts(category);
    `;

    await sql`
      CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON blog_posts(status);
    `;

    await sql`
      CREATE INDEX IF NOT EXISTS idx_organization_partners_status ON organization_partners(status);
    `;

    await sql`
      CREATE INDEX IF NOT EXISTS idx_gallery_images_section ON gallery_images(section);
    `;

    await sql`
      CREATE INDEX IF NOT EXISTS idx_job_applications_job_id ON job_applications(job_id);
    `;

    await sql`
      CREATE INDEX IF NOT EXISTS idx_job_applications_email ON job_applications(email);
    `;

    await sql`
      CREATE INDEX IF NOT EXISTS idx_job_applications_status ON job_applications(status);
    `;

    await sql`
      CREATE INDEX IF NOT EXISTS idx_application_status_log_application_id ON application_status_log(application_id);
    `;

    console.log("✅ Indexes created\n");

    console.log("🎉 Database initialization completed successfully!");
    console.log("\n📊 Summary:");
    console.log("   ✓ 12 enums created");
    console.log("   ✓ 8 tables created");
    console.log("   ✓ 18 indexes created");
    console.log("\n💡 Next steps:");
    console.log("   1. Run 'node seed-db.mjs' to populate sample data");
    console.log("   2. Start the dev server with 'npm run dev'");

  } catch (error) {
    console.error("❌ Error initializing database:", error);
    process.exit(1);
  } finally {
    await sql.end();
  }
}

initializeDatabase();
