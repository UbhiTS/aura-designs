import Link from 'next/link';
import { FaPinterestP, FaFacebookF, FaInstagram } from 'react-icons/fa';

export default function Footer() {
  const currentYear = new Date().getFullYear();

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
          <div className="flex items-center gap-6">
            <a
              href="#"
              className="text-text-secondary hover:text-text-primary transition-colors"
            >
              <FaPinterestP size={20} />
            </a>
            <a
              href="#"
              className="text-text-secondary hover:text-text-primary transition-colors"
            >
              <FaFacebookF size={20} />
            </a>
            <a
              href="#"
              className="text-text-secondary hover:text-text-primary transition-colors"
            >
              <FaInstagram size={20} />
            </a>
          </div>
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
