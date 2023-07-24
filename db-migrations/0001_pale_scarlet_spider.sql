ALTER TABLE "packages" ADD COLUMN "display_name" varchar DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE "packages" ADD COLUMN "description" varchar;--> statement-breakpoint
ALTER TABLE "packages" ADD COLUMN "version" varchar(32);--> statement-breakpoint
ALTER TABLE "packages" ADD COLUMN "license" varchar(128);--> statement-breakpoint
ALTER TABLE "packages" ADD COLUMN "logo_urls" varchar;--> statement-breakpoint
ALTER TABLE "packages" ADD COLUMN "screenshot_urls" varchar;--> statement-breakpoint
ALTER TABLE "packages" ADD COLUMN "provider" varchar(128);--> statement-breakpoint
ALTER TABLE "packages" ADD COLUMN "website" varchar;--> statement-breakpoint
ALTER TABLE "packages" ADD COLUMN "monthly_downloads" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "packages" ADD COLUMN "user_rating" integer;--> statement-breakpoint
ALTER TABLE "packages" ADD COLUMN "user_rating_count" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "packages" ADD COLUMN "advisory_rating" varchar(32);--> statement-breakpoint
ALTER TABLE "packages" ADD COLUMN "price" varchar(32);--> statement-breakpoint
ALTER TABLE "packages" ADD COLUMN "value" varchar(128);
