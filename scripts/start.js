const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

/**
 * Professional CLI Wrapper & Session Manager for WA Sticker Bot
 */

const AUTH_PATH = path.join(__dirname, '..', 'auth_info_baileys');
const CREDS_PATH = path.join(AUTH_PATH, 'creds.json');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function ask(question) {
  return new Promise((resolve) => rl.question(question, resolve));
}

async function main() {
  console.log('📸 WhatsApp Sticker Bot — CLI Hub');
  
  // 1. Check for existing session
  const sessionExists = fs.existsSync(CREDS_PATH);

  if (sessionExists) {
    console.log('\n🔍 Found an existing WhatsApp session.');
    console.log('1. Connect with existing number');
    console.log('2. Connect with new number');
    
    const choice = await ask('\nChoose an option (1-2): ');

    if (choice === '2') {
      const confirm = await ask('⚠️ This will log out the current number. Continue? (y/n): ');
      if (confirm.toLowerCase() === 'y') {
        console.log('🧹 Clearing old session data...');
        fs.rmSync(AUTH_PATH, { recursive: true, force: true });
      } else {
        console.log('✅ Keeping existing session.');
      }
    }
  }

  rl.close();
  startDocker();
}

function startDocker() {
  console.log('\n🚀 Starting WhatsApp Sticker Bot in Docker...');

  // Run docker-compose up -d
  const up = spawn('docker', ['compose', 'up', '-d', '--build']);

  up.stdout.on('data', (data) => console.log(data.toString().trim()));
  up.stderr.on('data', (data) => console.error(data.toString().trim()));

  up.on('close', (code) => {
    if (code !== 0) {
      console.error('❌ Failed to start Docker containers.');
      process.exit(1);
    }

    console.log('📦 Containers are up. Fetching your status...');
    tailLogs();
  });
}

function tailLogs() {
  const logs = spawn('docker', ['compose', 'logs', '-f', 'bot']);

  logs.stdout.on('data', (data) => {
    const output = data.toString();
    process.stdout.write(output);

    if (output.includes('SUCCESS!') || output.includes('WhatsApp Bot is online')) {
      console.log('\n✅ Bot is ready and running in background!');
      console.log('💡 You can exit these logs now (Ctrl+C).');
      setTimeout(() => {
        logs.kill();
        process.exit(0);
      }, 2000);
    }
  });

  logs.stderr.on('data', (data) => {
    process.stderr.write(data.toString());
  });
}

main();
