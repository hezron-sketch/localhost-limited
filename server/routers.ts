import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import { createContactSubmission, listContactSubmissions, updateContactSubmissionStatus, deleteContactSubmission, getContactSubmissionStats, getContactSubmissionById } from "./db";
import { notifyOwner } from "./_core/notification";
import { sendContactConfirmationEmail, sendContactNotificationEmail } from "./email";
import { TRPCError } from "@trpc/server";
import { cmsRouter } from "./cms.router";

// Helper to ensure user is admin (also exported for use in other routers)
export const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user?.role !== "admin") {
    throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
  }
  return next({ ctx });
});

export const appRouter = router({
  // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  contact: router({
    submit: publicProcedure
      .input(
        z.object({
          name: z.string().min(2, "Name must be at least 2 characters").max(255),
          email: z.string().email("Invalid email address"),
          message: z.string().min(10, "Message must be at least 10 characters").max(5000),
        })
      )
      .mutation(async ({ input }) => {
        try {
          // Store in database
          const result = await createContactSubmission({
            name: input.name,
            email: input.email,
            message: input.message,
            status: "new",
          });

          // Send confirmation email to user
          await sendContactConfirmationEmail(input.name, input.email);

          // Send notification to owner (in-app)
          await notifyOwner({
            title: `New Contact Form Submission from ${input.name}`,
            content: `Email: ${input.email}\n\nMessage:\n${input.message}`,
          });

          // Send detailed email notification to both HR and info emails
          const ownerEmail = process.env.OWNER_EMAIL || "hello@localhostlimited.com";
          const contactEmails = [
            "hr@localhostlimitedafrica.com",
            "info@localhostlimitedafrica.com"
          ];
          await sendContactNotificationEmail(
            input.name,
            input.email,
            input.message,
            contactEmails
          );

          return {
            success: true,
            message: "Thank you for reaching out! We'll get back to you soon.",
          };
        } catch (error) {
          console.error("[Contact] Failed to submit form:", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to submit contact form. Please try again later.",
          });
        }
      }),

    // Admin procedures
    list: adminProcedure
      .input(
        z.object({
          limit: z.number().min(1).max(100).default(50),
          offset: z.number().min(0).default(0),
          status: z.enum(["new", "reviewed", "replied", "archived"]).optional(),
        })
      )
      .query(async ({ input }) => {
        const result = await listContactSubmissions(input.limit, input.offset, input.status);
        return result;
      }),

    get: adminProcedure
      .input(z.object({ id: z.number().int().positive() }))
      .query(async ({ input }) => {
        const submission = await getContactSubmissionById(input.id);
        if (!submission) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Submission not found" });
        }
        return submission;
      }),

    stats: adminProcedure.query(async () => {
      return await getContactSubmissionStats();
    }),

    updateStatus: adminProcedure
      .input(
        z.object({
          id: z.number().int().positive(),
          status: z.enum(["new", "reviewed", "replied", "archived"]),
        })
      )
      .mutation(async ({ input }) => {
        const submission = await getContactSubmissionById(input.id);
        if (!submission) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Submission not found" });
        }

        await updateContactSubmissionStatus(input.id, input.status);
        return { success: true, message: "Status updated successfully" };
      }),

    delete: adminProcedure
      .input(z.object({ id: z.number().int().positive() }))
      .mutation(async ({ input }) => {
        const submission = await getContactSubmissionById(input.id);
        if (!submission) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Submission not found" });
        }

        await deleteContactSubmission(input.id);
        return { success: true, message: "Submission deleted successfully" };
      }),
  }),

  cms: cmsRouter,

  // TODO: add feature routers here, e.g.
  // todo: router({
  //   list: protectedProcedure.query(({ ctx }) =>
  //     db.getUserTodos(ctx.user.id)
  //   ),
  // }),
});

export type AppRouter = typeof appRouter;
