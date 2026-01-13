# Code Style and Conventions

## TypeScript Configuration
- **Strict mode**: Enabled
- **Target**: ES2017
- **Module**: ESNext with bundler resolution
- **Path aliases**: `@/*` maps to project root

## Naming Conventions

### Files and Directories
- **Components**: PascalCase (e.g., `GrantCard.tsx`)
- **Utilities**: camelCase (e.g., `utils.ts`, `scheduler.ts`)
- **API Routes**: lowercase with hyphens (e.g., `route.ts` in `app/api/grants/`)
- **Pages**: `page.tsx` for Next.js App Router pages
- **Layouts**: `layout.tsx` for Next.js layouts

### Code Naming
- **Functions**: camelCase (e.g., `fetchHTML`, `runScrapingJob`)
- **Variables**: camelCase (e.g., `grantData`, `searchParams`)
- **Constants**: UPPER_SNAKE_CASE for constants (e.g., `MAX_RETRIES`)
- **Types/Interfaces**: PascalCase (e.g., `GrantData`, `ScraperFunction`)
- **Components**: PascalCase (e.g., `GrantCard`, `Header`)

## Code Style

### TypeScript
- Use explicit types for function parameters and return types
- Prefer `interface` over `type` for object shapes
- Use `type` for unions, intersections, and utility types
- Always use `async/await` over promises chains
- Use `const` by default, `let` only when reassignment is needed

### React/Next.js
- Use functional components with hooks
- Prefer Server Components (default) over Client Components
- Mark Client Components with `"use client"` directive
- Use Next.js App Router conventions
- Use `Link` from `next/link` for internal navigation
- Use `useQuery` from TanStack Query for data fetching

### API Routes
- Use `NextRequest` and `NextResponse` from `next/server`
- Validate input with Zod schemas
- Return appropriate HTTP status codes
- Handle errors gracefully with try-catch
- Use Prisma for database operations

### Error Handling
- Always wrap async operations in try-catch
- Log errors with `console.error`
- Return user-friendly error messages in API responses
- Use proper HTTP status codes (400, 401, 404, 500)

### Comments
- Use JSDoc comments for exported functions
- Add inline comments for complex logic
- Keep comments up-to-date with code changes

## File Organization

### Component Structure
```typescript
// Imports (external first, then internal)
import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

// Types/Interfaces
interface GrantData { ... }

// Main component/function
export async function GET(request: NextRequest) { ... }
```

### Import Order
1. External packages (React, Next.js, etc.)
2. Internal utilities (`@/lib/*`)
3. Types/interfaces
4. Relative imports

## Prisma Conventions
- Use Prisma Client singleton from `@/lib/prisma`
- Always handle database errors
- Use transactions for multi-step operations
- Index frequently queried fields

## Scraping Conventions
- Each scraper is an async function returning `Promise<GrantData[]>`
- Always include error handling
- Use descriptive function names (e.g., `scrapeAWSCredits`)
- Add JSDoc comments explaining what the scraper does
- Register scrapers in the `scrapers` object

## Styling
- Use Tailwind CSS utility classes
- Use shadcn/ui components for consistent UI
- Follow mobile-first responsive design
- Use CSS variables for theming (defined in `globals.css`)

## Git Commit Messages
Follow Conventional Commits specification:
- `feat:` for new features
- `fix:` for bug fixes
- `docs:` for documentation
- `refactor:` for code restructuring
- `chore:` for maintenance tasks

Example: `feat: add AWS credits scraper`
