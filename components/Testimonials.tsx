'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';

interface Testimonial {
  quote: string;
  author: string;
  title?: string;
  rating?: number;
}

interface TestimonialsProps {
  testimonials: Testimonial[];
}

export default function Testimonials({ testimonials }: TestimonialsProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const next = () => {
    setCurrentIndex((prev) => (prev + 2) % testimonials.length);
  };

  const prev = () => {
    setCurrentIndex((prev) => (prev - 2 + testimonials.length) % testimonials.length);
  };

  const visibleTestimonials = [
    testimonials[currentIndex],
    testimonials[(currentIndex + 1) % testimonials.length],
  ];

  return (
    <div className="relative">
      {/* Background image with blur */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-30"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1602607122844-4c68e21ea0fd?w=1600)',
        }}
      />
      <div className="absolute inset-0 bg-dark-100/80 backdrop-blur-sm" />

      <div className="relative py-12">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-center gap-6">
            {/* Previous button */}
            <button
              onClick={prev}
              className="p-2 rounded-full border border-surface-50/50 text-text-secondary hover:text-accent-primary hover:border-accent-primary transition-colors"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Testimonial cards */}
            <div className="flex gap-6 max-w-4xl">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex gap-6 w-full"
                >
                  {visibleTestimonials.map((testimonial, index) => (
                    <div
                      key={index}
                      className="flex-1 bg-white/95 backdrop-blur-sm rounded-2xl p-8 shadow-xl"
                    >
                      {/* Star Rating */}
                      {testimonial.rating && (
                        <div className="flex gap-1 mb-4">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-5 h-5 ${
                                star <= testimonial.rating!
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                      </div>
                    )}
                    <p className="text-dark-200 leading-relaxed mb-6 text-lg">
                      "{testimonial.quote}"
                    </p>
                    <p className="text-dark-300 font-serif tracking-widest uppercase text-sm font-semibold">
                      — {testimonial.author}
                    </p>
                  </div>
                ))}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Next button */}
            <button
              onClick={next}
              className="p-2 rounded-full border border-surface-50/50 text-text-secondary hover:text-accent-primary hover:border-accent-primary transition-colors"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
