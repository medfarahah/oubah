# Backend Setup Instructions

## Running the Backend Locally

### Option 1: Run Both Frontend and Backend Together
```bash
npm run dev
```
This runs both the Vite frontend and Express backend server concurrently.

### Option 2: Run Separately

**Terminal 1 - Frontend:**
```bash
npm run dev:client
```

**Terminal 2 - Backend:**
```bash
npm run dev:server
```

## Environment Variables

Make sure your `.env` file has:
```env
DATABASE_URL="your-neon-database-url"
VITE_API_URL="http://localhost:3000"
```

## For Production (Vercel)

When deploying to Vercel:
1. Set `VITE_API_URL` to empty string `""` in your `.env` file (or don't set it)
2. The frontend will use relative paths to call Vercel serverless functions
3. Make sure all API routes are in the `api/` folder

## Troubleshooting

### "Cannot connect to server" Error

**If running locally:**
- Make sure the backend server is running: `npm run dev:server`
- Check that the server is running on `http://localhost:3000`
- Verify your `.env` file has `VITE_API_URL="http://localhost:3000"`

**If on Vercel:**
- Set `VITE_API_URL=""` (empty string) in Vercel environment variables
- Or remove `VITE_API_URL` from environment variables
- The frontend will automatically use relative paths

### Check Backend Health

Visit `http://localhost:3000/api/health` in your browser to verify the backend is running.
