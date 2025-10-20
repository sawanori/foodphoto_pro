'use client'

import { useEffect, useCallback } from 'react'

interface WebVitalsMetric {
  name: string
  value: number
  id: string
  delta: number
  navigationType?: string
  rating?: 'good' | 'needs-improvement' | 'poor'
}

interface WebVitalsProps {
  onMetric?: (metric: WebVitalsMetric) => void
}

export function WebVitals({ onMetric }: WebVitalsProps) {
  const handleMetric = useCallback((metric: WebVitalsMetric) => {
    // Send to analytics service
    if (onMetric) {
      onMetric(metric)
    }

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`${metric.name}: ${metric.value}`)
    }

    // Send to Google Analytics (if available)
    if (typeof window !== 'undefined' && 'gtag' in window) {
      // @ts-expect-error - gtag is a global function from GA script
      window.gtag('event', metric.name, {
        value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
        event_category: 'Web Vitals',
        event_label: metric.id,
        non_interaction: true,
      })
    }

    // Send to custom analytics endpoint (optional)
    if (typeof window !== 'undefined') {
      // Only send if API endpoint exists
      fetch('/api/analytics/web-vitals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: metric.name,
          value: metric.value,
          id: metric.id,
          delta: metric.delta,
          navigationType: metric.navigationType || 'navigate',
          timestamp: Date.now(),
          url: window.location.href,
          userAgent: navigator.userAgent,
        }),
      }).catch(() => {
        // Silently fail if endpoint doesn't exist
      })
    }
  }, [onMetric])

  useEffect(() => {
    // Dynamic import to ensure client-side loading
    const loadWebVitals = async () => {
      try {
        const { onCLS, onINP, onFCP, onLCP, onTTFB } = await import('web-vitals')
        
        // Measure all Web Vitals with error handling
        onCLS(handleMetric, { reportAllChanges: true })
        onINP(handleMetric)
        onFCP(handleMetric)
        onLCP(handleMetric, { reportAllChanges: true })
        onTTFB(handleMetric)
        
        // Additional performance measurements
        if ('PerformanceObserver' in window) {
          // First Paint (FP)
          const observer = new PerformanceObserver((list) => {
            list.getEntries().forEach((entry) => {
              if (entry.name === 'first-paint') {
                handleMetric({
                  name: 'FP',
                  value: entry.startTime,
                  id: 'fp-' + Math.random().toString(36).substr(2, 9),
                  delta: entry.startTime,
                  navigationType: 'navigate',
                  rating: entry.startTime < 1000 ? 'good' : entry.startTime < 3000 ? 'needs-improvement' : 'poor',
                })
              }
            })
          })

          try {
            observer.observe({ entryTypes: ['paint'] })
          } catch {
            // Paint timing not supported in this browser
          }

          // Long tasks monitoring
          const longTaskObserver = new PerformanceObserver((list) => {
            list.getEntries().forEach((entry) => {
              if (entry.duration > 50) {
                handleMetric({
                  name: 'Long Task',
                  value: entry.duration,
                  id: 'lt-' + Math.random().toString(36).substr(2, 9),
                  delta: entry.duration,
                  navigationType: 'navigate',
                  rating: entry.duration < 50 ? 'good' : entry.duration < 100 ? 'needs-improvement' : 'poor',
                })
              }
            })
          })

          try {
            longTaskObserver.observe({ entryTypes: ['longtask'] })
          } catch {
            // Long task timing not supported in this browser
          }

          return () => {
            observer.disconnect()
            longTaskObserver.disconnect()
          }
        }
      } catch (error) {
        console.warn('Failed to load web-vitals:', error)
      }
    }

    // Only run on client side
    if (typeof window !== 'undefined') {
      loadWebVitals()
    }
  }, [handleMetric])

  return null
}

// Hook for using Web Vitals in components
export function useWebVitals(onMetric?: (metric: WebVitalsMetric) => void) {
  useEffect(() => {
    const loadWebVitals = async () => {
      try {
        const { onCLS, onINP, onFCP, onLCP, onTTFB } = await import('web-vitals')
        
        const handleMetric = (metric: WebVitalsMetric) => {
          if (onMetric) {
            onMetric(metric)
          }
        }

        onCLS(handleMetric)
        onINP(handleMetric)
        onFCP(handleMetric)
        onLCP(handleMetric)
        onTTFB(handleMetric)
      } catch (error) {
        console.warn('Failed to load web-vitals in hook:', error)
      }
    }

    if (typeof window !== 'undefined') {
      loadWebVitals()
    }
  }, [onMetric])
}

// Performance budget monitoring
export function performanceBudget() {
  if (typeof window === 'undefined') return

  const budgets = {
    FCP: 1800, // First Contentful Paint
    LCP: 2500, // Largest Contentful Paint
    FID: 100,  // First Input Delay
    CLS: 0.1,  // Cumulative Layout Shift
    TTFB: 800, // Time to First Byte
  }

  const loadWebVitals = async () => {
    try {
      const { onCLS, onINP, onFCP, onLCP, onTTFB } = await import('web-vitals')
      
      const checkBudget = (metric: WebVitalsMetric) => {
        const budget = budgets[metric.name as keyof typeof budgets]
        if (budget && metric.value > budget) {
          console.warn(`Performance budget exceeded for ${metric.name}: ${metric.value} > ${budget}`)
          
          // Send alert to monitoring service
          if (process.env.NODE_ENV === 'production') {
            fetch('/api/performance/budget-alert', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                metric: metric.name,
                value: metric.value,
                budget,
                url: window.location.href,
                timestamp: Date.now(),
              }),
            }).catch(() => {
              // Silently fail if endpoint doesn't exist
            })
          }
        }
      }

      onCLS(checkBudget)
      onINP(checkBudget)
      onFCP(checkBudget)
      onLCP(checkBudget)
      onTTFB(checkBudget)
    } catch (error) {
      console.warn('Failed to load web-vitals for budget monitoring:', error)
    }
  }

  loadWebVitals()
}