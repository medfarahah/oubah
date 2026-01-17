// GET /api/products/[id] - Get single product
// PUT /api/products/[id] - Update product
// DELETE /api/products/[id] - Delete product
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { prisma } from '../../server/lib/prisma.js';

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

  // Handle dynamic route parameter - can be string or array
  const id = Array.isArray(request.query.id) 
    ? request.query.id[0] 
    : request.query.id;

  if (!id || typeof id !== 'string') {
    return response.status(400).json({ success: false, error: 'Product ID is required' });
  }

  try {
    if (request.method === 'GET') {
      const product = await prisma.product.findUnique({
        where: { id },
        include: { inventory: true }
      });
      if (!product) {
        return response.status(404).json({ success: false, error: 'Product not found' });
      }
      return response.json({ success: true, data: product });
    }

    if (request.method === 'PUT') {
      const { 
        stock, name, price, imageUrl, categories,
        description, material, colors, sizes, isNew, sale, originalPrice
      } = request.body;

      // Build update data object
      const updateData: any = {};
      if (name !== undefined) updateData.name = name;
      if (price !== undefined) updateData.price = price;
      if (imageUrl !== undefined) updateData.imageUrl = imageUrl;
      if (categories !== undefined) updateData.categories = categories;
      if (description !== undefined) updateData.description = description;
      if (material !== undefined) updateData.material = material;
      if (colors !== undefined) updateData.colors = colors;
      if (sizes !== undefined) updateData.sizes = sizes;
      if (isNew !== undefined) updateData.isNew = isNew;
      if (sale !== undefined) updateData.sale = sale;
      if (originalPrice !== undefined) updateData.originalPrice = originalPrice;

      const product = await prisma.product.update({
        where: { id },
        data: updateData,
      });

      // Update inventory if stock provided
      if (stock !== undefined) {
        await prisma.inventory.upsert({
          where: { productId: product.id },
          create: { productId: product.id, quantity: stock, lowStock: 5 },
          update: { quantity: stock }
        });
      }

      const updatedProduct = await prisma.product.findUnique({
        where: { id },
        include: { inventory: true }
      });

      return response.json({ success: true, data: updatedProduct });
    }

    if (request.method === 'DELETE') {
      await prisma.product.delete({ where: { id } });
      return response.json({ success: true, message: 'Product deleted' });
    }

    return response.status(405).json({ success: false, error: 'Method not allowed' });
  } catch (error) {
    console.error('Product API error:', error);
    return response.status(500).json({ success: false, error: 'Internal server error' });
  }
}
