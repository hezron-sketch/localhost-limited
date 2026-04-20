/**
 * Database Seeding Script for Localhost Limited
 * Run with: node seed-db.mjs
 * 
 * This script populates the PostgreSQL database with sample data for:
 * - Job Openings
 * - Marketing Services
 * - Blog Posts
 * - Organization Partners
 * - Gallery Images
 * - Sample Admin User
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

async function seedDatabase() {
  try {
    console.log("🌱 Starting database seeding...\n");

    // 1. Seed Admin User
    console.log("📝 Seeding admin user...");
    await sql`
      INSERT INTO users (google_id, name, email, picture, login_method, role)
      VALUES (
        'admin-user-001',
        'Admin User',
        'admin@localhostlimited.com',
        'https://via.placeholder.com/150',
        'google',
        'admin'
      )
      ON CONFLICT (google_id) DO NOTHING;
    `;
    console.log("✅ Admin user seeded\n");

    // 2. Seed Job Openings
    console.log("📝 Seeding job openings...");
    const jobOpenings = [
      {
        title: "Senior Marketing Manager",
        description: "Lead our marketing team and drive brand growth across East Africa",
        department: "Marketing",
        location: "Dar es Salaam, Tanzania",
        salaryRange: "$3,000 - $5,000",
        jobType: "full-time",
        requirements: "5+ years marketing experience, proven track record in digital marketing",
        benefits: "Health insurance, flexible hours, professional development",
        imageUrl: "https://via.placeholder.com/400x300?text=Marketing+Manager",
        status: "active",
      },
      {
        title: "HR Recruitment Specialist",
        description: "Source and recruit top talent for our clients across the region",
        department: "HR",
        location: "Nairobi, Kenya",
        salaryRange: "$2,500 - $4,000",
        jobType: "full-time",
        requirements: "3+ years recruitment experience, knowledge of East African market",
        benefits: "Competitive salary, commission structure, team bonding",
        imageUrl: "https://via.placeholder.com/400x300?text=HR+Specialist",
        status: "active",
      },
      {
        title: "Business Development Executive",
        description: "Build strategic partnerships and expand our client base",
        department: "Business Development",
        location: "Remote",
        salaryRange: "$2,000 - $3,500",
        jobType: "remote",
        requirements: "2+ years B2B sales experience, excellent communication skills",
        benefits: "Remote work, performance bonuses, career growth",
        imageUrl: "https://via.placeholder.com/400x300?text=BD+Executive",
        status: "active",
      },
    ];

    for (const job of jobOpenings) {
      await sql`
        INSERT INTO job_openings (
          title, description, department, location, salary_range,
          job_type, requirements, benefits, image_url, status
        ) VALUES (
          ${job.title}, ${job.description}, ${job.department}, ${job.location},
          ${job.salaryRange}, ${job.jobType}, ${job.requirements}, ${job.benefits},
          ${job.imageUrl}, ${job.status}
        )
        ON CONFLICT DO NOTHING;
      `;
    }
    console.log(`✅ ${jobOpenings.length} job openings seeded\n`);

    // 3. Seed Marketing Services
    console.log("📝 Seeding marketing services...");
    const services = [
      {
        title: "Social Media Management",
        description: "Comprehensive social media strategy and content management across all platforms",
        category: "social-media",
        benefits: "Increased engagement, brand awareness, customer loyalty",
        imageUrl: "https://via.placeholder.com/400x300?text=Social+Media",
        price: "Custom Quote",
        status: "active",
      },
      {
        title: "SEO Optimization",
        description: "Improve your search engine rankings and organic traffic",
        category: "seo",
        benefits: "Higher visibility, qualified leads, sustainable growth",
        imageUrl: "https://via.placeholder.com/400x300?text=SEO",
        price: "Custom Quote",
        status: "active",
      },
      {
        title: "Content Marketing",
        description: "Create compelling content that drives engagement and conversions",
        category: "content",
        benefits: "Thought leadership, audience engagement, brand authority",
        imageUrl: "https://via.placeholder.com/400x300?text=Content",
        price: "Custom Quote",
        status: "active",
      },
      {
        title: "Digital Campaign Management",
        description: "End-to-end management of digital marketing campaigns",
        category: "other",
        benefits: "Measurable ROI, targeted reach, data-driven decisions",
        imageUrl: "https://via.placeholder.com/400x300?text=Campaigns",
        price: "Custom Quote",
        status: "active",
      },
    ];

    for (const service of services) {
      await sql`
        INSERT INTO marketing_services (
          title, description, category, benefits, image_url, price, status
        ) VALUES (
          ${service.title}, ${service.description}, ${service.category},
          ${service.benefits}, ${service.imageUrl}, ${service.price}, ${service.status}
        )
        ON CONFLICT DO NOTHING;
      `;
    }
    console.log(`✅ ${services.length} marketing services seeded\n`);

    // 4. Seed Blog Posts
    console.log("📝 Seeding blog posts...");
    const blogPosts = [
      {
        title: "The Future of Digital Marketing in East Africa",
        slug: "future-digital-marketing-east-africa",
        content: "Digital marketing is rapidly evolving in East Africa. Learn about the latest trends and strategies...",
        excerpt: "Explore emerging digital marketing trends in the East African market",
        category: "marketing",
        imageUrl: "https://via.placeholder.com/400x300?text=Digital+Marketing",
        author: "Localhost Limited",
        status: "published",
      },
      {
        title: "Building Effective HR Sourcing Strategies",
        slug: "effective-hr-sourcing-strategies",
        content: "Discover proven methods for sourcing top talent in competitive markets...",
        excerpt: "Best practices for talent acquisition and HR sourcing",
        category: "hr-sourcing",
        imageUrl: "https://via.placeholder.com/400x300?text=HR+Sourcing",
        author: "Localhost Limited",
        status: "published",
      },
      {
        title: "Strategic Partnerships: Growing Together",
        slug: "strategic-partnerships-growing-together",
        content: "Learn how strategic partnerships can accelerate your business growth...",
        excerpt: "Why partnerships matter for sustainable business growth",
        category: "partnerships",
        imageUrl: "https://via.placeholder.com/400x300?text=Partnerships",
        author: "Localhost Limited",
        status: "published",
      },
      {
        title: "Organizational Excellence in 2024",
        slug: "organizational-excellence-2024",
        content: "Building organizations that thrive in the modern business environment...",
        excerpt: "Key principles for organizational success",
        category: "organization",
        imageUrl: "https://via.placeholder.com/400x300?text=Organization",
        author: "Localhost Limited",
        status: "published",
      },
    ];

    for (const post of blogPosts) {
      await sql`
        INSERT INTO blog_posts (
          title, slug, content, excerpt, category, image_url, author, status, published_at
        ) VALUES (
          ${post.title}, ${post.slug}, ${post.content}, ${post.excerpt},
          ${post.category}, ${post.imageUrl}, ${post.author}, ${post.status},
          NOW()
        )
        ON CONFLICT (slug) DO NOTHING;
      `;
    }
    console.log(`✅ ${blogPosts.length} blog posts seeded\n`);

    // 5. Seed Organization Partners
    console.log("📝 Seeding organization partners...");
    const partners = [
      {
        name: "TechVentures Africa",
        description: "Leading tech innovation hub in East Africa",
        partnerType: "startup",
        website: "https://techventures.africa",
        logoUrl: "https://via.placeholder.com/200x100?text=TechVentures",
        benefits: "Co-marketing opportunities, technology partnerships",
        status: "active",
      },
      {
        name: "East Africa Business Council",
        description: "Premier business organization in the region",
        partnerType: "corporate",
        website: "https://eabc.org",
        logoUrl: "https://via.placeholder.com/200x100?text=EABC",
        benefits: "Networking, business development, market insights",
        status: "active",
      },
      {
        name: "Digital Marketing Agency Network",
        description: "Collaborative network of digital agencies",
        partnerType: "agency",
        website: "https://dman.org",
        logoUrl: "https://via.placeholder.com/200x100?text=DMAN",
        benefits: "Referral partnerships, joint projects",
        status: "active",
      },
    ];

    for (const partner of partners) {
      await sql`
        INSERT INTO organization_partners (
          name, description, partner_type, website, logo_url, benefits, status
        ) VALUES (
          ${partner.name}, ${partner.description}, ${partner.partnerType},
          ${partner.website}, ${partner.logoUrl}, ${partner.benefits}, ${partner.status}
        )
        ON CONFLICT DO NOTHING;
      `;
    }
    console.log(`✅ ${partners.length} organization partners seeded\n`);

    // 6. Seed Gallery Images
    console.log("📝 Seeding gallery images...");
    const galleryImages = [
      {
        title: "Hero Banner",
        imageUrl: "https://via.placeholder.com/1200x600?text=Hero+Banner",
        section: "hero",
        altText: "Localhost Limited hero banner",
      },
      {
        title: "Marketing Services",
        imageUrl: "https://via.placeholder.com/400x300?text=Services",
        section: "services",
        altText: "Marketing services showcase",
      },
      {
        title: "Team Photo",
        imageUrl: "https://via.placeholder.com/400x300?text=Team",
        section: "team",
        altText: "Localhost Limited team",
      },
      {
        title: "Partner Logos",
        imageUrl: "https://via.placeholder.com/400x300?text=Partners",
        section: "partners",
        altText: "Our partners",
      },
      {
        title: "Client Testimonials",
        imageUrl: "https://via.placeholder.com/400x300?text=Testimonials",
        section: "testimonials",
        altText: "Client testimonials",
      },
    ];

    for (const image of galleryImages) {
      await sql`
        INSERT INTO gallery_images (
          title, image_url, section, alt_text
        ) VALUES (
          ${image.title}, ${image.imageUrl}, ${image.section}, ${image.altText}
        )
        ON CONFLICT DO NOTHING;
      `;
    }
    console.log(`✅ ${galleryImages.length} gallery images seeded\n`);

    console.log("🎉 Database seeding completed successfully!");
    console.log("\n📊 Summary:");
    console.log(`   ✓ Admin user created`);
    console.log(`   ✓ ${jobOpenings.length} job openings added`);
    console.log(`   ✓ ${services.length} marketing services added`);
    console.log(`   ✓ ${blogPosts.length} blog posts added`);
    console.log(`   ✓ ${partners.length} organization partners added`);
    console.log(`   ✓ ${galleryImages.length} gallery images added`);

  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  } finally {
    await sql.end();
  }
}

seedDatabase();
