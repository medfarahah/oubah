// GET /api/products - Get all products
// POST /api/products - Create product
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
      const products = await prisma.product.findMany({
        orderBy: { createdAt: 'desc' },
        include: { inventory: true }
      });
      return response.json({ success: true, data: products, count: products.length });
    }

    if (request.method === 'POST') {
      const { 
        name, price, imageUrl, categories, 
        description, material, colors, sizes, 
        isNew, sale, originalPrice, stock 
      } = request.body;

      if (!name || !price || !imageUrl) {
        return response.status(400).json({
          success: false,
          error: 'Name, price, and imageUrl are required',
        });
      }

      const product = await prisma.product.create({
        data: {
          name,
          price,
          imageUrl,
          categories: categories || [],
          description: description || null,
          material: material || null,
          colors: colors || [],
          sizes: sizes || ['One Size'],
          isNew: isNew || false,
          sale: sale || false,
          originalPrice: originalPrice || null,
          inventory: {
            create: {
              quantity: stock || 0,
              lowStock: 5,
            }
          }
        },
        include: { inventory: true }
      });

      return response.status(201).json({ success: true, data: product });
    }

    return response.status(405).json({ success: false, error: 'Method not allowed' });
  } catch (error) {
    console.error('Products API error:', error);
    return response.status(500).json({ success: false, error: 'Internal server error' });
  }
}
