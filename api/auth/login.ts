// POST /api/auth/login - Login user
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
    const { email, password } = request.body;

    if (!email || !password) {
      return response.status(400).json({ success: false, error: 'Email and password are required' });
    }

    const user = await prisma.user.findUnique({
      where: { email },
      include: { addresses: true }
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return response.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    const { password: _, ...userWithoutPassword } = user;

    return response.json({ success: true, data: userWithoutPassword });
  } catch (error) {
    console.error('Login error:', error);
    return response.status(500).json({ success: false, error: 'Internal server error' });
  }
}
