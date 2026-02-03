'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import { Instagram, Facebook, MessageSquare } from 'lucide-react';
import { FaPinterest } from 'react-icons/fa';
import TestimonialModal from './TestimonialModal';

interface HeroSectionProps {
  heroImage1?: string;
  heroImage2?: string;
  heroImage3?: string;
  instagramHandle?: string;
  facebookHandle?: string;
  pinterestHandle?: string;
}

const defaultImages = {
  heroImage1: 'https://images.unsplash.com/photo-1543512214-318c7553f230?w=400',
  heroImage2: 'https://images.unsplash.com/photo-1572726729207-a78d6feb18d7?w=800',
  heroImage3: 'https://images.unsplash.com/photo-1603905179080-e37d78c4217a?w=400',
};

export default function HeroSection({ 
  heroImage1 = defaultImages.heroImage1, 
  heroImage2 = defaultImages.heroImage2, 
  heroImage3 = defaultImages.heroImage3,
  instagramHandle = '',
  facebookHandle = '',
  pinterestHandle = '',
}: HeroSectionProps) {
  const [isTestimonialOpen, setIsTestimonialOpen] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    setHasMounted(true);
  }, []);

  // Only apply initial animation states after mount to prevent SSR flash
  const shouldAnimate = hasMounted && !prefersReducedMotion;

  return (
    <>
      <TestimonialModal isOpen={isTestimonialOpen} onClose={() => setIsTestimonialOpen(false)} />
      <section className="relative bg-dark-100 overflow-hidden pt-20 pb-8">
        {/* Dot pattern background */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />

        {/* Glowing orbs */}
        <motion.div
          animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-20 left-[10%] w-64 h-64 rounded-full bg-accent-primary/20 blur-3xl"
        />
        <motion.div
          animate={{ y: [0, 20, 0], rotate: [0, -5, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute bottom-32 right-[15%] w-80 h-80 rounded-full bg-accent-secondary/15 blur-3xl"
        />

        {/* Decorative curved lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none">
          <motion.path
            initial={shouldAnimate ? { pathLength: 0, opacity: 0 } : false}
            animate={{ pathLength: 1, opacity: 0.15 }}
            transition={{ duration: 2, ease: "easeInOut" }}
            d="M 200 100 Q 400 300 300 500 Q 200 700 400 800"
            stroke="currentColor"
            strokeWidth="1"
            fill="none"
            className="text-text-muted"
          />
          <motion.path
            initial={shouldAnimate ? { pathLength: 0, opacity: 0 } : false}
            animate={{ pathLength: 1, opacity: 0.15 }}
            transition={{ duration: 2, delay: 0.5, ease: "easeInOut" }}
            d="M 800 50 Q 600 200 700 400 Q 800 600 600 750"
            stroke="currentColor"
            strokeWidth="1"
            fill="none"
            className="text-text-muted"
          />
        </svg>

        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-8 items-center min-h-[50vh]">
            {/* Left side - Images */}
            <div className="relative flex items-center justify-center">
              {/* Small circular image - top left */}
              <motion.div
                initial={shouldAnimate ? { opacity: 0, x: -50 } : false}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="absolute left-0 top-0 w-32 h-32 lg:w-40 lg:h-40 rounded-full overflow-hidden border-2 border-surface-50/30 z-10 hero-glow-1"
              >
                <Image
                  src={heroImage1}
                  alt="Artisan decor"
                  fill
                  className="object-cover"
                />
              </motion.div>

              {/* Main large circular image */}
              <motion.div
                initial={shouldAnimate ? { opacity: 0, scale: 0.8 } : false}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="relative w-72 h-72 md:w-96 md:h-96 rounded-full overflow-hidden border-4 border-surface-50/20 hero-glow-2"
              >
                {/* Decorative ring */}
                <div className="absolute -inset-4 border border-text-muted/20 rounded-full" />
                <div className="absolute -inset-8 border border-text-muted/10 rounded-full" />
                
                <Image
                  src={heroImage2}
                  alt="Featured product"
                  fill
                  className="object-cover"
                />
              </motion.div>

              {/* Small circular image - bottom right */}
              <motion.div
                initial={shouldAnimate ? { opacity: 0, x: 50 } : false}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="absolute right-0 bottom-0 w-36 h-36 lg:w-44 lg:h-44 rounded-full overflow-hidden border-2 border-surface-50/30 hero-glow-3"
              >
                <Image
                  src={heroImage3}
                  alt="Home decor"
                  fill
                  className="object-cover"
                />
              </motion.div>
            </div>

            {/* Right side - Content */}
            <div className="text-center lg:text-left lg:pl-24 xl:pl-32 relative z-20">
              <motion.p
                initial={shouldAnimate ? { opacity: 0, y: 20 } : false}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-text-secondary text-lg mb-6 max-w-md mx-auto lg:mx-0"
              >
                Let our handcrafted pieces transform your home into a cozy haven filled with unique character.
              </motion.p>

              <motion.div
                initial={shouldAnimate ? { opacity: 0, y: 20 } : false}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="relative z-20 flex flex-col gap-3 items-center lg:items-start"
              >
                <a
                  href="/shop"
                  className="inline-block w-[300px] text-center py-4 bg-dark-300 text-white font-serif text-lg tracking-widest uppercase border-2 border-dark-300 hover:bg-transparent hover:text-text-primary transition-all duration-300 cursor-pointer relative z-20"
                >
                  Shop Now
                </a>
                <button
                  onClick={() => setIsTestimonialOpen(true)}
                  className="inline-flex w-[300px] items-center justify-center gap-2 py-3 bg-transparent text-text-secondary font-serif text-sm tracking-widest uppercase border border-surface-50/50 hover:border-accent-primary hover:text-accent-primary transition-all duration-300 cursor-pointer relative z-20"
                >
                  <MessageSquare className="w-4 h-4" />
                  Leave a Testimonial
                </button>
              </motion.div>
            </div>
          </div>

          {/* Title and Follow Us section */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8 pb-8">
            <motion.div
              initial={shouldAnimate ? { opacity: 0, y: 30 } : false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <h1 className="font-serif text-6xl md:text-8xl lg:text-9xl font-bold text-text-primary tracking-tight">
                Find your <span className="text-gradient">Aura</span>
              </h1>
            </motion.div>

            {/* Follow Us Section */}
            {(instagramHandle || facebookHandle || pinterestHandle) && (
              <motion.div
                initial={shouldAnimate ? { opacity: 0, y: 30 } : false}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1 }}
                className="pb-4 relative z-10"
              >
                <h3 className="font-serif text-lg text-text-secondary uppercase tracking-widest mb-4">Follow Us</h3>
                <div className="flex gap-4 flex-wrap">
                  {instagramHandle && (
                    <a 
                      href={`https://instagram.com/${instagramHandle.replace('@', '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 border border-surface-50/50 rounded-full hover:border-pink-400 hover:text-pink-400 transition-colors text-text-secondary cursor-pointer"
                    >
                      <Instagram className="w-5 h-5" />
                      <span className="text-sm">{instagramHandle}</span>
                    </a>
                  )}
                  {facebookHandle && (
                    <a 
                      href={`https://facebook.com/${facebookHandle}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 border border-surface-50/50 rounded-full hover:border-blue-500 hover:text-blue-500 transition-colors text-text-secondary cursor-pointer"
                    >
                      <Facebook className="w-5 h-5" />
                      <span className="text-sm">{facebookHandle}</span>
                    </a>
                  )}
                  {pinterestHandle && (
                    <a 
                      href={`https://pinterest.com/${pinterestHandle}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 border border-surface-50/50 rounded-full hover:border-red-500 hover:text-red-500 transition-colors text-text-secondary cursor-pointer"
                    >
                      <FaPinterest className="w-5 h-5" />
                      <span className="text-sm">{pinterestHandle}</span>
                    </a>
                  )}
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Feature highlights - Candly style */}
        <div className="border-t border-surface-50/30">
          <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-3 gap-0 divide-y md:divide-y-0 md:divide-x divide-surface-50/30">
              {[
                { title: 'Handmade', description: 'Each piece is carefully crafted by skilled artisans, ensuring uniqueness and attention to detail.' },
                { title: 'Eco-Friendly', description: 'We use sustainable materials and practices to minimize our environmental footprint.' },
                { title: 'Made with Love', description: 'Every creation is infused with passion and care, bringing warmth to your home.' },
              ].map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={shouldAnimate ? { opacity: 0, y: 20 } : false}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="py-8 px-8 text-center"
                >
                  <h3 className="font-serif text-2xl text-text-primary mb-4 uppercase tracking-widest">
                    {feature.title}
                  </h3>
                  <div className="w-12 h-px bg-accent-primary mx-auto mb-4" />
                  <p className="text-text-secondary text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
