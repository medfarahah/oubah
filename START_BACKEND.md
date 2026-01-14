# Quick Start Guide - Backend Server

## ⚠️ Error: "Cannot connect to server"

This error means the backend server is not running. Follow these steps:

## Solution: Start the Backend Server

### Option 1: Run Both Frontend + Backend (Recommended)
Open your terminal in the project folder and run:
```bash
npm run dev
```
This starts both the frontend (Vite) and backend (Express) servers.

### Option 2: Run Backend Only
If you only want to start the backend server:
```bash
npm run dev:server
```

You should see:
```
Server running on http://localhost:3000
```

## Verify Backend is Running

1. Open your browser
2. Visit: `http://localhost:3000/api/health`
3. You should see: `{"success":true,"status":"ok","message":"Backend is running",...}`

## Environment Setup

Make sure your `.env` file exists in the project root with:
```env
DATABASE_URL="your-neon-database-url"
VITE_API_URL="http://localhost:3000"
```

## Common Issues

### Port 3000 Already in Use
If you see "Port 3000 is already in use":
- Stop any other process using port 3000
- Or change the port in `server/index.ts` (line 14): `const PORT = process.env.PORT || 3001;`
- Update `.env`: `VITE_API_URL="http://localhost:3001"`

### Missing Dependencies
If you get module errors, install dependencies:
```bash
npm install
```

### Database Connection Issues
Make sure your `DATABASE_URL` in `.env` is correct and the database is accessible.
