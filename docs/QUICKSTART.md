# Quick Start Guide

## Local Development Setup

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Set Up Environment Variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Edit `.env` and add your database URL:

```env
DATABASE_URL="postgresql://user:password@localhost:5432/grant_aggregator?schema=public"
CRON_SECRET="your-secure-random-string-here"
```

### 3. Set Up Database

Generate Prisma Client:

```bash
pnpm db:generate
```

Push schema to database:

```bash
pnpm db:push
```

Or create a migration:

```bash
pnpm db:migrate
```

### 4. Run Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## First Steps

1. **Visit the Home Page**: See the landing page with stats and categories
2. **Browse Grants**: Go to `/grants` to see all available grants
3. **View Grant Details**: Click on any grant to see full details
4. **Admin Dashboard**: Visit `/admin` to manage scraping jobs
5. **Trigger Scraping**: Click "Run Scraping Job" in admin to fetch grants

## Testing Scrapers

To test a specific scraper:

```typescript
import { scrapers } from "@/lib/scrapers";

const grants = await scrapers.awsCredits();
console.log(grants);
```

## Database Management

### View Data in Prisma Studio

```bash
pnpm db:studio
```

This opens a GUI to view and edit your database.

### Reset Database

```bash
pnpm exec prisma migrate reset
```

⚠️ **Warning**: This will delete all data!

## Common Commands

```bash
# Development
pnpm dev              # Start dev server
pnpm build           # Build for production
pnpm start           # Start production server

# Database
pnpm db:push         # Push schema changes
pnpm db:migrate      # Create migration
pnpm db:studio       # Open Prisma Studio
pnpm db:generate     # Generate Prisma Client

# Linting
pnpm lint            # Run ESLint
```

## Next Steps

1. **Customize Scrapers**: Update scrapers to match actual website structures
2. **Add More Sources**: Follow `docs/SCRAPING.md` to add new grant sources
3. **Deploy**: Follow `docs/DEPLOYMENT.md` to deploy to Vercel

## Troubleshooting

### Database Connection Error
- Verify DATABASE_URL is correct
- Ensure PostgreSQL is running
- Check database credentials

### Build Errors
- Run `pnpm install` to ensure all dependencies are installed
- Check Node.js version (requires 18+)
- Clear `.next` folder and rebuild

### Scraping Not Working
- Check network connectivity
- Verify target websites are accessible
- Review scraper implementation in `lib/scrapers/index.ts`
- Check admin dashboard for error messages
