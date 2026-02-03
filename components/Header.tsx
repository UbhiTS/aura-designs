'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPinterestP, FaFacebookF, FaInstagram } from 'react-icons/fa';

const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/about' },
  { name: 'Shop', href: '/shop' },
];

interface SocialHandles {
  instagramHandle: string;
  facebookHandle: string;
  pinterestHandle: string;
}

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [socialHandles, setSocialHandles] = useState<SocialHandles>({
    instagramHandle: '',
    facebookHandle: '',
    pinterestHandle: '',
  });
  const { data: session } = useSession();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const fetchSocialHandles = async () => {
      try {
        const res = await fetch('/api/settings');
        if (res.ok) {
          const data = await res.json();
          setSocialHandles({
            instagramHandle: data.instagramHandle || '',
            facebookHandle: data.facebookHandle || '',
            pinterestHandle: data.pinterestHandle || '',
          });
        }
      } catch (error) {
        console.error('Failed to fetch social handles:', error);
      }
    };
    fetchSocialHandles();
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? 'bg-dark-100/95 backdrop-blur-xl shadow-lg shadow-black/20 py-4 border-b border-surface-50/30'
          : 'bg-transparent py-6'
      }`}
    >
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between">
          {/* Left Navigation */}
          <nav className="hidden md:flex items-center gap-10">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-text-secondary hover:text-text-primary transition-colors duration-300 font-sans text-sm tracking-wider uppercase"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Center Logo */}
          <Link href="/" className="absolute left-1/2 -translate-x-1/2 group">
            <span className="font-serif text-2xl md:text-3xl font-semibold text-text-primary tracking-widest uppercase">
              Aura<span className="text-accent-primary">*</span>
            </span>
          </Link>

          {/* Right - Social Icons */}
          <div className="hidden md:flex items-center gap-6">
            {session && (
              <Link
                href="/admin"
                className="text-text-secondary hover:text-accent-primary transition-colors duration-300 text-sm tracking-wider uppercase"
              >
                Admin
              </Link>
            )}
            <div className="flex items-center gap-4">
              {socialHandles.pinterestHandle && (
                <a 
                  href={`https://pinterest.com/${socialHandles.pinterestHandle.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
                >
                  <FaPinterestP size={18} />
                </a>
              )}
              {socialHandles.facebookHandle && (
                <a 
                  href={`https://facebook.com/${socialHandles.facebookHandle.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
                >
                  <FaFacebookF size={18} />
                </a>
              )}
              {socialHandles.instagramHandle && (
                <a 
                  href={`https://instagram.com/${socialHandles.instagramHandle.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
                >
                  <FaInstagram size={18} />
                </a>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-text-primary hover:text-accent-primary transition-colors ml-auto"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-dark-100/98 backdrop-blur-xl border-t border-surface-50/30"
          >
            <nav className="container mx-auto px-6 py-6 flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-text-secondary hover:text-text-primary transition-colors duration-300 font-serif py-2 text-lg tracking-wider"
                >
                  {link.name}
                </Link>
              ))}
              {session && (
                <Link
                  href="/admin"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-accent-primary hover:text-accent-secondary transition-colors duration-300 font-medium py-2"
                >
                  Admin
                </Link>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
