// POST /api/auth/login - Login user
import type { VercelRequest, VercelResponse } from '@vercel/node';
import bcrypt from 'bcryptjs';
import { prisma } from '../../lib/prisma.js';

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
    const { email, password } = request.body;

    // Validation
    if (!email || typeof email !== 'string') {
      return response.status(400).json({
        success: false,
        error: 'Email is required',
      });
    }

    if (!password || typeof password !== 'string') {
      return response.status(400).json({
        success: false,
        error: 'Password is required',
      });
    }

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
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
        country: true,
        createdAt: true,
        password: true,
      },
    });

    if (!user) {
      return response.status(401).json({
        success: false,
        error: 'Invalid email or password',
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return response.status(401).json({
        success: false,
        error: 'Invalid email or password',
      });
    }

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    return response.status(200).json({
      success: true,
      data: userWithoutPassword,
      message: 'Login successful',
    });
  } catch (error) {
    console.error('Login API error:', error);
    return response.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
