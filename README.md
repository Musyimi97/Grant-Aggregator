# Grant Aggregator Platform

A web-based grant tracking and aggregation platform that automatically fetches, categorizes, and displays grants from various online sources. Focuses on grants related to Cloud Compute, Health AI, Finance AI, and LLM API tokens.

## Features

- 🔍 **Automated Grant Scraping**: Automatically fetches grants from multiple sources (runs twice daily)
- 📊 **Categorization**: Organizes grants by Cloud Compute, Health AI, Finance AI, and LLM Tokens
- 🔔 **Deadline Tracking**: Never miss an important deadline
- 🎯 **Advanced Filtering**: Filter by category, deadline, amount, and more
- 📱 **Responsive Design**: Works seamlessly on all devices

## Tech Stack

- **Frontend**: Next.js 14+ (App Router), TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Next.js API Routes, Node.js
- **Database**: PostgreSQL with Prisma ORM
- **Data Fetching**: TanStack Query (React Query)
- **Scraping**: Cheerio, Axios, Puppeteer
- **Scheduling**: node-cron

## Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- pnpm (recommended) or npm

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd Grant-Aggregator
```

2. Install dependencies:
```bash
pnpm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` and add your database URL and other configuration:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/grant_aggregator?schema=public"
CRON_SECRET="your-secure-random-string-here"
```

4. Set up the database:
```bash
pnpm exec prisma generate
pnpm exec prisma db push
```

5. Run the development server:
```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
Grant-Aggregator/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   ├── grants/            # Grant pages
│   ├── admin/             # Admin dashboard
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── ui/                # shadcn/ui components
│   └── layout/            # Layout components
├── docs/                   # Documentation files
├── lib/                   # Utility functions
│   ├── scrapers/          # Web scraping modules
│   ├── scheduler.ts       # Cron job scheduler
│   └── prisma.ts          # Prisma client
├── prisma/                # Database schema
└── public/                # Static assets
```

## Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm db:push` - Push schema changes to database
- `pnpm db:migrate` - Create and run migrations
- `pnpm db:studio` - Open Prisma Studio
- `pnpm db:generate` - Generate Prisma Client

## Database Schema

The platform uses two main models:

- **Grant**: Stores grant information (title, description, category, deadline, etc.)
- **ScrapingJob**: Tracks scraping job status and results

## API Endpoints

- `GET /api/grants` - List all grants with filters
- `POST /api/grants` - Add manual grant entry
- `GET /api/grants/[id]` - Get single grant
- `PATCH /api/grants/[id]` - Update grant
- `DELETE /api/grants/[id]` - Remove grant
- `GET /api/scrape` - Triggered by Vercel Cron (runs twice daily)
- `POST /api/scrape` - Trigger scraping job manually
- `GET /api/scrape/status` - Check scraping job status

## Deployment

The platform is designed to deploy on Vercel:

1. Push your code to GitHub
2. Import the project in Vercel
3. Add environment variables in Vercel dashboard
4. Connect your PostgreSQL database (Vercel Postgres or Supabase)
5. Deploy!

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT
