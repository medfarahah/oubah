import type { VercelRequest, VercelResponse } from '@vercel/node';
import { prisma } from '../../server/lib/prisma.js';

export default async function handler(
  request: VercelRequest,
  response: VercelResponse
) {
  // CORS headers
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
    return response.status(400).json({
      success: false,
      error: 'Address ID is required',
    });
  }

  try {
    if (request.method === 'GET') {
      // GET /api/addresses/[id]
      const address = await prisma.address.findUnique({
        where: { id },
      });

      if (!address) {
        return response.status(404).json({
          success: false,
          error: 'Address not found',
        });
      }

      return response.status(200).json({
        success: true,
        data: address,
      });
    }

    if (request.method === 'PUT') {
      // PUT /api/addresses/[id]
      const existingAddress = await prisma.address.findUnique({
        where: { id },
      });

      if (!existingAddress) {
        return response.status(404).json({
          success: false,
          error: 'Address not found',
        });
      }

      const {
        type,
        firstName,
        lastName,
        address: addressLine,
        apartment,
        city,
        state,
        zipCode,
        country,
        phone,
        isDefault,
      } = request.body;

      // If setting as default, unset other defaults for the same user
      if (isDefault && existingAddress.userId) {
        await prisma.address.updateMany({
          where: {
            userId: existingAddress.userId,
            id: { not: id },
          },
          data: { isDefault: false },
        });
      }

      // Build update data object with only provided fields
      const updateData: any = {};
      if (type !== undefined) updateData.type = type;
      if (firstName !== undefined) updateData.firstName = firstName;
      if (lastName !== undefined) updateData.lastName = lastName;
      if (addressLine !== undefined) updateData.address = addressLine;
      if (apartment !== undefined) updateData.apartment = apartment;
      if (city !== undefined) updateData.city = city;
      if (state !== undefined) updateData.state = state;
      if (zipCode !== undefined) updateData.zipCode = zipCode;
      if (country !== undefined) updateData.country = country;
      if (phone !== undefined) updateData.phone = phone;
      if (isDefault !== undefined) updateData.isDefault = isDefault;

      const updatedAddress = await prisma.address.update({
        where: { id },
        data: updateData,
      });

      return response.status(200).json({
        success: true,
        data: updatedAddress,
      });
    }

    if (request.method === 'DELETE') {
      // DELETE /api/addresses/[id]
      await prisma.address.delete({
        where: { id },
      });

      return response.status(200).json({
        success: true,
        message: 'Address deleted successfully',
      });
    }

    return response.status(405).json({
      success: false,
      error: 'Method not allowed',
    });
  } catch (error) {
    console.error(`Address API error for ID ${id}:`, error);
    return response.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
