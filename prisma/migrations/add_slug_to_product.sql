-- Add slug column to Product table
ALTER TABLE "Product" ADD COLUMN "slug" TEXT;

-- Generate initial slugs from product names
-- This uses a simple approach: lowercase and replace spaces with dashes
UPDATE "Product" 
SET "slug" = LOWER(REGEXP_REPLACE(REGEXP_REPLACE("name", '[^a-zA-Z0-9\s-]', '', 'g'), '\s+', '-', 'g'));

-- Handle duplicates by appending row number
WITH duplicates AS (
  SELECT id, slug, ROW_NUMBER() OVER (PARTITION BY slug ORDER BY "createdAt") as rn
  FROM "Product"
)
UPDATE "Product" 
SET "slug" = "Product"."slug" || '-' || duplicates.rn
FROM duplicates
WHERE "Product".id = duplicates.id AND duplicates.rn > 1;

-- Make slug unique and not null
ALTER TABLE "Product" ALTER COLUMN "slug" SET NOT NULL;
CREATE UNIQUE INDEX "Product_slug_key" ON "Product"("slug");
