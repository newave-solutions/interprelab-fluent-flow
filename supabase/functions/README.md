# Supabase Edge Functions

This directory contains Supabase Edge Functions that run on Deno runtime.

## IDE Configuration

The following files configure your IDE to properly handle Deno code:

- `deno.json` - Deno configuration
- `tsconfig.json` - TypeScript configuration for IDE
- `.eslintrc.json` - ESLint configuration
- `import_map.json` - Import mappings

## Suppressing IDE Errors

If you see errors like:
- `Cannot find module 'https://deno.land/std@0.192.0/http/server.ts'`
- `Cannot find name 'Deno'`

These are **not real errors**. They're just IDE warnings because:
1. Your IDE expects Node.js-style imports
2. Deno uses URL imports which work at runtime
3. The `Deno` global is available in the Deno runtime

### To Fix IDE Warnings:

1. **Install Deno Extension** (VS Code):
   - Open Extensions (Ctrl+Shift+X)
   - Search for "Deno"
   - Install the official extension by Denoland

2. **Reload VS Code**:
   - Press Ctrl+Shift+P
   - Type "Reload Window"
   - Press Enter

3. **Verify Deno is Enabled**:
   - Check the status bar at the bottom
   - Should show "Deno" when editing files in this directory

## Functions

### Available Functions

1. **process-interprecoach** - HIPAA-compliant medical interpretation with Google AI
2. **process-assessment** - Assessment processing and scoring
3. **generate-analytics** - Analytics generation for call logs
4. **calculate-earnings** - Earnings calculation based on call duration
5. **generate-study-content** - AI-powered study content generation

### Shared Resources

- `_shared/cors.ts` - CORS headers for all functions
- `_shared/types.ts` - Shared TypeScript interfaces

## Development

### Local Testing

```bash
# Start Supabase locally
supabase start

# Serve a function locally
supabase functions serve function-name

# Test with curl
curl -i --location --request POST 'http://localhost:54321/functions/v1/function-name' \
  --header 'Authorization: Bearer YOUR_ANON_KEY' \
  --header 'Content-Type: application/json' \
  --data '{"key":"value"}'
```

### Deployment

```bash
# Deploy a single function
supabase functions deploy function-name

# Deploy all functions
supabase functions deploy
```

### Environment Variables

Set secrets using:
```bash
supabase secrets set KEY=value
```

Required secrets:
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `GOOGLE_CLOUD_API_KEY` (for AI features)
- `GOOGLE_CLOUD_PROJECT_ID` (for AI features)

## Troubleshooting

### TypeScript Errors in IDE

If you still see TypeScript errors after configuration:

1. Close and reopen VS Code
2. Run "TypeScript: Restart TS Server" from command palette
3. Ensure Deno extension is installed and enabled
4. Check that `deno.enablePaths` includes `supabase/functions` in settings

### Import Errors

If imports show as errors but code works:
- This is normal for Deno URL imports
- The code will work when deployed
- IDE just doesn't recognize the syntax

### Runtime Errors

Check function logs:
```bash
supabase functions logs function-name
```

## Best Practices

1. **Always use CORS headers** from `_shared/cors.ts`
2. **Handle OPTIONS requests** for CORS preflight
3. **Validate input** before processing
4. **Use try-catch** for error handling
5. **Return proper HTTP status codes**
6. **Log errors** for debugging
7. **Keep functions small** and focused
8. **Use shared types** from `_shared/types.ts`

## Resources

- [Supabase Edge Functions Docs](https://supabase.com/docs/guides/functions)
- [Deno Documentation](https://deno.land/manual)
- [Deno Standard Library](https://deno.land/std)
