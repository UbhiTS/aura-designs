'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';

interface CircularImageProps {
  src: string;
  alt: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  delay?: number;
  showCurve?: boolean;
  curvePosition?: 'left' | 'right' | 'top' | 'bottom';
}

const sizes = {
  sm: 'w-32 h-32',
  md: 'w-48 h-48',
  lg: 'w-64 h-64',
  xl: 'w-80 h-80',
};

export default function CircularImage({
  src,
  alt,
  size = 'md',
  className = '',
  delay = 0,
  showCurve = false,
  curvePosition = 'right',
}: CircularImageProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      className={`relative ${className}`}
    >
      {/* Decorative curve */}
      {showCurve && (
        <svg
          className={`absolute ${
            curvePosition === 'right' ? '-right-8 top-1/2 -translate-y-1/2' :
            curvePosition === 'left' ? '-left-8 top-1/2 -translate-y-1/2 rotate-180' :
            curvePosition === 'top' ? 'left-1/2 -top-8 -translate-x-1/2 -rotate-90' :
            'left-1/2 -bottom-8 -translate-x-1/2 rotate-90'
          } w-16 h-32 text-text-muted/30`}
          viewBox="0 0 50 100"
          fill="none"
        >
          <path
            d="M 0 0 Q 50 50 0 100"
            stroke="currentColor"
            strokeWidth="1"
            fill="none"
          />
        </svg>
      )}

      {/* Circular image container */}
      <div className={`${sizes[size]} rounded-full overflow-hidden border-2 border-surface-50/30 shadow-xl`}>
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover"
        />
      </div>
    </motion.div>
  );
}
