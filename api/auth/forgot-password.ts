// POST /api/auth/forgot-password - Request a password reset (stub implementation)
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { prisma } from '../../lib/prisma.js';

export default async function handler(
  request: VercelRequest,
  response: VercelResponse
) {
  // CORS headers
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (request.method === 'OPTIONS') {
    return response.status(200).end();
  }

  if (request.method !== 'POST') {
    return response.status(405).json({
      success: false,
      error: 'Method not allowed',
    });
  }

  try {
    const { email } = request.body as { email?: string };

    if (!email || typeof email !== 'string') {
      return response.status(400).json({
        success: false,
        error: 'Email is required',
      });
    }

    // Try to find the user (do not reveal existence to client)
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, email: true },
    });

    if (user) {
      console.log('Password reset requested for:', email);
      // TODO: In production, generate a reset token, store it, and send an email.
    }

    return response.status(200).json({
      success: true,
      message: 'If an account exists, you will receive password reset instructions.',
    });
  } catch (error) {
    console.error('Forgot password API error:', error);
    return response.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}

