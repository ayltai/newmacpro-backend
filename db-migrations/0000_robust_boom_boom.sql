DO $$ BEGIN
 CREATE TYPE "source" AS ENUM('Homebrew/cask', 'Homebrew/core', 'App Store', 'Tweak');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "bundles" (
	"id" uuid PRIMARY KEY NOT NULL,
	"display_name" varchar NOT NULL,
	"description" varchar,
	"icon_id" varchar(32),
	"is_private" boolean DEFAULT false NOT NULL,
	"download_count" integer DEFAULT 0 NOT NULL,
	"created_by" varchar(256) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "packages" (
	"bundle_id" uuid NOT NULL,
	"id" varchar NOT NULL,
	"source" "source" NOT NULL,
	CONSTRAINT packages_bundle_id_id PRIMARY KEY("bundle_id","id")
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "display_name_idx" ON "bundles" ("display_name");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "description_idx" ON "bundles" ("description");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "view_count_idx" ON "bundles" ("download_count");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "created_by_idx" ON "bundles" ("created_by");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "updated_at_idx" ON "bundles" ("updated_at");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "packages" ADD CONSTRAINT "packages_bundle_id_bundles_id_fk" FOREIGN KEY ("bundle_id") REFERENCES "bundles"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
