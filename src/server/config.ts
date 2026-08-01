import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

// Load .env and .env.local if present
const rootDir = process.cwd();
if (fs.existsSync(path.join(rootDir, '.env.local'))) {
  dotenv.config({ path: path.join(rootDir, '.env.local') });
}
dotenv.config();

export interface ServerEnvConfig {
  telegramBotToken: string;
  telegramBotUsername: string;
  telegramRequiredGroup: string;
  telegramGroupLink: string;
  mongoDbUri: string;
  mongoDbUsername?: string;
  mongoDbPassword?: string;
  jwtSecret: string;
  appUrl: string;
  port: number;
}

/**
 * Validates required environment variables.
 * Throws a clear, human-readable terminal error message if any variable is missing.
 */
export function validateAndGetEnvConfig(): ServerEnvConfig {
  const missingVars: string[] = [];

  const telegramBotToken = process.env.TELEGRAM_BOT_TOKEN;
  const telegramBotUsername = process.env.TELEGRAM_BOT_USERNAME;
  const telegramRequiredGroup = process.env.TELEGRAM_REQUIRED_GROUP || '@ProfileNexus_Updates';
  const telegramGroupLink = process.env.TELEGRAM_GROUP_LINK || 'https://t.me/+k6ofO5RQueo3ZjZl';
  const mongoDbUri = process.env.MONGODB_URI;
  const jwtSecret = process.env.JWT_SECRET;
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.APP_URL || 'http://localhost:3000';
  const port = parseInt(process.env.PORT || '5000', 10);

  if (!telegramBotToken || telegramBotToken.includes('your_telegram_bot_token_here')) {
    missingVars.push('TELEGRAM_BOT_TOKEN');
  }

  if (!telegramBotUsername || telegramBotUsername.includes('your_bot_username_here')) {
    missingVars.push('TELEGRAM_BOT_USERNAME');
  }

  if (!mongoDbUri || mongoDbUri.includes('your_mongodb_connection_string_here')) {
    missingVars.push('MONGODB_URI');
  }

  if (!jwtSecret || jwtSecret.includes('your_jwt_secret_key_here')) {
    missingVars.push('JWT_SECRET');
  }

  if (missingVars.length > 0) {
    const errorBanner = `
================================================================================
🚨 FATAL ERROR: MISSING ENVIRONMENT VARIABLES IN BACKEND CONFIGURATION
================================================================================
The backend failed to start because the following required environment variable(s) 
are missing or set to placeholder values in your .env / .env.local file:

${missingVars.map((v) => `  ❌ ${v}`).join('\n')}

💡 HOW TO FIX:
1. Open your .env or .env.local file.
2. Ensure all required keys are defined with valid values:
   - TELEGRAM_BOT_TOKEN (Bot token from @BotFather)
   - TELEGRAM_BOT_USERNAME (Telegram bot handle without @)
   - MONGODB_URI (MongoDB Atlas or local connection string)
   - JWT_SECRET (Secure secret string for signing auth tokens)
3. Restart the server.
================================================================================
`;
    console.error(errorBanner);
    throw new Error(`Missing environment variables: ${missingVars.join(', ')}`);
  }

  return {
    telegramBotToken: telegramBotToken!,
    telegramBotUsername: telegramBotUsername!,
    telegramRequiredGroup,
    telegramGroupLink,
    mongoDbUri: mongoDbUri!,
    mongoDbUsername: process.env.MONGODB_USERNAME,
    mongoDbPassword: process.env.MONGODB_PASSWORD,
    jwtSecret: jwtSecret!,
    appUrl,
    port,
  };
}
