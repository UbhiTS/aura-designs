'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Share2, Heart } from 'lucide-react';
import { useState } from 'react';

interface ProductImage {
  id: string;
  url: string;
  alt?: string | null;
}

interface Product {
  id: string;
  name: string;
  description?: string | null;
  price?: number | null;
  category: string;
  images: ProductImage[];
  featured: boolean;
}

interface ProductCardProps {
  product: Product;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [copied, setCopied] = useState(false);

  const shareProduct = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const url = `${window.location.origin}/product/${product.id}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: product.description || 'Check out this beautiful product!',
          url,
        });
      } catch (err) {
        // User cancelled or error
      }
    } else {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const mainImage = product.images[0]?.url || '/placeholder.jpg';

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
    >
      <Link href={`/product/${product.id}`}>
        <div
          className="elegant-card group cursor-pointer"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Image Container */}
          <div className="relative aspect-square overflow-hidden bg-surface-300">
            <Image
              src={mainImage}
              alt={product.images[0]?.alt || product.name}
              fill
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
            
            {/* Overlay */}
            <div className={`absolute inset-0 bg-dark-900/40 transition-opacity duration-300 ${
              isHovered ? 'opacity-100' : 'opacity-0'
            }`} />

            {/* Action Buttons */}
            <div className={`absolute top-4 right-4 flex flex-col gap-2 transition-all duration-300 ${
              isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
            }`}>
              <button
                onClick={shareProduct}
                className="w-10 h-10 rounded-xl bg-surface-200/90 backdrop-blur-sm flex items-center justify-center hover:bg-accent-primary hover:text-white transition-colors text-text-primary"
                title="Share"
              >
                <Share2 className="w-4 h-4" />
              </button>
              <button
                onClick={(e) => e.preventDefault()}
                className="w-10 h-10 rounded-xl bg-surface-200/90 backdrop-blur-sm flex items-center justify-center hover:bg-accent-primary hover:text-white transition-colors text-text-primary"
                title="Add to favorites"
              >
                <Heart className="w-4 h-4" />
              </button>
            </div>

            {/* Copied notification */}
            {copied && (
              <div className="absolute top-4 left-4 bg-accent-primary text-white px-3 py-1 rounded-full text-sm">
                Link copied!
              </div>
            )}

            {/* Category Badge */}
            <div className="absolute bottom-4 left-4">
              <span className="px-3 py-1 bg-surface-200/90 backdrop-blur-sm rounded-lg text-xs uppercase tracking-wider text-text-secondary font-medium">
                {product.category}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="p-5">
            <h3 className="font-serif text-xl text-text-primary mb-2 group-hover:text-accent-primary transition-colors duration-300 font-semibold">
              {product.name}
            </h3>
            {product.description && (
              <p className="text-text-muted text-sm line-clamp-2 mb-3">
                {product.description}
              </p>
            )}
            {product.price && (
              <p className="font-serif text-lg text-accent-primary font-semibold">
                ${product.price.toFixed(2)}
              </p>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
