CREATE TABLE `jobApplications` (
	`id` int AUTO_INCREMENT NOT NULL,
	`jobId` int NOT NULL,
	`fullName` varchar(255) NOT NULL,
	`email` varchar(320) NOT NULL,
	`phone` varchar(20) NOT NULL,
	`cvUrl` text NOT NULL,
	`coverLetter` text,
	`status` enum('pending','reviewed','accepted','rejected') NOT NULL DEFAULT 'pending',
	`appliedAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `jobApplications_id` PRIMARY KEY(`id`)
);
