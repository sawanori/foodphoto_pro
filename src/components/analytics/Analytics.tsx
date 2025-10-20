'use client'

import { useEffect } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import Script from 'next/script'

interface AnalyticsProps {
  googleAnalyticsId?: string
  googleTagManagerId?: string
  facebookPixelId?: string
  enableDebugMode?: boolean
}

export function Analytics({
  googleAnalyticsId,
  googleTagManagerId,
  facebookPixelId,
  enableDebugMode = false
}: AnalyticsProps) {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Track page views
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const url = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : '')
      
      // Google Analytics pageview
      if (googleAnalyticsId && 'gtag' in window) {
        // @ts-expect-error - Global gtag and dataLayer types not available
        window.gtag('config', googleAnalyticsId, {
          page_path: url,
        })
      }

      // Google Tag Manager pageview
      if (googleTagManagerId && 'dataLayer' in window) {
        const windowAny = window as { dataLayer?: unknown[] }
        windowAny.dataLayer = windowAny.dataLayer || []
        if (Array.isArray(windowAny.dataLayer)) {
          windowAny.dataLayer.push({
            event: 'page_view',
            page_path: url,
            page_title: document.title,
          })
        }
      }

      // Facebook Pixel pageview
      if (facebookPixelId && 'fbq' in window) {
        // @ts-expect-error - Global gtag and dataLayer types not available
        window.fbq('track', 'PageView')
      }

      if (enableDebugMode) {
        console.log('Analytics: Page view tracked', { url, title: document.title })
      }
    }
  }, [pathname, searchParams, googleAnalyticsId, googleTagManagerId, facebookPixelId, enableDebugMode])

  return (
    <>
      {/* Google Analytics */}
      {googleAnalyticsId && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsId}`}
            strategy="afterInteractive"
          />
          <Script
            id="google-analytics"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${googleAnalyticsId}', {
                  send_page_view: false,
                  anonymize_ip: true,
                  allow_google_signals: false,
                  allow_ad_personalization_signals: false,
                  cookie_flags: 'SameSite=Strict;Secure',
                  custom_map: {
                    'custom_parameter_1': 'business_type',
                    'custom_parameter_2': 'service_category'
                  }
                });
              `
            }}
          />
        </>
      )}

      {/* Google Tag Manager */}
      {googleTagManagerId && (
        <>
          <Script
            id="google-tag-manager"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                })(window,document,'script','dataLayer','${googleTagManagerId}');
              `
            }}
          />
          <noscript
            dangerouslySetInnerHTML={{
              __html: `
                <iframe src="https://www.googletagmanager.com/ns.html?id=${googleTagManagerId}"
                height="0" width="0" style="display:none;visibility:hidden"></iframe>
              `
            }}
          />
        </>
      )}

      {/* Facebook Pixel */}
      {facebookPixelId && (
        <Script
          id="facebook-pixel"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '${facebookPixelId}');
              fbq('track', 'PageView');
            `
          }}
        />
      )}
    </>
  )
}

// Event tracking utilities
export const trackEvent = {
  contact: (method: string) => {
    if (typeof window !== 'undefined') {
      // Google Analytics
      if ('gtag' in window) {
        // @ts-expect-error - Global gtag and dataLayer types not available
        window.gtag('event', 'contact', {
          event_category: 'engagement',
          event_label: method,
          value: 1
        })
      }

      // Google Tag Manager
      if ('dataLayer' in window) {
        // @ts-expect-error - Global gtag and dataLayer types not available
        window.dataLayer.push({
          event: 'contact_form_submission',
          contact_method: method,
          value: 1
        })
      }

      // Facebook Pixel
      if ('fbq' in window) {
        // @ts-expect-error - Global gtag and dataLayer types not available
        window.fbq('track', 'Contact', { content_name: method })
      }
    }
  },

  portfolioView: (category: string, projectId?: string) => {
    if (typeof window !== 'undefined') {
      if ('gtag' in window) {
        // @ts-expect-error - Global gtag and dataLayer types not available
        window.gtag('event', 'portfolio_view', {
          event_category: 'content',
          event_label: category,
          custom_parameter_1: 'portfolio',
          custom_parameter_2: category,
          project_id: projectId
        })
      }

      if ('dataLayer' in window) {
        // @ts-expect-error - Global gtag and dataLayer types not available
        window.dataLayer.push({
          event: 'portfolio_engagement',
          category: category,
          project_id: projectId,
          content_type: 'portfolio'
        })
      }
    }
  },

  serviceInquiry: (serviceType: string) => {
    if (typeof window !== 'undefined') {
      if ('gtag' in window) {
        // @ts-expect-error - Global gtag and dataLayer types not available
        window.gtag('event', 'service_inquiry', {
          event_category: 'conversion',
          event_label: serviceType,
          value: 10,
          custom_parameter_2: serviceType
        })
      }

      if ('dataLayer' in window) {
        // @ts-expect-error - Global gtag and dataLayer types not available
        window.dataLayer.push({
          event: 'service_inquiry',
          service_type: serviceType,
          value: 10,
          currency: 'JPY'
        })
      }

      if ('fbq' in window) {
        // @ts-expect-error - Global gtag and dataLayer types not available
        window.fbq('track', 'Lead', {
          content_name: serviceType,
          content_category: 'service',
          value: 10,
          currency: 'JPY'
        })
      }
    }
  },

  downloadResource: (resourceName: string, resourceType: string) => {
    if (typeof window !== 'undefined') {
      if ('gtag' in window) {
        // @ts-expect-error - Global gtag and dataLayer types not available
        window.gtag('event', 'file_download', {
          event_category: 'engagement',
          event_label: resourceName,
          file_name: resourceName,
          file_extension: resourceType
        })
      }

      if ('dataLayer' in window) {
        // @ts-expect-error - Global gtag and dataLayer types not available
        window.dataLayer.push({
          event: 'file_download',
          file_name: resourceName,
          file_type: resourceType
        })
      }
    }
  },

  scrollDepth: (percentage: number) => {
    if (typeof window !== 'undefined' && percentage > 0) {
      if ('gtag' in window) {
        // @ts-expect-error - Global gtag and dataLayer types not available
        window.gtag('event', 'scroll', {
          event_category: 'engagement',
          event_label: `${percentage}%`,
          value: percentage
        })
      }

      if ('dataLayer' in window) {
        // @ts-expect-error - Global gtag and dataLayer types not available
        window.dataLayer.push({
          event: 'scroll_depth',
          scroll_percentage: percentage
        })
      }
    }
  },

  videoPlay: (videoTitle: string, videoCategory: string) => {
    if (typeof window !== 'undefined') {
      if ('gtag' in window) {
        // @ts-expect-error - Global gtag and dataLayer types not available
        window.gtag('event', 'video_play', {
          event_category: 'video',
          event_label: videoTitle,
          video_title: videoTitle,
          video_category: videoCategory
        })
      }

      if ('dataLayer' in window) {
        // @ts-expect-error - Global gtag and dataLayer types not available
        window.dataLayer.push({
          event: 'video_engagement',
          video_title: videoTitle,
          video_category: videoCategory,
          action: 'play'
        })
      }
    }
  },

  searchConsoleEvent: (query: string, position: number, clicks: number) => {
    if (typeof window !== 'undefined') {
      if ('gtag' in window) {
        // @ts-expect-error - Global gtag and dataLayer types not available
        window.gtag('event', 'search_result_click', {
          event_category: 'search',
          event_label: query,
          search_query: query,
          search_position: position,
          value: clicks
        })
      }
    }
  }
}

// Custom hook for scroll depth tracking
export function useScrollDepthTracking() {
  useEffect(() => {
    const milestones = [25, 50, 75, 90, 100]
    const tracked = new Set<number>()

    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop
      const documentHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight
      const scrollPercentage = Math.round((scrollTop / documentHeight) * 100)

      milestones.forEach(milestone => {
        if (scrollPercentage >= milestone && !tracked.has(milestone)) {
          tracked.add(milestone)
          trackEvent.scrollDepth(milestone)
        }
      })
    }

    let timeoutId: NodeJS.Timeout
    const throttledHandleScroll = () => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(handleScroll, 100)
    }

    window.addEventListener('scroll', throttledHandleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', throttledHandleScroll)
      clearTimeout(timeoutId)
    }
  }, [])
}

// Search Console integration helper
export function setupSearchConsoleTracking() {
  if (typeof window !== 'undefined') {
    // Track internal search if implemented
    const searchForms = document.querySelectorAll('form[role="search"]')
    searchForms.forEach(form => {
      form.addEventListener('submit', (e) => {
        const formData = new FormData(e.target as HTMLFormElement)
        const query = formData.get('q') || formData.get('search') || formData.get('query')
        
        if (query && typeof query === 'string') {
          if ('gtag' in window) {
            // @ts-expect-error - Global gtag and dataLayer types not available
            window.gtag('event', 'search', {
              search_term: query
            })
          }
        }
      })
    })

    // Track outbound links
    document.addEventListener('click', (e) => {
      const target = e.target as HTMLElement
      const link = target.closest('a') as HTMLAnchorElement
      
      if (link && link.hostname !== window.location.hostname) {
        if ('gtag' in window) {
          // @ts-expect-error - Global gtag and dataLayer types not available
          window.gtag('event', 'click', {
            event_category: 'outbound',
            event_label: link.href,
            transport_type: 'beacon'
          })
        }
      }
    })
  }
}