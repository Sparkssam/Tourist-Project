#!/usr/bin/env node

/**
 * Test Login Functionality
 * This script helps diagnose login issues
 */

const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('\n🔍 Login Troubleshooting Checklist\n');
console.log('Follow these steps to fix your login issue:\n');

const steps = [
  {
    step: 1,
    title: 'Clear Browser Cache',
    instructions: [
      'Press Ctrl+Shift+R (Windows/Linux) or Cmd+Shift+R (Mac)',
      'Or: F12 → Network tab → Check "Disable cache"',
      'Or: Browser Settings → Clear browsing data → Cached files'
    ]
  },
  {
    step: 2,
    title: 'Clear All Cookies',
    instructions: [
      'Press F12 → Application tab',
      'Left sidebar → Cookies → http://localhost:3000',
      'Right-click → Clear',
      'Close DevTools'
    ]
  },
  {
    step: 3,
    title: 'Close All Browser Tabs',
    instructions: [
      'Close ALL tabs of localhost:3000',
      'Close the browser completely',
      'Reopen browser',
      'Open ONLY ONE tab with localhost:3000'
    ]
  },
  {
    step: 4,
    title: 'Verify Dev Server is Running',
    instructions: [
      'Check terminal shows: "Ready in X.Xs"',
      'If not, restart: Ctrl+C, then npm run dev',
      'Wait for "Ready" message before testing'
    ]
  },
  {
    step: 5,
    title: 'Test Login',
    instructions: [
      'Go to: http://localhost:3000/login',
      'Open DevTools: F12 → Console tab',
      'Enter credentials and click Sign In',
      'Watch console for messages'
    ]
  }
];

function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, resolve);
  });
}

async function runChecklist() {
  for (const { step, title, instructions } of steps) {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`Step ${step}: ${title}`);
    console.log('='.repeat(60));
    
    instructions.forEach((instruction, index) => {
      console.log(`  ${index + 1}. ${instruction}`);
    });
    
    const answer = await askQuestion(`\nCompleted step ${step}? (y/n): `);
    
    if (answer.toLowerCase() !== 'y' && answer.toLowerCase() !== 'yes') {
      console.log('\n⚠️  Please complete this step before continuing.\n');
      return;
    }
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('✅ All steps completed!');
  console.log('='.repeat(60));
  console.log('\n📊 Expected Console Output:\n');
  console.log('  Attempting sign in...');
  console.log('  Sign in successful! Role: staff');
  console.log('  (Page redirects to /staff)\n');
  
  console.log('🎯 What Should Happen:\n');
  console.log('  1. Login form submits');
  console.log('  2. Console shows "Attempting sign in..."');
  console.log('  3. Console shows "Sign in successful! Role: {your_role}"');
  console.log('  4. Page redirects automatically');
  console.log('  5. You see the dashboard for your role\n');
  
  const stillBroken = await askQuestion('Is login still not working? (y/n): ');
  
  if (stillBroken.toLowerCase() === 'y' || stillBroken.toLowerCase() === 'yes') {
    console.log('\n🔧 Additional Debugging Steps:\n');
    console.log('1. Check Console Errors:');
    console.log('   - Press F12 → Console tab');
    console.log('   - Look for red error messages');
    console.log('   - Copy and share any errors\n');
    
    console.log('2. Check Network Tab:');
    console.log('   - F12 → Network tab');
    console.log('   - Try logging in');
    console.log('   - Look for failed requests (red)');
    console.log('   - Check response of /login request\n');
    
    console.log('3. Verify Environment Variables:');
    console.log('   - Run: npm run verify');
    console.log('   - Check all environment variables are set\n');
    
    console.log('4. Check Supabase Connection:');
    console.log('   - Go to: https://supabase.com/dashboard');
    console.log('   - Verify project is active');
    console.log('   - Check API keys are correct\n');
    
    console.log('5. Restart Everything:');
    console.log('   - Terminal: Ctrl+C to stop server');
    console.log('   - Run: npm run verify');
    console.log('   - Run: npm run dev');
    console.log('   - Clear browser cache again');
    console.log('   - Try login\n');
  } else {
    console.log('\n🎉 Great! Login is working!\n');
    console.log('You can now:');
    console.log('  - Access your dashboard');
    console.log('  - Test all features');
    console.log('  - Start developing\n');
  }
  
  rl.close();
}

console.log('This interactive checklist will help fix your login issue.\n');
askQuestion('Ready to start? (y/n): ').then((answer) => {
  if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
    runChecklist();
  } else {
    console.log('\n📚 Quick Reference:\n');
    console.log('  Clear cache: Ctrl+Shift+R');
    console.log('  Clear cookies: F12 → Application → Cookies → Clear');
    console.log('  Restart server: Ctrl+C, then npm run dev\n');
    rl.close();
  }
});
