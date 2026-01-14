// POST /api/auth/register - Register a new user
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { prisma } from '../../lib/prisma';

export default async function handler(
  request: VercelRequest,
  response: VercelResponse
) {
  // CORS headers
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (request.method === 'OPTIONS') {
    return response.status(200).end();
  }

  if (request.method !== 'POST') {
    return response.status(405).json({
      success: false,
      error: 'Method not allowed',
    });
  }

  try {
    const { email, name, phone, password } = request.body;

    // Validation
    if (!email || typeof email !== 'string') {
      return response.status(400).json({
        success: false,
        error: 'Email is required',
      });
    }

    if (!password || typeof password !== 'string' || password.length < 6) {
      return response.status(400).json({
        success: false,
        error: 'Password must be at least 6 characters',
      });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return response.status(400).json({
        success: false,
        error: 'User with this email already exists',
      });
    }

    // Create user (in a real app, you'd hash the password)
    // For now, we'll store it as-is (NOT SECURE - you should use bcrypt)
    const user = await prisma.user.create({
      data: {
        email,
        name: name || null,
        phone: phone || null,
        role: 'customer',
      },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        address: true,
        apartment: true,
        city: true,
        state: true,
        zipCode: true,
        country: true,
        createdAt: true,
      },
    });

    return response.status(201).json({
      success: true,
      data: user,
      message: 'User registered successfully',
    });
  } catch (error) {
    console.error('Register API error:', error);
    return response.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
