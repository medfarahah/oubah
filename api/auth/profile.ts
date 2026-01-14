// PUT /api/auth/profile - Update user profile
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
    const { userId, name, phone, address, apartment, city, state, zipCode, country } = request.body;

    if (!userId || typeof userId !== 'string') {
      return response.status(400).json({
        success: false,
        error: 'User ID is required',
      });
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(name !== undefined && { name }),
        ...(phone !== undefined && { phone }),
        ...(address !== undefined && { address }),
        ...(apartment !== undefined && { apartment }),
        ...(city !== undefined && { city }),
        ...(state !== undefined && { state }),
        ...(zipCode !== undefined && { zipCode }),
        ...(country !== undefined && { country }),
      },
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

    return response.status(200).json({
      success: true,
      data: user,
      message: 'Profile updated successfully',
    });
  } catch (error) {
    console.error('Update profile API error:', error);
    return response.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
