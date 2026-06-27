/**
 * GET /api/export/booking-code-pdf
 * Serves the ArtiZone booking & admin build guide PDF as a download.
 */
import type { Request, Response } from 'express';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

export default function handler(_req: Request, res: Response) {
  try {
    const filePath = join(process.cwd(), 'public', 'data', 'booking-admin-build-guidev2.pdf');
    const content  = readFileSync(filePath);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="booking-admin-build-guidev2.pdf"');
    res.setHeader('Content-Length', content.length);
    res.send(content);
  } catch (err) {
    res.status(500).json({ error: 'File not found', message: String(err) });
  }
}
