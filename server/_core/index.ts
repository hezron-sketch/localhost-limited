import "dotenv/config";
import express from "express";
import { createServer } from "http";
import net from "net";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { serveStatic, setupVite } from "./vite";
import { storagePut } from "../storage";
import multer from "multer";
import { sendEmail } from "./email";

function isPortAvailable(port: number): Promise<boolean> {
  return new Promise(resolve => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}

async function findAvailablePort(startPort: number = 3000): Promise<number> {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}

async function startServer() {
  const app = express();
  const server = createServer(app);
  // Configure body parser with larger size limit for file uploads
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
  // Configure multer for file uploads
  const upload = multer({ storage: multer.memoryStorage() });

  // File upload endpoint
  app.post("/api/upload", upload.single("file"), async (req: any, res: any) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file provided" });
      }

      // Validate file type
      const allowedMimes = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
      if (!allowedMimes.includes(req.file.mimetype)) {
        return res.status(400).json({ error: "Invalid file type. Only PDF and DOC files are allowed." });
      }

      // Validate file size (10MB max)
      if (req.file.size > 10 * 1024 * 1024) {
        return res.status(400).json({ error: "File too large. Maximum size is 10MB." });
      }

      // Upload to S3
      const fileKey = `job-applications/${Date.now()}-${req.file.originalname}`;
      const { url } = await storagePut(fileKey, req.file.buffer, req.file.mimetype);

      res.json({ url });
    } catch (error) {
      console.error("[Upload] Error:", error);
      res.status(500).json({ error: "Failed to upload file" });
    }
  });

  // HR email notification endpoint
  app.post("/api/send-hr-email", async (req: any, res: any) => {
    try {
      const { jobTitle, applicantName, applicantEmail, applicantPhone, cvUrl, coverLetter } = req.body;

      if (!jobTitle || !applicantName || !applicantEmail || !applicantPhone) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      // Send email to HR
      await sendEmail({
        to: "hr@localhostlimitedafrica.com",
        subject: `New Job Application: ${jobTitle} - ${applicantName}`,
        html: `
          <h2>New Job Application</h2>
          <p><strong>Job Position:</strong> ${jobTitle}</p>
          <p><strong>Applicant Name:</strong> ${applicantName}</p>
          <p><strong>Email:</strong> ${applicantEmail}</p>
          <p><strong>Phone:</strong> ${applicantPhone}</p>
          <p><strong>CV:</strong> <a href="${cvUrl}" target="_blank">Download CV</a></p>
          ${coverLetter ? `<p><strong>Cover Letter:</strong></p><p>${coverLetter.replace(/\n/g, "<br>")}</p>` : ""}
          <hr>
          <p>Please review this application in your HR Dashboard.</p>
        `,
      });

      res.json({ success: true });
    } catch (error) {
      console.error("[HR Email] Error:", error);
      res.status(500).json({ error: "Failed to send email" });
    }
  });

  // OAuth callback under /api/oauth/callback
  registerOAuthRoutes(app);
  
  // tRPC API
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );
  // development mode uses Vite, production mode uses static files
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);

  if (port !== preferredPort) {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
