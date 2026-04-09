import { eq, desc, and } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, contactSubmissions, InsertContactSubmission, ContactSubmission } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

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

// TODO: add feature queries here as your schema grows.
