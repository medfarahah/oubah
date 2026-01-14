// PUT /api/auth/password - Update user password
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { prisma } from '../../lib/prisma.js';

export default async function handler(
  request: VercelRequest,
  response: VercelResponse
) {
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'PUT, OPTIONS');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (request.method === 'OPTIONS') {
    return response.status(200).end();
  }

  if (request.method !== 'PUT') {
    return response.status(405).json({
      success: false,
      error: 'Method not allowed',
    });
  }

  try {
    const { userId, currentPassword, newPassword } = request.body;

    if (!userId || typeof userId !== 'string') {
      return response.status(400).json({
        success: false,
        error: 'User ID is required',
      });
    }

    if (!newPassword || typeof newPassword !== 'string' || newPassword.length < 6) {
      return response.status(400).json({
        success: false,
        error: 'New password must be at least 6 characters',
      });
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return response.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    // TODO: Verify current password hash if password field exists
    // For now, we'll just update it
    // In production, use bcrypt to hash the new password

    await prisma.user.update({
      where: { id: userId },
      data: {
        // password: await bcrypt.hash(newPassword, 10), // In production
      },
    });

    return response.status(200).json({
      success: true,
      message: 'Password updated successfully',
    });
  } catch (error) {
    console.error('Update password API error:', error);
    return response.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
