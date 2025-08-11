CREATE DATABASE "wawita_db";

CREATE TABLE "users" (
	"id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	"email" TEXT NOT NULL UNIQUE,
	"password_hash" TEXT NOT NULL,
	"is_active" BOOLEAN NOT NULL DEFAULT TRUE,
	"created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
	"updated_at" TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE "user_profiles" (
	"id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	"user_id" UUID NOT NULL,
	"fullname" TEXT NOT NULL,
	"nickname" TEXT UNIQUE,
	"avatar_url" TEXT,
	"biography" TEXT,
	"created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
	"updated_at" TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE "publications" (
	"id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	"user_profile_id" UUID NOT NULL,
	"title" TEXT NOT NULL,
	"short_description" TEXT,
	"full_description" TEXT,
	"category_id" UUID NOT NULL,
	"price" INTEGER NOT NULL,
	"stock" INTEGER NOT NULL DEFAULT 1,
	"condition" TEXT NOT NULL CHECK ("condition" IN ('nuevo', 'usado')),
	"status" TEXT NOT NULL DEFAULT 'activa' CHECK ("status" IN ('activa', 'pausada', 'finalizada')),
	"created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
	"updated_at" TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE "publication_images" (
	"id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	"publication_id" UUID NOT NULL,
	"image_url" TEXT NOT NULL,
	"position" INTEGER NOT NULL DEFAULT 1,
	"created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
	"updated_at" TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE "categories" (
	"id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	"name" TEXT NOT NULL,
	"created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
	"updated_at" TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE "favorites" (
	"id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	"user_profile_id" UUID NOT NULL,
	"publication_id" UUID NOT NULL,
	"created_at" TIMESTAMP NOT NULL DEFAULT NOW(),
	"updated_at" TIMESTAMP NOT NULL DEFAULT NOW()
);

ALTER TABLE "user_profiles"
ADD FOREIGN KEY("user_id") REFERENCES "users"("id")
ON UPDATE NO ACTION ON DELETE NO ACTION;

ALTER TABLE "publications"
ADD FOREIGN KEY("user_profile_id") REFERENCES "user_profiles"("id")
ON UPDATE NO ACTION ON DELETE NO ACTION;

ALTER TABLE "publication_images"
ADD FOREIGN KEY("publication_id") REFERENCES "publications"("id")
ON UPDATE NO ACTION ON DELETE NO ACTION;

ALTER TABLE "publications"
ADD FOREIGN KEY("category_id") REFERENCES "categories"("id")
ON UPDATE NO ACTION ON DELETE NO ACTION;

ALTER TABLE "favorites"
ADD FOREIGN KEY("user_profile_id") REFERENCES "user_profiles"("id")
ON UPDATE NO ACTION ON DELETE NO ACTION;
ALTER TABLE "favorites"
ADD FOREIGN KEY("publication_id") REFERENCES "publications"("id")
ON UPDATE NO ACTION ON DELETE NO ACTION;