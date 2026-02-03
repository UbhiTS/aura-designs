import Link from 'next/link';
import Image from 'next/image';
import ProductCard from '@/components/ProductCard';
import HeroSection from '@/components/HeroSection';
import Testimonials from '@/components/Testimonials';
import { FadeIn, FadeInUp, StaggerContainer, StaggerItem } from '@/components/AnimatedSection';
import prisma from '@/lib/prisma';
import type { Product, Image as PrismaImage, Testimonial } from '@prisma/client';

// Force dynamic rendering to always fetch fresh data
export const dynamic = 'force-dynamic';

type ProductWithImages = Product & { images: PrismaImage[] };

// Default settings for fallback
const defaultSettings = {
  heroImage1: 'https://images.unsplash.com/photo-1543512214-318c7553f230?w=400',
  heroImage2: 'https://images.unsplash.com/photo-1572726729207-a78d6feb18d7?w=800',
  heroImage3: 'https://images.unsplash.com/photo-1602028915047-37269d1a73f7?w=400',
  instagramHandle: '',
  facebookHandle: '',
  pinterestHandle: '',
};

async function getSiteSettings() {
  try {
    const settings = await prisma.siteSettings.findUnique({
      where: { id: 'site-settings' },
    });
    if (!settings) return defaultSettings;
    return {
      heroImage1: settings.heroImage1 || defaultSettings.heroImage1,
      heroImage2: settings.heroImage2 || defaultSettings.heroImage2,
      heroImage3: settings.heroImage3 || defaultSettings.heroImage3,
      instagramHandle: settings.instagramHandle || '',
      facebookHandle: settings.facebookHandle || '',
      pinterestHandle: settings.pinterestHandle || '',
    };
  } catch (error) {
    return defaultSettings;
  }
}

async function getFeaturedProducts() {
  try {
    const products = await prisma.product.findMany({
      where: { available: true, featured: true },
      include: { images: { orderBy: { order: 'asc' } } },
      take: 6,
      orderBy: { createdAt: 'desc' },
    });
    return products;
  } catch (error) {
    return [];
  }
}

async function getRecentProducts() {
  try {
    const products = await prisma.product.findMany({
      where: { available: true },
      include: { images: { orderBy: { order: 'asc' } } },
      take: 8,
      orderBy: { createdAt: 'desc' },
    });
    return products;
  } catch (error) {
    return [];
  }
}

async function getApprovedTestimonials() {
  try {
    const testimonials = await prisma.testimonial.findMany({
      where: { approved: true },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });
    return testimonials.map((t: Testimonial) => ({
      title: 'Customer Review',
      quote: t.message,
      author: t.name,
      rating: t.rating,
    }));
  } catch (error) {
    return [];
  }
}

export default async function HomePage() {
  const [featuredProducts, recentProducts, siteSettings, testimonials] = await Promise.all([
    getFeaturedProducts(),
    getRecentProducts(),
    getSiteSettings(),
    getApprovedTestimonials(),
  ]);

  const storySteps = [
    { title: 'We Start with the Finest Materials', description: 'We carefully source premium, eco-friendly materials that ensure quality and sustainability in every piece.' },
    { title: 'Handcrafted with Loving Care', description: 'Each item is meticulously crafted by skilled artisans who pour their heart into every detail.' },
    { title: 'Delivered to Your Door', description: 'We package each piece with care and deliver it safely to bring joy to your home.' },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <HeroSection 
        heroImage1={siteSettings.heroImage1}
        heroImage2={siteSettings.heroImage2}
        heroImage3={siteSettings.heroImage3}
        instagramHandle={siteSettings.instagramHandle}
        facebookHandle={siteSettings.facebookHandle}
        pinterestHandle={siteSettings.pinterestHandle}
      />

      {/* The Story Section */}
      <section className="py-16 bg-dark-100">
        <div className="container mx-auto px-6">
          <FadeIn className="text-center mb-10">
            <h2 className="font-serif text-4xl md:text-5xl text-text-primary tracking-wide">
              The Story Of Our Creations
            </h2>
          </FadeIn>

          {/* Story steps with decorative line */}
          <div className="max-w-4xl mx-auto relative">
            {/* Decorative curved line */}
            <svg className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-24 text-text-muted/30" viewBox="0 0 200 80">
              <path d="M 0 80 Q 100 0 200 80" stroke="currentColor" strokeWidth="1" fill="none" />
            </svg>

            <div className="grid md:grid-cols-3 gap-8 pt-16">
              {storySteps.map((step, index) => (
                <FadeIn key={step.title} className="text-center">
                  <h3 className="font-serif text-xl text-accent-primary mb-4 uppercase tracking-wider">
                    {step.title}
                  </h3>
                  <p className="text-text-secondary text-sm leading-relaxed">
                    {step.description}
                  </p>
                </FadeIn>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products - Candly Style */}
      {featuredProducts.length > 0 && (
        <section className="py-12 bg-dark-200">
          <div className="container mx-auto px-6">
            <FadeIn className="text-center mb-10">
              <span className="text-accent-primary font-serif uppercase tracking-widest text-sm mb-4 block">
                ✦ Curated Selection ✦
              </span>
              <h2 className="font-serif text-4xl md:text-5xl text-text-primary tracking-wide">
                Featured Creations
              </h2>
            </FadeIn>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featuredProducts.slice(0, 3).map((product: ProductWithImages, index: number) => (
                <FadeIn key={product.id}>
                  <div className="bg-white/5 backdrop-blur-sm rounded-2xl overflow-hidden border border-surface-50/20 hover:border-accent-primary/40 transition-all duration-300 group">
                    <div className="relative aspect-[4/3] overflow-hidden rounded-t-2xl">
                      <Image
                        src={product.images[0]?.url || 'https://images.unsplash.com/photo-1602607122844-4c68e21ea0fd?w=600'}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-6 text-center">
                      <h3 className="font-serif text-xl text-text-primary mb-2 uppercase tracking-wider">
                        {product.name}
                      </h3>
                      <p className="text-text-secondary text-sm mb-4 line-clamp-2">
                        {product.description || 'Handcrafted with care and attention to detail.'}
                      </p>
                      {product.price && (
                        <p className="text-text-primary font-serif text-xl mb-4">
                          ${product.price.toFixed(2)}
                        </p>
                      )}
                      <Link
                        href={`/product/${product.slug}`}
                        className="inline-block w-full py-3 bg-dark-300 text-white font-serif tracking-wider uppercase hover:bg-accent-primary transition-colors"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>

            <FadeIn className="text-center mt-12">
              <Link 
                href="/shop" 
                className="inline-block px-10 py-4 border-2 border-text-primary text-text-primary font-serif tracking-widest uppercase hover:bg-text-primary hover:text-dark-100 transition-all duration-300"
              >
                View All Products
              </Link>
            </FadeIn>
          </div>
        </section>
      )}

      {/* Testimonials Section */}
      {testimonials.length > 0 && (
        <Testimonials testimonials={testimonials} />
      )}

      {/* CTA Section - Candly Style */}
      <section className="py-16 bg-dark-200">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <FadeIn>
              <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-text-primary leading-tight uppercase tracking-wide">
                Immerse Yourself in a World of Unique Decors with Our Creations
              </h2>
            </FadeIn>
            <FadeIn>
              <p className="text-text-secondary leading-relaxed uppercase tracking-wider text-sm">
                Enjoy a wide range of handcrafted pieces that will create a{' '}
                <span className="text-text-primary font-semibold">unique atmosphere in your home</span>.
                From elegant decor to thoughtful gifts, we have something{' '}
                <span className="text-text-primary font-semibold">for every style you have</span>.
              </p>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Recent Products */}
      {recentProducts.length > 0 && (
        <section className="py-20 bg-dark-100">
          <div className="container mx-auto px-6">
            <FadeIn className="text-center mb-16">
              <h2 className="font-serif text-4xl md:text-5xl text-text-primary tracking-wide">
                Latest Arrivals
              </h2>
              <p className="text-text-secondary mt-4 max-w-2xl mx-auto">
                Fresh additions to our collection, crafted with passion and care
              </p>
            </FadeIn>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {recentProducts.slice(0, 4).map((product: ProductWithImages, index: number) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </div>

            <FadeIn className="text-center mt-12">
              <Link 
                href="/shop" 
                className="inline-block px-10 py-4 border border-surface-50/50 text-text-primary font-serif tracking-widest uppercase hover:border-accent-primary hover:text-accent-primary transition-all duration-300"
              >
                Browse Collection
              </Link>
            </FadeIn>
          </div>
        </section>
      )}

      {/* Empty State */}
      {featuredProducts.length === 0 && recentProducts.length === 0 && (
        <section className="py-20 bg-dark-100">
          <div className="container mx-auto px-6 text-center">
            <FadeIn>
              <h2 className="font-serif text-4xl text-text-primary mb-6">Coming Soon</h2>
              <p className="text-text-secondary max-w-xl mx-auto mb-8">
                Our beautiful collection is being curated. Check back soon for exquisite handcrafted pieces!
              </p>
              <Link 
                href="/admin" 
                className="inline-block px-10 py-4 bg-accent-primary text-white font-serif tracking-widest uppercase hover:bg-accent-primary/90 transition-colors"
              >
                Add Your First Product
              </Link>
            </FadeIn>
          </div>
        </section>
      )}
    </div>
  );
}
