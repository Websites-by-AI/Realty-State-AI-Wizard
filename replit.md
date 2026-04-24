# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)
- **AI**: OpenAI via Replit AI Integrations (gpt-5.4)

## Artifacts

### `artifacts/amlak-ai` — Persian Real Estate AI Website (املاک AI)
- React + Vite, RTL Persian (Farsi), navy blue/gold design
- Target cities: Tehran (تهران), Karaj (کرج), Mashhad (مشهد)
- Contact: 09334001881 | Built by: احمد حسینی
- **Pages**: Home (/), Price Estimator (/price-estimator), Ad Writer (/ad-writer), Chatbot (/chatbot), Tools (/tools)
- **AI Tools**: Smart price estimator, auto ad writer, AI chatbot advisor
- previewPath: /

### `artifacts/api-server` — Express API Server
- Handles all AI tool endpoints (OpenAI integration)
- Routes: /api/property/estimate-price, /api/property/generate-ad, /api/property/search
- Routes: /api/openai/conversations (chat)
- previewPath: /api

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

## Database Schema

- `conversations` table — AI chatbot conversations
- `messages` table — Chat messages (role: user/assistant)

## AI Integration

Uses Replit AI Integrations OpenAI proxy (no user API key needed):
- `AI_INTEGRATIONS_OPENAI_BASE_URL` — auto-provisioned
- `AI_INTEGRATIONS_OPENAI_API_KEY` — auto-provisioned

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.
