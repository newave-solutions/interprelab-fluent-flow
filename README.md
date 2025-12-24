# InterpreLab - AI-Driven Medical Interpreter Platform

## 🎯 Overview

InterpreLab is a comprehensive AI-powered platform designed to train, support, and empower medical interpreters through cutting-edge technology and evidence-based learning methodologies.

## 🚀 Products & Features

### InterpreTest 🤖 (AI Assessment & Training)

Realistic, interactive linguistic assessments with deep grammatical and contextual analysis. Provides personalized learning paths based on performance.

### InterpreCoach 🎧 (Real-Time AI Assistant)

Browser extension providing real-time terminology assistance, voice coaching, and predictive support during live interpretation sessions.

### InterpreStudy 📚 (Interactive Learning)

Multimodal training modules covering ethics, cultural competency, medical terminology, and scenario-based practice.

### InterpreSigns 🤟 (ASL Recognition)

AI-powered American Sign Language recognition and training using TensorFlow.js with support for both static and motion-based gestures.

### InterpreWellness 💆 (Self-Care)

Mental health and wellness resources specifically designed for interpreters, including stress management and burnout prevention.

### InterpreLink 🤝 (Professional Network)

Community platform featuring forums, job boards, and curated resources for interpreter professional development.

## 🛠️ Tech Stack

### Frontend

- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS + shadcn/ui
- **State Management**: React Query + Context API
- **Routing**: React Router v6

### Backend & Services

- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Edge Functions**: Supabase Edge Functions
- **AI/ML**: Google Gemini API, TensorFlow.js
- **Real-time**: Supabase Realtime subscriptions

### DevOps

- **Version Control**: Git / GitHub
- **CI/CD**: GitHub Actions
- **Environment Management**: `.env` files
- **Package Manager**: npm / pnpm

## 📋 Prerequisites

- Node.js 18+ and npm (or pnpm)
- Supabase account and project
- Google Gemini API key
- Git

## 🔧 Local Development Setup

```bash
# 1. Clone the repository
git clone https://github.com/newave-solutions/interprelab-fluent-flow.git
cd interprelab-fluent-flow

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
# Edit .env with your Supabase and Gemini credentials

# 4. Run database migrations
npx supabase db push

# 5. Start development server
npm run dev
```

## 🌿 Branch Strategy

### `main` Branch

- **Purpose**: Production-ready independent deployment
- **Dependencies**: Standard React/Vite stack only
- **Deployment**: Self-hosted or cloud platforms (Firebase, Vercel, Netlify, etc.)

### `lovable` Branch  

- **Purpose**: Development workflow integrated with Lovable.dev
- **Dependencies**: Includes Lovable-specific packages
- **Use**: For rapid prototyping and AI-assisted development

## 📦 Environment Variables

```bash
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Google Gemini API
GEMINI_API_KEY=your_gemini_api_key
```

See `.env.example` for complete configuration.

## 🚀 Deployment

### Option 1: Vercel (Recommended)

```bash
npm run build
# Deploy dist folder to Vercel
```

### Option 2: Firebase Hosting

```bash
npm run build
firebase deploy --only hosting
```

### Option 3: Docker

```bash
docker build -t interprelab .
docker run -p 3000:3000 interprelab
```

See [GCP_CLOUDRUN_DEPLOY.md](./GCP_CLOUDRUN_DEPLOY.md) for Cloud Run deployment.

## 📚 Documentation

### Core Documentation

- **[PLATFORM_DOCUMENTATION.md](./PLATFORM_DOCUMENTATION.md)** - Complete technical reference
- **[PROJECT_ARCHITECTURE.md](./PROJECT_ARCHITECTURE.md)** - System architecture and design
- **[GEMINI.md](./GEMINI.md)** - AI assistant knowledge base
- **[API_DOCUMENTATION.md](./API_DOCUMENTATION.md)** - API reference

### Setup Guides

- **[ENV_CONFIG.md](./ENV_CONFIG.md)** - Environment configuration guide
- **[IMPLEMENTATION_GUIDE.md](./IMPLEMENTATION_GUIDE.md)** - Step-by-step deployment
- **[GITHUB_ACTIONS_SETUP.md](./GITHUB_ACTIONS_SETUP.md)** - CI/CD configuration

### Strategic Planning

- **[OPTIMIZATION_ROADMAP.md](./OPTIMIZATION_ROADMAP.md)** - 2026 roadmap and priorities
- **[EXECUTIVE_SUMMARY.md](./EXECUTIVE_SUMMARY.md)** - Project overview and metrics

## 🧪 Testing

```bash
# Run unit tests
npm test

# Run E2E tests
npm run test:e2e

# Linting
npm run lint

# Type checking
npm run type-check
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch from `main`
3. Make your changes with tests
4. Submit a pull request

## 📄 License

Proprietary - © 2024-2025 InterpreLab. All rights reserved.

## 📞 Support

- **Email**: <admin.ceo@interprelab.com>
- **Documentation**: See `/docs` directory
- **Issues**: GitHub Issues

---

**Built with ❤️ by working interpreters, for working interpreters.**
