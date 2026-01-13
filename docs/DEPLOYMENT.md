# Deployment Guide

## Prerequisites

- GitHub account
- Vercel account
- PostgreSQL database (Vercel Postgres or Supabase)

## Step 1: Prepare Repository

1. Initialize git repository:
```bash
git init
git add .
git commit -m "feat: initial commit"
```

2. Push to GitHub:
```bash
git remote add origin <your-repo-url>
git push -u origin main
```

## Step 2: Set Up Database

### Option A: Vercel Postgres

1. Go to Vercel Dashboard
2. Navigate to Storage
3. Create new Postgres database
4. Copy connection string

### Option B: Supabase

1. Create account at supabase.com
2. Create new project
3. Go to Settings > Database
4. Copy connection string

## Step 3: Deploy to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Configure project:
   - Framework Preset: Next.js
   - Root Directory: ./
   - Build Command: `pnpm build`
   - Output Directory: `.next`
   - Install Command: `pnpm install`

## Step 4: Configure Environment Variables

In Vercel project settings, add:

```
DATABASE_URL=postgresql://...
NEXTAUTH_SECRET=generate-with-openssl-rand-base64-32
NEXTAUTH_URL=https://your-domain.vercel.app
CRON_SECRET=generate-secure-random-string
```

Generate secrets:
```bash
# NEXTAUTH_SECRET
openssl rand -base64 32

# CRON_SECRET
openssl rand -hex 32
```

## Step 5: Set Up Database Schema

1. Push schema to database:
```bash
pnpm exec prisma db push
```

Or run migration:
```bash
pnpm exec prisma migrate deploy
```

## Step 6: Configure Vercel Cron

The `vercel.json` file is already configured for cron jobs. Vercel will automatically set up the cron job to run every 6 hours.

To verify:
1. Go to Vercel project settings
2. Navigate to Cron Jobs
3. Verify the job is scheduled

## Step 7: Test Deployment

1. Visit your deployed site
2. Test API endpoints
3. Manually trigger scraping job from admin page
4. Verify database connection

## Post-Deployment

### Monitor Logs
- Check Vercel logs for errors
- Monitor scraping job status in admin dashboard
- Review database for new grants

### Set Up Monitoring
- Configure error tracking (Sentry recommended)
- Set up uptime monitoring
- Configure alerts for scraping failures

## Troubleshooting

### Database Connection Issues
- Verify DATABASE_URL is correct
- Check database is accessible
- Ensure IP allowlist includes Vercel IPs (if applicable)

### Cron Jobs Not Running
- Verify vercel.json is in root directory
- Check CRON_SECRET is set correctly
- Review Vercel cron job logs

### Build Failures
- Check Node.js version (should be 18+)
- Verify all dependencies are in package.json
- Review build logs for specific errors

## Environment-Specific Configuration

### Development
```env
DATABASE_URL=postgresql://localhost:5432/grant_aggregator
NEXTAUTH_URL=http://localhost:3000
```

### Production
```env
DATABASE_URL=postgresql://... (from Vercel/Supabase)
NEXTAUTH_URL=https://your-domain.vercel.app
```

## Scaling Considerations

- Database connection pooling
- API rate limiting
- Caching strategy
- CDN for static assets
- Monitoring and alerting
