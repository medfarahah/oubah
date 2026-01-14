// GET /api/orders - Get all orders (with optional filters)
// POST /api/orders - Create a new order
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { prisma } from '../lib/prisma.js';

export default async function handler(
  request: VercelRequest,
  response: VercelResponse
) {
  // CORS headers for frontend
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (request.method === 'OPTIONS') {
    return response.status(200).end();
  }

  try {
    if (request.method === 'GET') {
      // GET /api/orders - Get all orders with optional filters
      const { userId, email, status } = request.query;

      const where: any = {};
      if (email) where.email = email as string;
      if (status) where.status = status as string;

      const orders = await prisma.order.findMany({
        where,
        orderBy: {
          createdAt: 'desc',
        },
      });

      return response.status(200).json({
        success: true,
        data: orders,
        count: orders.length,
      });
    }

    if (request.method === 'POST') {
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
          ...(request.body.email && { email: request.body.email }),
          ...(request.body.firstName && { firstName: request.body.firstName }),
          ...(request.body.lastName && { lastName: request.body.lastName }),
          ...(request.body.address && { address: request.body.address }),
          ...(request.body.apartment && { apartment: request.body.apartment }),
          ...(request.body.city && { city: request.body.city }),
          ...(request.body.state && { state: request.body.state }),
          ...(request.body.zipCode && { zipCode: request.body.zipCode }),
          ...(request.body.country && { country: request.body.country }),
          ...(request.body.deliveryNotes && { deliveryNotes: request.body.deliveryNotes }),
          ...(request.body.paymentMethod && { paymentMethod: request.body.paymentMethod }),
          ...(request.body.subtotal && { subtotal: request.body.subtotal }),
          ...(request.body.shipping && { shipping: request.body.shipping }),
          ...(request.body.items && { items: request.body.items }),
          ...(request.body.status && { status: request.body.status }),
        },
      });

      return response.status(201).json({
        success: true,
        data: order,
      });
    }

    return response.status(405).json({
      success: false,
      error: 'Method not allowed',
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
