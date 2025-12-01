# API Documentation Setup Guide

This guide explains how to set up and use automated documentation tools for the InterpreHub API.

## Table of Contents

1. [Quick Start](#quick-start)
2. [Swagger UI Setup](#swagger-ui-setup)
3. [Redoc Setup](#redoc-setup)
4. [Postman Setup](#postman-setup)
5. [TypeDoc Setup](#typedoc-setup)
6. [API Testing](#api-testing)
7. [Maintenance](#maintenance)

---

## Quick Start

### Files Created

1. **API_DOCUMENTATION.md** - Comprehensive API documentation
2. **openapi.yaml** - OpenAPI 3.0 specification
3. **postman_collection.json** - Postman collection for testing
4. **API_DOCUMENTATION_SETUP.md** - This setup guide

### Prerequisites

```bash
npm install
```

---

## Swagger UI Setup

Swagger UI provides interactive API documentation that allows users to test endpoints directly from the browser.

### Installation

```bash
npm install --save-dev swagger-ui-react swagger-jsdoc
```

### Create Swagger Page Component

Create `src/pages/APIDocs.tsx`:

```typescript
import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';

function APIDocs() {
  return (
    <div className="api-docs-container">
      <SwaggerUI url="/openapi.yaml" />
    </div>
  );
}

export default APIDocs;
```

### Add Route

In `src/App.tsx`, add:

```typescript
import APIDocs from './pages/APIDocs';

// In your router configuration
<Route path="/api-docs" element={<APIDocs />} />
```

### Copy OpenAPI Spec to Public

```bash
cp openapi.yaml public/openapi.yaml
```

### Access Documentation

Navigate to `http://localhost:5173/api-docs` to view interactive API documentation.

### Customization

Create `src/pages/APIDocs.tsx` with custom options:

```typescript
import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';

function APIDocs() {
  return (
    <SwaggerUI
      url="/openapi.yaml"
      docExpansion="list"
      defaultModelsExpandDepth={1}
      defaultModelExpandDepth={1}
      displayRequestDuration={true}
      filter={true}
      showExtensions={true}
      showCommonExtensions={true}
      tryItOutEnabled={true}
      requestInterceptor={(req) => {
        // Add custom headers
        req.headers['X-Custom-Header'] = 'value';
        return req;
      }}
    />
  );
}

export default APIDocs;
```

---

## Redoc Setup

Redoc provides beautiful, responsive API documentation with a three-panel layout.

### Installation

```bash
npm install --save-dev redoc
```

### Create Redoc Page Component

Create `src/pages/APIReference.tsx`:

```typescript
import { RedocStandalone } from 'redoc';

function APIReference() {
  return (
    <RedocStandalone
      specUrl="/openapi.yaml"
      options={{
        nativeScrollbars: true,
        theme: {
          colors: {
            primary: {
              main: '#3b82f6'
            }
          },
          typography: {
            fontFamily: 'Inter, system-ui, sans-serif',
            fontSize: '14px',
            headings: {
              fontFamily: 'Inter, system-ui, sans-serif'
            }
          }
        },
        scrollYOffset: 60,
        hideDownloadButton: false,
        disableSearch: false,
        expandResponses: '200,201'
      }}
    />
  );
}

export default APIReference;
```

### Add Route

```typescript
<Route path="/api-reference" element={<APIReference />} />
```

### Access Documentation

Navigate to `http://localhost:5173/api-reference`

### Static HTML Generation

Generate static HTML for deployment:

```bash
npx redoc-cli bundle openapi.yaml -o api-docs.html
```

### Custom Theme

Create `redoc-theme.json`:

```json
{
  "colors": {
    "primary": {
      "main": "#3b82f6"
    },
    "success": {
      "main": "#10b981"
    },
    "warning": {
      "main": "#f59e0b"
    },
    "error": {
      "main": "#ef4444"
    },
    "text": {
      "primary": "#1f2937",
      "secondary": "#6b7280"
    },
    "http": {
      "get": "#10b981",
      "post": "#3b82f6",
      "put": "#f59e0b",
      "delete": "#ef4444"
    }
  },
  "typography": {
    "fontSize": "14px",
    "lineHeight": "1.5",
    "fontFamily": "Inter, system-ui, sans-serif",
    "headings": {
      "fontFamily": "Inter, system-ui, sans-serif",
      "fontWeight": "600"
    },
    "code": {
      "fontSize": "13px",
      "fontFamily": "monospace"
    }
  },
  "sidebar": {
    "backgroundColor": "#f9fafb",
    "textColor": "#1f2937"
  },
  "rightPanel": {
    "backgroundColor": "#1f2937"
  }
}
```

Use custom theme:

```bash
npx redoc-cli bundle openapi.yaml -o api-docs.html --options.theme redoc-theme.json
```

---

## Postman Setup

Postman provides API testing and documentation capabilities.

### Import Collection

1. Open Postman
2. Click **Import** button
3. Select `postman_collection.json`
4. Collection will be imported with all endpoints

### Configure Environment

1. Click **Environments** in left sidebar
2. Click **+** to create new environment
3. Name it "InterpreHub Development"
4. Add variables:

| Variable | Initial Value | Current Value |
|----------|--------------|---------------|
| BASE_URL | https://0ec90b57d6e95fcbda19832f.supabase.co | (same) |
| SUPABASE_ANON_KEY | your_anon_key | your_anon_key |
| ACCESS_TOKEN | | |

5. Click **Save**

### Test Endpoints

1. Select the environment in the top-right dropdown
2. Open any request from the collection
3. Click **Send**
4. View response

### Automatic Token Refresh

The "Sign In" request includes a test script that automatically saves the access token:

```javascript
if (pm.response.code === 200) {
    const response = pm.response.json();
    pm.collectionVariables.set('ACCESS_TOKEN', response.access_token);
}
```

### Generate Documentation

1. Click collection name
2. Click **View documentation**
3. Click **Publish** to create public documentation
4. Or click **Share** to generate a private link

### Run Collection

Test all endpoints at once:

1. Click collection name
2. Click **Run collection**
3. Select requests to run
4. Click **Run InterpreHub API**

---

## TypeDoc Setup

Generate documentation from TypeScript code comments.

### Installation

```bash
npm install --save-dev typedoc typedoc-plugin-markdown
```

### Configure TypeDoc

Create `typedoc.json`:

```json
{
  "entryPoints": [
    "src/integrations/supabase/services.ts",
    "src/contexts/AuthContext.tsx",
    "src/lib/types.ts"
  ],
  "out": "docs",
  "plugin": ["typedoc-plugin-markdown"],
  "readme": "API_DOCUMENTATION.md",
  "name": "InterpreHub API Client",
  "includeVersion": true,
  "excludePrivate": true,
  "excludeProtected": true,
  "excludeExternals": true,
  "theme": "default",
  "hideGenerator": true
}
```

### Add Documentation Comments

Update service files with JSDoc comments:

```typescript
/**
 * Service for managing interpreter call logs
 * @module CallLogService
 */
export const CallLogService = {
  /**
   * Create a new call log entry
   * @param {TablesInsert<'call_logs'>} callLog - Call log data
   * @returns {Promise<{data: CallLog | null, error: Error | null}>}
   * @example
   * ```typescript
   * const result = await CallLogService.createCallLog({
   *   user_id: 'uuid',
   *   start_time: '2025-12-01T10:00:00Z',
   *   call_type: 'medical'
   * });
   * ```
   */
  async createCallLog(callLog: TablesInsert<'call_logs'>) {
    // ... implementation
  }
};
```

### Generate Documentation

Add script to `package.json`:

```json
{
  "scripts": {
    "docs": "typedoc",
    "docs:watch": "typedoc --watch"
  }
}
```

Run:

```bash
npm run docs
```

Documentation will be generated in the `docs/` directory.

### View Documentation

```bash
npx serve docs
```

Or deploy to GitHub Pages, Netlify, or Vercel.

---

## API Testing

### Automated Testing with Playwright

Create `tests/api.spec.ts`:

```typescript
import { test, expect } from '@playwright/test';

const BASE_URL = 'https://0ec90b57d6e95fcbda19832f.supabase.co';
const ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY;

test.describe('InterpreHub API', () => {
  test('wellness chat endpoint responds', async ({ request }) => {
    const response = await request.post(
      `${BASE_URL}/functions/v1/wellness-chat`,
      {
        headers: {
          'Authorization': `Bearer ${ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        data: {
          messages: [
            {
              role: 'user',
              content: 'Test message'
            }
          ]
        }
      }
    );

    expect(response.status()).toBe(200);
  });

  test('study chat with specialty', async ({ request }) => {
    const response = await request.post(
      `${BASE_URL}/functions/v1/study-chat`,
      {
        headers: {
          'Authorization': `Bearer ${ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        data: {
          messages: [
            {
              role: 'user',
              content: 'Explain hypertension'
            }
          ],
          specialty: 'cardiology'
        }
      }
    );

    expect(response.status()).toBe(200);
  });

  test('generate flashcards', async ({ request }) => {
    const response = await request.post(
      `${BASE_URL}/functions/v1/generate-flashcards`,
      {
        headers: {
          'Authorization': `Bearer ${ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        data: {
          cardType: 'term-translation',
          specialty: 'cardiology',
          count: 5
        }
      }
    );

    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data.flashcards).toBeDefined();
    expect(data.flashcards.length).toBeGreaterThan(0);
  });

  test('process interprecoach text', async ({ request }) => {
    const response = await request.post(
      `${BASE_URL}/functions/v1/process-interprecoach`,
      {
        headers: {
          'Authorization': `Bearer ${ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        data: {
          text: 'Patient presents with acute abdominal pain',
          medications: [],
          conversions: []
        }
      }
    );

    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data.processed).toBe(true);
    expect(data.medicalTerms).toBeDefined();
  });
});
```

Run tests:

```bash
npx playwright test tests/api.spec.ts
```

### cURL Examples

Test endpoints from command line:

```bash
# Wellness Chat
curl -X POST https://0ec90b57d6e95fcbda19832f.supabase.co/functions/v1/wellness-chat \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [
      {
        "role": "user",
        "content": "I need support"
      }
    ]
  }'

# Generate Flashcards
curl -X POST https://0ec90b57d6e95fcbda19832f.supabase.co/functions/v1/generate-flashcards \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "cardType": "term-translation",
    "specialty": "cardiology",
    "count": 5
  }'
```

---

## Maintenance

### Keeping Documentation Updated

#### 1. Update OpenAPI Spec

When adding new endpoints, update `openapi.yaml`:

```yaml
paths:
  /functions/v1/new-endpoint:
    post:
      tags:
        - Edge Functions
      summary: New endpoint description
      # ... rest of specification
```

#### 2. Update Markdown Documentation

Update `API_DOCUMENTATION.md` with:
- Endpoint description
- Request/response examples
- Error handling
- Code examples

#### 3. Update Postman Collection

1. Create new request in Postman
2. Test the request
3. Export collection
4. Replace `postman_collection.json`

#### 4. Regenerate TypeDoc

```bash
npm run docs
```

### Versioning

When making breaking changes:

1. Update version in `openapi.yaml`:
```yaml
info:
  version: 2.0.0
```

2. Create version-specific documentation:
```
API_DOCUMENTATION_v1.md
API_DOCUMENTATION_v2.md
```

3. Maintain backward compatibility:
```
/functions/v1/endpoint
/functions/v2/endpoint
```

### CI/CD Integration

Add to `.github/workflows/documentation.yml`:

```yaml
name: Documentation

on:
  push:
    branches: [main]
    paths:
      - 'supabase/functions/**'
      - 'openapi.yaml'

jobs:
  generate-docs:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm install

      - name: Generate TypeDoc
        run: npm run docs

      - name: Generate Redoc static HTML
        run: npx redoc-cli bundle openapi.yaml -o docs/api-reference.html

      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./docs
```

### API Changelog

Create `API_CHANGELOG.md`:

```markdown
# API Changelog

## Version 1.0.0 (2025-12-01)

### Added
- Wellness chat endpoint
- Study chat endpoint
- Process InterpreCoach endpoint
- Generate interpreter feedback endpoint
- Generate flashcards endpoint
- Debriefing questionnaire endpoint

### Authentication
- Supabase Auth integration
- JWT token support

### Database Services
- Call logs CRUD
- User settings management
- Contacts management
- Waitlist management
- Profiles management
```

---

## Best Practices

### 1. Documentation Standards

- **Keep examples up-to-date** - Test all code examples
- **Use real-world scenarios** - Examples should reflect actual usage
- **Include error cases** - Document common error scenarios
- **Provide context** - Explain why, not just how

### 2. Testing Documentation

Create `scripts/test-docs-examples.sh`:

```bash
#!/bin/bash

# Extract code examples from documentation and test them
# This ensures all examples in docs are valid

echo "Testing API documentation examples..."

# Test wellness chat example
curl -X POST https://0ec90b57d6e95fcbda19832f.supabase.co/functions/v1/wellness-chat \
  -H "Authorization: Bearer $VITE_SUPABASE_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d @tests/fixtures/wellness-chat.json \
  --fail || exit 1

echo "All documentation examples tested successfully!"
```

### 3. Documentation Review Checklist

- [ ] All endpoints documented
- [ ] Request/response examples provided
- [ ] Error responses documented
- [ ] Authentication requirements clear
- [ ] Rate limits documented
- [ ] Code examples tested
- [ ] OpenAPI spec validates
- [ ] Postman collection works
- [ ] TypeDoc generates without errors
- [ ] Links work (no broken links)

---

## Resources

### Tools

- **Swagger UI**: https://swagger.io/tools/swagger-ui/
- **Redoc**: https://github.com/Redocly/redoc
- **Postman**: https://www.postman.com/
- **TypeDoc**: https://typedoc.org/
- **OpenAPI**: https://www.openapis.org/

### Validators

- **OpenAPI Validator**: https://apitools.dev/swagger-parser/online/
- **JSON Schema Validator**: https://www.jsonschemavalidator.net/

### References

- **OpenAPI Specification**: https://spec.openapis.org/oas/v3.0.0
- **Supabase Docs**: https://supabase.com/docs
- **REST API Best Practices**: https://restfulapi.net/

---

## Support

For documentation questions:
- Create an issue on GitHub
- Contact: support@interprehub.com
- Documentation: https://interprehub.com/docs
