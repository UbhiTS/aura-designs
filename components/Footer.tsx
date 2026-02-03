'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaPinterestP, FaFacebookF, FaInstagram } from 'react-icons/fa';

interface SocialHandles {
  instagramHandle: string;
  facebookHandle: string;
  pinterestHandle: string;
}

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [socialHandles, setSocialHandles] = useState<SocialHandles>({
    instagramHandle: '',
    facebookHandle: '',
    pinterestHandle: '',
  });

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

  const hasSocialHandles = socialHandles.instagramHandle || socialHandles.facebookHandle || socialHandles.pinterestHandle;

  return (
    <footer className="bg-dark-200 text-text-secondary border-t border-surface-50/30">
      {/* Main Footer */}
      <div className="container mx-auto px-6 py-16">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          {/* Brand */}
          <div>
            <Link href="/" className="block">
              <span className="font-serif text-3xl font-semibold text-text-primary tracking-widest uppercase">
                Aura<span className="text-accent-primary">*</span>
              </span>
            </Link>
          </div>

          {/* Social Icons */}
          {hasSocialHandles && (
            <div className="flex items-center gap-6">
              {socialHandles.pinterestHandle && (
                <a
                  href={`https://pinterest.com/${socialHandles.pinterestHandle}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-text-secondary hover:text-red-500 transition-colors"
                >
                  <FaPinterestP size={20} />
                </a>
              )}
              {socialHandles.facebookHandle && (
                <a
                  href={`https://facebook.com/${socialHandles.facebookHandle}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-text-secondary hover:text-blue-500 transition-colors"
                >
                  <FaFacebookF size={20} />
                </a>
              )}
              {socialHandles.instagramHandle && (
                <a
                  href={`https://instagram.com/${socialHandles.instagramHandle.replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-text-secondary hover:text-pink-400 transition-colors"
                >
                  <FaInstagram size={20} />
                </a>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-surface-50/30">
        <div className="container mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-text-muted text-sm">
            <p>&copy; Copyright {currentYear}</p>
            <p className="text-center">
              Handcrafted with love
            </p>
            <Link href="/about" className="hover:text-text-primary transition-colors">
              About Us
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
