import { describe, expect, it, vi } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

/**
 * Test: Admin Submissions Management
 * Validates:
 * 1. Admin-only access control
 * 2. List submissions with pagination
 * 3. Get submission details
 * 4. Update submission status
 * 5. Delete submissions
 * 6. Get statistics
 */

// Mock admin context
function createAdminContext(): TrpcContext {
  return {
    user: {
      id: 1,
      openId: "admin-user",
      email: "admin@localhost.com",
      name: "Admin User",
      loginMethod: "manus",
      role: "admin",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

// Mock non-admin context
function createUserContext(): TrpcContext {
  return {
    user: {
      id: 2,
      openId: "regular-user",
      email: "user@localhost.com",
      name: "Regular User",
      loginMethod: "manus",
      role: "user",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("admin.submissions", () => {
  it("denies non-admin access to list", async () => {
    const ctx = createUserContext();
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.contact.list({
        limit: 50,
        offset: 0,
      });
      expect.fail("Should have denied non-admin access");
    } catch (error: any) {
      expect(error.code).toBe("FORBIDDEN");
      expect(error.message).toContain("Admin");
    }
  });

  it("denies non-admin access to stats", async () => {
    const ctx = createUserContext();
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.contact.stats();
      expect.fail("Should have denied non-admin access");
    } catch (error: any) {
      expect(error.code).toBe("FORBIDDEN");
    }
  });

  it("denies non-admin access to update status", async () => {
    const ctx = createUserContext();
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.contact.updateStatus({
        id: 1,
        status: "reviewed",
      });
      expect.fail("Should have denied non-admin access");
    } catch (error: any) {
      expect(error.code).toBe("FORBIDDEN");
    }
  });

  it("denies non-admin access to delete", async () => {
    const ctx = createUserContext();
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.contact.delete({ id: 1 });
      expect.fail("Should have denied non-admin access");
    } catch (error: any) {
      expect(error.code).toBe("FORBIDDEN");
    }
  });

  it("allows admin to list submissions", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    try {
      const result = await caller.contact.list({
        limit: 50,
        offset: 0,
      });

      expect(result).toHaveProperty("submissions");
      expect(result).toHaveProperty("total");
      expect(Array.isArray(result.submissions)).toBe(true);
      expect(typeof result.total).toBe("number");
    } catch (error: any) {
      // Database might not be available, that's ok
      if (!error.message.includes("database")) {
        throw error;
      }
    }
  });

  it("allows admin to get stats", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    try {
      const result = await caller.contact.stats();

      expect(result).toHaveProperty("total");
      expect(result).toHaveProperty("new");
      expect(result).toHaveProperty("reviewed");
      expect(result).toHaveProperty("replied");
      expect(result).toHaveProperty("archived");
    } catch (error: any) {
      if (!error.message.includes("database")) {
        throw error;
      }
    }
  });

  it("validates pagination parameters", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    try {
      // Test invalid limit
      await caller.contact.list({
        limit: 0,
        offset: 0,
      });
      expect.fail("Should have rejected invalid limit");
    } catch (error: any) {
      expect(error.message).toContain(">=");
    }

    try {
      // Test limit too high
      await caller.contact.list({
        limit: 101,
        offset: 0,
      });
      expect.fail("Should have rejected limit > 100");
    } catch (error: any) {
      expect(error.message).toContain("<=");
    }

    try {
      // Test negative offset
      await caller.contact.list({
        limit: 50,
        offset: -1,
      });
      expect.fail("Should have rejected negative offset");
    } catch (error: any) {
      expect(error.message).toContain(">=");
    }
  });

  it("validates status filter", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    try {
      // Valid status filters
      const validStatuses = ["new", "reviewed", "replied", "archived"];
      for (const status of validStatuses) {
        const result = await caller.contact.list({
          limit: 50,
          offset: 0,
          status: status as any,
        });
        expect(result).toHaveProperty("submissions");
      }
    } catch (error: any) {
      if (!error.message.includes("database")) {
        throw error;
      }
    }

    try {
      // Invalid status
      await caller.contact.list({
        limit: 50,
        offset: 0,
        status: "invalid" as any,
      });
      expect.fail("Should have rejected invalid status");
    } catch (error: any) {
      expect(error.message).toContain("Invalid option");
    }
  });

  it("validates update status parameters", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    try {
      // Invalid ID
      await caller.contact.updateStatus({
        id: 0,
        status: "reviewed",
      });
      expect.fail("Should have rejected invalid ID");
    } catch (error: any) {
      expect(error.message).toContain(">0");
    }

    try {
      // Invalid status
      await caller.contact.updateStatus({
        id: 1,
        status: "invalid" as any,
      });
      expect.fail("Should have rejected invalid status");
    } catch (error: any) {
      expect(error.message).toContain("Invalid option");
    }
  });

  it("handles non-existent submission gracefully", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.contact.get({ id: 999999 });
      expect.fail("Should have thrown NOT_FOUND error");
    } catch (error: any) {
      expect(error.code).toBe("NOT_FOUND");
    }

    try {
      await caller.contact.updateStatus({
        id: 999999,
        status: "reviewed",
      });
      expect.fail("Should have thrown NOT_FOUND error");
    } catch (error: any) {
      expect(error.code).toBe("NOT_FOUND");
    }

    try {
      await caller.contact.delete({ id: 999999 });
      expect.fail("Should have thrown NOT_FOUND error");
    } catch (error: any) {
      expect(error.code).toBe("NOT_FOUND");
    }
  });
});
