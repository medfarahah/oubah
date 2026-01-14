// Script to seed the database with sample data
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

const sampleProducts = [
  {
    name: 'Elegant Abaya - Classic Black',
    price: 89.99,
    imageUrl: 'https://images.unsplash.com/photo-1594633312688-8b5e3b2b8b3f?w=500',
    category: 'Abayas',
    description: 'A timeless classic black abaya with elegant design and comfortable fit.',
    material: 'Premium Polyester',
    colors: ['Black', 'Navy', 'Brown'],
    sizes: ['S', 'M', 'L', 'XL'],
    isNew: true,
    sale: false,
  },
  {
    name: 'Modern Hijab Set - Pastel Collection',
    price: 45.99,
    imageUrl: 'https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=500',
    category: 'Hijabs',
    description: 'Beautiful pastel colored hijab set with matching undercap.',
    material: 'Cotton Blend',
    colors: ['Pink', 'Mint', 'Lavender', 'Beige'],
    sizes: ['One Size'],
    isNew: true,
    sale: false,
  },
  {
    name: 'Luxury Kaftan - Gold Embroidery',
    price: 149.99,
    imageUrl: 'https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=500',
    category: 'Kaftans',
    description: 'Stunning gold embroidered kaftan perfect for special occasions.',
    material: 'Silk Blend',
    colors: ['Gold', 'Silver', 'Rose Gold'],
    sizes: ['S', 'M', 'L', 'XL'],
    isNew: false,
    sale: true,
    originalPrice: 199.99,
  },
  {
    name: 'Casual Jilbab - Everyday Wear',
    price: 65.99,
    imageUrl: 'https://images.unsplash.com/photo-1594633312688-8b5e3b2b8b3f?w=500',
    category: 'Jilbabs',
    description: 'Comfortable and stylish jilbab for everyday wear.',
    material: 'Cotton',
    colors: ['Gray', 'Navy', 'Black', 'Beige'],
    sizes: ['S', 'M', 'L', 'XL'],
    isNew: false,
    sale: false,
  },
  {
    name: 'Premium Niqab Set',
    price: 35.99,
    imageUrl: 'https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=500',
    category: 'Niqabs',
    description: 'High-quality niqab set with adjustable straps.',
    material: 'Breathable Fabric',
    colors: ['Black', 'Navy', 'Brown'],
    sizes: ['One Size'],
    isNew: true,
    sale: false,
  },
  {
    name: 'Designer Abaya - Embroidered',
    price: 129.99,
    imageUrl: 'https://images.unsplash.com/photo-1594633312688-8b5e3b2b8b3f?w=500',
    category: 'Abayas',
    description: 'Beautifully embroidered designer abaya with intricate details.',
    material: 'Premium Fabric',
    colors: ['Black', 'Navy', 'Maroon'],
    sizes: ['S', 'M', 'L', 'XL'],
    isNew: true,
    sale: false,
  },
  {
    name: 'Sport Hijab - Active Wear',
    price: 29.99,
    imageUrl: 'https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=500',
    category: 'Hijabs',
    description: 'Moisture-wicking sport hijab perfect for active lifestyle.',
    material: 'Polyester',
    colors: ['Black', 'Gray', 'Navy', 'Pink'],
    sizes: ['One Size'],
    isNew: true,
    sale: false,
  },
  {
    name: 'Evening Kaftan - Party Collection',
    price: 179.99,
    imageUrl: 'https://images.unsplash.com/photo-1594633313593-bab3825d0caf?w=500',
    category: 'Kaftans',
    description: 'Elegant evening kaftan with sequin details for special events.',
    material: 'Silk',
    colors: ['Black', 'Navy', 'Burgundy'],
    sizes: ['S', 'M', 'L', 'XL'],
    isNew: false,
    sale: true,
    originalPrice: 249.99,
  },
];

const sampleCustomers = [
  {
    email: 'sarah.ahmed@example.com',
    firstName: 'Sarah',
    lastName: 'Ahmed',
    phone: '+25377123456',
  },
  {
    email: 'fatima.hassan@example.com',
    firstName: 'Fatima',
    lastName: 'Hassan',
    phone: '+25377234567',
  },
  {
    email: 'amina.ali@example.com',
    firstName: 'Amina',
    lastName: 'Ali',
    phone: '+25377345678',
  },
  {
    email: 'mariam.ibrahim@example.com',
    firstName: 'Mariam',
    lastName: 'Ibrahim',
    phone: '+25377456789',
  },
];

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seed...\n');

    // 1. Create Products with Inventory
    console.log('📦 Creating products...');
    const createdProducts = [];
    for (const productData of sampleProducts) {
      const { originalPrice, ...productFields } = productData;
      
      // Check if product exists by name
      const existing = await prisma.product.findFirst({
        where: { name: productData.name },
      });

      let product;
      if (existing) {
        // Update existing product
        product = await prisma.product.update({
          where: { id: existing.id },
          data: productFields,
          include: { inventory: true },
        });
        console.log(`  ✓ Updated product: ${product.name}`);
      } else {
        // Create new product
        product = await prisma.product.create({
          data: {
            ...productFields,
            originalPrice: originalPrice || null,
            inventory: {
              create: {
                quantity: Math.floor(Math.random() * 50) + 10, // Random stock between 10-60
                lowStock: 5,
              },
            },
          },
          include: { inventory: true },
        });
        console.log(`  ✓ Created product: ${product.name}`);
      }
      createdProducts.push(product);
    }
    console.log(`✅ Processed ${createdProducts.length} products\n`);

    // 2. Create Customers
    console.log('👥 Creating customers...');
    const createdCustomers = [];
    for (const customerData of sampleCustomers) {
      const customer = await prisma.customer.upsert({
        where: { email: customerData.email },
        update: customerData,
        create: customerData,
      });
      createdCustomers.push(customer);
      console.log(`  ✓ Created customer: ${customer.firstName} ${customer.lastName}`);
    }
    console.log(`✅ Created ${createdCustomers.length} customers\n`);

    // 3. Create Sample Orders
    console.log('🛒 Creating sample orders...');
    const orders = [];
    for (let i = 0; i < 5; i++) {
      const customer = createdCustomers[i % createdCustomers.length];
      const productCount = Math.floor(Math.random() * 3) + 1; // 1-3 products per order
      const selectedProducts = createdProducts
        .sort(() => Math.random() - 0.5)
        .slice(0, productCount);

      const subtotal = selectedProducts.reduce((sum, p) => sum + p.price, 0);
      const shipping = 10.00;
      const total = subtotal + shipping;

      const order = await prisma.order.create({
        data: {
          customerName: `${customer.firstName} ${customer.lastName}`,
          email: customer.email,
          phone: customer.phone,
          customerId: customer.id,
          subtotal,
          shipping,
          total,
          status: ['pending', 'processing', 'shipped'][Math.floor(Math.random() * 3)],
          address: '123 Main Street',
          city: 'Djibouti',
          state: 'Djibouti',
          zipCode: '001',
          country: 'Djibouti',
          paymentMethod: ['waafi', 'cash'][Math.floor(Math.random() * 2)],
          items: {
            create: selectedProducts.map((product) => ({
              productId: product.id,
              quantity: Math.floor(Math.random() * 2) + 1, // 1-2 quantity
              price: product.price,
            })),
          },
        },
        include: { items: true },
      });
      orders.push(order);
      console.log(`  ✓ Created order #${order.id.substring(0, 8)} for ${order.customerName}`);
    }
    console.log(`✅ Created ${orders.length} orders\n`);

    // 4. Create Regular Users (non-admin)
    console.log('👤 Creating regular users...');
    const regularUsers = [
      {
        email: 'customer1@example.com',
        name: 'Customer One',
        phone: '+25377567890',
        password: await bcrypt.hash('password123', 10),
        role: 'customer',
      },
      {
        email: 'customer2@example.com',
        name: 'Customer Two',
        phone: '+25377678901',
        password: await bcrypt.hash('password123', 10),
        role: 'customer',
      },
    ];

    for (const userData of regularUsers) {
      const user = await prisma.user.upsert({
        where: { email: userData.email },
        update: userData,
        create: userData,
      });
      console.log(`  ✓ Created user: ${user.email}`);
    }
    console.log(`✅ Created ${regularUsers.length} regular users\n`);

    console.log('🎉 Database seeding completed successfully!');
    console.log('\nSummary:');
    console.log(`  - Products: ${createdProducts.length}`);
    console.log(`  - Customers: ${createdCustomers.length}`);
    console.log(`  - Orders: ${orders.length}`);
    console.log(`  - Regular Users: ${regularUsers.length}`);
    console.log(`  - Admin User: 1 (lorgroup.dj@gmail.com)`);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

seedDatabase();
