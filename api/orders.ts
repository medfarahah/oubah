// POST /api/orders - Create a new order
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { prisma } from '../lib/prisma';

export default async function handler(
  request: VercelRequest,
  response: VercelResponse
) {
  // CORS headers for frontend
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
    const { customer, phone, total } = request.body;

    // Validation
    if (!customer || typeof customer !== 'string') {
      return response.status(400).json({
        success: false,
        error: 'Customer name is required',
      });
    }

    if (!phone || typeof phone !== 'string') {
      return response.status(400).json({
        success: false,
        error: 'Phone number is required',
      });
    }

    if (!total || typeof total !== 'number' || total <= 0) {
      return response.status(400).json({
        success: false,
        error: 'Valid total amount is required',
      });
    }

    const order = await prisma.order.create({
      data: {
        customer,
        phone,
        total,
      },
    });

    return response.status(201).json({
      success: true,
      data: order,
    });
  } catch (error) {
    console.error('Orders API error:', error);
    return response.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
