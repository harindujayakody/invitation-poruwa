#!/usr/bin/env bash
# Creates a Next.js app and copies this kit into it.
# Usage: bash scripts/setup.sh my-wedding-app
set -euo pipefail

APP_DIR="${1:-wedding-invites}"
KIT_DIR="$(cd "$(dirname "$0")/.." && pwd)"

npx create-next-app@latest "$APP_DIR" --ts --tailwind --eslint --app --no-src-dir --import-alias "@/*" --use-npm --yes
cd "$APP_DIR"

# Copy kit files without overwriting anything create-next-app made.
for item in AGENTS.md .agent docs db lib features styles tests snippets drizzle.config.ts playwright.config.ts vitest.config.mts .env.example; do
  cp -rn "$KIT_DIR/$item" . 2>/dev/null || true
done

npm install drizzle-orm pg zod next-intl lucide-react
npm install -D drizzle-kit @types/pg @playwright/test vitest

# Add scripts
npm pkg set scripts.typecheck="tsc --noEmit" scripts.test="vitest run" scripts.e2e="playwright test" \
  scripts.db:generate="drizzle-kit generate" scripts.db:migrate="drizzle-kit migrate"

cat <<'MSG'

Next steps (run inside the new app folder):
  1. npx shadcn@latest init
  2. npx shadcn@latest add button input label form select switch checkbox tabs dialog sheet dropdown-menu table sonner tooltip skeleton
  3. In app/globals.css, AFTER shadcn's generated block, add:
       @import "../styles/tokens.css";
       @import "../styles/fonts.css";
       @import "../styles/motion.css";
     (CSS @import lines must be at the top of the file; if your build complains, move them above shadcn's variables
      and raise specificity in tokens.css instead.)
  4. Merge snippets/layout.example.tsx into app/layout.tsx.
  5. npx impeccable skills install   then check where it wrote files (see README.md).
  6. In Antigravity run: /impeccable teach  and answer from docs/DESIGN-BRIEF.md
  7. cp .env.example .env.local  and fill DATABASE_URL, then: npm run db:generate && npm run db:migrate
  8. npm test
MSG
