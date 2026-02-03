'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { ReactNode, useState, useEffect } from 'react';

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

// Hook to check if the component has mounted (hydrated)
function useHasMounted() {
  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => {
    setHasMounted(true);
  }, []);
  return hasMounted;
}

export function FadeIn({ children, className = '', delay = 0 }: AnimatedSectionProps) {
  const hasMounted = useHasMounted();
  const prefersReducedMotion = useReducedMotion();
  
  return (
    <motion.div
      initial={hasMounted && !prefersReducedMotion ? { opacity: 0, y: 20 } : false}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function FadeInUp({ children, className = '', delay = 0 }: AnimatedSectionProps) {
  const hasMounted = useHasMounted();
  const prefersReducedMotion = useReducedMotion();
  
  return (
    <motion.div
      initial={hasMounted && !prefersReducedMotion ? { opacity: 0, y: 40 } : false}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function SlideInLeft({ children, className = '', delay = 0 }: AnimatedSectionProps) {
  const hasMounted = useHasMounted();
  const prefersReducedMotion = useReducedMotion();
  
  return (
    <motion.div
      initial={hasMounted && !prefersReducedMotion ? { opacity: 0, x: -50 } : false}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function SlideInRight({ children, className = '', delay = 0 }: AnimatedSectionProps) {
  const hasMounted = useHasMounted();
  const prefersReducedMotion = useReducedMotion();
  
  return (
    <motion.div
      initial={hasMounted && !prefersReducedMotion ? { opacity: 0, x: 50 } : false}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function ScaleIn({ children, className = '', delay = 0 }: AnimatedSectionProps) {
  const hasMounted = useHasMounted();
  const prefersReducedMotion = useReducedMotion();
  
  return (
    <motion.div
      initial={hasMounted && !prefersReducedMotion ? { opacity: 0, scale: 0.9 } : false}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerContainer({ children, className = '' }: { children: ReactNode; className?: string }) {
  const hasMounted = useHasMounted();
  const prefersReducedMotion = useReducedMotion();
  
  return (
    <motion.div
      initial={hasMounted && !prefersReducedMotion ? "hidden" : false}
      whileInView="visible"
      viewport={{ once: true }}
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.15,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.6, ease: 'easeOut' },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
