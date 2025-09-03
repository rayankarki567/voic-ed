#!/usr/bin/env node

/**
 * Script to add Vercel runtime configuration to all API routes
 * Prevents common deployment errors like FUNCTION_INVOCATION_TIMEOUT
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

const RUNTIME_CONFIG = `
// Vercel runtime configuration
export const runtime = 'nodejs18';
export const maxDuration = 30; // seconds (max for Hobby plan)
export const dynamic = 'force-dynamic';
`;

function addRuntimeConfig(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Check if runtime config already exists
    if (content.includes('export const runtime')) {
      console.log(`✓ ${filePath} - Already configured`);
      return;
    }
    
    // Add runtime config after imports
    const lines = content.split('\n');
    const importEndIndex = lines.findLastIndex(line => 
      line.startsWith('import ') || 
      line.startsWith("import'") ||
      line.startsWith('import"')
    );
    
    if (importEndIndex >= 0) {
      lines.splice(importEndIndex + 1, 0, RUNTIME_CONFIG);
    } else {
      // If no imports, add at the beginning
      lines.unshift(RUNTIME_CONFIG);
    }
    
    fs.writeFileSync(filePath, lines.join('\n'), 'utf8');
    console.log(`✓ ${filePath} - Runtime config added`);
    
  } catch (error) {
    console.error(`✗ ${filePath} - Error: ${error.message}`);
  }
}

// Find all API route files
const apiRoutes = glob.sync('app/api/**/route.{js,ts}', { 
  cwd: process.cwd(),
  absolute: true 
});

console.log(`Found ${apiRoutes.length} API routes to configure:\n`);

apiRoutes.forEach(addRuntimeConfig);

console.log(`\n🚀 Runtime configuration complete!`);
console.log('All API routes are now optimized for Vercel deployment.');

module.exports = { addRuntimeConfig };
