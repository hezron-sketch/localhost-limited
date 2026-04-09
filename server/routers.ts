import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { createContactSubmission } from "./db";
import { notifyOwner } from "./_core/notification";
import { sendContactConfirmationEmail, sendContactNotificationEmail } from "./email";

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

          // Send detailed email notification to owner
          const ownerEmail = process.env.OWNER_EMAIL || "hello@localhostlimited.com";
          await sendContactNotificationEmail(
            input.name,
            input.email,
            input.message,
            ownerEmail
          );

          return {
            success: true,
            message: "Thank you for reaching out! We'll get back to you soon.",
          };
        } catch (error) {
          console.error("[Contact] Failed to submit form:", error);
          throw new Error("Failed to submit contact form. Please try again later.");
        }
      }),
  }),

  // TODO: add feature routers here, e.g.
  // todo: router({
  //   list: protectedProcedure.query(({ ctx }) =>
  //     db.getUserTodos(ctx.user.id)
  //   ),
  // }),
});

export type AppRouter = typeof appRouter;
