import React, { useEffect, useRef, useState } from 'react';
import { ArrowUp } from 'lucide-react';

/**
 * Hook to detect if the user prefers reduced motion
 */
export function usePrefersReducedMotion(): boolean {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const listener = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };
    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, []);

  return prefersReducedMotion;
}

/**
 * Lightweight scroll reveal hook using standard browser IntersectionObserver
 */
export function useScrollReveal<T extends HTMLElement = HTMLDivElement>(options: {
  threshold?: number;
  rootMargin?: string;
  once?: boolean;
} = {}) {
  const { threshold = 0.12, rootMargin = '0px 0px -40px 0px', once = true } = options;
  const ref = useRef<T | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const prefersReduced = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReduced) {
      setIsVisible(true);
      return;
    }

    const node = ref.current;
    if (!node) return;

    if (typeof IntersectionObserver === 'undefined') {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) {
            observer.unobserve(node);
          }
        } else if (!once) {
          setIsVisible(false);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold, rootMargin, once, prefersReduced]);

  return [ref, isVisible] as const;
}

/**
 * Top slim scroll progress bar with institutional sovereign colors (Lightweight CSS)
 */
export const ScrollProgressBar: React.FC = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const container = document.getElementById('main-scroll-container');
      if (container) {
        const scrollY = container.scrollTop;
        const totalHeight = container.scrollHeight - container.clientHeight;
        if (totalHeight > 0) {
          setProgress(Math.min(100, Math.max(0, (scrollY / totalHeight) * 100)));
        } else {
          setProgress(0);
        }
        return;
      }

      const scrollY = window.scrollY;
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        setProgress(Math.min(100, Math.max(0, (scrollY / totalHeight) * 100)));
      }
    };

    const container = document.getElementById('main-scroll-container');
    if (container) {
      container.addEventListener('scroll', handleScroll, { passive: true });
    }
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      if (container) {
        container.removeEventListener('scroll', handleScroll);
      }
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div
      className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-700 via-emerald-600 to-amber-500 origin-left z-50 pointer-events-none transition-[width] duration-150 ease-out"
      style={{ width: `${progress}%` }}
    />
  );
};

/**
 * Floating Back-to-Top button with scroll progress percentage (Lightweight CSS)
 */
export const BackToTopButton: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [scrollPercent, setScrollPercent] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const container = document.getElementById('main-scroll-container');
      if (container) {
        const scrollY = container.scrollTop;
        const docHeight = container.scrollHeight - container.clientHeight;
        const percent = docHeight > 0 ? Math.round((scrollY / docHeight) * 100) : 0;
        setScrollPercent(percent);
        setVisible(scrollY > 240);
        return;
      }

      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const percent = docHeight > 0 ? Math.round((scrollY / docHeight) * 100) : 0;
      setScrollPercent(percent);
      setVisible(scrollY > 240);
    };

    const container = document.getElementById('main-scroll-container');
    if (container) {
      container.addEventListener('scroll', handleScroll, { passive: true });
    }
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      if (container) {
        container.removeEventListener('scroll', handleScroll);
      }
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    const container = document.getElementById('main-scroll-container');
    if (container) {
      container.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <button
      type="button"
      onClick={scrollToTop}
      className={`fixed bottom-6 right-6 z-40 bg-slate-900/90 backdrop-blur-xs text-white border border-slate-700 shadow-xl rounded-full p-2.5 flex items-center gap-2 hover:bg-slate-800 transition-all duration-300 transform cursor-pointer group ${
        visible
          ? 'opacity-100 translate-y-0 pointer-events-auto scale-100'
          : 'opacity-0 translate-y-4 pointer-events-none scale-95'
      }`}
      title="Scroll back to top"
      aria-label="Scroll back to top"
    >
      <ArrowUp className="w-4 h-4 text-blue-400 group-hover:-translate-y-0.5 transition-transform" />
      <span className="text-[11px] font-mono font-bold pr-1 text-slate-300">
        {scrollPercent}%
      </span>
    </button>
  );
};

/**
 * Lightweight ScrollReveal component to smoothly fade in elements using Tailwind classes
 */
export interface ScrollRevealProps {
  children: React.ReactNode;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  distance?: 'sm' | 'md' | 'lg' | 'none';
  duration?: number;
  threshold?: number;
  once?: boolean;
  className?: string;
  as?: React.ElementType;
  style?: React.CSSProperties;
}

export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  delay = 0,
  direction = 'up',
  distance = 'md',
  duration = 700,
  threshold = 0.1,
  once = true,
  className = '',
  as: Component = 'div',
  style,
}) => {
  const [ref, isVisible] = useScrollReveal<HTMLDivElement>({ threshold, once });
  const prefersReduced = usePrefersReducedMotion();

  const getHiddenTransform = () => {
    if (prefersReduced || direction === 'none' || distance === 'none') {
      return '';
    }

    const distMap = {
      sm: {
        up: 'slide-in-from-bottom-2',
        down: 'slide-in-from-top-4',
        left: 'slide-in-from-right-4',
        right: 'slide-in-from-left-4',
      },
      md: {
        up: 'slide-in-from-bottom-6',
        down: 'slide-in-from-top-4',
        left: 'slide-in-from-right-4',
        right: 'slide-in-from-left-4',
      },
      lg: {
        up: 'slide-in-from-bottom-8',
        down: 'slide-in-from-top-4',
        left: 'slide-in-from-right-4',
        right: 'slide-in-from-left-4',
      },
    };

    return distMap[distance][direction];
  };

  const slideInClass = getHiddenTransform();

  return (
    <Component
      ref={ref}
      style={{
        animationDuration: prefersReduced ? '0ms' : `${duration}ms`,
        animationDelay: prefersReduced ? '0ms' : `${delay}ms`,
        animationFillMode: 'both',
        ...style,
      }}
      className={`${
        isVisible
          ? `animate-in fade-in ${slideInClass} duration-700 ease-out fill-mode-both`
          : 'opacity-0'
      } ${className}`}
    >
      {children}
    </Component>
  );
};
