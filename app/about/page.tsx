import Image from 'next/image';
import Link from 'next/link';
import { FadeIn, FadeInUp, SlideInLeft, SlideInRight } from '@/components/AnimatedSection';
import { Heart, Sparkles, Leaf, Award, Star } from 'lucide-react';
import prisma from '@/lib/prisma';

export const metadata = {
  title: 'About Us | Aura Designs',
  description: 'Learn about Aura Designs - our story, our passion for handcrafted decor, and our commitment to bringing elegance to every home.',
};

export const dynamic = 'force-dynamic';

async function getSettings() {
  try {
    const settings = await prisma.siteSettings.findUnique({
      where: { id: 'site-settings' },
    });
    return settings;
  } catch (error) {
    console.error('Failed to fetch settings:', error);
    return null;
  }
}

export default async function AboutPage() {
  const settings = await getSettings();
  const aboutImage = settings?.aboutImage || '';
  
  const values = [
    {
      icon: Heart,
      title: 'Made with Love',
      description: 'Every piece is crafted with passion and care, infusing love into each creation.',
    },
    {
      icon: Sparkles,
      title: 'Unique Designs',
      description: 'No two pieces are exactly alike. Each item carries its own special character.',
    },
    {
      icon: Leaf,
      title: 'Eco-Conscious',
      description: 'We prioritize sustainable materials and eco-friendly practices.',
    },
    {
      icon: Award,
      title: 'Premium Quality',
      description: 'Only the finest materials make it into our handcrafted pieces.',
    },
  ];

  return (
    <div className="min-h-screen bg-cream-50">
      {/* Hero Section */}
      <section className="relative min-h-[70vh] flex items-center justify-center bg-gradient-to-br from-cream-100 via-cream-50 to-rose-light/20 pt-24">
        <div className="container mx-auto px-6 text-center">
          <FadeIn>
            <span className="text-rose-gold font-medium uppercase tracking-wider text-sm mb-4 block">
              ✦ Our Story ✦
            </span>
            <h1 className="font-serif text-5xl md:text-7xl text-charcoal-800 mb-6">
              About Aura Designs
            </h1>
            <p className="text-xl md:text-2xl text-charcoal-500 max-w-3xl mx-auto leading-relaxed">
              Where artistry meets heart, creating beautiful pieces that transform 
              spaces and touch souls.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-24 bg-dark-200">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <SlideInLeft>
              <div className="relative">
                <div className="aspect-[4/5] rounded-3xl overflow-hidden bg-surface-300">
                  {aboutImage ? (
                    <Image
                      src={aboutImage}
                      alt="About Aura Designs"
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <Sparkles className="w-20 h-20 text-accent-primary/30 mx-auto mb-4" />
                        <p className="text-text-muted italic">Your photo here</p>
                      </div>
                    </div>
                  )}
                </div>
                <div className="absolute -bottom-8 -right-8 w-48 h-48 bg-accent-primary/10 rounded-full blur-3xl -z-10" />
              </div>
            </SlideInLeft>

            <SlideInRight>
              <span className="text-accent-primary font-medium uppercase tracking-wider text-sm mb-4 block">
                The Beginning
              </span>
              <h2 className="font-sans font-bold text-4xl text-text-primary mb-6">
                A Passion for Beauty
              </h2>
              <div className="space-y-4 text-text-secondary text-lg leading-relaxed">
                <p>
                  Aura Designs was born from a simple belief: that beautiful, 
                  handcrafted pieces can transform ordinary spaces into extraordinary 
                  sanctuaries of comfort and style.
                </p>
                <p>
                  What started as a creative outlet has blossomed into a labor of love, 
                  with each candle poured, each gift wrapped, and each decor piece 
                  crafted with intention and care.
                </p>
                <p>
                  We believe that the objects we surround ourselves with should tell 
                  a story, evoke emotions, and bring joy to everyday moments.
                </p>
              </div>
            </SlideInRight>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-24 bg-dark-100">
        <div className="container mx-auto px-6">
          <FadeIn className="text-center mb-16">
            <h2 className="font-sans font-bold text-4xl text-text-primary mb-4">Our Values</h2>
            <p className="text-xl text-text-secondary">
              The principles that guide every creation
            </p>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <FadeInUp key={value.title} delay={index * 0.1}>
                  <div className="bg-surface-200 border border-surface-300 rounded-2xl p-8 text-center hover:border-accent-primary/30 transition-all h-full">
                    <div className="w-16 h-16 rounded-2xl bg-accent-primary/10 flex items-center justify-center mx-auto mb-6">
                      <Icon className="w-8 h-8 text-accent-primary" />
                    </div>
                    <h3 className="font-sans font-semibold text-xl text-text-primary mb-3">
                      {value.title}
                    </h3>
                    <p className="text-text-secondary">
                      {value.description}
                    </p>
                  </div>
                </FadeInUp>
              );
            })}
          </div>
        </div>
      </section>

      {/* Quote Section */}
      <section className="py-24 bg-gradient-to-br from-accent-primary/10 via-dark-200 to-accent-secondary/10 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent-primary rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent-secondary rounded-full blur-3xl" />
        </div>
        
        <div className="container mx-auto px-6 text-center relative z-10">
          <FadeIn>
            <Star className="w-12 h-12 text-accent-primary mx-auto mb-8" />
            <blockquote className="font-sans text-3xl md:text-4xl italic text-text-primary max-w-4xl mx-auto leading-relaxed mb-8">
              "Every piece we create carries a piece of our heart. We don't just make 
              products; we create memories, moments, and a little bit of magic."
            </blockquote>
            <p className="text-accent-primary font-medium">— The Aura Designs Team</p>
          </FadeIn>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-dark-200">
        <div className="container mx-auto px-6 text-center">
          <FadeIn>
            <h2 className="font-sans font-bold text-4xl text-text-primary mb-6">Ready to Explore?</h2>
            <p className="text-xl text-text-secondary max-w-2xl mx-auto mb-10">
              Discover our collection of handcrafted treasures and find the perfect 
              piece to elevate your space.
            </p>
            <Link href="/shop" className="btn-primary">
              Browse Our Collection
            </Link>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
