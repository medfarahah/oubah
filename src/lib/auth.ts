import { createAuthClient } from '@neondatabase/neon-js/auth';

// Neon Auth client configured from Vite environment variable
// Make sure VITE_NEON_AUTH_URL is set in your .env and Vercel env
export const authClient = createAuthClient(
  import.meta.env.VITE_NEON_AUTH_URL as string,
);

