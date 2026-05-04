-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE `projects` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`code` varchar(5) NOT NULL,
	`title` varchar(255) NOT NULL,
	`series_title` varchar(255),
	`goal` int NOT NULL DEFAULT 0,
	CONSTRAINT `projects_id` PRIMARY KEY(`id`),
	CONSTRAINT `code` UNIQUE(`code`)
);
--> statement-breakpoint
CREATE TABLE `scenes` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`code` varchar(5) NOT NULL,
	`sequence` int,
	`name` varchar(255),
	`words` int DEFAULT 0,
	`status` enum('pending','writing','finished','aborted') NOT NULL DEFAULT 'pending',
	`project_id` bigint,
	CONSTRAINT `scenes_id` PRIMARY KEY(`id`),
	CONSTRAINT `code` UNIQUE(`code`)
);
--> statement-breakpoint
CREATE TABLE `sessions` (
	`id` bigint AUTO_INCREMENT NOT NULL,
	`date` date NOT NULL,
	`start_time` timestamp,
	`stop_time` timestamp,
	`words` int NOT NULL,
	`scene_id` bigint NOT NULL,
	`comments` varchar(255),
	CONSTRAINT `sessions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `scenes` ADD CONSTRAINT `fk_scenes_books` FOREIGN KEY (`project_id`) REFERENCES `projects`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `sessions` ADD CONSTRAINT `fk_sessions_scenes` FOREIGN KEY (`scene_id`) REFERENCES `scenes`(`id`) ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `IX_sessions_date` ON `sessions` (`date`);--> statement-breakpoint
CREATE INDEX `IX_sessions_scene_date` ON `sessions` (`scene_id`,`date`);
*/