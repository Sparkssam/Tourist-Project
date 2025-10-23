#!/usr/bin/env node

/**
 * Local Development Setup Verification Script
 * 
 * This script checks if your local development environment is properly configured.
 * Run: node scripts/verify-local-setup.js
 */

const fs = require('fs');
const path = require('path');

console.log('\n🔍 Verifying Local Development Setup...\n');

let allChecksPass = true;

// Check 1: Node.js version
console.log('1️⃣  Checking Node.js version...');
const nodeVersion = process.version;
const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);

if (majorVersion >= 18) {
  console.log(`   ✅ Node.js ${nodeVersion} (OK)\n`);
} else {
  console.log(`   ❌ Node.js ${nodeVersion} (Need v18 or higher)\n`);
  allChecksPass = false;
}

// Check 2: package.json exists
console.log('2️⃣  Checking package.json...');
const packageJsonPath = path.join(process.cwd(), 'package.json');

if (fs.existsSync(packageJsonPath)) {
  console.log('   ✅ package.json found\n');
  
  // Read package.json
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  
  // Check for key dependencies
  console.log('3️⃣  Checking key dependencies...');
  const requiredDeps = ['next', 'react', 'react-dom', '@supabase/supabase-js', 'resend'];
  let missingDeps = [];
  
  requiredDeps.forEach(dep => {
    if (packageJson.dependencies[dep]) {
      console.log(`   ✅ ${dep} installed`);
    } else {
      console.log(`   ❌ ${dep} missing`);
      missingDeps.push(dep);
      allChecksPass = false;
    }
  });
  console.log('');
  
  if (missingDeps.length > 0) {
    console.log(`   ⚠️  Run: npm install ${missingDeps.join(' ')}\n`);
  }
} else {
  console.log('   ❌ package.json not found\n');
  allChecksPass = false;
}

// Check 3: node_modules exists
console.log('4️⃣  Checking node_modules...');
const nodeModulesPath = path.join(process.cwd(), 'node_modules');

if (fs.existsSync(nodeModulesPath)) {
  console.log('   ✅ node_modules found (dependencies installed)\n');
} else {
  console.log('   ❌ node_modules not found');
  console.log('   ⚠️  Run: npm install\n');
  allChecksPass = false;
}

// Check 4: .env.local file
console.log('5️⃣  Checking environment variables...');
const envLocalPath = path.join(process.cwd(), '.env.local');

if (fs.existsSync(envLocalPath)) {
  console.log('   ✅ .env.local file found');
  
  // Read and check required variables
  const envContent = fs.readFileSync(envLocalPath, 'utf8');
  const requiredVars = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'SUPABASE_SERVICE_ROLE_KEY',
    'SUPER_ADMIN_SECRET'
  ];
  
  requiredVars.forEach(varName => {
    if (envContent.includes(varName) && !envContent.includes(`${varName}=\n`)) {
      console.log(`   ✅ ${varName} is set`);
    } else {
      console.log(`   ⚠️  ${varName} might be missing or empty`);
    }
  });
  
  // Check optional variables
  if (envContent.includes('RESEND_API_KEY') && !envContent.includes('RESEND_API_KEY=\n')) {
    console.log('   ✅ RESEND_API_KEY is set (email feature ready)');
  } else {
    console.log('   ℹ️  RESEND_API_KEY not set (email feature disabled)');
  }
  console.log('');
} else {
  console.log('   ❌ .env.local file not found');
  console.log('   ⚠️  Copy .env.example to .env.local and fill in your values\n');
  allChecksPass = false;
}

// Check 5: Next.js configuration
console.log('6️⃣  Checking Next.js configuration...');
const nextConfigPath = path.join(process.cwd(), 'next.config.mjs');

if (fs.existsSync(nextConfigPath)) {
  console.log('   ✅ next.config.mjs found\n');
} else {
  console.log('   ❌ next.config.mjs not found\n');
  allChecksPass = false;
}

// Check 6: Key directories
console.log('7️⃣  Checking project structure...');
const requiredDirs = ['app', 'components', 'lib', 'public'];
const missingDirs = [];

requiredDirs.forEach(dir => {
  const dirPath = path.join(process.cwd(), dir);
  if (fs.existsSync(dirPath)) {
    console.log(`   ✅ ${dir}/ directory found`);
  } else {
    console.log(`   ❌ ${dir}/ directory not found`);
    missingDirs.push(dir);
    allChecksPass = false;
  }
});
console.log('');

// Check 7: TypeScript configuration
console.log('8️⃣  Checking TypeScript configuration...');
const tsconfigPath = path.join(process.cwd(), 'tsconfig.json');

if (fs.existsSync(tsconfigPath)) {
  console.log('   ✅ tsconfig.json found\n');
} else {
  console.log('   ⚠️  tsconfig.json not found (will be auto-generated)\n');
}

// Final summary
console.log('═══════════════════════════════════════════════════════════\n');

if (allChecksPass) {
  console.log('✅ All checks passed! Your local development environment is ready.\n');
  console.log('🚀 To start the development server, run:\n');
  console.log('   npm run dev\n');
  console.log('Then open: http://localhost:3000\n');
} else {
  console.log('⚠️  Some checks failed. Please fix the issues above.\n');
  console.log('📚 For help, see: LOCAL-DEVELOPMENT-GUIDE.md\n');
}

console.log('═══════════════════════════════════════════════════════════\n');

// Additional helpful commands
console.log('📝 Helpful commands:\n');
console.log('   npm run dev              - Start development server');
console.log('   npm run build            - Build for production');
console.log('   npm run start            - Start production server');
console.log('   npm run lint             - Check code quality');
console.log('   npm run create-admin     - Create admin user\n');

process.exit(allChecksPass ? 0 : 1);
