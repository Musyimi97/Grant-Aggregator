# Task Completion Checklist

When completing a task, ensure the following:

## Code Quality
- [ ] Code follows TypeScript strict mode
- [ ] All functions have proper type annotations
- [ ] Error handling is implemented (try-catch blocks)
- [ ] Input validation using Zod (for API routes)
- [ ] No console.log statements (use console.error for errors)

## Testing
- [ ] Test the feature manually in development
- [ ] Verify API endpoints work correctly
- [ ] Check database operations (if applicable)
- [ ] Test error cases and edge cases
- [ ] Verify responsive design (mobile/tablet/desktop)

## Code Review
- [ ] Run linter: `pnpm run lint`
- [ ] Fix any linting errors
- [ ] Check for unused imports
- [ ] Verify no TypeScript errors
- [ ] Ensure consistent code style

## Database (if applicable)
- [ ] Run `pnpm run db:generate` if schema changed
- [ ] Run `pnpm run db:push` or `pnpm run db:migrate` if needed
- [ ] Test database operations
- [ ] Verify indexes are appropriate

## Documentation
- [ ] Update relevant documentation if needed
- [ ] Add JSDoc comments for new functions
- [ ] Update API documentation if endpoints changed
- [ ] Update README if setup changed

## Git
- [ ] Stage all changes: `git add .`
- [ ] Commit with conventional commit message
- [ ] Push to remote repository

## Deployment Checklist (before deploying)
- [ ] All environment variables are set
- [ ] Database migrations are applied
- [ ] Build succeeds: `pnpm run build`
- [ ] No TypeScript errors
- [ ] No linting errors
- [ ] Test in production-like environment if possible

## Scraping Tasks (if applicable)
- [ ] Test scraper manually
- [ ] Verify data structure matches GrantData interface
- [ ] Check for duplicate detection
- [ ] Monitor scraping job in admin dashboard
- [ ] Handle errors gracefully

## UI/UX Tasks (if applicable)
- [ ] Test on different screen sizes
- [ ] Verify accessibility (keyboard navigation, screen readers)
- [ ] Check loading states
- [ ] Verify error states display correctly
- [ ] Test user interactions
