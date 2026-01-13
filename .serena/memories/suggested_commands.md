# Suggested Commands for Grant Aggregator

## Development Commands

### Start Development Server
```bash
pnpm dev
```
Starts Next.js development server at http://localhost:3000

### Build for Production
```bash
pnpm build
```
Builds the Next.js application for production

### Start Production Server
```bash
pnpm start
```
Starts the production server (after build)

## Database Commands

### Generate Prisma Client
```bash
pnpm db:generate
```
Generates Prisma Client from schema

### Push Schema to Database
```bash
pnpm db:push
```
Pushes Prisma schema changes directly to database (development)

### Create Migration
```bash
pnpm db:migrate
```
Creates and applies a new Prisma migration

### Open Prisma Studio
```bash
pnpm db:studio
```
Opens Prisma Studio GUI to view/edit database

## Code Quality Commands

### Run Linter
```bash
pnpm lint
```
Runs ESLint to check code quality

## System Utilities (Darwin/macOS)

### File Operations
```bash
ls -la          # List files with details
cd <directory>  # Change directory
pwd             # Print working directory
find . -name "*.ts"  # Find TypeScript files
grep -r "pattern" .  # Search for pattern recursively
```

### Git Commands
```bash
git status      # Check git status
git add .       # Stage all changes
git commit -m "message"  # Commit changes
git push        # Push to remote
git pull        # Pull from remote
```

### Process Management
```bash
ps aux | grep node  # Find Node processes
kill <pid>          # Kill process by PID
lsof -i :3000       # Find process using port 3000
```

## Testing Scrapers

### Test Individual Scraper
```typescript
// In a script or REPL
import { scrapers } from "@/lib/scrapers";
const grants = await scrapers.awsCredits();
console.log(grants);
```

### Trigger Scraping Job Manually
```bash
curl -X POST http://localhost:3000/api/scrape \
  -H "Content-Type: application/json" \
  -H "x-cron-secret: your-secret"
```

## Environment Setup

### Install Dependencies
```bash
pnpm install
```

### Copy Environment Template
```bash
cp .env.example .env
```

### Generate Secrets
```bash
# Generate NEXTAUTH_SECRET
openssl rand -base64 32

# Generate CRON_SECRET
openssl rand -hex 32
```
