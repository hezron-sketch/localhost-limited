CREATE TABLE `applicationStatusLog` (
	`id` int AUTO_INCREMENT NOT NULL,
	`applicationId` int NOT NULL,
	`previousStatus` enum('pending','reviewed','accepted','rejected') NOT NULL,
	`newStatus` enum('pending','reviewed','accepted','rejected') NOT NULL,
	`changedBy` varchar(255),
	`notes` text,
	`changedAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `applicationStatusLog_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `jobApplications` ADD CONSTRAINT `unique_job_email` UNIQUE(`jobId`,`email`);