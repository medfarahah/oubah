import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Cleaning up sample data...');

    // 1. Delete all order items (they reference products)
    const orderItemCount = await prisma.orderItem.deleteMany();
    console.log(`Deleted ${orderItemCount.count} order items.`);

    // 2. Delete all orders
    const orderCount = await prisma.order.deleteMany();
    console.log(`Deleted ${orderCount.count} orders.`);

    // 3. Delete all products (inventory will be deleted automatically due to Cascade)
    const productCount = await prisma.product.deleteMany();
    console.log(`Deleted ${productCount.count} products.`);

    // 4. Delete all addresses
    const addressCount = await prisma.address.deleteMany();
    console.log(`Deleted ${addressCount.count} addresses.`);

    // 5. Delete all customers (optional, but good for a fresh start)
    const customerCount = await prisma.customer.deleteMany();
    console.log(`Deleted ${customerCount.count} customers.`);

    console.log('Cleanup complete. Your database is now ready for your own data.');
}

main()
    .catch((e) => {
        console.error('Error during cleanup:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
