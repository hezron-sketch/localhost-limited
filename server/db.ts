import { and, eq, desc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { InsertUser, users, contactSubmissions, InsertContactSubmission, ContactSubmission, jobOpenings, InsertJobOpening, JobOpening, marketingServices, InsertMarketingService, MarketingService, blogPosts, InsertBlogPost, BlogPost, organizationPartners, InsertOrganizationPartner, OrganizationPartner, galleryImages, InsertGalleryImage, GalleryImage, jobApplications, InsertJobApplication, JobApplication } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;
let _client: postgres.Sql | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _client = postgres(process.env.DATABASE_URL);
      _db = drizzle(_client);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
      _client = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.googleId) {
    throw new Error("User googleId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    // Check if user exists
    const existing = await db.select().from(users).where(eq(users.googleId, user.googleId)).limit(1);
    
    if (existing.length > 0) {
      // Update existing user
      const updateSet: Record<string, unknown> = {};
      
      if (user.name !== undefined) updateSet.name = user.name;
      if (user.email !== undefined) updateSet.email = user.email;
      if (user.picture !== undefined) updateSet.picture = user.picture;
      if (user.loginMethod !== undefined) updateSet.loginMethod = user.loginMethod;
      if (user.lastSignedIn !== undefined) updateSet.lastSignedIn = user.lastSignedIn;
      if (user.role !== undefined) updateSet.role = user.role;
      
      updateSet.updatedAt = new Date();
      
      await db.update(users).set(updateSet).where(eq(users.googleId, user.googleId));
    } else {
      // Insert new user
      const values: InsertUser = {
        googleId: user.googleId,
        name: user.name || null,
        email: user.email || null,
        picture: user.picture || null,
        loginMethod: user.loginMethod || "google",
        role: user.role || "user",
        lastSignedIn: user.lastSignedIn || new Date(),
      };
      
      await db.insert(users).values(values);
    }
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByGoogleId(googleId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.googleId, googleId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function getUserByEmail(email: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.email, email)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function createContactSubmission(data: InsertContactSubmission) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot create contact submission: database not available");
    throw new Error("Database connection failed");
  }

  const result = await db.insert(contactSubmissions).values(data);
  return result;
}

export async function getContactSubmissionById(id: number) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get contact submission: database not available");
    return undefined;
  }

  const result = await db
    .select()
    .from(contactSubmissions)
    .where(eq(contactSubmissions.id, id))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function listContactSubmissions(
  limit: number = 50,
  offset: number = 0,
  status?: string
) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot list contact submissions: database not available");
    return { submissions: [], total: 0 };
  }

  try {
    const whereConditions = status ? and(eq(contactSubmissions.status, status as any)) : undefined;

    const [submissions, countResult] = await Promise.all([
      db
        .select()
        .from(contactSubmissions)
        .where(whereConditions)
        .orderBy(desc(contactSubmissions.submittedAt))
        .limit(limit)
        .offset(offset),
      db
        .select({ count: db.$count(contactSubmissions) })
        .from(contactSubmissions)
        .where(whereConditions),
    ]);

    const total = countResult[0]?.count || 0;
    return { submissions, total };
  } catch (error) {
    console.error("[Database] Failed to list contact submissions:", error);
    return { submissions: [], total: 0 };
  }
}

export async function updateContactSubmissionStatus(
  id: number,
  status: "new" | "reviewed" | "replied" | "archived"
) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot update contact submission: database not available");
    throw new Error("Database connection failed");
  }

  try {
    await db
      .update(contactSubmissions)
      .set({ status, updatedAt: new Date() })
      .where(eq(contactSubmissions.id, id));

    return { success: true };
  } catch (error) {
    console.error("[Database] Failed to update contact submission:", error);
    throw error;
  }
}

export async function deleteContactSubmission(id: number) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot delete contact submission: database not available");
    throw new Error("Database connection failed");
  }

  try {
    await db.delete(contactSubmissions).where(eq(contactSubmissions.id, id));
    return { success: true };
  } catch (error) {
    console.error("[Database] Failed to delete contact submission:", error);
    throw error;
  }
}

export async function getContactSubmissionStats() {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get contact submission stats: database not available");
    return { total: 0, new: 0, reviewed: 0, replied: 0, archived: 0 };
  }

  try {
    const stats = await db
      .select({
        status: contactSubmissions.status,
        count: db.$count(contactSubmissions),
      })
      .from(contactSubmissions)
      .groupBy(contactSubmissions.status);

    const result = { total: 0, new: 0, reviewed: 0, replied: 0, archived: 0 };
    let total = 0;

    stats.forEach((stat) => {
      const count = stat.count || 0;
      total += count;
      if (stat.status === "new") result.new = count;
      else if (stat.status === "reviewed") result.reviewed = count;
      else if (stat.status === "replied") result.replied = count;
      else if (stat.status === "archived") result.archived = count;
    });

    result.total = total;
    return result;
  } catch (error) {
    console.error("[Database] Failed to get contact submission stats:", error);
    return { total: 0, new: 0, reviewed: 0, replied: 0, archived: 0 };
  }
}

// ============ Job Openings ============
export async function createJobOpening(data: InsertJobOpening) {
  const db = await getDb();
  if (!db) throw new Error("Database connection failed");
  return db.insert(jobOpenings).values(data);
}

export async function listJobOpenings(limit: number = 50, offset: number = 0) {
  const db = await getDb();
  if (!db) return { jobs: [], total: 0 };
  
  try {
    // Fetch jobs with pagination - select only needed fields
    const jobs = await db
      .select()
      .from(jobOpenings)
      .where(eq(jobOpenings.status, "active"))
      .orderBy(desc(jobOpenings.createdAt))
      .limit(limit)
      .offset(offset);
    
    // Get total count
    const countResult = await db
      .select({ count: db.$count(jobOpenings) })
      .from(jobOpenings)
      .where(eq(jobOpenings.status, "active"));
    
    return { 
      jobs, 
      total: countResult[0]?.count || 0 
    };
  } catch (error) {
    console.error("[DB] Error fetching jobs:", error);
    return { jobs: [], total: 0 };
  }
}

export async function getJobOpeningById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(jobOpenings).where(eq(jobOpenings.id, id)).limit(1);
  return result[0];
}

export async function updateJobOpening(id: number, data: Partial<InsertJobOpening>) {
  const db = await getDb();
  if (!db) throw new Error("Database connection failed");
  await db.update(jobOpenings).set({ ...data, updatedAt: new Date() }).where(eq(jobOpenings.id, id));
  return { success: true };
}

export async function deleteJobOpening(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database connection failed");
  await db.delete(jobOpenings).where(eq(jobOpenings.id, id));
  return { success: true };
}

// ============ Marketing Services ============
export async function createMarketingService(data: InsertMarketingService) {
  const db = await getDb();
  if (!db) throw new Error("Database connection failed");
  return db.insert(marketingServices).values(data);
}

export async function listMarketingServices(limit: number = 50, offset: number = 0) {
  const db = await getDb();
  if (!db) return { services: [], total: 0 };
  const [services, countResult] = await Promise.all([
    db.select().from(marketingServices).where(eq(marketingServices.status, "active")).orderBy(desc(marketingServices.createdAt)).limit(limit).offset(offset),
    db.select({ count: db.$count(marketingServices) }).from(marketingServices).where(eq(marketingServices.status, "active")),
  ]);
  return { services, total: countResult[0]?.count || 0 };
}

export async function getMarketingServiceById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(marketingServices).where(eq(marketingServices.id, id)).limit(1);
  return result[0];
}

export async function updateMarketingService(id: number, data: Partial<InsertMarketingService>) {
  const db = await getDb();
  if (!db) throw new Error("Database connection failed");
  await db.update(marketingServices).set({ ...data, updatedAt: new Date() }).where(eq(marketingServices.id, id));
  return { success: true };
}

export async function deleteMarketingService(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database connection failed");
  
  await db.delete(marketingServices).where(eq(marketingServices.id, id));
  return { success: true };
}

// ============ Blog Posts ============
export async function createBlogPost(data: InsertBlogPost) {
  const db = await getDb();
  if (!db) throw new Error("Database connection failed");
  return db.insert(blogPosts).values(data);
}

export async function listBlogPosts(limit: number = 50, offset: number = 0) {
  const db = await getDb();
  if (!db) return { posts: [], total: 0 };
  const [posts, countResult] = await Promise.all([
    db.select().from(blogPosts).where(eq(blogPosts.status, "published")).orderBy(desc(blogPosts.publishedAt)).limit(limit).offset(offset),
    db.select({ count: db.$count(blogPosts) }).from(blogPosts).where(eq(blogPosts.status, "published")),
  ]);
  return { posts, total: countResult[0]?.count || 0 };
}

export async function getBlogPostBySlug(slug: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(blogPosts).where(eq(blogPosts.slug, slug)).limit(1);
  return result[0];
}

export async function updateBlogPost(id: number, data: Partial<InsertBlogPost>) {
  const db = await getDb();
  if (!db) throw new Error("Database connection failed");
  await db.update(blogPosts).set({ ...data, updatedAt: new Date() }).where(eq(blogPosts.id, id));
  return { success: true };
}

export async function deleteBlogPost(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database connection failed");
  await db.delete(blogPosts).where(eq(blogPosts.id, id));
  return { success: true };
}

// ============ Organization Partners ============
export async function createOrganizationPartner(data: InsertOrganizationPartner) {
  const db = await getDb();
  if (!db) throw new Error("Database connection failed");
  return db.insert(organizationPartners).values(data);
}

export async function listOrganizationPartners(limit: number = 50, offset: number = 0) {
  const db = await getDb();
  if (!db) return { partners: [], total: 0 };
  const [partners, countResult] = await Promise.all([
    db.select().from(organizationPartners).where(eq(organizationPartners.status, "active")).orderBy(desc(organizationPartners.createdAt)).limit(limit).offset(offset),
    db.select({ count: db.$count(organizationPartners) }).from(organizationPartners).where(eq(organizationPartners.status, "active")),
  ]);
  return { partners, total: countResult[0]?.count || 0 };
}

export async function getOrganizationPartnerById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(organizationPartners).where(eq(organizationPartners.id, id)).limit(1);
  return result[0];
}

export async function updateOrganizationPartner(id: number, data: Partial<InsertOrganizationPartner>) {
  const db = await getDb();
  if (!db) throw new Error("Database connection failed");
  await db.update(organizationPartners).set({ ...data, updatedAt: new Date() }).where(eq(organizationPartners.id, id));
  return { success: true };
}

export async function deleteOrganizationPartner(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database connection failed");
  await db.delete(organizationPartners).where(eq(organizationPartners.id, id));
  return { success: true };
}

// ============ Gallery Images ============
export async function createGalleryImage(data: InsertGalleryImage) {
  const db = await getDb();
  if (!db) throw new Error("Database connection failed");
  return db.insert(galleryImages).values(data);
}

export async function listGalleryImages(section?: string, limit: number = 50, offset: number = 0) {
  const db = await getDb();
  if (!db) return { images: [], total: 0 };
  
  const whereCondition = section ? eq(galleryImages.section, section as any) : undefined;
  const [images, countResult] = await Promise.all([
    db.select().from(galleryImages).where(whereCondition).orderBy(desc(galleryImages.createdAt)).limit(limit).offset(offset),
    db.select({ count: db.$count(galleryImages) }).from(galleryImages).where(whereCondition),
  ]);
  return { images, total: countResult[0]?.count || 0 };
}

export async function getGalleryImageById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(galleryImages).where(eq(galleryImages.id, id)).limit(1);
  return result[0];
}

export async function updateGalleryImage(id: number, data: Partial<InsertGalleryImage>) {
  const db = await getDb();
  if (!db) throw new Error("Database connection failed");
  await db.update(galleryImages).set(data).where(eq(galleryImages.id, id));
  return { success: true };
}

export async function deleteGalleryImage(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database connection failed");
  await db.delete(galleryImages).where(eq(galleryImages.id, id));
  return { success: true };
}

// ============ Job Applications ============
export async function createJobApplication(data: InsertJobApplication) {
  const db = await getDb();
  if (!db) throw new Error("Database connection failed");
  return db.insert(jobApplications).values(data);
}

export async function listJobApplications(limit: number = 50, offset: number = 0, jobId?: number) {
  const db = await getDb();
  if (!db) return { applications: [], total: 0 };
  
  const whereCondition = jobId ? eq(jobApplications.jobId, jobId) : undefined;
  const [applications, countResult] = await Promise.all([
    db.select().from(jobApplications).where(whereCondition).orderBy(desc(jobApplications.appliedAt)).limit(limit).offset(offset),
    db.select({ count: db.$count(jobApplications) }).from(jobApplications).where(whereCondition),
  ]);
  return { applications, total: countResult[0]?.count || 0 };
}

export async function getJobApplicationById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(jobApplications).where(eq(jobApplications.id, id)).limit(1);
  return result[0];
}

export async function updateJobApplication(id: number, data: Partial<InsertJobApplication>) {
  const db = await getDb();
  if (!db) throw new Error("Database connection failed");
  await db.update(jobApplications).set({ ...data, updatedAt: new Date() }).where(eq(jobApplications.id, id));
  return { success: true };
}

export async function deleteJobApplication(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database connection failed");
  await db.delete(jobApplications).where(eq(jobApplications.id, id));
  return { success: true };
}

export async function getJobApplicationByJobAndEmail(jobId: number, email: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(jobApplications).where(and(eq(jobApplications.jobId, jobId), eq(jobApplications.email, email))).limit(1);
  return result[0];
}
