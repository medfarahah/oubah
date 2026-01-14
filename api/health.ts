// GET /api/health - Health check
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(
  request: VercelRequest,
  response: VercelResponse
) {
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (request.method === 'OPTIONS') {
    return response.status(200).end();
  }

  if (request.method === 'GET') {
    return response.json({
      success: true,
      status: 'ok',
      message: 'Backend is running',
      timestamp: new Date().toISOString()
    });
  }

  return response.status(405).json({ success: false, error: 'Method not allowed' });
}
