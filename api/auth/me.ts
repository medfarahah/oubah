// GET /api/auth/me - Get current user by ID
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { prisma } from '../../lib/prisma';

export default async function handler(
  request: VercelRequest,
  response: VercelResponse
) {
  // CORS headers
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (request.method === 'OPTIONS') {
    return response.status(200).end();
  }

  if (request.method !== 'GET') {
    return response.status(405).json({
      success: false,
      error: 'Method not allowed',
    });
  }

  try {
    const userId = request.query.userId as string;

    if (!userId) {
      return response.status(400).json({
        success: false,
        error: 'User ID is required',
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        address: true,
        apartment: true,
        city: true,
        state: true,
        zipCode: true,
        country: true,
        createdAt: true,
      },
    });

    if (!user) {
      return response.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    return response.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error('Get user API error:', error);
    return response.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
