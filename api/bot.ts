import type { Request, Response } from 'express';
import { validateAndGetEnvConfig } from '../src/server/config.js';
import { connectToDatabase } from '../src/server/db.js';
import { handleTelegramWebhookUpdate } from '../src/server/bot.js';

export default async function handler(req: Request, res: Response) {
  if (req.method === 'POST') {
    try {
      console.log('Telegram update received:', req.body);
      let config;
      try {
        config = validateAndGetEnvConfig();
      } catch (err) {
        config = {
          telegramBotToken: process.env.TELEGRAM_BOT_TOKEN || '',
          telegramBotUsername: process.env.TELEGRAM_BOT_USERNAME || 'ProfileNexus_bot',
          telegramRequiredGroup: process.env.TELEGRAM_REQUIRED_GROUP || '@ProfileNexus_Updates',
          telegramGroupLink: process.env.TELEGRAM_GROUP_LINK || 'https://t.me/+k6ofO5RQueo3ZjZl',
          mongoDbUri: process.env.MONGODB_URI || '',
          mongoDbUsername: process.env.MONGODB_USERNAME,
          mongoDbPassword: process.env.MONGODB_PASSWORD,
          jwtSecret: process.env.JWT_SECRET || 'secret',
          appUrl: process.env.NEXT_PUBLIC_APP_URL || process.env.APP_URL || 'https://profilenexus.vercel.app',
          port: parseInt(process.env.PORT || '5000', 10),
        };
      }

      if (config.mongoDbUri) {
        await connectToDatabase(config.mongoDbUri);
      }

      const update = req.body;
      const result = await handleTelegramWebhookUpdate(update, config);
      return res.status(200).json({ status: 'ok', result });
    } catch (e: any) {
      console.error('Telegram bot webhook error:', e);
      return res.status(200).json({ status: 'ok', error: e?.message });
    }
  }

  return res.status(200).send('Bot backend is running!');
}
