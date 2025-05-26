import { Request, Response } from 'express';
import { z } from 'zod';
import * as admin from 'firebase-admin';

if (!admin.apps.length) {
  admin.initializeApp();
}

const uplinkSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email address'),
    subject: z.string().min(1, 'Subject is required'),
    message: z.string().min(5, 'Message must be at least 5 characters'),
  });

  export async function uplinkHandler(req: Request, res: Response): Promise<Response> {
    if (req.method !== 'POST') {
      return res.status(405).send('Method Not Allowed');
    }
  
    const parsed = uplinkSchema.safeParse(req.body);
  
    if (!parsed.success) {
      return res.status(400).json({
        error: 'Validation failed',
        issues: parsed.error.format(),
      });
    }
  
    const { name, email, subject, message } = parsed.data;
  
    try {
      await admin.firestore().collection('messages').add({
        name,
        email,
        subject,
        message,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });
  
      return res.status(200).json({ status: 'received' });
    } catch (error) {
      console.error('Firestore error:', error);
      return res.status(500).json({ error: 'Failed to store message' });
    }
  }
  
