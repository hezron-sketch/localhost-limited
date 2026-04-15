import { z } from "zod";
import { adminProcedure, publicProcedure, router } from "./_core/trpc";
import {
  createJobOpening,
  listJobOpenings,
  getJobOpeningById,
  updateJobOpening,
  deleteJobOpening,
  createMarketingService,
  listMarketingServices,
  getMarketingServiceById,
  updateMarketingService,
  deleteMarketingService,
  createBlogPost,
  listBlogPosts,
  getBlogPostBySlug,
  updateBlogPost,
  deleteBlogPost,
  createOrganizationPartner,
  listOrganizationPartners,
  getOrganizationPartnerById,
  updateOrganizationPartner,
  deleteOrganizationPartner,
  createGalleryImage,
  listGalleryImages,
  deleteGalleryImage,
  createJobApplication,
  listJobApplications,
  updateJobApplicationStatus,
  deleteJobApplication,
} from "./db";

// ============ Job Openings Router ============
export const jobsRouter = router({
  list: publicProcedure
    .input(z.object({ limit: z.number().default(50), offset: z.number().default(0) }))
    .query(async ({ input }) => listJobOpenings(input.limit, input.offset)),

  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => getJobOpeningById(input.id)),

  create: adminProcedure
    .input(z.object({
      title: z.string().min(1),
      description: z.string().min(1),
      department: z.string().min(1),
      location: z.string().min(1),
      salaryRange: z.string().optional(),
      jobType: z.enum(["full-time", "part-time", "contract", "remote"]),
      requirements: z.string().optional(),
      benefits: z.string().optional(),
      imageUrl: z.string().optional(),
    }))
    .mutation(async ({ input }) => createJobOpening(input)),

  update: adminProcedure
    .input(z.object({
      id: z.number(),
      title: z.string().optional(),
      description: z.string().optional(),
      department: z.string().optional(),
      location: z.string().optional(),
      salaryRange: z.string().optional(),
      jobType: z.enum(["full-time", "part-time", "contract", "remote"]).optional(),
      requirements: z.string().optional(),
      benefits: z.string().optional(),
      imageUrl: z.string().optional(),
      status: z.enum(["active", "archived"]).optional(),
    }))
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      return updateJobOpening(id, data);
    }),

  delete: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => deleteJobOpening(input.id)),
});

// ============ Marketing Services Router ============
export const servicesRouter = router({
  list: publicProcedure
    .input(z.object({ limit: z.number().default(50), offset: z.number().default(0) }))
    .query(async ({ input }) => listMarketingServices(input.limit, input.offset)),

  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => getMarketingServiceById(input.id)),

  create: adminProcedure
    .input(z.object({
      title: z.string().min(1),
      description: z.string().min(1),
      category: z.enum(["social-media", "seo", "content", "other"]),
      benefits: z.string().optional(),
      imageUrl: z.string().optional(),
      price: z.string().optional(),
    }))
    .mutation(async ({ input }) => createMarketingService(input)),

  update: adminProcedure
    .input(z.object({
      id: z.number(),
      title: z.string().optional(),
      description: z.string().optional(),
      category: z.enum(["social-media", "seo", "content", "other"]).optional(),
      benefits: z.string().optional(),
      imageUrl: z.string().optional(),
      price: z.string().optional(),
      status: z.enum(["active", "archived"]).optional(),
    }))
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      return updateMarketingService(id, data);
    }),

  delete: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => deleteMarketingService(input.id)),
});

// ============ Blog Posts Router ============
export const blogRouter = router({
  list: publicProcedure
    .input(z.object({ limit: z.number().default(50), offset: z.number().default(0), category: z.string().optional() }))
    .query(async ({ input }) => listBlogPosts(input.limit, input.offset, input.category)),

  getBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => getBlogPostBySlug(input.slug)),

  create: adminProcedure
    .input(z.object({
      title: z.string().min(1),
      slug: z.string().min(1),
      content: z.string().min(1),
      excerpt: z.string().optional(),
      category: z.enum(["organization", "hr-sourcing", "marketing", "partnerships"]),
      imageUrl: z.string().optional(),
      author: z.string().min(1),
      status: z.enum(["draft", "published", "archived"]).default("draft"),
    }))
    .mutation(async ({ input }) => {
      const data = {
        ...input,
        publishedAt: input.status === "published" ? new Date() : null,
      };
      return createBlogPost(data);
    }),

  update: adminProcedure
    .input(z.object({
      id: z.number(),
      title: z.string().optional(),
      slug: z.string().optional(),
      content: z.string().optional(),
      excerpt: z.string().optional(),
      category: z.enum(["organization", "hr-sourcing", "marketing", "partnerships"]).optional(),
      imageUrl: z.string().optional(),
      author: z.string().optional(),
      status: z.enum(["draft", "published", "archived"]).optional(),
    }))
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      const updateData = {
        ...data,
        publishedAt: data.status === "published" ? new Date() : undefined,
      };
      return updateBlogPost(id, updateData);
    }),

  delete: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => deleteBlogPost(input.id)),
});

// ============ Organization Partners Router ============
export const partnersRouter = router({
  list: publicProcedure
    .input(z.object({ limit: z.number().default(50), offset: z.number().default(0) }))
    .query(async ({ input }) => listOrganizationPartners(input.limit, input.offset)),

  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => getOrganizationPartnerById(input.id)),

  create: adminProcedure
    .input(z.object({
      name: z.string().min(1),
      description: z.string().optional(),
      partnerType: z.enum(["corporate", "startup", "agency", "other"]),
      website: z.string().optional(),
      logoUrl: z.string().optional(),
      benefits: z.string().optional(),
    }))
    .mutation(async ({ input }) => createOrganizationPartner(input)),

  update: adminProcedure
    .input(z.object({
      id: z.number(),
      name: z.string().optional(),
      description: z.string().optional(),
      partnerType: z.enum(["corporate", "startup", "agency", "other"]).optional(),
      website: z.string().optional(),
      logoUrl: z.string().optional(),
      benefits: z.string().optional(),
      status: z.enum(["active", "inactive"]).optional(),
    }))
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      return updateOrganizationPartner(id, data);
    }),

  delete: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => deleteOrganizationPartner(input.id)),
});

// ============ Gallery Images Router ============
export const galleryRouter = router({
  list: publicProcedure
    .input(z.object({ section: z.string().optional() }))
    .query(async ({ input }) => listGalleryImages(input.section)),

  create: adminProcedure
    .input(z.object({
      title: z.string().min(1),
      imageUrl: z.string().min(1),
      section: z.enum(["hero", "services", "team", "partners", "testimonials", "other"]),
      altText: z.string().optional(),
    }))
    .mutation(async ({ input }) => createGalleryImage(input)),

  delete: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => deleteGalleryImage(input.id)),
});

// ============ Job Applications Router ============
export const jobApplicationsRouter = router({
  list: adminProcedure
    .input(z.object({ 
      jobId: z.number().optional(),
      status: z.string().optional(),
      limit: z.number().default(50), 
      offset: z.number().default(0) 
    }))
    .query(async ({ input }) => listJobApplications(input.limit, input.offset, input.jobId, input.status)),

  create: publicProcedure
    .input(z.object({
      jobId: z.number(),
      fullName: z.string().min(1),
      email: z.string().email(),
      phone: z.string().min(1),
      cvUrl: z.string().min(1),
      coverLetter: z.string().optional(),
    }))
    .mutation(async ({ input }) => createJobApplication(input)),

  updateStatus: adminProcedure
    .input(z.object({
      id: z.number(),
      status: z.enum(["pending", "reviewed", "accepted", "rejected"]),
    }))
    .mutation(async ({ input }) => updateJobApplicationStatus(input.id, input.status)),

  delete: adminProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => deleteJobApplication(input.id)),
});

// ============ CMS Router ============
export const cmsRouter = router({
  jobs: jobsRouter,
  services: servicesRouter,
  blog: blogRouter,
  partners: partnersRouter,
  gallery: galleryRouter,
  applications: jobApplicationsRouter,
});
