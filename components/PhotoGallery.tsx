'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Eye } from 'lucide-react';

interface PhotoGalleryProps {
  images: { src: string; alt: string; productSlug?: string }[];
}

export default function PhotoGallery({ images }: PhotoGalleryProps) {
  const displayImages = images.slice(0, 9);

  return (
    <section className="py-12 bg-dark-100">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-3 gap-4 max-w-4xl mx-auto">
          {displayImages.map((image, index) => {
            const content = (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="group relative aspect-square overflow-hidden rounded-2xl cursor-pointer"
              >
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-dark-300/0 group-hover:bg-dark-300/40 transition-colors duration-300 flex items-center justify-center">
                  <Eye className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </motion.div>
            );

            return image.productSlug ? (
              <Link key={index} href={`/product/${image.productSlug}`}>
                {content}
              </Link>
            ) : (
              <div key={index}>{content}</div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
