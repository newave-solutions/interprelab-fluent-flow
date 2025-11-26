# InterpreLab - AI-Driven Medical Interpreter Platform

## 📚 Documentation

**Complete Documentation:** See [DOCUMENTATION_INDEX.md](./DOCUMENTATION_INDEX.md) for all available documentation.

**Key Documentation:**
- 📖 [**Platform Documentation**](./PLATFORM_DOCUMENTATION.md) - Complete technical reference (33 KB)
- 🗺️ [**Optimization Roadmap**](./OPTIMIZATION_ROADMAP.md) - Strategic planning Q1-Q4 2026 (38 KB)
- 🚀 [**Implementation Guide**](./IMPLEMENTATION_GUIDE.md) - Step-by-step deployment
- 📊 [**Executive Summary**](./EXECUTIVE_SUMMARY.md) - Project overview and metrics

## Project info

**URL**: https://lovable.dev/projects/61694cb5-bbd8-44b1-aa9e-2b4cead1a91a

## A/B Testing Note

**InterpreCoach Implementation:**
This project implements two different versions of the InterpreCoach solution for A/B testing purposes:

1. **Current Version** (in `/interprecoach` route): Standard solution with AI coaching features
2. **Agentic Version** (removed from Extension UI): Multi-agent system implementation with distributed AI agents

The agentic version with multi-agent architecture has been removed to allow for performance comparison. Future A/B testing will help determine which approach users prefer and which performs better in real-world scenarios.

Key differences to test:
- Single AI model vs. multi-agent system
- User experience and response quality
- Performance and resource usage
- User preference and satisfaction

## Development Sprints

### Sprint 1 & 2: Core Visuals & Interactivity (Completed)
✅ Hero background images generated and implemented
✅ Animated stats counters with scroll-triggered visibility
✅ Scroll-triggered animations for all major sections
✅ Enhanced hover effects and micro-interactions on cards
✅ Testimonial avatar images and auto-rotation
✅ Basic accessibility improvements

### Sprint 3: Polish & Optimization (Completed)
✅ **Scroll Progress Indicator** - Visual feedback for page navigation
✅ **Enhanced Accessibility**
   - ARIA labels on all interactive elements
   - Focus-visible states with primary color ring
   - Reduced motion support for accessibility
   - Semantic HTML with proper role attributes
✅ **Advanced Micro-interactions**
   - Button shine effects on hover
   - Icon rotations and scaling on hover
   - Staggered fade-in animations with delay
   - Smooth scroll snap for video sections
✅ **Loading States** - Created reusable LoadingSpinner component
✅ **Custom Hooks** - useScrollAnimation and useParallax for smooth interactions
✅ **Design System Enhancements**
   - Glass button effects with animated shine
   - Skeleton loading patterns
   - Scroll snap containers
✅ **Performance Optimization**
   - Lazy loading support in CSS
   - Passive event listeners for scroll
   - Optimized animation performance

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/61694cb5-bbd8-44b1-aa9e-2b4cead1a91a) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/61694cb5-bbd8-44b1-aa9e-2b4cead1a91a) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)

---

## 📖 Additional Resources

For comprehensive platform information, please refer to our documentation:

- **[Documentation Index](./DOCUMENTATION_INDEX.md)** - Central hub for all documentation
- **[Platform Documentation](./PLATFORM_DOCUMENTATION.md)** - Complete technical guide
  - All 6 product features (InterpreBot, InterpreCoach, InterpreStudy, InterpreWellness, InterpreTrack, InterpreLink)
  - Technical architecture and database schema
  - API reference and authentication
  - Deployment guide and development workflow
  
- **[Optimization Roadmap](./OPTIMIZATION_ROADMAP.md)** - Strategic planning for 2026
  - Performance optimization strategy
  - Code quality improvements
  - Security enhancements
  - Feature prioritization timeline
  - Testing & QA strategy
  
- **[Implementation Guide](./IMPLEMENTATION_GUIDE.md)** - Production deployment steps
- **[Executive Summary](./EXECUTIVE_SUMMARY.md)** - Project status and achievements
- **[Project Optimization Report](./PROJECT_OPTIMIZATION_REPORT.md)** - Technical analysis

**Support:** admin.ceo@interprelab.com
