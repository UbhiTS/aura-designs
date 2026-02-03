import prisma from './prisma';

/**
 * Converts a string to a URL-friendly slug
 * Example: "Lavender Candle" → "lavender-candle"
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-')      // Replace spaces with dashes
    .replace(/-+/g, '-')       // Replace multiple dashes with single dash
    .replace(/^-+|-+$/g, '');  // Remove leading/trailing dashes
}

/**
 * Generates a unique slug for a product
 * If "lavender-candle" exists, returns "lavender-candle-2", etc.
 */
export async function generateUniqueSlug(
  name: string,
  excludeProductId?: string
): Promise<string> {
  const baseSlug = slugify(name);
  
  if (!baseSlug) {
    // Fallback for empty names
    return `product-${Date.now()}`;
  }

  let slug = baseSlug;
  let counter = 1;

  while (true) {
    // Check if slug exists
    const existing = await prisma.product.findUnique({
      where: { slug },
      select: { id: true },
    });

    // If no existing product with this slug, or it's the same product being updated
    if (!existing || (excludeProductId && existing.id === excludeProductId)) {
      return slug;
    }

    // Increment counter and try again
    counter++;
    slug = `${baseSlug}-${counter}`;
  }
}
