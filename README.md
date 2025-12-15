# TofuStore - E-commerce Storefront

A modern, accessible e-commerce storefront built with Next.js, featuring Algolia-powered search, persistent shopping cart, and comprehensive analytics tracking.

## Features

- 🛍️ **Product Listing Pages (PLPs)** with advanced filtering

  - Hierarchical category navigation
  - Brand, price range, and rating filters
  - Real-time search with Algolia InstantSearch
  - Shareable URLs with filter state preserved

- 📦 **Product Detail Pages (PDPs)**

  - Rich product information display
  - Image gallery with keyboard navigation
  - Related products recommendations
  - SEO-optimized with structured data

- 🛒 **Shopping Cart**

  - Persistent cart using localStorage
  - Add, remove, and update quantities
  - Real-time cart total calculations
  - Checkout flow with form validation

- 📊 **Analytics Tracking**

  - Comprehensive event tracking (product views, cart actions, checkout)
  - Server-side analytics processing
  - Type-safe event schemas with Zod validation
  - Sensible payload structure for analytics services

- ♿ **Accessibility**

  - WCAG-compliant implementation
  - Full keyboard navigation support
  - Screen reader optimized
  - ARIA labels and live regions

- 🔍 **SEO Optimized**
  - Dynamic sitemap generation
  - Structured data (JSON-LD)
  - Open Graph and Twitter Card support
  - Canonical URLs and meta tags

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Search**: Algolia InstantSearch
- **State Management**: Zustand
- **Form Validation**: Zod
- **UI Components**: Radix UI
- **Icons**: Lucide React

## Prerequisites

- Node.js 18+
- pnpm (or npm/yarn)
- Algolia account with:
  - Application ID
  - Search API Key
  - Products index

## Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd tofu-store
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Set up environment variables

Create a `.env.local` file in the root directory:

```env
# Algolia Configuration (Required)
NEXT_PUBLIC_ALGOLIA_APP_ID=your_algolia_app_id
NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY=your_search_api_key
NEXT_PUBLIC_ALGOLIA_INDEX_NAME=your_index_name

# Base URL (Optional - defaults to https://tofustore.com)
NEXT_PUBLIC_BASE_URL=http://localhost:3000 // tofu-store-git-main-tofucode-devs-projects.vercel.app
```

### 4. Generate category slugs

Before running the app, generate category slug mappings:

```bash
pnpm generate:slugs
```

This script fetches categories from Algolia and generates slug mappings for SEO-friendly URLs.

### 5. Run the development server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm generate:slugs` - Generate category slug mappings

## Project Structure

```
tofu-store/
├── app/                      # Next.js App Router pages
│   ├── actions/              # Server actions
│   │   ├── analytics.ts      # Analytics tracking
│   │   └── checkout.ts       # Checkout processing
│   ├── api/                  # API routes
│   │   └── checkout/         # Checkout endpoint
│   ├── product/              # Product detail pages
│   ├── products/             # Product listing pages
│   ├── robots.ts             # Dynamic robots.txt
│   └── sitemap.ts            # Dynamic sitemap
├── components/               # React components
│   ├── algolia/              # Algolia InstantSearch components
│   ├── analytics/            # Analytics components
│   ├── cart/                 # Shopping cart components
│   ├── layout/               # Layout components
│   ├── product/              # Product page components
│   └── products/             # Product listing components
├── lib/                      # Utility libraries
│   ├── algolia/              # Algolia client and helpers
│   ├── hooks/                # Custom React hooks
│   ├── schemas/              # Zod validation schemas
│   ├── stores/               # Zustand stores
│   └── types/                # TypeScript types
├── public/                   # Static assets
└── scripts/                  # Build scripts
    └── generate-category-slugs.ts
```

## Key Features

### Shareable Filter URLs

Filter states are preserved in the URL, making it easy to share filtered product views:

- Categories: `/products/category/subcategory`
- Search: `/products?q=search+term`
- Filters: `/products?brands=Brand1,Brand2&rating=4&price=0-100`

### Persistent Shopping Cart

The cart persists across browser sessions using localStorage, implemented with Zustand's persist middleware.

### Analytics System

The analytics system tracks:

- Product views
- Add to cart events
- Cart modifications (add, remove, update quantity)
- Checkout flow (started, completed, failed)
- Search and filter interactions

Events are validated with Zod schemas and sent to server actions for processing.

### Accessibility

The application follows WCAG 2.1 guidelines:

- Semantic HTML
- ARIA labels and roles
- Keyboard navigation support
- Screen reader announcements
- Focus management

### SEO

- Dynamic sitemap at `/sitemap.xml`
- Dynamic robots.txt at `/robots.txt`
- Structured data (JSON-LD) for products and breadcrumbs
- Open Graph and Twitter Card metadata
- Canonical URLs

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the project in [Vercel](https://vercel.com)
3. Add environment variables in the Vercel dashboard
4. Deploy

The `prebuild` script automatically generates category slugs before building.

### Other Platforms

Ensure you:

1. Set all required environment variables
2. Run `pnpm generate:slugs` before building (or use the `prebuild` hook)
3. Build with `pnpm build`
4. Start with `pnpm start`

## Environment Variables

| Variable                             | Required | Description                                            |
| ------------------------------------ | -------- | ------------------------------------------------------ |
| `NEXT_PUBLIC_ALGOLIA_APP_ID`         | Yes      | Your Algolia Application ID                            |
| `NEXT_PUBLIC_ALGOLIA_SEARCH_API_KEY` | Yes      | Your Algolia Search API Key                            |
| `NEXT_PUBLIC_ALGOLIA_INDEX_NAME`     | No       | Algolia index name (defaults to `instant_search`)      |
| `NEXT_PUBLIC_BASE_URL`               | No       | Base URL for SEO (defaults to `https://tofustore.com`) |

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Algolia InstantSearch](https://www.algolia.com/doc/guides/building-search-ui/what-is-instantsearch/)
- [Zustand Documentation](https://zustand-demo.pmnd.rs/)
- [Zod Documentation](https://zod.dev/)

## License

This project is private and proprietary.
