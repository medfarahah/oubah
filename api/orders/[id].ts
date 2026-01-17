import type { VercelRequest, VercelResponse } from '@vercel/node';
import { prisma } from '../../server/lib/prisma.js';

export default async function handler(
  request: VercelRequest,
  response: VercelResponse
) {
  // CORS headers
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'GET, PUT, OPTIONS');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (request.method === 'OPTIONS') {
    return response.status(200).end();
  }

  // Handle dynamic route parameter - can be string or array
  const id = Array.isArray(request.query.id) 
    ? request.query.id[0] 
    : request.query.id;

  if (!id || typeof id !== 'string') {
    return response.status(400).json({
      success: false,
      error: 'Order ID is required',
    });
  }

  try {
    if (request.method === 'GET') {
      // GET /api/orders/[id]
      const order = await prisma.order.findUnique({
        where: { id },
        include: {
          items: {
            include: {
              product: true,
            },
          },
          customer: true,
          user: {
            select: {
              id: true,
              email: true,
              name: true,
            },
          },
        },
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
      // PUT /api/orders/[id]
      const { status, shipping, deliveryNotes } = request.body;

      const updateData: any = {};
      if (status !== undefined) updateData.status = status;
      if (shipping !== undefined) updateData.shipping = shipping;
      if (deliveryNotes !== undefined) updateData.deliveryNotes = deliveryNotes;

      const updatedOrder = await prisma.order.update({
        where: { id },
        data: updateData,
        include: {
          items: {
            include: {
              product: true,
            },
          },
          customer: true,
        },
      });

      return response.status(200).json({
        success: true,
        data: updatedOrder,
      });
    }

    return response.status(405).json({
      success: false,
      error: 'Method not allowed',
    });
  } catch (error) {
    console.error(`Order API error for ID ${id}:`, error);
    return response.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
