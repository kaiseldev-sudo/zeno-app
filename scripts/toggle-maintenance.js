#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const envPath = path.join(process.cwd(), '.env.local');
const envExamplePath = path.join(process.cwd(), 'env.example');

function toggleMaintenanceMode() {
  let envContent = '';
  
  // Check if .env.local exists
  if (fs.existsSync(envPath)) {
    envContent = fs.readFileSync(envPath, 'utf8');
  }
  
  // Check current maintenance mode status
  const currentMode = envContent.includes('MAINTENANCE_MODE=true');
  const newMode = !currentMode;
  
  // Update or add MAINTENANCE_MODE variable
  if (envContent.includes('MAINTENANCE_MODE=')) {
    envContent = envContent.replace(
      /MAINTENANCE_MODE=(true|false)/,
      `MAINTENANCE_MODE=${newMode}`
    );
  } else {
    envContent += `\nMAINTENANCE_MODE=${newMode}`;
  }
  
  // Write to .env.local
  fs.writeFileSync(envPath, envContent.trim() + '\n');
  
  console.log(`✅ Maintenance mode ${newMode ? 'ENABLED' : 'DISABLED'}`);
  console.log(`📁 Updated ${envPath}`);
  console.log(`🔄 Restart your Next.js server for changes to take effect`);
}

function showStatus() {
  let envContent = '';
  
  if (fs.existsSync(envPath)) {
    envContent = fs.readFileSync(envPath, 'utf8');
  }
  
  const isEnabled = envContent.includes('MAINTENANCE_MODE=true');
  console.log(`🔧 Maintenance mode is currently ${isEnabled ? 'ENABLED' : 'DISABLED'}`);
}

// Parse command line arguments
const command = process.argv[2];

switch (command) {
  case 'toggle':
    toggleMaintenanceMode();
    break;
  case 'status':
    showStatus();
    break;
  case 'enable':
    // Force enable
    let envContent = '';
    if (fs.existsSync(envPath)) {
      envContent = fs.readFileSync(envPath, 'utf8');
    }
    if (envContent.includes('MAINTENANCE_MODE=')) {
      envContent = envContent.replace(
        /MAINTENANCE_MODE=(true|false)/,
        'MAINTENANCE_MODE=true'
      );
    } else {
      envContent += '\nMAINTENANCE_MODE=true';
    }
    fs.writeFileSync(envPath, envContent.trim() + '\n');
    console.log('✅ Maintenance mode ENABLED');
    break;
  case 'disable':
    // Force disable
    let envContent2 = '';
    if (fs.existsSync(envPath)) {
      envContent2 = fs.readFileSync(envPath, 'utf8');
    }
    if (envContent2.includes('MAINTENANCE_MODE=')) {
      envContent2 = envContent2.replace(
        /MAINTENANCE_MODE=(true|false)/,
        'MAINTENANCE_MODE=false'
      );
    } else {
      envContent2 += '\nMAINTENANCE_MODE=false';
    }
    fs.writeFileSync(envPath, envContent2.trim() + '\n');
    console.log('✅ Maintenance mode DISABLED');
    break;
  default:
    console.log('🔧 Maintenance Mode Control Script');
    console.log('');
    console.log('Usage:');
    console.log('  node scripts/toggle-maintenance.js toggle    - Toggle maintenance mode');
    console.log('  node scripts/toggle-maintenance.js enable    - Enable maintenance mode');
    console.log('  node scripts/toggle-maintenance.js disable   - Disable maintenance mode');
    console.log('  node scripts/toggle-maintenance.js status    - Show current status');
    console.log('');
    console.log('Note: After changing maintenance mode, restart your Next.js server.');
}
