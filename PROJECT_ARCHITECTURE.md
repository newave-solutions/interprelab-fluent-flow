# InterpreLab Project Architecture & Scaffold Documentation

**Last Updated:** November 29, 2025  
**Version:** 1.0  
**Purpose:** Complete organizational architecture reference and project scaffold documentation

---

## 📋 Table of Contents

1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Directory Structure](#directory-structure)
4. [Frontend Architecture](#frontend-architecture)
5. [Backend Architecture](#backend-architecture)
6. [Data Flow Architecture](#data-flow-architecture)
7. [Naming Conventions](#naming-conventions)
8. [Module Organization Patterns](#module-organization-patterns)
9. [Development Setup](#development-setup)
10. [Build & Deployment](#build--deployment)
11. [Configuration Files Reference](#configuration-files-reference)

---

## Project Overview

### Mission

InterpreLab is an AI-driven training and real-time assistance platform for medical interpreters, focused on human skill optimization and bridging critical communication gaps in healthcare.

### Core Products

| Product | Icon | Description | Route |
|---------|------|-------------|-------|
| **InterpreBot** | 🤖 | AI Training & Assessment with deep linguistic analysis | `/interprebot` |
| **InterpreCoach** | 🎧 | Real-Time AI Assistance Browser Extension | `/interprecoach` |
| **InterpreStudy** | 📚 | Learning Management with flashcards and scenarios | `/interprestudy` |
| **InterpreWellness** | 🧘 | Mental Health & Well-being Support | `/interpre-wellness` |
| **InterpreTrack** | 📞 | Call Tracking & Analytics Dashboard | `/interpretrack` |
| **InterpreLink** | 🤝 | Professional Community Network | `/interprelink` |
| **ASL Teacher** | 🤟 | American Sign Language Learning Tool | `/asl-teacher` |

---

## Technology Stack

### Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | ^18.3.1 | UI Library |
| **TypeScript** | ^5.8.3 | Type-safe JavaScript |
| **Vite** | ^7.2.2 | Build Tool & Dev Server |
| **Tailwind CSS** | ^3.4.17 | Utility-first CSS Framework |
| **shadcn/ui** | Latest | UI Component Library (Radix-based) |
| **React Router DOM** | ^6.30.1 | Client-side Routing |
| **TanStack React Query** | ^5.83.0 | Server State Management |
| **React Hook Form** | ^7.61.1 | Form Management |
| **Zod** | ^3.25.76 | Schema Validation |

### Backend & Services

| Technology | Purpose |
|------------|---------|
| **Supabase** | Database, Auth, Edge Functions |
| **PostgreSQL** | Relational Database (via Supabase) |
| **Deno** | Edge Functions Runtime |

### AI/ML

| Technology | Purpose |
|------------|---------|
| **TensorFlow.js** | Browser-based ML |
| **PoseNet** | Pose Estimation |
| **HandPose** | Hand Gesture Detection |
| **Fingerpose** | Sign Language Recognition |

### Build & DevOps

| Technology | Purpose |
|------------|---------|
| **GitHub Actions** | CI/CD Pipeline |
| **Docker** | Containerization |
| **Nginx** | Production Server |
| **ESLint** | Code Linting |

---

## Directory Structure

```
interprelab-fluent-flow/
│
├── 📁 .github/                    # GitHub configuration
│   └── workflows/                 # CI/CD workflows
│       └── deploy.yml            # Deployment workflow
│
├── 📁 public/                     # Static assets
│   ├── favicon.ico               # Site favicon
│   ├── robots.txt                # SEO configuration
│   └── placeholder.svg           # Placeholder images
│
├── 📁 src/                        # Source code (main application)
│   ├── 📁 assets/                # Static assets imported in code
│   │
│   ├── 📁 components/            # React components
│   │   ├── 📁 dashboard/        # Dashboard-specific components
│   │   ├── 📁 interprestudy/    # InterpreStudy feature components
│   │   │   └── modules/         # Study module sub-components
│   │   ├── 📁 ui/               # shadcn/ui base components
│   │   └── *.tsx                # Shared/global components
│   │
│   ├── 📁 contexts/              # React Context providers
│   │   ├── AuthContext.tsx      # Authentication state
│   │   └── LanguageContext.tsx  # Internationalization
│   │
│   ├── 📁 hooks/                 # Custom React hooks
│   │   ├── use-mobile.tsx       # Mobile detection
│   │   ├── use-toast.ts         # Toast notifications
│   │   ├── useCallTracker.ts    # Call tracking logic
│   │   └── useScrollAnimation.ts # Scroll animations
│   │
│   ├── 📁 integrations/          # External service integrations
│   │   └── supabase/            # Supabase client & services
│   │       ├── client.ts        # Supabase client instance
│   │       ├── services.ts      # API service functions
│   │       └── types.ts         # Database type definitions
│   │
│   ├── 📁 lib/                   # Utility libraries
│   │   ├── data.ts              # Static data & constants
│   │   ├── types.ts             # Shared type definitions
│   │   ├── utils.ts             # Utility functions (cn, etc.)
│   │   └── validations.ts       # Zod validation schemas
│   │
│   ├── 📁 pages/                 # Route page components
│   │   ├── Index.tsx            # Landing page (/)
│   │   ├── Home.tsx             # Alternative home (/home)
│   │   ├── Dashboard.tsx        # User dashboard
│   │   ├── InterpreBot.tsx      # AI Training feature
│   │   ├── InterpreCoach.tsx    # Real-time assistance
│   │   ├── InterpreStudy.tsx    # Learning platform
│   │   ├── InterpreWellness.tsx # Wellness feature
│   │   ├── InterpreLink.tsx     # Community feature
│   │   ├── CallTracker.tsx      # Call tracking
│   │   ├── Settings.tsx         # User settings
│   │   └── *.tsx                # Other pages
│   │
│   ├── 📁 services/              # Service layer
│   │   ├── ASLRecognitionService.js  # ASL ML service
│   │   └── asl-gestures.js      # Gesture definitions
│   │
│   ├── App.tsx                   # Root application component
│   ├── App.css                   # Global app styles
│   ├── main.tsx                  # Application entry point
│   ├── index.css                 # Global CSS & Tailwind imports
│   └── vite-env.d.ts            # Vite type declarations
│
├── 📁 supabase/                   # Supabase configuration
│   ├── config.toml              # Supabase project config
│   ├── 📁 functions/            # Edge Functions
│   │   ├── debriefing-questionnaire/  # Post-call debriefing
│   │   ├── generate-flashcards/       # AI flashcard generation
│   │   ├── study-chat/                # Study chatbot
│   │   └── wellness-chat/             # Wellness chatbot
│   └── 📁 migrations/           # Database migrations
│       └── *.sql                # Migration files
│
├── 📄 Configuration Files
│   ├── package.json              # Node.js dependencies & scripts
│   ├── tsconfig.json            # TypeScript base config
│   ├── tsconfig.app.json        # App-specific TS config
│   ├── tsconfig.node.json       # Node-specific TS config
│   ├── vite.config.ts           # Vite bundler config
│   ├── tailwind.config.ts       # Tailwind CSS config
│   ├── postcss.config.js        # PostCSS config
│   ├── eslint.config.js         # ESLint config
│   ├── components.json          # shadcn/ui config
│   ├── Dockerfile               # Docker container config
│   └── nginx.conf               # Nginx server config
│
└── 📄 Documentation
    ├── README.md                 # Project overview
    ├── DOCUMENTATION_INDEX.md    # Doc navigation
    ├── PLATFORM_DOCUMENTATION.md # Technical docs
    ├── PROJECT_ARCHITECTURE.md   # This file
    ├── IMPLEMENTATION_GUIDE.md   # Deployment guide
    ├── OPTIMIZATION_ROADMAP.md   # Future planning
    ├── EXECUTIVE_SUMMARY.md      # Project summary
    └── GCP_*.md                  # GCP deployment docs
```

---

## Frontend Architecture

### Component Hierarchy

```
App.tsx (Root)
│
├── Providers (Wrappers)
│   ├── QueryClientProvider (TanStack Query)
│   ├── ThemeProvider (next-themes)
│   ├── AuthProvider (Authentication)
│   ├── LanguageProvider (i18n)
│   └── TooltipProvider (Radix)
│
├── Global Components
│   ├── Toaster (Notifications)
│   └── Sonner (Alternative Toasts)
│
└── BrowserRouter (Routing)
    └── Routes
        ├── Public Routes
        │   ├── / (Index)
        │   ├── /home
        │   ├── /interprebot
        │   ├── /interprecoach
        │   ├── /interprestudy
        │   ├── /asl-teacher
        │   ├── /interprelink
        │   ├── /resources
        │   ├── /about
        │   ├── /contact
        │   ├── /careers
        │   ├── /signin
        │   └── /waitlist
        │
        └── Protected Routes (ProtectedRoute wrapper)
            ├── /dashboard
            ├── /interpretrack
            ├── /call-tracker
            └── /settings
```

### Component Categories

#### 1. Page Components (`src/pages/`)

Full-page components that represent routes. Each page should:
- Be named in PascalCase matching the feature
- Handle its own data fetching
- Compose from smaller components
- Include page-level layout

```typescript
// Example: src/pages/Dashboard.tsx
export default function Dashboard() {
  return (
    <Layout>
      <DashboardContent />
    </Layout>
  );
}
```

#### 2. Feature Components (`src/components/`)

Reusable components organized by feature domain:

| Folder | Purpose | Examples |
|--------|---------|----------|
| `dashboard/` | Dashboard widgets | `stats-cards.tsx`, `weekly-chart.tsx` |
| `interprestudy/` | Study feature UI | `FlashcardDeck.tsx`, `MockScenarios.tsx` |
| `ui/` | Base UI primitives | `button.tsx`, `card.tsx`, `dialog.tsx` |

#### 3. UI Components (`src/components/ui/`)

shadcn/ui-based components following Radix primitives:

```
ui/
├── Primitives: button, input, label, checkbox, etc.
├── Layout: card, separator, aspect-ratio
├── Navigation: navigation-menu, tabs, breadcrumb
├── Feedback: toast, alert, progress, skeleton
├── Overlay: dialog, sheet, popover, dropdown-menu
└── Data Display: table, avatar, badge
```

### State Management Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Application State                        │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌─────────────────┐    ┌─────────────────────────────────┐ │
│  │ React Context   │    │ TanStack React Query            │ │
│  │ (Client State)  │    │ (Server State)                  │ │
│  ├─────────────────┤    ├─────────────────────────────────┤ │
│  │ • AuthContext   │    │ • Supabase queries              │ │
│  │ • LanguageCtx   │    │ • API data caching              │ │
│  │ • Theme state   │    │ • Background refetching         │ │
│  └─────────────────┘    └─────────────────────────────────┘ │
│                                                              │
│  ┌─────────────────┐    ┌─────────────────────────────────┐ │
│  │ Component State │    │ Form State (React Hook Form)    │ │
│  │ (useState)      │    │                                 │ │
│  ├─────────────────┤    ├─────────────────────────────────┤ │
│  │ • UI toggles    │    │ • Form values                   │ │
│  │ • Local filters │    │ • Validation state              │ │
│  │ • Animations    │    │ • Submit handling               │ │
│  └─────────────────┘    └─────────────────────────────────┘ │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Custom Hooks (`src/hooks/`)

| Hook | Purpose | Usage |
|------|---------|-------|
| `use-mobile.tsx` | Detect mobile viewport | Responsive layouts |
| `use-toast.ts` | Toast notifications | User feedback |
| `useCallTracker.ts` | Call tracking state | InterpreTrack feature |
| `useScrollAnimation.ts` | Scroll-based animations | UI effects |

---

## Backend Architecture

### Supabase Integration

```
┌────────────────────────────────────────────────────────────────┐
│                        Supabase Backend                         │
├────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────┐    ┌─────────────────────────────────┐│
│  │   PostgreSQL DB     │    │      Edge Functions (Deno)      ││
│  │                     │    │                                 ││
│  │ Tables:             │    │ • debriefing-questionnaire     ││
│  │ • profiles          │    │ • generate-flashcards          ││
│  │ • call_records      │    │ • study-chat                   ││
│  │ • user_preferences  │    │ • wellness-chat                ││
│  │ • learning_stats    │    │                                 ││
│  │ • flashcards        │    └─────────────────────────────────┘│
│  │ • interprelink_*    │                                       │
│  └─────────────────────┘    ┌─────────────────────────────────┐│
│                             │      Authentication              ││
│  ┌─────────────────────┐    │                                 ││
│  │   Row Level Security│    │ • Email/Password                ││
│  │                     │    │ • OAuth Providers               ││
│  │ • User data privacy │    │ • Session Management            ││
│  │ • Role-based access │    └─────────────────────────────────┘│
│  └─────────────────────┘                                       │
│                                                                 │
└────────────────────────────────────────────────────────────────┘
```

### Database Schema Overview

```sql
-- Core User Tables
profiles              -- User profile data
user_preferences      -- User settings and preferences

-- Feature Tables
call_records          -- InterpreTrack call logs
learning_stats        -- InterpreStudy progress
flashcards           -- Custom flashcard decks

-- Community Tables (InterpreLink)
interprelink_posts    -- Community posts
interprelink_events   -- Community events
interprelink_jobs     -- Job listings
```

### Edge Functions (`supabase/functions/`)

| Function | Purpose | Trigger |
|----------|---------|---------|
| `debriefing-questionnaire` | Post-call analysis | HTTP POST |
| `generate-flashcards` | AI-powered flashcard creation | HTTP POST |
| `study-chat` | Interactive study assistant | HTTP POST |
| `wellness-chat` | Mental health support chatbot | HTTP POST |

### Client Integration (`src/integrations/supabase/`)

```typescript
// client.ts - Supabase client singleton
import { createClient } from '@supabase/supabase-js';

// services.ts - API service layer
export const fetchUserProfile = async (userId: string) => {...};
export const updateCallRecord = async (data: CallRecord) => {...};

// types.ts - Database type definitions
export interface Database {
  public: {
    Tables: {
      profiles: {...};
      call_records: {...};
    };
  };
}
```

---

## Data Flow Architecture

### Request/Response Flow

```
┌─────────┐    ┌─────────────┐    ┌─────────────┐    ┌──────────────┐
│  User   │───▶│   React     │───▶│  TanStack   │───▶│   Supabase   │
│ Action  │    │  Component  │    │   Query     │    │    Client    │
└─────────┘    └─────────────┘    └─────────────┘    └──────────────┘
                                                            │
                                                            ▼
                                                     ┌──────────────┐
                                                     │  Supabase    │
                                                     │   Backend    │
                                                     │ (PostgreSQL) │
                                                     └──────────────┘
                                                            │
                                                            ▼
                                        ┌───────────────────────────────┐
                                        │         Response              │
                                        │  (Cached by React Query)      │
                                        └───────────────────────────────┘
```

### Authentication Flow

```
┌─────────┐    ┌─────────────┐    ┌─────────────┐    ┌──────────────┐
│  User   │───▶│   SignIn    │───▶│   Supabase  │───▶│   Session    │
│ Login   │    │    Page     │    │    Auth     │    │   Created    │
└─────────┘    └─────────────┘    └─────────────┘    └──────────────┘
                                                            │
                                                            ▼
                                                     ┌──────────────┐
                                                     │  AuthContext │
                                                     │   Updated    │
                                                     └──────────────┘
                                                            │
                                                            ▼
                                                     ┌──────────────┐
                                                     │ ProtectedRoute│
                                                     │   Unlocked   │
                                                     └──────────────┘
```

### Feature Data Flow Example (InterpreTrack)

```
┌──────────────────────────────────────────────────────────────────┐
│                    InterpreTrack Data Flow                        │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  1. User logs call ─────────────────────────────────────────────▶│
│                                                                   │
│  2. ┌────────────────┐                                           │
│     │ useCallTracker │ ─── Creates call_record                   │
│     │     Hook       │                                           │
│     └────────────────┘                                           │
│            │                                                     │
│            ▼                                                     │
│  3. ┌────────────────┐                                           │
│     │   Supabase     │ ─── INSERT into call_records              │
│     │   Service      │                                           │
│     └────────────────┘                                           │
│            │                                                     │
│            ▼                                                     │
│  4. ┌────────────────┐                                           │
│     │ React Query    │ ─── Invalidates & refetches               │
│     │   Cache        │                                           │
│     └────────────────┘                                           │
│            │                                                     │
│            ▼                                                     │
│  5. ┌────────────────┐                                           │
│     │ Dashboard      │ ─── Updates charts & stats                │
│     │ Components     │                                           │
│     └────────────────┘                                           │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

---

## Naming Conventions

### Files & Folders

| Type | Convention | Example |
|------|------------|---------|
| React Components | PascalCase.tsx | `Dashboard.tsx`, `CallTracker.tsx` |
| UI Components | kebab-case.tsx | `button.tsx`, `loading-spinner.tsx` |
| Hooks | camelCase with `use` prefix | `useCallTracker.ts`, `use-toast.ts` |
| Utilities | camelCase.ts | `utils.ts`, `validations.ts` |
| Contexts | PascalCase with `Context` suffix | `AuthContext.tsx` |
| Types/Interfaces | camelCase.ts (file), PascalCase (exports) | `types.ts` → `export interface User` |
| CSS | kebab-case.css | `flashcard-animations.css` |
| SQL Migrations | timestamp_description.sql | `20251102000000_consolidate_schema.sql` |

### Code Conventions

```typescript
// Components - PascalCase
export function DashboardHeader() {...}
export const StatsCard = () => {...}

// Hooks - camelCase with 'use' prefix
export function useCallTracker() {...}
export const useScrollAnimation = () => {...}

// Interfaces/Types - PascalCase
interface UserProfile {...}
type CallRecordStatus = 'pending' | 'completed';

// Constants - SCREAMING_SNAKE_CASE
const MAX_RETRIES = 3;
const API_BASE_URL = '/api';

// Functions - camelCase
function calculateEarnings() {...}
const formatCallDuration = () => {...}

// Event Handlers - 'handle' + Event
const handleSubmit = () => {...}
const handleCallComplete = () => {...}
```

### Import Aliases

```typescript
// Path aliases configured in tsconfig.json
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
```

---

## Module Organization Patterns

### Feature-Based Organization

Each major feature follows this pattern:

```
feature/
├── FeaturePage.tsx           # Main page component
├── components/               # Feature-specific components
│   ├── FeatureHeader.tsx
│   ├── FeatureContent.tsx
│   └── FeatureWidget.tsx
├── hooks/                    # Feature-specific hooks (if needed)
│   └── useFeatureLogic.ts
└── types.ts                  # Feature-specific types (if needed)
```

### Component Composition Pattern

```typescript
// Parent component composes children
export function Dashboard() {
  return (
    <Layout>
      <DashboardHeader />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <StatsCards />
        <WeeklyChart />
        <RecentCalls />
        <GoalsTracker />
      </div>
    </Layout>
  );
}
```

### Shared Component Pattern

```typescript
// Reusable components with flexible props
interface CardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'premium';
}

export function FeatureCard({ title, children, className, variant = 'default' }: CardProps) {
  return (
    <Card className={cn(variants[variant], className)}>
      <CardHeader>{title}</CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}
```

---

## Development Setup

### Prerequisites

| Requirement | Version | Purpose |
|-------------|---------|---------|
| Node.js | ≥18.x | JavaScript runtime |
| npm | ≥9.x | Package manager |
| Git | Latest | Version control |

### Initial Setup

```bash
# 1. Clone repository
git clone <repository-url>
cd interprelab-fluent-flow

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
# Server runs at http://localhost:8080
```

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server (port 8080) |
| `npm run build` | Production build |
| `npm run build:dev` | Development build |
| `npm run lint` | Run ESLint |
| `npm run preview` | Preview production build |
| `npm run test` | Run tests (placeholder) |

### Environment Variables

Create `.env.local` for local development:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

For production deployments, create `.env.production` based on `.env.production.example`:

```bash
cp .env.production.example .env.production
# Edit .env.production with your production credentials
```

**Important:** Never commit `.env.production` to version control. It's already in `.gitignore`.

### IDE Setup (Recommended)

**VS Code Extensions:**
- ESLint
- Prettier
- Tailwind CSS IntelliSense
- TypeScript and JavaScript Language Features
- ES7+ React/Redux/React-Native snippets

---

## Build & Deployment

### Build Process

```bash
# Production build
npm run build

# Output directory: dist/
# Build includes:
# - Transpiled TypeScript
# - Bundled JavaScript
# - Processed CSS
# - Optimized assets
```

### Docker Deployment

```dockerfile
# Multi-stage build (see Dockerfile)
# Stage 1: Build
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Production
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
```

### CI/CD Pipeline

GitHub Actions workflow (`.github/workflows/deploy.yml`):

```yaml
# Triggers on push to main branch
# Steps:
# 1. Checkout code
# 2. Install dependencies
# 3. Run linting
# 4. Build application
# 5. Deploy to hosting
```

### Deployment Options

| Platform | Configuration |
|----------|---------------|
| **Lovable** | Direct publish via dashboard |
| **Firebase Hosting** | See GCP_SETUP.md |
| **Google Cloud Run** | See GCP_CLOUDRUN_DEPLOY.md |
| **Docker** | Use included Dockerfile |

---

## Configuration Files Reference

### TypeScript Configuration

```json
// tsconfig.json - Base configuration
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]  // Path aliases
    },
    "skipLibCheck": true,
    "allowJs": true
  }
}
```

### Vite Configuration

```typescript
// vite.config.ts
export default defineConfig({
  server: {
    host: "::",
    port: 8080  // Development server port
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src")  // Path alias
    }
  }
});
```

### Tailwind Configuration

```typescript
// tailwind.config.ts
export default {
  darkMode: ["class"],  // Class-based dark mode
  content: ["./src/**/*.{ts,tsx}"],  // Content paths
  theme: {
    extend: {
      colors: {
        // Custom color scheme using CSS variables
        primary: "hsl(var(--primary))",
        secondary: "hsl(var(--secondary))",
        // ... more colors
      }
    }
  }
};
```

### ESLint Configuration

```javascript
// eslint.config.js
// Uses flat config format (ESLint 9+)
// Includes:
// - TypeScript support
// - React Hooks rules
// - React Refresh rules
```

### shadcn/ui Configuration

```json
// components.json
{
  "style": "default",
  "rsc": false,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.ts",
    "css": "src/index.css",
    "baseColor": "neutral"
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils"
  }
}
```

---

## Quick Reference Cards

### Adding a New Page

1. Create page component in `src/pages/NewPage.tsx`
2. Add route in `src/App.tsx`
3. Add navigation link if needed
4. If protected, wrap with `<ProtectedRoute>`

### Adding a New Component

1. Determine category (feature-specific vs shared)
2. Create in appropriate folder
3. Export from component
4. Import where needed using `@/` alias

### Adding a New Hook

1. Create in `src/hooks/useHookName.ts`
2. Follow naming convention (`use` prefix)
3. Document parameters and return values
4. Import where needed

### Adding a Database Table

1. Create migration in `supabase/migrations/`
2. Add types in `src/integrations/supabase/types.ts`
3. Add service functions in `src/integrations/supabase/services.ts`
4. Set up RLS policies

---

## Related Documentation

| Document | Purpose |
|----------|---------|
| [README.md](./README.md) | Project overview |
| [DOCUMENTATION_INDEX.md](./DOCUMENTATION_INDEX.md) | Documentation navigation |
| [PLATFORM_DOCUMENTATION.md](./PLATFORM_DOCUMENTATION.md) | Complete technical guide |
| [IMPLEMENTATION_GUIDE.md](./IMPLEMENTATION_GUIDE.md) | Deployment steps |
| [OPTIMIZATION_ROADMAP.md](./OPTIMIZATION_ROADMAP.md) | Future planning |

---

## Support

- **Email:** admin.ceo@interprelab.com
- **Issues:** Create GitHub issue with appropriate label

---

**Document Version:** 1.0  
**Last Updated:** November 29, 2025  
**Maintained By:** InterpreLab Development Team
