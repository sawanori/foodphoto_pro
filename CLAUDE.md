# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**foodphotopro** is a Japanese food photography service landing page built as a Next.js 15 application with TypeScript, React 19, and Tailwind CSS v4. The site uses the App Router architecture with Turbopack for fast builds and is optimized for SEO and performance.

## Development Commands

### Running the Application
- **Development server**: `npm run dev` (uses Turbopack)
  - Starts at http://localhost:3000
  - Hot-reload enabled for instant updates
- **Production build**: `npm run build` (uses Turbopack)
- **Production start**: `npm start`
- **Type checking**: `npx tsc --noEmit`

### Post-Build
- **Sitemap generation**: `npm run postbuild` (runs `next-sitemap` automatically after build)

### Testing
- **Run all tests**: `npm test` (runs Playwright tests)
- **Run tests with UI**: `npm run test:ui` (opens Playwright UI mode)
- **Run tests in headed mode**: `npm run test:headed` (shows browser during tests)
- **Run specific test file**: `npx playwright test e2e/chat.spec.ts`
- **Run specific test**: `npx playwright test e2e/chat.spec.ts:4` (runs test at line 4)
- **Run on specific browser**: `npx playwright test --project=chromium`

Test configuration:
- Test directory: `./e2e`
- Base URL: `http://localhost:3000`
- Browsers: Chromium, Firefox, WebKit, Mobile Chrome, Mobile Safari
- Auto-starts dev server before tests
- Screenshots captured on failure
- Traces captured on first retry

## Architecture

### Tech Stack
- **Framework**: Next.js 15.5.4 with App Router
- **Build Tool**: Turbopack (enabled via `--turbopack` flag)
- **Runtime**: React 19.1.0
- **Styling**: Tailwind CSS v4 with PostCSS
- **Fonts**: Geist Sans and Geist Mono (via `next/font/google`)
- **Validation**: Zod for schema validation
- **Email**: SendGrid for transactional emails
- **Database**: Supabase (with fallback to mock API)
- **3D Graphics**: React Three Fiber and Drei
- **Animation**: Framer Motion

### Project Structure
```
foodphotopro/
├── app/                        # Next.js App Router
│   ├── api/                    # API routes
│   │   └── foodphoto-order/    # Form submission endpoint
│   ├── area/[area]/            # Dynamic area pages (Shibuya, Shinjuku, etc.)
│   ├── blog/[slug]/            # Dynamic blog posts
│   ├── form/                   # Main order form
│   ├── checkform/              # Form verification page
│   ├── pricing/                # Pricing page
│   ├── FoodPhotoClient.tsx     # Homepage client component
│   ├── metadata.ts             # SEO metadata configuration
│   └── structured-data.ts      # JSON-LD structured data
├── src/
│   ├── components/             # Shared React components
│   │   ├── ui/                 # UI primitives (buttons, cards, etc.)
│   │   ├── 3d/                 # Three.js/R3F components
│   │   ├── layout/             # Layout components (nav, footer)
│   │   ├── services/           # Service-specific components
│   │   └── chat/               # Chat widget components
│   ├── lib/                    # Core libraries and utilities
│   │   ├── foodOrderSchema.ts  # Zod schema for form validation
│   │   ├── supabase.ts         # Supabase client
│   │   ├── env.ts              # Environment variable validation
│   │   ├── chat/               # Chat API abstraction (mock/Supabase)
│   │   └── csrf.ts             # CSRF token handling
│   ├── utils/                  # Utility functions
│   ├── hooks/                  # Custom React hooks
│   ├── data/                   # Static data (portfolio, reviews, areas)
│   └── types/                  # TypeScript type definitions
└── public/                     # Static assets
```

### Path Aliases
- `@/*` maps to `./src/*` (configured in tsconfig.json:22)

### Styling Architecture
- **Tailwind CSS v4** with new `@import "tailwindcss"` syntax in `app/globals.css`
- CSS custom properties for theming (`--background`, `--foreground`)
- Dark mode via `prefers-color-scheme` media query
- Inline theme configuration with `@theme inline` directive
- Font variables injected via `next/font/google` and exposed to Tailwind

### API Routes

#### POST /api/foodphoto-order
Handles food photography order form submissions. Features:
- Zod validation using `formSchema` from `@/lib/foodOrderSchema`
- Dual email sending: admin notification + customer confirmation
- SendGrid integration for email delivery
- Price calculation based on plan, extra time, and options
- Honeypot field (`website`) for spam prevention

#### Chat API (`/api/chat/*`)
- `POST /api/chat/start` - Start a new conversation
- `GET /api/chat/history` - Get message history for a conversation
- `POST /api/chat/send` - Send a message
- `POST /api/chat/update-contact` - Update contact information

#### Admin API (`/api/admin/*`)
Admin panel for managing chat inquiries:
- `POST /api/admin/auth/login` - Admin authentication (bcrypt + session cookie)
- `POST /api/admin/auth/logout` - End admin session
- `GET /api/admin/auth/verify` - Verify admin session
- `GET /api/admin/conversations` - List all chat conversations
- `GET /api/admin/messages` - Get messages for a conversation
- `POST /api/admin/reply` - Send admin reply
- `POST /api/admin/update-status` - Update conversation status

Admin pages:
- `/admin/login` - Admin login page
- `/admin/inbox` - Chat inbox management

**Required Environment Variables:**
- `SENDGRID_API_KEY`, `SENDGRID_FROM_EMAIL`
- `SENDGRID_TO` (or defaults to `SENDGRID_FROM_EMAIL`)
- `SUPABASE_SERVICE_ROLE_KEY` (for admin operations)

### Data Layer

#### Chat System
The chat system uses an abstraction pattern with two implementations:
- **Mock API** (`src/lib/chat/mockApi.ts`): In-memory storage for development
- **Supabase API** (`src/lib/chat/supabaseApi.ts`): Production database

Controlled by `NEXT_PUBLIC_USE_MOCK` environment variable.

#### Form Validation
All form submissions use Zod schemas defined in `src/lib/foodOrderSchema.ts`:
- **Security**: Regex validation for Japanese postal codes, phone numbers, katakana
- **Pricing**: Automatic calculation via `calcTotalJPY()`
- **Plans**: Light (¥33,000), Standard (¥44,000), Premium (¥88,000)
- **Options**: Extra time, location scouting (¥11,000), site improvement (¥100,000)

### SEO & Performance Features

#### Static Site Generation
- Pages use ISR (Incremental Static Regeneration) with 1-hour revalidation
- Area pages dynamically generated for major Tokyo locations
- Sitemap auto-generated via `next-sitemap` with dual-domain support

#### Image Optimization
- Remote images from Vercel Blob Storage configured in `next.config.ts`
- Critical image preloading (see `app/image-optimization.ts`)
- Responsive image loading with placeholders

#### Core Web Vitals
- Web Vitals monitoring in `app/web-vitals.ts`
- Critical CSS inlining (see `app/critical-css.ts`)
- Performance utilities in `app/performance-utils.ts`

#### Structured Data
Comprehensive JSON-LD schemas in `app/structured-data.ts`:
- LocalBusiness schema with service area
- FAQ schema for voice search optimization
- HowTo schema for service explanations
- Breadcrumb navigation

### Dual-Domain Configuration
The application supports two domains via environment variable:
- **foodphoto-pro.com**: Food photography service (controlled by `NEXT_PUBLIC_SITE_DOMAIN`)
- **non-turn.com**: Portfolio/general site

Configuration in `next-sitemap.config.js`:
- Different sitemap priorities for each domain
- Separate area page configurations
- Domain-specific path filtering

### Component Patterns

#### Client/Server Component Split
- Server components for static content and SEO metadata
- Client components suffixed with `Client.tsx` (e.g., `FoodPhotoClient.tsx`)
- Dynamic imports for heavy components (3D graphics, animations)

#### 3D Graphics
- Lazy-loaded Three.js components with fallbacks
- Optimized versions in `src/components/3d/Optimized*.tsx`
- Dynamic imports to reduce initial bundle size
- Conditional rendering based on device capabilities

#### Performance Optimizations
- Intersection Observer for lazy loading (`src/hooks/useIntersectionObserver.ts`)
- Progressive image loading (`src/hooks/useProgressiveImageLoad.ts`)
- PWA support with service worker (`src/components/providers/PWAProvider.tsx`)

### Environment Variables

See `.env.example` for complete list. Critical variables:
- **SendGrid**: `SENDGRID_API_KEY`, `SENDGRID_FROM_EMAIL`
- **Supabase**: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
- **Chat Feature**: `NEXT_PUBLIC_USE_MOCK=true` (use mock API for development, false for Supabase)
- **LINE Notifications**: `LINE_CHANNEL_ACCESS_TOKEN`, `LINE_ADMIN_GROUP_ID`, `ADMIN_NOTIFY_ENABLED` (admin alerts on new inquiries)
- **Google Maps**: `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`
- **Site Config**: `NEXT_PUBLIC_SITE_DOMAIN`, `NEXT_PUBLIC_SITE_URL`
- **Analytics**: `NEXT_PUBLIC_GTM_ID` (Google Tag Manager)

Environment validation handled in `src/lib/env.ts` using Zod.

### TypeScript Configuration
- **Strict mode** enabled (`strict: true`)
- **Target**: ES2017 for optimal compatibility
- **Module Resolution**: Bundler mode
- **Path Aliases**: `@/*` → `./src/*`

### Key Libraries & Utilities

#### Form Handling
- **Zod**: Runtime type validation
- **Honeypot**: Anti-spam field in forms
- **CSRF**: Token-based protection (see `src/lib/csrf.ts`)
- **Rate Limiting**: LRU cache-based rate limiter (`src/lib/rate-limit.ts`)

#### UI Components
Comprehensive component library in `src/components/ui/`:
- `AdvancedButton`, `GradientButton` - Enhanced button components
- `GlassCard`, `AdvancedCard` - Card components with effects
- `HeroSection` - Hero component with animations
- `FAQSection`, `ReviewSection` - Structured content sections
- `StatCounter` - Animated statistics
- `ParticleSystem` - Canvas-based particle effects

#### Hooks
Custom hooks in `src/hooks/`:
- `useIntersectionObserver` - Element visibility detection
- `useScrollAnimation` - Scroll-triggered animations
- `usePWA` - Progressive Web App features
- `usePricingCalculator` - Dynamic pricing calculation
- `useCSRFToken` - CSRF token management

### Accessibility
- Accessibility enhancements in `app/accessibility.ts` and `app/accessibility.css`
- ARIA attributes throughout components
- Screen reader support
- Keyboard navigation
- Focus trap utilities (`src/hooks/useFocusTrap.ts`)

### Testing & Debugging
- TypeScript strict mode catches errors at compile time
- Environment variable validation at runtime (production only)
- Console warnings for missing configuration
- Mock APIs for local development without external dependencies
