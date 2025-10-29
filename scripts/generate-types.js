#!/usr/bin/env node

/**
 * Script to generate TypeScript types from Supabase
 * Run this after setting up your Supabase project and running migrations
 *
 * Usage:
 * node scripts/generate-types.js
 *
 * Prerequisites:
 * - Supabase CLI installed
 * - Project linked to Supabase
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔄 Generating TypeScript types from Supabase...');

try {
  // Generate types using Supabase CLI
  const command = 'supabase gen types typescript --local > integrations/supabase/types.ts';

  console.log('📡 Connecting to Supabase and generating types...');
  execSync(command, { stdio: 'inherit' });

  console.log('✅ Types generated successfully!');
  console.log('📁 Types saved to: integrations/supabase/types.ts');

  // Verify the file was created
  const typesPath = path.join(process.cwd(), 'integrations', 'supabase', 'types.ts');
  if (fs.existsSync(typesPath)) {
    const stats = fs.statSync(typesPath);
    console.log(`📊 File size: ${Math.round(stats.size / 1024)}KB`);
    console.log('🎉 Ready to use! Your TypeScript types are now up to date.');
  } else {
    console.error('❌ Types file was not created. Please check your Supabase setup.');
  }

} catch (error) {
  console.error('❌ Error generating types:', error.message);
  console.log('\n🔧 Troubleshooting:');
  console.log('1. Make sure Supabase CLI is installed: npm install -g supabase');
  console.log('2. Make sure your project is linked: supabase link --project-ref YOUR_PROJECT_REF');
  console.log('3. Make sure you have run the migrations: supabase db push');
  console.log('4. For remote projects, use: supabase gen types typescript --project-id YOUR_PROJECT_REF');
  process.exit(1);
}
