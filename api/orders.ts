// GET /api/orders - Get all orders
// POST /api/orders - Create order
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { prisma } from '../server/lib/prisma.js';

export default async function handler(
  request: VercelRequest,
  response: VercelResponse
) {
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (request.method === 'OPTIONS') {
    return response.status(200).end();
  }

  try {
    if (request.method === 'GET') {
      const { email, status, userId } = request.query;
      
      const where: any = {};
      if (email) where.email = email as string;
      if (status) where.status = status as string;
      if (userId) where.userId = userId as string;

      const orders = await prisma.order.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        include: { 
          items: {
            include: {
              product: true,
            }
          }, 
          customer: true,
          user: {
            select: {
              id: true,
              email: true,
              name: true,
            }
          }
        }
      });
      return response.json({ success: true, data: orders, count: orders.length });
    }

    if (request.method === 'POST') {
      const {
        customerName, customer, phone, email,
        items,
        total, subtotal, shipping,
        address, apartment, city, state, zipCode, country,
        userId, paymentMethod, deliveryNotes
      } = request.body;

      // Validation
      if (!customerName && !customer) {
        return response.status(400).json({
          success: false,
          error: 'Customer name is required',
        });
      }
      if (!phone) {
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
      if (!items || !Array.isArray(items) || items.length === 0) {
        return response.status(400).json({
          success: false,
          error: 'Order must contain items',
        });
      }

      let customerId = null;
      if (email) {
        let existingCust = await prisma.customer.findUnique({ where: { email } });
        if (!existingCust) {
          existingCust = await prisma.customer.create({
            data: {
              email,
              firstName: (customerName || customer)?.split(' ')[0] || '',
              lastName: (customerName || customer)?.split(' ').slice(1).join(' ') || '',
              phone
            }
          });
        }
        customerId = existingCust.id;
      }

      const order = await prisma.order.create({
        data: {
          customerName: customerName || customer,
          phone,
          email,
          total,
          subtotal: subtotal || total,
          shipping: shipping || 0,
          address,
          apartment,
          city,
          state,
          zipCode,
          country,
          userId,
          customerId,
          paymentMethod,
          deliveryNotes,
          items: {
            create: items?.map((item: any) => ({
              productId: item.productId || item.id,
              quantity: item.quantity,
              price: item.price,
              size: item.size || null,
            })) || []
          }
        },
        include: { 
          items: {
            include: {
              product: true,
            }
          }
        }
      });

      if (items && Array.isArray(items)) {
        for (const item of items) {
          const pid = item.productId || item.id;
          if (pid) {
            try {
              await prisma.inventory.update({
                where: { productId: pid },
                data: { quantity: { decrement: item.quantity } }
              });
            } catch (e) {
              console.log(`Failed to update inventory for product ${pid}`);
            }
          }
        }
      }

      return response.status(201).json({ success: true, data: order });
    }

    return response.status(405).json({ success: false, error: 'Method not allowed' });
  } catch (error) {
    console.error('Orders API error:', error);
    return response.status(500).json({ success: false, error: 'Internal server error' });
  }
}
