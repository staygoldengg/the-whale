#!/usr/bin/env node

/**
 * Quick Vercel Setup Script
 * 
 * This script guides you through deploying The Whale to Vercel with automatic
 * deployments on every git push. No paid services required.
 * 
 * Usage: node scripts/setup-vercel.js
 */

import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function run() {
  console.log('\n🐋 The Whale — Vercel Auto-Deployment Setup\n');
  console.log('This script will help you deploy to Vercel with automated updates.\n');

  // Step 1: Check if Vercel CLI is installed
  console.log('📋 Step 1: Checking Vercel CLI...');
  try {
    await execAsync('vercel --version');
    console.log('✅ Vercel CLI already installed\n');
  } catch {
    console.log('❌ Vercel CLI not found. Installing...\n');
    try {
      await execAsync('npm install -g vercel');
      console.log('✅ Vercel CLI installed\n');
    } catch (e) {
      console.error('Failed to install Vercel CLI:', e);
      console.log('\nManual install: npm install -g vercel\n');
      return;
    }
  }

  // Step 2: Guide user through Vercel login
  console.log('🔐 Step 2: Vercel Authentication');
  console.log('You will now be prompted to log in to Vercel.\n');
  console.log('If you don\'t have a Vercel account:');
  console.log('1. Go to https://vercel.com\n');
  console.log('2. Click "Sign Up"\n');
  console.log('3. Select "GitHub" to connect your account\n');
  console.log('4. Authorize Vercel to access your GitHub repos\n');
  console.log('Then come back here and continue.\n');

  console.log('Press Enter to continue...');
  await new Promise(resolve => process.stdin.once('data', resolve));

  // Step 3: Deploy
  console.log('\n🚀 Step 3: Deploying to Vercel...\n');
  console.log('This will:\n');
  console.log('1. Deploy your app to Vercel');
  console.log('2. Give you a live URL (e.g., the-whale-abc123.vercel.app)');
  console.log('3. Set up automatic deployments on every git push\n');

  try {
    await execAsync('vercel --prod', { stdio: 'inherit' });
    console.log('\n✅ Deployment successful!\n');

    // Step 4: Domain setup guidance
    console.log('📍 Step 4: Connect Custom Domain');
    console.log('\nTo use thewhale.westhampton.app:\n');
    console.log('1. Go to https://vercel.com/dashboard\n');
    console.log('2. Click "The Whale" project\n');
    console.log('3. Go to Settings → Domains\n');
    console.log('4. Add "thewhale.westhampton.app"\n');
    console.log('5. Copy the CNAME value\n');
    console.log('6. Go to your domain registrar (GoDaddy, Namecheap, etc.)\n');
    console.log('7. Add DNS CNAME record:\n');
    console.log('   subdomain: thewhale\n');
    console.log('   points to: cname.vercel-dns.com\n');
    console.log('8. Wait 5-10 minutes for DNS to propagate\n');
    console.log('9. Visit https://thewhale.westhampton.app ✨\n');

    console.log('✨ Automation Setup');
    console.log('Every time you push to main:\n');
    console.log('git push origin main\n');
    console.log('→ Vercel automatically:\n');
    console.log('  • Rebuilds your app\n');
    console.log('  • Runs tests\n');
    console.log('  • Deploys to production\n');
    console.log('  • Updates thewhale.westhampton.app\n');

    console.log('📚 Next Steps:\n');
    console.log('1. Read DEPLOYMENT.md for complete guide\n');
    console.log('2. Add environment variables in Vercel dashboard\n');
    console.log('3. Connect your custom domain\n');
    console.log('4. Start developing - changes auto-deploy!\n');

  } catch (e) {
    console.error('\n❌ Deployment failed:', e);
    console.log('\nManual setup:');
    console.log('vercel --prod\n');
  }
}

run().catch(console.error);
