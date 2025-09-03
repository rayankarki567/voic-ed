#!/usr/bin/env node

/**
 * Fix Next.js 15 async params issues in all API routes
 * Converts params from sync to async access pattern
 */

const fs = require('fs');
const glob = require('glob');

function fixAsyncParams(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // Fix RouteParams interface for [id] routes
    if (filePath.includes('[id]')) {
      const oldInterface = /interface RouteParams \{\s*params: \{\s*id: string\s*\}\s*\}/g;
      const newInterface = `interface RouteParams {
  params: Promise<{
    id: string
  }>
}`;
      
      if (oldInterface.test(content)) {
        content = content.replace(oldInterface, newInterface);
        modified = true;
      }

      // Fix async parameter destructuring in functions
      const oldPattern = /export async function (GET|POST|PUT|DELETE)\(request: Request, \{ params \}: RouteParams\) \{\s*try \{\s*const supabase/g;
      const newPattern = (match, method) => {
        return `export async function ${method}(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params
    const supabase`;
      };
      
      content = content.replace(oldPattern, newPattern);

      // Fix params.id references to use id variable
      content = content.replace(/params\.id/g, 'id');
      
      if (content.includes('const { id } = await params')) {
        modified = true;
      }
    }

    if (modified) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✓ ${filePath} - Fixed async params`);
    } else {
      console.log(`- ${filePath} - No changes needed`);
    }

  } catch (error) {
    console.error(`✗ ${filePath} - Error: ${error.message}`);
  }
}

// Find all API routes with [id] parameters
const routes = glob.sync('app/api/**/[id]/route.{js,ts}', { 
  cwd: process.cwd(),
  absolute: true 
});

// Also check surveys/[id] route
routes.push(...glob.sync('app/api/surveys/[id]/route.{js,ts}', { 
  cwd: process.cwd(),
  absolute: true 
}));

// Also check polls/[id] route  
routes.push(...glob.sync('app/api/polls/[id]/route.{js,ts}', { 
  cwd: process.cwd(),
  absolute: true 
}));

console.log(`Fixing async params in ${routes.length} API routes:\n`);

routes.forEach(fixAsyncParams);

console.log(`\n🔧 Async params configuration fixed!`);
console.log('All API routes now use Next.js 15 async params pattern.');
