import type { Request, Response } from 'express';
import { createRequest, updateRequest } from '../../review-requests/store.js';
import { reviewRequestEmail } from '../../email/templates.js';
import { sendEmail } from '@/server/email';

export default async function handler(req: Request, res: Response) {
  // Protect with SEQUENCE_SECRET
  const secret = req.headers['x-admin-secret'] as string | undefined;
  if (process.env.SEQUENCE_SECRET && secret !== process.env.SEQUENCE_SECRET) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const { clientName, clientEmail, service, staffName, serviceDate } = req.body as {
      clientName?: string;
      clientEmail?: string;
      service?: string;
      staffName?: string;
      serviceDate?: string;
    };

    // Validation
    if (!clientName || typeof clientName !== 'string' || clientName.trim().length < 2) {
      return res.status(400).json({ error: 'Client name is required.' });
    }
    if (!clientEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clientEmail.trim())) {
      return res.status(400).json({ error: 'A valid client email is required.' });
    }
    if (!service || typeof service !== 'string' || service.trim().length < 2) {
      return res.status(400).json({ error: 'Service name is required.' });
    }

    const request = await createRequest({
      clientName: clientName.trim(),
      clientEmail: clientEmail.trim().toLowerCase(),
      service: service.trim(),
      staffName: staffName?.trim() || undefined,
      serviceDate: serviceDate || new Date().toISOString().split('T')[0],
    });

    // Send the review request email immediately
    const { subject, html, text } = reviewRequestEmail({
      name: request.clientName,
      service: request.service,
      requestId: request.id,
      staffName: request.staffName,
    });

    let emailError: string | undefined;
    try {
      await sendEmail({ to: request.clientEmail, subject, html, text });
      await updateRequest(request.id, {
        status: 'sent',
        sentAt: new Date().toISOString(),
      });
    } catch (err) {
      // Don't fail the whole request if email fails — record it as pending
      emailError = String(err);
      console.error('review-request.email.error', err);
    }

    return res.status(201).json({
      success: true,
      id: request.id,
      emailSent: !emailError,
      ...(emailError ? { emailError } : {}),
    });
  } catch (err) {
    console.error('review-request.create.error', err);
    return res.status(500).json({ error: 'Failed to create review request.' });
  }
}
