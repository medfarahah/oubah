import type { VercelRequest, VercelResponse } from '@vercel/node';
import { prisma } from '../../server/lib/prisma.js';

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

  // Handle dynamic route parameter - can be string or array
  const id = Array.isArray(request.query.id) 
    ? request.query.id[0] 
    : request.query.id;

  if (!id || typeof id !== 'string') {
    return response.status(400).json({
      success: false,
      error: 'Customer ID is required',
    });
  }

  try {
    if (request.method === 'GET') {
      // GET /api/customers/[id]
      const customer = await prisma.customer.findUnique({
        where: { id },
        include: {
          orders: {
            include: {
              items: {
                include: {
                  product: true,
                },
              },
            },
            orderBy: { createdAt: 'desc' },
          },
          addresses: true,
        },
      });

      if (!customer) {
        return response.status(404).json({
          success: false,
          error: 'Customer not found',
        });
      }

      return response.status(200).json({
        success: true,
        data: customer,
      });
    }

    return response.status(405).json({
      success: false,
      error: 'Method not allowed',
    });
  } catch (error) {
    console.error(`Customer API error for ID ${id}:`, error);
    return response.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
