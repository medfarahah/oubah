// GET /api/health - Backend health check endpoint
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(
  request: VercelRequest,
  response: VercelResponse
) {
  if (request.method !== 'GET') {
    return response.status(405).json({ error: 'Method not allowed' });
  }

  try {
    return response.status(200).json({
      status: 'ok',
      message: 'Backend API is running',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return response.status(500).json({
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
