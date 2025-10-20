import { useEffect, useState, useRef, MutableRefObject } from 'react';

interface UseIntersectionObserverProps {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
}

export function useIntersectionObserver<T extends HTMLElement = HTMLDivElement>({
  threshold = 0.1,
  rootMargin = '50px',
  triggerOnce = true
}: UseIntersectionObserverProps = {}): [MutableRefObject<T | null>, boolean] {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);
  const targetRef = useRef<T | null>(null);

  useEffect(() => {
    const element = targetRef.current;
    if (!element || typeof IntersectionObserver === 'undefined') return;

    if (triggerOnce && hasTriggered) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isNowIntersecting = entry.isIntersecting;
        setIsIntersecting(isNowIntersecting);
        
        if (isNowIntersecting && triggerOnce) {
          setHasTriggered(true);
        }
      },
      {
        threshold,
        rootMargin
      }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [threshold, rootMargin, triggerOnce, hasTriggered]);

  return [targetRef, triggerOnce ? (isIntersecting || hasTriggered) : isIntersecting];
}