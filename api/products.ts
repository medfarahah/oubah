// GET /api/products - Get all products
// POST /api/products - Create a new product
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { prisma } from '../lib/prisma';

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
      // GET /api/products
      const products = await prisma.product.findMany({
        orderBy: {
          createdAt: 'desc',
        },
      });

      return response.status(200).json({
        success: true,
        data: products,
        count: products.length,
      });
    }

    if (request.method === 'POST') {
      // POST /api/products
      const { name, price, imageUrl } = request.body;

      // Validation
      if (!name || typeof name !== 'string') {
        return response.status(400).json({
          success: false,
          error: 'Product name is required',
        });
      }

      if (!price || typeof price !== 'number' || price <= 0) {
        return response.status(400).json({
          success: false,
          error: 'Valid price is required',
        });
      }

      if (!imageUrl || typeof imageUrl !== 'string') {
        return response.status(400).json({
          success: false,
          error: 'Image URL is required',
        });
      }

      const product = await prisma.product.create({
        data: {
          name,
          price,
          imageUrl,
        },
      });

      return response.status(201).json({
        success: true,
        data: product,
      });
    }

    return response.status(405).json({
      success: false,
      error: 'Method not allowed',
    });
  } catch (error) {
    console.error('Products API error:', error);
    return response.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
