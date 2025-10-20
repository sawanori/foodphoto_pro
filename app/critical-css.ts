/**
 * Critical CSS for above-the-fold content
 * This CSS is inlined for faster initial rendering
 */

export const criticalCSS = `
/* Reset and base styles */
*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  line-height: 1.5;
  -webkit-text-size-adjust: 100%;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

body {
  margin: 0;
  background-color: rgb(36, 35, 35);
  color: white;
}

/* Critical layout styles */
.min-h-screen {
  min-height: 100vh;
}

.relative {
  position: relative;
}

.fixed {
  position: fixed;
}

.absolute {
  position: absolute;
}

.inset-0 {
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
}

.z-50 {
  z-index: 50;
}

/* Critical flexbox styles */
.flex {
  display: flex;
}

.items-center {
  align-items: center;
}

.justify-center {
  justify-content: center;
}

.justify-between {
  justify-content: space-between;
}

/* Critical spacing */
.p-4 {
  padding: 1rem;
}

.px-4 {
  padding-left: 1rem;
  padding-right: 1rem;
}

.py-3 {
  padding-top: 0.75rem;
  padding-bottom: 0.75rem;
}

/* Critical typography */
.text-sm {
  font-size: 0.875rem;
  line-height: 1.25rem;
}

.text-4xl {
  font-size: 2.25rem;
  line-height: 2.5rem;
}

.font-bold {
  font-weight: 700;
}

.text-white {
  color: white;
}

.text-gray-500 {
  color: rgb(107, 114, 128);
}

/* Critical hero section */
.hero-section {
  height: 100vh;
  overflow: hidden;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

/* Critical loading styles */
.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Critical breadcrumb styles */
.bg-white {
  background-color: white;
}

.border-b {
  border-bottom-width: 1px;
}

.max-w-6xl {
  max-width: 72rem;
}

.mx-auto {
  margin-left: auto;
  margin-right: auto;
}

/* Critical button styles */
.bg-orange-500 {
  background-color: rgb(249, 115, 22);
}

.hover\\:bg-orange-600:hover {
  background-color: rgb(234, 88, 12);
}

.rounded-full {
  border-radius: 9999px;
}

.transition-colors {
  transition-property: color, background-color, border-color;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}

/* Critical image styles */
.object-cover {
  object-fit: cover;
}

.w-full {
  width: 100%;
}

.h-full {
  height: 100%;
}

/* Mobile optimizations */
@media (max-width: 768px) {
  .text-4xl {
    font-size: 1.875rem;
    line-height: 2.25rem;
  }
  
  .hero-section {
    height: 100dvh;
  }
}

/* Prevent layout shift */
img {
  max-width: 100%;
  height: auto;
  display: block;
}

/* Font loading optimization */
.font-loading {
  visibility: hidden;
}

.fonts-loaded .font-loading {
  visibility: visible;
}
`

/**
 * Generate critical CSS with custom values
 */
export function generateCriticalCSS(options?: {
  primaryColor?: string
  backgroundColor?: string
}) {
  const { 
    primaryColor = '#fbbf24',
    backgroundColor = 'rgb(36, 35, 35)'
  } = options || {}
  
  return criticalCSS
    .replace(/rgb\(36, 35, 35\)/g, backgroundColor)
    .replace(/#fbbf24/g, primaryColor)
}

/**
 * Extract critical CSS from existing stylesheets
 * This would be used in a build process
 */
export function extractCriticalCSS(html: string, css: string): string {
  // This is a placeholder for actual critical CSS extraction
  // In production, you'd use tools like critical, critters, or penthouse
  return criticalCSS
}