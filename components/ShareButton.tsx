'use client';

import { useState } from 'react';
import { Share2, Check, Copy, Facebook, Twitter, Mail } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  productSlug: string;
  productName: string;
}

export default function ShareButton({ productSlug, productName }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const productUrl = typeof window !== 'undefined' 
    ? `${window.location.origin}/product/${productSlug}`
    : '';

  const copyLink = async () => {
    await navigator.clipboard.writeText(productUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareOptions = [
    {
      name: 'Copy Link',
      icon: copied ? Check : Copy,
      action: copyLink,
      color: 'text-text-secondary',
    },
    {
      name: 'Facebook',
      icon: Facebook,
      action: () => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(productUrl)}`, '_blank'),
      color: 'text-blue-500',
    },
    {
      name: 'Twitter',
      icon: Twitter,
      action: () => window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(productUrl)}&text=${encodeURIComponent(`Check out ${productName} from Aura Designs!`)}`, '_blank'),
      color: 'text-sky-400',
    },
    {
      name: 'Email',
      icon: Mail,
      action: () => window.open(`mailto:?subject=${encodeURIComponent(`Check out ${productName}`)}&body=${encodeURIComponent(`I thought you might like this: ${productUrl}`)}`, '_blank'),
      color: 'text-text-secondary',
    },
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="btn-primary flex items-center justify-center gap-2 w-full sm:w-auto"
      >
        <Share2 className="w-5 h-5" />
        Share
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            
            {/* Dropdown */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="absolute top-full left-0 mt-2 w-48 bg-surface-200 border border-surface-300 rounded-xl shadow-lg z-50 overflow-hidden"
            >
              {shareOptions.map((option) => {
                const Icon = option.icon;
                return (
                  <button
                    key={option.name}
                    onClick={() => {
                      option.action();
                      if (option.name !== 'Copy Link') setIsOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-surface-300 transition-colors text-left ${option.color}`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-text-primary">
                      {option.name === 'Copy Link' && copied ? 'Copied!' : option.name}
                    </span>
                  </button>
                );
              })}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
