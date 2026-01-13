# Grant Aggregator Platform - Project Overview

## Purpose
A web-based grant tracking and aggregation platform that automatically fetches, categorizes, and displays grants from various online sources. The platform focuses on grants related to Cloud Compute, Health AI, Finance AI, and LLM API tokens (Claude, OpenAI, Google Gemini, etc.).

## Key Features
- Automated grant scraping from multiple sources
- Categorization by Cloud Compute, Health AI, Finance AI, and LLM Tokens
- Save & bookmark functionality
- Deadline tracking
- Advanced filtering and search
- Responsive design
- Admin dashboard for scraping management

## Tech Stack

### Frontend
- **Next.js 14+** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **shadcn/ui** for UI components
- **TanStack Query** (React Query) for data fetching

### Backend
- **Next.js API Routes** (serverless)
- **Prisma ORM** with PostgreSQL
- **Zod** for validation

### Scraping
- **Cheerio** for HTML parsing
- **Axios** for HTTP requests
- **Puppeteer** for dynamic content (when needed)
- **node-cron** for scheduling (local dev)

### Deployment
- **Vercel** for hosting
- **Vercel Cron** for scheduled scraping jobs

## Project Structure
```
Grant-Aggregator/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   ├── grants/        # Grant CRUD endpoints
│   │   ├── scrape/        # Scraping job endpoints
│   │   └── user/          # User saved grants endpoints
│   ├── grants/            # Grant pages (list, detail)
│   ├── saved/             # Saved grants page
│   ├── admin/             # Admin dashboard
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── ui/                # shadcn/ui components
│   └── layout/            # Layout components (Header, Footer)
├── lib/                   # Utility functions
│   ├── scrapers/          # Web scraping modules
│   ├── scheduler.ts       # Cron job scheduler
│   └── prisma.ts          # Prisma client singleton
├── prisma/                # Database schema
│   └── schema.prisma     # Prisma schema definition
└── public/                # Static assets
```

## Database Models
- **Grant**: Stores grant information (title, description, category, deadline, etc.)
- **ScrapingJob**: Tracks scraping job execution and status
- **User**: User accounts and saved grants

## Environment Variables
- `DATABASE_URL`: PostgreSQL connection string
- `NEXTAUTH_SECRET`: Secret for authentication
- `NEXTAUTH_URL`: Application URL
- `CRON_SECRET`: Secret for securing cron endpoints
- `ANTHROPIC_API_KEY`: Optional, for AI matching feature
- `EMAIL_SERVER`: Optional, for email notifications
- `REDIS_URL`: Optional, for caching
