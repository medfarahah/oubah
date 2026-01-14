# Database Setup Guide

## ⚠️ "No Results" or Empty Database?

If you're seeing "No products found" or empty data, you need to:
1. Create the database tables (migrations)
2. Generate Prisma Client
3. Seed the database with sample data

## Step-by-Step Setup

### Step 1: Generate Prisma Client
```bash
npm run prisma:generate
```
This creates the Prisma Client that your code uses to interact with the database.

### Step 2: Run Database Migrations
```bash
npm run prisma:migrate
```
This creates all the tables in your Neon database based on `prisma/schema.prisma`.

**Note:** When prompted, enter a migration name (e.g., "init" or "initial_setup")

### Step 3: Seed the Database (Add Sample Data)
```bash
npm run seed
```
This adds sample products, customers, orders, and users to your database.

### Step 4: Create Admin User
```bash
npm run create-admin
```
This creates an admin user:
- Email: `lorgroup.dj@gmail.com`
- Password: `123456`

## Complete Setup Command (All at Once)

Run these commands in order:

```bash
# 1. Generate Prisma Client
npm run prisma:generate

# 2. Create database tables
npm run prisma:migrate

# 3. Add sample data
npm run seed

# 4. Create admin user
npm run create-admin
```

## Verify Database Setup

### Option 1: Check via Prisma Studio
```bash
npm run prisma:studio
```
This opens a visual database browser at `http://localhost:5555` where you can see all your data.

### Option 2: Check via API
1. Start the backend: `npm run dev:server`
2. Visit: `http://localhost:3000/api/products`
3. You should see a list of products

## Troubleshooting

### Error: "P1001: Can't reach database server"
- Check your `DATABASE_URL` in `.env` file
- Make sure your Neon database is running
- Verify the connection string is correct

### Error: "Migration failed"
- Make sure `DATABASE_URL` is set correctly
- Check that your Neon database is accessible
- Try running `npm run prisma:generate` first

### No data after seeding
- Check the console output for errors
- Verify the seed script completed successfully
- Check Prisma Studio to see if data exists

## What Gets Created

After running the seed script, you'll have:
- ✅ 8 Sample Products with inventory
- ✅ 4 Sample Customers
- ✅ 5 Sample Orders
- ✅ 2 Regular Users (password: `password123`)
- ✅ 1 Admin User (lorgroup.dj@gmail.com / password: `123456`)
