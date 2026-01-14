// POST /api/auth/register - Register new user
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { prisma } from '../../server/lib/prisma.js';
// @ts-ignore - bcryptjs types may not be available
import bcrypt from 'bcryptjs';

export default async function handler(
  request: VercelRequest,
  response: VercelResponse
) {
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (request.method === 'OPTIONS') {
    return response.status(200).end();
  }

  if (request.method !== 'POST') {
    return response.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const { name, email, password, phone } = request.body;

    if (!email || !password) {
      return response.status(400).json({ success: false, error: 'Email and password are required' });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return response.status(400).json({ success: false, error: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        phone,
      },
      include: { addresses: true }
    });

    const { password: _, ...userWithoutPassword } = user;

    return response.status(201).json({ success: true, data: userWithoutPassword });
  } catch (error) {
    console.error('Register error:', error);
    return response.status(500).json({ success: false, error: 'Internal server error' });
  }
}
