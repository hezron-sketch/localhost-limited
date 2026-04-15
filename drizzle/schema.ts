import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, unique } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Contact form submissions for Localhost Limited
 * Stores all contact form submissions with metadata for follow-up and analytics
 */
export const contactSubmissions = mysqlTable("contactSubmissions", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  message: text("message").notNull(),
  status: mysqlEnum("status", ["new", "reviewed", "replied", "archived"]).default("new").notNull(),
  submittedAt: timestamp("submittedAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ContactSubmission = typeof contactSubmissions.$inferSelect;
export type InsertContactSubmission = typeof contactSubmissions.$inferInsert;

/**
 * Job Openings for HR Sourcing section
 * Stores all active and archived job postings
 */
export const jobOpenings = mysqlTable("jobOpenings", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  department: varchar("department", { length: 100 }).notNull(),
  location: varchar("location", { length: 100 }).notNull(),
  salaryRange: varchar("salaryRange", { length: 100 }),
  jobType: mysqlEnum("jobType", ["full-time", "part-time", "contract", "remote"]).notNull(),
  requirements: text("requirements"),
  benefits: text("benefits"),
  imageUrl: text("imageUrl"),
  status: mysqlEnum("status", ["active", "archived"]).default("active").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type JobOpening = typeof jobOpenings.$inferSelect;
export type InsertJobOpening = typeof jobOpenings.$inferInsert;

/**
 * Marketing Services
 * Stores marketing service offerings with descriptions and benefits
 */
export const marketingServices = mysqlTable("marketingServices", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  category: mysqlEnum("category", ["social-media", "seo", "content", "other"]).notNull(),
  benefits: text("benefits"),
  imageUrl: text("imageUrl"),
  price: varchar("price", { length: 100 }),
  status: mysqlEnum("status", ["active", "archived"]).default("active").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type MarketingService = typeof marketingServices.$inferSelect;
export type InsertMarketingService = typeof marketingServices.$inferInsert;

/**
 * Blog Posts
 * Stores blog articles for all three business sections
 */
export const blogPosts = mysqlTable("blogPosts", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  content: text("content").notNull(),
  excerpt: text("excerpt"),
  category: mysqlEnum("category", ["organization", "hr-sourcing", "marketing", "partnerships"]).notNull(),
  imageUrl: text("imageUrl"),
  author: varchar("author", { length: 100 }).notNull(),
  status: mysqlEnum("status", ["draft", "published", "archived"]).default("draft").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  publishedAt: timestamp("publishedAt"),
});

export type BlogPost = typeof blogPosts.$inferSelect;
export type InsertBlogPost = typeof blogPosts.$inferInsert;

/**
 * Organization Partners
 * Stores information about partner organizations
 */
export const organizationPartners = mysqlTable("organizationPartners", {
  id: int("id").autoincrement().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  partnerType: mysqlEnum("partnerType", ["corporate", "startup", "agency", "other"]).notNull(),
  website: varchar("website", { length: 255 }),
  logoUrl: text("logoUrl"),
  benefits: text("benefits"),
  status: mysqlEnum("status", ["active", "inactive"]).default("active").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type OrganizationPartner = typeof organizationPartners.$inferSelect;
export type InsertOrganizationPartner = typeof organizationPartners.$inferInsert;

/**
 * Gallery Images
 * Stores images for various sections of the website
 */
export const galleryImages = mysqlTable("galleryImages", {
  id: int("id").autoincrement().primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  imageUrl: text("imageUrl").notNull(),
  section: mysqlEnum("section", ["hero", "services", "team", "partners", "testimonials", "other"]).notNull(),
  altText: varchar("altText", { length: 255 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type GalleryImage = typeof galleryImages.$inferSelect;
export type InsertGalleryImage = typeof galleryImages.$inferInsert;

/**
 * Job Applications
 * Stores all job applications submitted by candidates
 */
export const jobApplications = mysqlTable("jobApplications", {
  id: int("id").autoincrement().primaryKey(),
  jobId: int("jobId").notNull(),
  fullName: varchar("fullName", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  phone: varchar("phone", { length: 20 }).notNull(),
  cvUrl: text("cvUrl").notNull(),
  coverLetter: text("coverLetter"),
  status: mysqlEnum("status", ["pending", "reviewed", "accepted", "rejected"]).default("pending").notNull(),
  appliedAt: timestamp("appliedAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
}, (table) => ({
  uniqueApplication: unique("unique_job_email").on(table.jobId, table.email),
}));

export type JobApplication = typeof jobApplications.$inferSelect;
export type InsertJobApplication = typeof jobApplications.$inferInsert;

/**
 * Application Status Audit Log
 * Tracks changes to application status for HR review purposes
 */
export const applicationStatusLog = mysqlTable("applicationStatusLog", {
  id: int("id").autoincrement().primaryKey(),
  applicationId: int("applicationId").notNull(),
  previousStatus: mysqlEnum("previousStatus", ["pending", "reviewed", "accepted", "rejected"]).notNull(),
  newStatus: mysqlEnum("newStatus", ["pending", "reviewed", "accepted", "rejected"]).notNull(),
  changedBy: varchar("changedBy", { length: 255 }),
  notes: text("notes"),
  changedAt: timestamp("changedAt").defaultNow().notNull(),
});

export type ApplicationStatusLog = typeof applicationStatusLog.$inferSelect;
export type InsertApplicationStatusLog = typeof applicationStatusLog.$inferInsert;

// TODO: Add additional tables as needed