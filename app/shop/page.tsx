import { Suspense } from 'react';
import prisma from '@/lib/prisma';
import ProductCard from '@/components/ProductCard';
import ShopFilters from '@/components/ShopFilters';
import { FadeIn } from '@/components/AnimatedSection';
import { Sparkles } from 'lucide-react';
import type { Product, Image as PrismaImage } from '@prisma/client';

type ProductWithImages = Product & { images: PrismaImage[] };

interface Props {
  searchParams: { category?: string };
}

async function getProducts(category?: string) {
  try {
    const where: any = { available: true };
    if (category) where.category = category;

    const products = await prisma.product.findMany({
      where,
      include: { images: { orderBy: { order: 'asc' } } },
      orderBy: { createdAt: 'desc' },
    });
    return products;
  } catch (error) {
    return [];
  }
}

async function getCategories() {
  try {
    const categories = await prisma.product.findMany({
      where: { available: true },
      select: { category: true },
      distinct: ['category'],
    });
    return categories.map((c: { category: string }) => c.category);
  } catch (error) {
    return [];
  }
}

export default async function ShopPage({ searchParams }: Props) {
  const products = await getProducts(searchParams.category);
  const categories = await getCategories();

  return (
    <div className="min-h-screen bg-dark-100 pt-24">
      {/* Hero */}
      <section className="bg-dark-200 py-16 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent-secondary/10 rounded-full blur-3xl" />
        </div>
        <div className="container mx-auto px-6 text-center relative z-10">
          <FadeIn>
            <span className="text-accent-primary font-medium uppercase tracking-wider text-sm mb-4 block">
              ✦ Our Collection ✦
            </span>
            <h1 className="font-serif text-5xl md:text-6xl text-text-primary mb-4 font-bold">
              Shop
            </h1>
            <p className="text-xl text-text-secondary max-w-2xl mx-auto">
              Explore our curated collection of handcrafted treasures, each piece made with love and attention to detail.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Filters & Products */}
      <section className="container mx-auto px-6 py-12">
        <Suspense fallback={<div>Loading...</div>}>
          <ShopFilters 
            categories={categories} 
            activeCategory={searchParams.category} 
          />
        </Suspense>

        {products.length === 0 ? (
          <FadeIn className="text-center py-20">
            <Sparkles className="w-16 h-16 text-accent-primary mx-auto mb-6" />
            <h2 className="font-serif text-3xl text-text-primary mb-4 font-semibold">
              {searchParams.category 
                ? `No ${searchParams.category} available yet`
                : 'Coming Soon'
              }
            </h2>
            <p className="text-text-muted max-w-md mx-auto">
              We're working on adding beautiful new pieces to our collection. Check back soon!
            </p>
          </FadeIn>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product: ProductWithImages, index: number) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
