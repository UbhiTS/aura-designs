'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { RefreshCcw, Home, Sparkles } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-dark-100 flex items-center justify-center pt-20">
      <div className="container mx-auto px-6 text-center">
        <Sparkles className="w-20 h-20 text-accent-primary mx-auto mb-8 opacity-50" />
        
        <h1 className="font-sans font-bold text-4xl text-text-primary mb-4">
          Something Went Wrong
        </h1>
        
        <p className="text-text-secondary text-lg max-w-md mx-auto mb-10">
          We apologize for the inconvenience. Please try again or return to our homepage.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button onClick={reset} className="btn-primary inline-flex items-center gap-2">
            <RefreshCcw className="w-5 h-5" />
            Try Again
          </button>
          <Link href="/" className="btn-secondary inline-flex items-center gap-2">
            <Home className="w-5 h-5" />
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
