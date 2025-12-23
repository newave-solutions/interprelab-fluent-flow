# GitHub Copilot Instructions for InterpreLab

This document provides coding standards, architecture patterns, and development guidelines for the InterpreLab platform.

## Project Overview

**InterpreLab** is an AI-driven training and real-time assistance platform for medical interpreters, focused on human skill optimization and bridging critical communication gaps in healthcare.

### Core Products
- **InterpreBot** 🤖 - AI Training & Assessment with deep linguistic analysis
- **InterpreCoach** 🎧 - Real-Time AI Assistance Browser Extension  
- **InterpreStudy** 📚 - Learning Management with flashcards and scenarios
- **InterpreWellness** 🧘 - Mental Health & Well-being Support
- **InterpreTrack** 📞 - Call Tracking & Analytics Dashboard
- **InterpreLink** 🤝 - Professional Community Network
- **ASL Teacher** 🤟 - American Sign Language Learning Tool

## Technology Stack

### Frontend
- **React** (^18.3.1) with **TypeScript** (^5.8.3) - Primary UI framework
- **Vite** (^5.4.19) - Build tool and dev server
- **Tailwind CSS** (^3.4.17) - Utility-first styling (REQUIRED - use exclusively)
- **shadcn/ui** - UI component library built on Radix UI
- **React Router DOM** (^6.30.1) - Client-side routing
- **TanStack React Query** (^5.83.0) - Server state management
- **React Hook Form** (^7.61.1) + **Zod** (^3.25.76) - Form management and validation

### Backend & Services
- **Supabase** - Database, authentication, and edge functions
- **PostgreSQL** - Relational database (via Supabase)
- **Deno** - Edge functions runtime

### AI/ML
- **TensorFlow.js** (^4.22.0) - Browser-based machine learning
- **@tensorflow-models/handpose** - Hand gesture detection
- **fingerpose** - Sign language recognition

## Coding Standards

### TypeScript
- **Always use TypeScript** for all new files
- The project uses relaxed TypeScript configuration (strict checking is disabled to allow flexibility)
- Use type inference but provide explicit types for function parameters and return values where beneficial
- Prefer interfaces over types for object shapes
- Use proper typing for React components, hooks, and event handlers
- Handle nullable values appropriately even though strictNullChecks is disabled

### React Components
- **Component Structure**: Create modular, reusable components
- **File Naming**: Use PascalCase for component files (e.g., `HeroSection.tsx`)
- **Component Organization**: Group related components in feature folders
  - UI components: `src/components/ui/`
  - Feature components: `src/components/[feature-name]/`
  - Pages: `src/pages/`
- **Functional Components**: Use functional components with hooks exclusively
- **Props**: Define prop types with TypeScript interfaces
- **State Management**: Use React hooks (useState, useEffect, useContext) and TanStack Query for server state

### Styling
- **Use Tailwind CSS exclusively** - utility-first approach required
- **No custom CSS files** unless absolutely necessary
- Use shadcn/ui components for consistent UI patterns
- Follow responsive design principles (mobile-first)
- **Accessibility**: Adhere to WCAG 2.1 AA standards
  - Use semantic HTML elements
  - Include proper alt text for images
  - Ensure keyboard navigation works
  - Add ARIA labels where appropriate

### Code Organization
- **Import Aliases**: Use `@/` for imports from src (e.g., `import { Button } from "@/components/ui/button"`)
- **File Structure**: 
  ```
  src/
  ├── components/     # Reusable React components
  ├── pages/          # Route-level page components
  ├── hooks/          # Custom React hooks
  ├── lib/            # Utility functions and helpers
  ├── services/       # API and external service integrations
  ├── contexts/       # React context providers
  ├── integrations/   # Third-party integrations (Supabase, etc.)
  └── assets/         # Static assets
  ```

### Naming Conventions
- **Components**: PascalCase (e.g., `InterpreBotDashboard.tsx`)
- **Hooks**: camelCase with "use" prefix (e.g., `useScrollAnimation.ts`)
- **Utils/Helpers**: camelCase (e.g., `formatDate.ts`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `API_BASE_URL`)
- **Routes**: kebab-case (e.g., `/interprebot`, `/interpre-wellness`)

## Development Workflow

### Setup
```bash
# Install dependencies
npm install

# Start development server
npm run dev
# Server runs on port 8080 (accessible on all network interfaces)

# Build for production
npm run build

# Lint code
npm run lint

# Preview production build
npm run preview
```

### Build & Lint
- **Build**: `npm run build` - Creates optimized production build in `dist/`
- **Dev Build**: `npm run build:dev` - Build with development mode
- **Lint**: `npm run lint` - Runs ESLint on TypeScript files
- **Config Files**:
  - `vite.config.ts` - Vite configuration
  - `eslint.config.js` - ESLint configuration
  - `tsconfig.json` - TypeScript configuration
  - `tailwind.config.ts` - Tailwind CSS configuration

### Git Workflow
- Create feature branches from `main`
- Use descriptive commit messages
- Review PR requirements before submitting
- Ensure linting passes before committing

## Architecture Patterns

### Component Patterns
- **Composition over inheritance**: Build complex UIs from simple components
- **Container/Presentational pattern**: Separate logic from presentation where appropriate
- **Custom hooks**: Extract reusable logic into custom hooks
- **Error boundaries**: Implement error handling for robust UIs

### State Management
- **Local state**: Use `useState` for component-specific state
- **Global state**: Use React Context for app-wide state
- **Server state**: Use TanStack Query for data fetching and caching
- **Form state**: Use React Hook Form with Zod validation

### API Integration
- Use Supabase client for database operations
- Implement proper error handling for all API calls
- Use TanStack Query for data fetching with proper cache management
- Store API keys and secrets in environment variables (never hardcode)

### Accessibility
- Use semantic HTML5 elements (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`)
- Ensure all interactive elements are keyboard accessible
- Provide clear focus indicators
- Include proper ARIA labels and roles
- Test with screen readers when possible
- Support reduced motion preferences

## Security Best Practices
- **Never commit secrets or API keys** to the repository
- Use environment variables for sensitive data
- Validate all user inputs with Zod schemas
- Implement proper authentication checks
- Use Supabase Row Level Security (RLS) policies
- Sanitize data before rendering to prevent XSS attacks

## Documentation
For detailed technical and business context, refer to:
- **[GEMINI.md](../GEMINI.md)** - Business & product knowledge, technical directives
- **[PROJECT_ARCHITECTURE.md](../PROJECT_ARCHITECTURE.md)** - Complete architecture reference
- **[PLATFORM_DOCUMENTATION.md](../PLATFORM_DOCUMENTATION.md)** - Complete technical guide
- **[DOCUMENTATION_INDEX.md](../DOCUMENTATION_INDEX.md)** - Central documentation hub
- **[README.md](../README.md)** - Project overview and quick start

## Brand & Content Guidelines
- **Target Audience**: Medical interpreters (certified professionals, students, certification candidates)
- **Brand Voice**: Professional, authoritative, innovative, empowering, supportive, precise, transparent
- **Keywords**: "medical interpreter training", "AI for interpreters", "NBCMI prerequisite course", "CCHI approved training", "interpreter skills assessment"
- **CTAs**: Use clear calls to action like "Start Your Free Assessment" or "Enroll Now"

## Testing
- Write unit tests for utility functions and hooks
- Test components with user interactions in mind
- Validate form submissions and error handling
- Test accessibility features
- Verify responsive design across devices

## Performance Optimization
- Lazy load components and routes where appropriate
- Optimize images and assets
- Use React.memo for expensive components
- Implement proper code splitting
- Monitor bundle size and load times
- Use passive event listeners for scroll events

## When Making Changes
1. **Understand the context**: Review related documentation and existing code patterns
2. **Follow existing conventions**: Match the style and structure of existing code
3. **Write TypeScript**: Use proper typing for all new code
4. **Use Tailwind CSS**: Style exclusively with Tailwind utility classes
5. **Test your changes**: Verify functionality, linting, and build success
6. **Maintain accessibility**: Ensure WCAG 2.1 AA compliance
7. **Update documentation**: If making significant architectural changes
8. **Keep it modular**: Create reusable, composable components
9. **Optimize for performance**: Consider bundle size and runtime performance
10. **Security first**: Never expose secrets, validate inputs, handle errors properly

## Common Tasks

### Adding a New Page
1. Create component in `src/pages/[PageName].tsx`
2. Add route in `src/App.tsx` (or routing config)
3. Use existing layout components for consistency
4. Follow accessibility guidelines
5. Add to navigation if needed

### Adding a New UI Component
1. Create in `src/components/[feature]/[ComponentName].tsx`
2. Use TypeScript interfaces for props
3. Style with Tailwind CSS
4. Make it reusable and composable
5. Document props and usage in comments if complex

### Integrating with Supabase
1. Use the Supabase client from `src/integrations/supabase/`
2. Implement proper error handling
3. Use TanStack Query for data fetching
4. Follow Row Level Security policies
5. Type all database operations

### Adding AI/ML Features
1. Import from TensorFlow.js libraries
2. Load models efficiently (lazy load if possible)
3. Handle loading and error states
4. Optimize for performance
5. Test across different devices

## Questions or Issues?
- Review existing documentation files
- Check similar implementations in the codebase
- Follow established patterns and conventions
- Reach out to: admin.ceo@interprelab.com
