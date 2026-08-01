import type { Request, Response } from 'express';
import { validateAndGetEnvConfig } from '../src/server/config';
import { connectToDatabase } from '../src/server/db';
import { handleTelegramWebhookUpdate } from '../src/server/bot';

export default async function handler(req: Request, res: Response) {
  if (req.method === 'POST') {
    try {
      console.log('Telegram update received:', req.body);
      const config = validateAndGetEnvConfig();
      await connectToDatabase(config.mongoDbUri);
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
