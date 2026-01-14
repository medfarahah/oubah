// GET /api/products/[id] - Get single product
// PUT /api/products/[id] - Update product
// DELETE /api/products/[id] - Delete product
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { prisma } from '../../lib/prisma.js';

export default async function handler(
  request: VercelRequest,
  response: VercelResponse
) {
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'GET, PUT, DELETE, OPTIONS');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (request.method === 'OPTIONS') {
    return response.status(200).end();
  }

  const { id } = request.query;

  if (!id || typeof id !== 'string') {
    return response.status(400).json({
      success: false,
      error: 'Product ID is required',
    });
  }

  try {
    if (request.method === 'GET') {
      const product = await prisma.product.findUnique({
        where: { id },
      });

      if (!product) {
        return response.status(404).json({
          success: false,
          error: 'Product not found',
        });
      }

      return response.status(200).json({
        success: true,
        data: product,
      });
    }

    if (request.method === 'PUT') {
      const { name, price, imageUrl, category, originalPrice, description, material, colors, sizes, isNew, sale } = request.body;

      const product = await prisma.product.update({
        where: { id },
        data: {
          ...(name && { name }),
          ...(price !== undefined && { price }),
          ...(imageUrl && { imageUrl }),
          ...(category !== undefined && { category }),
          ...(originalPrice !== undefined && { originalPrice }),
          ...(description !== undefined && { description }),
          ...(material !== undefined && { material }),
          ...(colors && { colors }),
          ...(sizes && { sizes }),
          ...(isNew !== undefined && { isNew }),
          ...(sale !== undefined && { sale }),
        },
      });

      return response.status(200).json({
        success: true,
        data: product,
        message: 'Product updated successfully',
      });
    }

    if (request.method === 'DELETE') {
      await prisma.product.delete({
        where: { id },
      });

      return response.status(200).json({
        success: true,
        message: 'Product deleted successfully',
      });
    }

    return response.status(405).json({
      success: false,
      error: 'Method not allowed',
    });
  } catch (error) {
    console.error('Product API error:', error);
    return response.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
