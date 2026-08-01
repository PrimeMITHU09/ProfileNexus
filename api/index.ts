import type { Request, Response } from 'express';
import app from '../server';

export default async function handler(req: Request, res: Response) {
  return app(req, res);
}
