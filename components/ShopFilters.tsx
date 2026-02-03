'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';

interface Props {
  categories: string[];
  activeCategory?: string;
}

export default function ShopFilters({ categories, activeCategory }: Props) {
  const router = useRouter();

  const allCategories = ['all', ...categories];

  return (
    <div className="flex flex-wrap justify-center gap-3 mb-12">
      {allCategories.map((category) => {
        const isActive = category === 'all' 
          ? !activeCategory 
          : category === activeCategory;

        return (
          <Link
            key={category}
            href={category === 'all' ? '/shop' : `/shop?category=${category}`}
            className={`relative px-6 py-2.5 rounded-xl text-sm font-medium capitalize transition-all duration-300 ${
              isActive
                ? 'text-white'
                : 'text-text-secondary hover:text-accent-primary bg-surface-200 hover:bg-surface-100 border border-surface-50/50'
            }`}
          >
            {isActive && (
              <motion.div
                layoutId="activeCategory"
                className="absolute inset-0 bg-accent-primary rounded-xl"
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            )}
            <span className="relative z-10">{category}</span>
          </Link>
        );
      })}
    </div>
  );
}
