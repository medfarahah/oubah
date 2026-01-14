import type { VercelRequest, VercelResponse } from '@vercel/node';
import { prisma } from '../server/lib/prisma.js';

export default async function handler(
  request: VercelRequest,
  response: VercelResponse
) {
  // CORS headers
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (request.method === 'OPTIONS') {
    return response.status(200).end();
  }

  try {
    if (request.method === 'GET') {
      // GET /api/addresses?userId=xxx
      const userId = request.query.userId as string;
      if (!userId) {
        return response.status(400).json({
          success: false,
          error: 'User ID is required',
        });
      }

      const addresses = await prisma.address.findMany({
        where: { userId },
        orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
      });

      return response.status(200).json({
        success: true,
        data: addresses,
        count: addresses.length,
      });
    }

    if (request.method === 'POST') {
      // POST /api/addresses
      const {
        userId,
        type,
        firstName,
        lastName,
        address,
        apartment,
        city,
        state,
        zipCode,
        country,
        phone,
        isDefault,
      } = request.body;

      if (!userId) {
        return response.status(400).json({
          success: false,
          error: 'User ID is required',
        });
      }
      if (!address || !city || !country) {
        return response.status(400).json({
          success: false,
          error: 'Address, city, and country are required',
        });
      }

      // If setting as default, unset other defaults
      if (isDefault) {
        await prisma.address.updateMany({
          where: { userId },
          data: { isDefault: false },
        });
      }

      const newAddress = await prisma.address.create({
        data: {
          userId,
          type: type || 'shipping',
          firstName,
          lastName,
          address,
          apartment,
          city,
          state,
          zipCode,
          country,
          phone,
          isDefault: isDefault || false,
        },
      });

      return response.status(201).json({
        success: true,
        data: newAddress,
      });
    }

    return response.status(405).json({
      success: false,
      error: 'Method not allowed',
    });
  } catch (error) {
    console.error('Addresses API error:', error);
    return response.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
