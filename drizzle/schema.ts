import { integer, pgEnum, pgTable, text, timestamp, varchar, unique } from "drizzle-orm/pg-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */

// Define enums for PostgreSQL
export const roleEnum = pgEnum("role", ["user", "admin"]);
export const contactStatusEnum = pgEnum("contact_status", ["new", "reviewed", "replied", "archived"]);
export const jobTypeEnum = pgEnum("job_type", ["full-time", "part-time", "contract", "remote"]);
export const jobStatusEnum = pgEnum("job_status", ["active", "archived"]);
export const serviceCategoryEnum = pgEnum("service_category", ["social-media", "seo", "content", "other"]);
export const serviceStatusEnum = pgEnum("service_status", ["active", "archived"]);
export const blogCategoryEnum = pgEnum("blog_category", ["organization", "hr-sourcing", "marketing", "partnerships"]);
export const blogStatusEnum = pgEnum("blog_status", ["draft", "published", "archived"]);
export const partnerTypeEnum = pgEnum("partner_type", ["corporate", "startup", "agency", "other"]);
export const partnerStatusEnum = pgEnum("partner_status", ["active", "inactive"]);
export const gallerySectionEnum = pgEnum("gallery_section", ["hero", "services", "team", "partners", "testimonials", "other"]);
export const applicationStatusEnum = pgEnum("application_status", ["pending", "reviewed", "accepted", "rejected"]);

export const users = pgTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  /** Google OAuth identifier (sub) returned from the OAuth callback. Unique per user. */
  googleId: varchar("google_id", { length: 255 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }).unique(),
  picture: text("picture"),
  loginMethod: varchar("login_method", { length: 64 }).default("google"),
  role: roleEnum("role").default("user").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  lastSignedIn: timestamp("last_signed_in").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Contact form submissions for Localhost Limited
 * Stores all contact form submissions with metadata for follow-up and analytics
 */
export const contactSubmissions = pgTable("contact_submissions", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  message: text("message").notNull(),
  status: contactStatusEnum("status").default("new").notNull(),
  submittedAt: timestamp("submitted_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type ContactSubmission = typeof contactSubmissions.$inferSelect;
export type InsertContactSubmission = typeof contactSubmissions.$inferInsert;

/**
 * Job Openings for HR Sourcing section
 * Stores all active and archived job postings
 */
export const jobOpenings = pgTable("job_openings", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  department: varchar("department", { length: 100 }).notNull(),
  location: varchar("location", { length: 100 }).notNull(),
  salaryRange: varchar("salary_range", { length: 100 }),
  jobType: jobTypeEnum("job_type").notNull(),
  requirements: text("requirements"),
  benefits: text("benefits"),
  imageUrl: text("image_url"),
  status: jobStatusEnum("status").default("active").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type JobOpening = typeof jobOpenings.$inferSelect;
export type InsertJobOpening = typeof jobOpenings.$inferInsert;

/**
 * Marketing Services
 * Stores marketing service offerings with descriptions and benefits
 */
export const marketingServices = pgTable("marketing_services", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  category: serviceCategoryEnum("category").notNull(),
  benefits: text("benefits"),
  imageUrl: text("image_url"),
  price: varchar("price", { length: 100 }),
  status: serviceStatusEnum("status").default("active").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type MarketingService = typeof marketingServices.$inferSelect;
export type InsertMarketingService = typeof marketingServices.$inferInsert;

/**
 * Blog Posts
 * Stores blog articles for all three business sections
 */
export const blogPosts = pgTable("blog_posts", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  content: text("content").notNull(),
  excerpt: text("excerpt"),
  category: blogCategoryEnum("category").notNull(),
  imageUrl: text("image_url"),
  author: varchar("author", { length: 100 }).notNull(),
  status: blogStatusEnum("status").default("draft").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  publishedAt: timestamp("published_at"),
});

export type BlogPost = typeof blogPosts.$inferSelect;
export type InsertBlogPost = typeof blogPosts.$inferInsert;

/**
 * Organization Partners
 * Stores information about partner organizations
 */
export const organizationPartners = pgTable("organization_partners", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  partnerType: partnerTypeEnum("partner_type").notNull(),
  website: varchar("website", { length: 255 }),
  logoUrl: text("logo_url"),
  benefits: text("benefits"),
  status: partnerStatusEnum("status").default("active").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type OrganizationPartner = typeof organizationPartners.$inferSelect;
export type InsertOrganizationPartner = typeof organizationPartners.$inferInsert;

/**
 * Gallery Images
 * Stores images for various sections of the website
 */
export const galleryImages = pgTable("gallery_images", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  title: varchar("title", { length: 255 }).notNull(),
  imageUrl: text("image_url").notNull(),
  section: gallerySectionEnum("section").notNull(),
  altText: varchar("alt_text", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type GalleryImage = typeof galleryImages.$inferSelect;
export type InsertGalleryImage = typeof galleryImages.$inferInsert;

/**
 * Job Applications
 * Stores all job applications submitted by candidates
 */
export const jobApplications = pgTable("job_applications", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  jobId: integer("job_id").notNull(),
  fullName: varchar("full_name", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  phone: varchar("phone", { length: 20 }).notNull(),
  cvUrl: text("cv_url").notNull(),
  coverLetter: text("cover_letter"),
  status: applicationStatusEnum("status").default("pending").notNull(),
  appliedAt: timestamp("applied_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  uniqueApplication: unique("unique_job_email").on(table.jobId, table.email),
}));

export type JobApplication = typeof jobApplications.$inferSelect;
export type InsertJobApplication = typeof jobApplications.$inferInsert;

/**
 * Application Status Audit Log
 * Tracks changes to application status for HR review purposes
 */
export const applicationStatusLog = pgTable("application_status_log", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  applicationId: integer("application_id").notNull(),
  previousStatus: applicationStatusEnum("previous_status").notNull(),
  newStatus: applicationStatusEnum("new_status").notNull(),
  changedBy: varchar("changed_by", { length: 255 }),
  notes: text("notes"),
  changedAt: timestamp("changed_at").defaultNow().notNull(),
});

export type ApplicationStatusLog = typeof applicationStatusLog.$inferSelect;
export type InsertApplicationStatusLog = typeof applicationStatusLog.$inferInsert;

// TODO: Add additional tables as needed
