import Link from 'next/link';
import { Home, ArrowLeft, Sparkles } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-dark-100 flex items-center justify-center pt-20">
      <div className="container mx-auto px-6 text-center">
        <Sparkles className="w-20 h-20 text-accent-primary mx-auto mb-8 opacity-50" />
        
        <h1 className="font-sans font-bold text-8xl text-text-primary mb-4">404</h1>
        
        <h2 className="font-sans font-semibold text-3xl text-text-secondary mb-4">
          Oops! Page Not Found
        </h2>
        
        <p className="text-text-secondary text-lg max-w-md mx-auto mb-10">
          The page you're looking for seems to have wandered off. 
          Let's get you back to our beautiful collection.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/" className="btn-primary inline-flex items-center gap-2">
            <Home className="w-5 h-5" />
            Go Home
          </Link>
          <Link href="/shop" className="btn-secondary inline-flex items-center gap-2">
            <ArrowLeft className="w-5 h-5" />
            Browse Shop
          </Link>
        </div>
      </div>
    </div>
  );
}
