#!/usr/bin/env node

import { execSync } from 'child_process';
import dotenv from 'dotenv';

console.log('🚀 Setting up local development environment...');

// Load .env.local file
dotenv.config({ path: '.env.local' });
console.log('✅ Loaded .env.local file');

// Check if Docker is running
try {
  execSync('docker info', { stdio: 'ignore' });
  console.log('✅ Docker is running');
} catch {
  console.log('❌ Docker is not running. Please start Docker Desktop first.');
  process.exit(1);
}

// Start PostgreSQL container
console.log('🐘 Starting PostgreSQL container...');
try {
  execSync('docker-compose -f docker-compose.local.db.yml up -d postgres', { stdio: 'inherit' });
} catch {
  console.log('❌ Failed to start PostgreSQL container');
  process.exit(1);
}

// Wait for PostgreSQL to be ready
console.log('⏳ Waiting for PostgreSQL to be ready...');
let isReady = false;
let attempts = 0;
const maxAttempts = 30;

while (!isReady && attempts < maxAttempts) {
  try {
    execSync('docker exec prototype-next-app-postgres-dev pg_isready -U postgres -d postgres_dev', { stdio: 'ignore' });
    isReady = true;
    console.log('✅ PostgreSQL is ready!');
  } catch {
    console.log(`   Waiting for PostgreSQL... (attempt ${attempts + 1}/${maxAttempts})`);
    attempts++;
    if (attempts < maxAttempts) {
      // Wait 2 seconds
      const start = Date.now();
      while (Date.now() - start < 2000) {
        // Busy wait
      }
    }
  }
}

if (!isReady) {
  console.log('❌ PostgreSQL failed to start within expected time');
  process.exit(1);
}

// Generate Prisma client
console.log('🔧 Generating Prisma client...');
try {
  execSync('npx prisma generate', { stdio: 'inherit' });
  console.log('✅ Prisma client generated');
} catch {
  console.log('❌ Failed to generate Prisma client');
  process.exit(1);
}

// Run Prisma migrations
console.log('🔄 Running Prisma migrations...');
try {
  execSync('npx prisma migrate dev --name init', { stdio: 'inherit' });
} catch {
  console.log('❌ Failed to run Prisma migrations');
  process.exit(1);
}

// Run Prisma seed
console.log('🌱 Running Prisma seed...');
try {
  execSync('npx tsx prisma/seed.ts', { stdio: 'inherit' });
  console.log('✅ Prisma seed completed successfully');
} catch {
  console.log('❌ Failed to run Prisma seed');
  process.exit(1);
}

console.log('🎉 Development environment setup complete!');
console.log('');
console.log('📋 Next steps:');
console.log('1. Run \'npm run dev\' to start the development server');
console.log('2. Access the application at http://localhost:3000');
console.log('');
console.log('🛠️  Useful commands:');
console.log('- Stop PostgreSQL: npm run db:stop');
console.log('- View logs: npm run db:logs');
console.log('- Reset database: npm run db:reset');
