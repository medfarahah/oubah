// GET /api/orders/[id] - Get single order
// PUT /api/orders/[id] - Update order status
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { prisma } from '../../lib/prisma.js';

export default async function handler(
  request: VercelRequest,
  response: VercelResponse
) {
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'GET, PUT, OPTIONS');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (request.method === 'OPTIONS') {
    return response.status(200).end();
  }

  const { id } = request.query;

  if (!id || typeof id !== 'string') {
    return response.status(400).json({
      success: false,
      error: 'Order ID is required',
    });
  }

  try {
    if (request.method === 'GET') {
      const order = await prisma.order.findUnique({
        where: { id },
      });

      if (!order) {
        return response.status(404).json({
          success: false,
          error: 'Order not found',
        });
      }

      return response.status(200).json({
        success: true,
        data: order,
      });
    }

    if (request.method === 'PUT') {
      const { status, customer, phone, email, firstName, lastName, address, apartment, city, state, zipCode, country, deliveryNotes, paymentMethod, subtotal, shipping, total, items } = request.body;

      const order = await prisma.order.update({
        where: { id },
        data: {
          ...(status && { status }),
          ...(customer && { customer }),
          ...(phone && { phone }),
          ...(email !== undefined && { email }),
          ...(firstName !== undefined && { firstName }),
          ...(lastName !== undefined && { lastName }),
          ...(address !== undefined && { address }),
          ...(apartment !== undefined && { apartment }),
          ...(city !== undefined && { city }),
          ...(state !== undefined && { state }),
          ...(zipCode !== undefined && { zipCode }),
          ...(country !== undefined && { country }),
          ...(deliveryNotes !== undefined && { deliveryNotes }),
          ...(paymentMethod !== undefined && { paymentMethod }),
          ...(subtotal !== undefined && { subtotal }),
          ...(shipping !== undefined && { shipping }),
          ...(total !== undefined && { total }),
          ...(items !== undefined && { items }),
        },
      });

      return response.status(200).json({
        success: true,
        data: order,
        message: 'Order updated successfully',
      });
    }

    return response.status(405).json({
      success: false,
      error: 'Method not allowed',
    });
  } catch (error) {
    console.error('Order API error:', error);
    return response.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
