# Development Workflow

## Initial Setup
1. Install dependencies: `pnpm install`
2. Copy `.env.example` to `.env` and configure
3. Set up database: `pnpm run db:push`
4. Start dev server: `pnpm run dev`

## Adding a New Feature

### 1. Planning
- Review project structure and existing patterns
- Check if similar functionality exists
- Plan database changes (if needed)

### 2. Database Changes
- Update `prisma/schema.prisma`
- Run `pnpm run db:generate`
- Run `pnpm run db:push` or create migration

### 3. Backend Development
- Create API routes in `app/api/`
- Add validation with Zod
- Implement error handling
- Test with curl or Postman

### 4. Frontend Development
- Create pages in `app/` directory
- Use Server Components when possible
- Mark Client Components with `"use client"`
- Use TanStack Query for data fetching
- Use shadcn/ui components for UI

### 5. Testing
- Test manually in browser
- Verify API endpoints
- Check error handling
- Test responsive design

### 6. Code Quality
- Run `pnpm run lint`
- Fix any issues
- Ensure TypeScript compiles without errors

## Adding a New Scraper

1. Create scraper function in `lib/scrapers/index.ts`
2. Follow existing scraper patterns
3. Return `GrantData[]` array
4. Add to `scrapers` object
5. Test scraper manually
6. Monitor in admin dashboard

## Common Patterns

### API Route Pattern
```typescript
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

export async function GET(request: NextRequest) {
  try {
    // Implementation
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Message" },
      { status: 500 }
    );
  }
}
```

### Client Component Pattern
```typescript
"use client";

import { useQuery } from "@tanstack/react-query";

export default function Component() {
  const { data, isLoading } = useQuery({
    queryKey: ["key"],
    queryFn: async () => {
      const res = await fetch("/api/endpoint");
      return res.json();
    },
  });
  // Render
}
```

## Debugging

### Check Logs
- Server logs in terminal (dev server)
- Browser console for client-side errors
- Vercel logs for production

### Database Debugging
- Use `pnpm run db:studio` to inspect data
- Check Prisma queries in code
- Verify database connection

### Common Issues
- **Build errors**: Check TypeScript errors
- **Database errors**: Verify DATABASE_URL
- **API errors**: Check request/response in Network tab
- **Scraping errors**: Check admin dashboard for job status
