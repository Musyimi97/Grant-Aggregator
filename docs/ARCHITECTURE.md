# Architecture Documentation

## System Overview

The Grant Aggregator Platform is built using Next.js 14+ with the App Router, providing a full-stack solution for aggregating and displaying grant opportunities.

## Technology Stack

### Frontend
- **Next.js 14+**: React framework with App Router
- **TypeScript**: Type safety throughout the application
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: Reusable UI components
- **TanStack Query**: Server state management and data fetching

### Backend
- **Next.js API Routes**: Serverless API endpoints
- **Prisma**: Type-safe database ORM
- **PostgreSQL**: Relational database

### Scraping
- **Cheerio**: HTML parsing for static sites
- **Axios**: HTTP client for fetching web pages
- **Puppeteer**: Browser automation for dynamic sites (when needed)

### Scheduling
- **node-cron**: Cron job scheduling (local development)
- **Vercel Cron**: Scheduled functions for production

## Database Schema

### Grant Model
Stores grant information including:
- Basic info (title, description, organization)
- Categorization (category array, tags)
- Financial details (amount, deadline)
- Metadata (source, scraped date, active status)

### ScrapingJob Model
Tracks scraping job execution:
- Job status (running, success, failed)
- Results (grants found, errors)
- Timestamps (started, completed)


## Data Flow

### Scraping Flow
1. Cron job triggers `/api/scrape` endpoint
2. Scheduler runs all scrapers in parallel
3. Each scraper fetches and parses grant data
4. Grants are processed and saved to database
5. Duplicate detection by URL
6. Expired grants marked as inactive

### User Flow
1. User browses grants on `/grants` page
2. Filters and search applied via API
3. User clicks grant to view details
4. User can apply directly via external link

## API Endpoints

### Grants API
- `GET /api/grants` - List grants with filters
- `POST /api/grants` - Create new grant
- `GET /api/grants/[id]` - Get single grant
- `PATCH /api/grants/[id]` - Update grant
- `DELETE /api/grants/[id]` - Delete grant

### Scraping API
- `GET /api/scrape` - Triggered by Vercel Cron
- `POST /api/scrape` - Manual trigger
- `GET /api/scrape/status` - Get scraping job history


## Scraping Architecture

### Scraper Structure
Each scraper is a function that:
1. Fetches HTML from target URL
2. Parses HTML using Cheerio
3. Extracts grant data
4. Returns array of GrantData objects

### Adding New Scrapers
1. Create scraper function in `lib/scrapers/index.ts`
2. Add to `scrapers` object
3. Scraper will automatically be included in scheduled jobs

## Deployment

### Vercel Deployment
1. Connect GitHub repository
2. Configure environment variables
3. Set up PostgreSQL database (Vercel Postgres or Supabase)
4. Configure Vercel Cron for scheduled scraping
5. Deploy

### Environment Variables
- `DATABASE_URL`: PostgreSQL connection string
- `CRON_SECRET`: Secret for securing cron endpoints

## Performance Considerations

- Database indexing on frequently queried fields
- Pagination for large result sets
- Caching with TanStack Query (1 minute stale time)
- Server Components where possible
- Image optimization with Next.js Image component

## Security

- Input validation with Zod
- SQL injection prevention via Prisma
- Rate limiting on API endpoints (to be implemented)
- CORS policies
- Environment variable protection

## Future Enhancements

- Email notifications
- AI-powered grant matching
- Application tracking
- Export functionality (CSV/PDF)
- Browser extension
- RSS feeds
