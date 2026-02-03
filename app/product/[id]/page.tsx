import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import prisma from '@/lib/prisma';
import ProductImageGallery from '@/components/ProductImageGallery';
import ShareButton from '@/components/ShareButton';
import { FadeIn, FadeInUp } from '@/components/AnimatedSection';
import { ArrowLeft, Heart, Sparkles } from 'lucide-react';

interface Props {
  params: { id: string };
}

async function getProduct(id: string) {
  try {
    const product = await prisma.product.findUnique({
      where: { id },
      include: { images: { orderBy: { order: 'asc' } } },
    });
    return product;
  } catch (error) {
    return null;
  }
}

async function getRelatedProducts(category: string, excludeId: string) {
  try {
    const products = await prisma.product.findMany({
      where: {
        category,
        available: true,
        id: { not: excludeId },
      },
      include: { images: { orderBy: { order: 'asc' } } },
      take: 4,
      orderBy: { createdAt: 'desc' },
    });
    return products;
  } catch (error) {
    return [];
  }
}

export async function generateMetadata({ params }: Props) {
  const product = await getProduct(params.id);
  
  if (!product) {
    return { title: 'Product Not Found' };
  }

  return {
    title: `${product.name} | Aura Designs`,
    description: product.description || `Discover ${product.name} - a beautiful handcrafted piece from Aura Designs.`,
    openGraph: {
      title: product.name,
      description: product.description || `Discover ${product.name} - a beautiful handcrafted piece from Aura Designs.`,
      images: product.images[0]?.url ? [product.images[0].url] : [],
    },
  };
}

export default async function ProductPage({ params }: Props) {
  const product = await getProduct(params.id);

  if (!product) {
    notFound();
  }

  const relatedProducts = await getRelatedProducts(product.category, product.id);

  return (
    <div className="min-h-screen bg-dark-100 pt-24">
      {/* Breadcrumb */}
      <div className="container mx-auto px-6 py-6">
        <FadeIn>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 text-text-secondary hover:text-accent-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Shop
          </Link>
        </FadeIn>
      </div>

      {/* Product Content */}
      <section className="container mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Image Gallery */}
          <FadeIn>
            <ProductImageGallery images={product.images} productName={product.name} />
          </FadeIn>

          {/* Product Info */}
          <FadeInUp delay={0.2}>
            <div className="lg:sticky lg:top-32">
              {/* Category */}
              <span className="inline-block px-4 py-1.5 bg-surface-300 text-text-secondary text-sm uppercase tracking-wider rounded-full mb-4">
                {product.category}
              </span>

              {/* Name */}
              <h1 className="font-sans font-bold text-4xl md:text-5xl text-text-primary mb-4">
                {product.name}
              </h1>

              {/* Price */}
              {product.price && (
                <p className="font-sans font-semibold text-3xl text-accent-primary mb-6">
                  ${product.price.toFixed(2)}
                </p>
              )}

              {/* Description */}
              {product.description && (
                <div className="mb-8">
                  <p className="text-text-secondary leading-relaxed text-lg">
                    {product.description}
                  </p>
                </div>
              )}

              {/* Featured Badge */}
              {product.featured && (
                <div className="flex items-center gap-2 text-accent-primary mb-6">
                  <Sparkles className="w-5 h-5" />
                  <span className="font-medium">Featured Creation</span>
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <ShareButton productId={product.id} productName={product.name} />
                <button className="btn-secondary flex items-center justify-center gap-2">
                  <Heart className="w-5 h-5" />
                  Save to Favorites
                </button>
              </div>

              {/* Details */}
              <div className="border-t border-surface-300 pt-8 space-y-4">
                <div className="flex items-center gap-4">
                  <span className="w-2 h-2 rounded-full bg-accent-secondary" />
                  <span className="text-text-secondary">Handcrafted with care</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="w-2 h-2 rounded-full bg-accent-primary" />
                  <span className="text-text-secondary">Premium quality materials</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="w-2 h-2 rounded-full bg-pink-500" />
                  <span className="text-text-secondary">Unique, one-of-a-kind design</span>
                </div>
              </div>

              {/* Contact for Purchase */}
              <div className="mt-8 p-6 bg-surface-200 border border-surface-300 rounded-2xl">
                <h3 className="font-sans font-semibold text-xl text-text-primary mb-2">
                  Interested in this piece?
                </h3>
                <p className="text-text-secondary mb-4">
                  Contact us for availability and ordering information.
                </p>
                <a
                  href="mailto:hello@auradesigns.com"
                  className="btn-primary w-full text-center"
                >
                  Contact Us
                </a>
              </div>
            </div>
          </FadeInUp>
        </div>
      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="py-20 bg-dark-200">
          <div className="container mx-auto px-6">
            <FadeIn className="text-center mb-12">
              <h2 className="font-sans font-bold text-4xl text-text-primary">You Might Also Love</h2>
            </FadeIn>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <FadeIn key={relatedProduct.id}>
                  <Link href={`/product/${relatedProduct.id}`}>
                    <div className="bg-surface-200 border border-surface-300 rounded-2xl overflow-hidden hover:border-accent-primary/30 transition-all group">
                      <div className="relative aspect-square overflow-hidden">
                        {relatedProduct.images[0] ? (
                          <Image
                            src={relatedProduct.images[0].url}
                            alt={relatedProduct.images[0].alt || relatedProduct.name}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                        ) : (
                          <div className="absolute inset-0 bg-surface-300 flex items-center justify-center">
                            <Sparkles className="w-12 h-12 text-text-muted" />
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="font-sans font-semibold text-lg text-text-primary group-hover:text-accent-primary transition-colors">
                          {relatedProduct.name}
                        </h3>
                        {relatedProduct.price && (
                          <p className="text-accent-primary font-semibold mt-1">
                            ${relatedProduct.price.toFixed(2)}
                          </p>
                        )}
                      </div>
                    </div>
                  </Link>
                </FadeIn>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
