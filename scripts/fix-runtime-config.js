#!/usr/bin/env node

/**
 * Fix runtime configuration for Next.js compatibility
 * Changes nodejs18 to nodejs (valid Next.js value)
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

function fixRuntimeConfig(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Replace nodejs18 with nodejs
    const updated = content.replace(/runtime = 'nodejs18'/g, "runtime = 'nodejs'");
    
    if (content !== updated) {
      fs.writeFileSync(filePath, updated, 'utf8');
      console.log(`✓ ${filePath} - Runtime fixed`);
    } else {
      console.log(`- ${filePath} - No changes needed`);
    }
    
  } catch (error) {
    console.error(`✗ ${filePath} - Error: ${error.message}`);
  }
}

// Find all API route files
const apiRoutes = glob.sync('app/api/**/route.{js,ts}', { 
  cwd: process.cwd(),
  absolute: true 
});

console.log(`Fixing runtime configuration in ${apiRoutes.length} API routes:\n`);

apiRoutes.forEach(fixRuntimeConfig);

console.log(`\n🔧 Runtime configuration fixed!`);
console.log('All API routes now use valid Next.js runtime values.');
