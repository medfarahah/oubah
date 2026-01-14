# Backend API Setup Guide

This guide explains how to set up the backend API with Prisma and PostgreSQL on Vercel.

## 📁 New Files Added

```
├── api/
│   ├── health.ts          # GET /api/health
│   ├── products.ts        # GET/POST /api/products
│   └── orders.ts          # POST /api/orders
├── lib/
│   └── prisma.ts          # Prisma client singleton
├── prisma/
│   └── schema.prisma      # Database schema
└── src/lib/
    └── api.ts             # Frontend API client utility
```

## 🚀 Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

This will install:
- `@prisma/client` - Prisma ORM client
- `@vercel/node` - Vercel serverless function types
- `prisma` (dev) - Prisma CLI

### 2. Set Up PostgreSQL Database

Choose one of these options:

**Option A: Vercel Postgres (Recommended)**
1. Go to your Vercel project dashboard
2. Navigate to Storage → Create Database → Postgres
3. Copy the connection string

**Option B: External PostgreSQL (Supabase, Neon, etc.)**
1. Create a PostgreSQL database
2. Get your connection string (format: `postgresql://user:password@host:5432/database?schema=public`)

### 3. Configure Environment Variables

#### Local Development (.env file)

Create a `.env` file in the root directory:

```env
DATABASE_URL="postgresql://user:password@host:5432/database?schema=public"
VITE_API_URL="http://localhost:3000"
```

#### Vercel Production

1. Go to your Vercel project → Settings → Environment Variables
2. Add these variables:

```
DATABASE_URL = your_postgresql_connection_string
VITE_API_URL = https://nura-beta-three.vercel.app
```

**Important:** 
- `DATABASE_URL` is used by the backend (serverless functions)
- `VITE_API_URL` is used by the frontend (must start with `VITE_` for Vite)

### 4. Run Prisma Migrations

```bash
# Generate Prisma Client
npm run prisma:generate

# Create and run migrations
npm run prisma:migrate
```

This will:
- Create the database tables (`products` and `orders`)
- Generate the Prisma Client

### 5. Deploy to Vercel

```bash
# Push to your git repository
git add .
git commit -m "Add backend API with Prisma"
git push

# Vercel will automatically deploy
```

Or deploy manually:
```bash
vercel --prod
```

## 📡 API Endpoints

All endpoints are available at: `https://nura-beta-three.vercel.app/api/*`

### GET /api/health
Health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "message": "Backend API is running",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### GET /api/products
Get all products.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "clx...",
      "name": "Product Name",
      "price": 99.99,
      "imageUrl": "https://...",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "count": 1
}
```

### POST /api/products
Create a new product.

**Request Body:**
```json
{
  "name": "Product Name",
  "price": 99.99,
  "imageUrl": "https://example.com/image.jpg"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "clx...",
    "name": "Product Name",
    "price": 99.99,
    "imageUrl": "https://example.com/image.jpg",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### POST /api/orders
Create a new order.

**Request Body:**
```json
{
  "customer": "John Doe",
  "phone": "+1234567890",
  "total": 199.99
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "clx...",
    "customer": "John Doe",
    "phone": "+1234567890",
    "total": 199.99,
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

## 💻 Frontend Usage Example

### Using the API Client

```typescript
import { api } from './lib/api';

// Check backend health
const health = await api.checkHealth();
console.log(health.data); // { status: 'ok', message: '...', timestamp: '...' }

// Get all products
const productsResponse = await api.getProducts();
if (productsResponse.success) {
  console.log(productsResponse.data); // Array of products
}

// Create a product
const newProduct = await api.createProduct({
  name: 'New Product',
  price: 99.99,
  imageUrl: 'https://example.com/image.jpg',
});

// Create an order
const newOrder = await api.createOrder({
  customer: 'John Doe',
  phone: '+1234567890',
  total: 199.99,
});
```

### Direct Fetch Example

```typescript
const API_URL = import.meta.env.VITE_API_URL;

// Get products
const response = await fetch(`${API_URL}/api/products`);
const data = await response.json();
console.log(data);

// Create order
const orderResponse = await fetch(`${API_URL}/api/orders`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    customer: 'John Doe',
    phone: '+1234567890',
    total: 199.99,
  }),
});
const orderData = await orderResponse.json();
console.log(orderData);
```

## 🔧 Prisma Commands

```bash
# Generate Prisma Client (after schema changes)
npm run prisma:generate

# Create and apply migration
npm run prisma:migrate

# Open Prisma Studio (database GUI)
npm run prisma:studio
```

## ✅ Testing the API

### Test Health Endpoint

```bash
curl https://nura-beta-three.vercel.app/api/health
```

### Test Products Endpoint

```bash
# GET products
curl https://nura-beta-three.vercel.app/api/products

# POST product
curl -X POST https://nura-beta-three.vercel.app/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Product",
    "price": 99.99,
    "imageUrl": "https://example.com/image.jpg"
  }'
```

## 🐛 Troubleshooting

### Issue: "Prisma Client not generated"
**Solution:** Run `npm run prisma:generate`

### Issue: "Database connection failed"
**Solution:** 
- Check your `DATABASE_URL` environment variable
- Ensure your database is accessible from Vercel
- For Vercel Postgres, use the connection string from the dashboard

### Issue: "CORS errors"
**Solution:** The API endpoints already include CORS headers. If you still see errors, check that `VITE_API_URL` is set correctly.

### Issue: "API returns 404"
**Solution:**
- Ensure the `/api` folder is in the root directory
- Check that files are named correctly (e.g., `api/products.ts`)
- Redeploy on Vercel after adding API routes

## 📝 Notes

- **No Express server needed:** Vercel automatically handles serverless functions
- **Prisma singleton:** The `lib/prisma.ts` file ensures only one Prisma client instance exists (important for serverless)
- **Environment variables:** 
  - Backend uses `DATABASE_URL` (no `VITE_` prefix)
  - Frontend uses `VITE_API_URL` (must have `VITE_` prefix)
- **Same domain:** Both frontend and API share `https://nura-beta-three.vercel.app`

## 🎯 Next Steps

1. Integrate the API into your existing frontend components
2. Replace mock data with real API calls
3. Add more endpoints as needed
4. Add authentication if required
