import type { VercelRequest, VercelResponse } from '@vercel/node';
import { prisma } from '../server/lib/prisma.js';

export default async function handler(
  request: VercelRequest,
  response: VercelResponse
) {
  // CORS headers
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (request.method === 'OPTIONS') {
    return response.status(200).end();
  }

  try {
    if (request.method === 'GET') {
      // GET /api/settings
      const settings = await prisma.setting.findMany();
      // Convert to key-value object for easier frontend consumption
      const settingsMap = settings.reduce((acc, curr) => {
        if (curr.type === 'json') {
          try {
            acc[curr.key] = JSON.parse(curr.value);
          } catch {
            acc[curr.key] = curr.value;
          }
        } else if (curr.type === 'number') {
          acc[curr.key] = parseFloat(curr.value);
        } else if (curr.type === 'boolean') {
          acc[curr.key] = curr.value === 'true';
        } else {
          acc[curr.key] = curr.value;
        }
        return acc;
      }, {} as Record<string, any>);

      return response.status(200).json({
        success: true,
        data: settingsMap,
      });
    }

    if (request.method === 'POST') {
      // POST /api/settings - Update or create a setting
      const { key, value, type, description } = request.body;

      if (!key || value === undefined) {
        return response.status(400).json({
          success: false,
          error: 'Key and value are required',
        });
      }

      const stringValue = typeof value === 'object' ? JSON.stringify(value) : String(value);
      const settingType = type || (typeof value === 'object' ? 'json' : typeof value === 'number' ? 'number' : typeof value === 'boolean' ? 'boolean' : 'string');

      const setting = await prisma.setting.upsert({
        where: { key },
        update: { value: stringValue, type: settingType, description },
        create: { key, value: stringValue, type: settingType, description },
      });

      return response.status(200).json({
        success: true,
        data: setting,
      });
    }

    return response.status(405).json({
      success: false,
      error: 'Method not allowed',
    });
  } catch (error) {
    console.error('Settings API error:', error);
    return response.status(500).json({
      success: false,
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
