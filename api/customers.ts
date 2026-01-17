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
      // GET /api/customers
      const customers = await prisma.customer.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
          orders: {
            select: {
              id: true,
              total: true,
              createdAt: true,
            },
            orderBy: { createdAt: 'desc' },
          },
        },
      });

      // Transform to include order summary
      const customersWithSummary = customers.map((customer) => {
        const totalOrders = customer.orders.length;
        const lastOrder = customer.orders[0] || null;
        const totalSpent = customer.orders.reduce((sum, order) => sum + order.total, 0);

        return {
          id: customer.id,
          email: customer.email,
          firstName: customer.firstName || '',
          lastName: customer.lastName || '',
          phone: customer.phone || '',
          totalOrders,
          totalSpent,
          lastOrderDate: lastOrder?.createdAt || null,
          createdAt: customer.createdAt,
        };
      });

      return response.status(200).json({
        success: true,
        data: customersWithSummary,
        count: customersWithSummary.length,
      });
    }

    return response.status(405).json({
      success: false,
      error: 'Method not allowed',
    });
  } catch (error) {
    console.error('Customers API error:', error);
    return response.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
