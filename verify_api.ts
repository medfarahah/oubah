
import productsHandler from './api/products';
import productHandler from './api/products/[id]';
import ordersHandler from './api/orders';

import { prisma } from './lib/prisma';

async function mockRequestResponse(handler: any, method: string, query: any, body: any) {
    const req = {
        method,
        query: query || {},
        body: body || {},
    };

    let statusCode = 200;
    let result = null;
    const headers = {};

    const res = {
        setHeader: (key: any, value: any) => { (headers as any)[key] = value; },
        status: (code: number) => {
            statusCode = code;
            return res;
        },
        json: (data: any) => {
            result = data;
            return res;
        },
        end: () => { }
    };

    await handler(req, res);
    return { statusCode, result };
}

async function verifyAPI() {
    console.log('--- STARTING API VERIFICATION ---');

    // 1. Create Product
    console.log('\n1. Testing Create Product...');
    const productData = {
        name: `Test Product ${Date.now()}`,
        price: 99.99,
        imageUrl: 'http://example.com/image.jpg'
    };
    const createProdRes = await mockRequestResponse(productsHandler, 'POST', {}, productData);
    if (createProdRes.statusCode !== 201) {
        console.error('Failed to create product:', createProdRes.result);
        process.exit(1);
    }
    const createdProduct = (createProdRes.result as any).data;
    console.log('Product created:', createdProduct.id);

    // 2. Get All Products
    console.log('\n2. Testing Get All Products...');
    const getProdsRes = await mockRequestResponse(productsHandler, 'GET', {}, {});
    if (getProdsRes.statusCode !== 200) {
        console.error('Failed to get products:', getProdsRes.result);
        process.exit(1);
    }
    const products = (getProdsRes.result as any).data;
    const foundProduct = products.find((p: any) => p.id === createdProduct.id);
    if (!foundProduct) {
        console.error('Created product not found in list!');
        process.exit(1);
    }
    console.log('Product found in list.');

    // 3. Get Single Product
    console.log('\n3. Testing Get Single Product...');
    const getSingleRes = await mockRequestResponse(productHandler, 'GET', { id: createdProduct.id }, {});
    if (getSingleRes.statusCode !== 200) {
        console.error('Failed to get single product:', getSingleRes.result);
        process.exit(1);
    }
    console.log('Single product retrieved.');

    // 4. Update Product
    console.log('\n4. Testing Update Product...');
    const updateRes = await mockRequestResponse(productHandler, 'PUT', { id: createdProduct.id }, { price: 150.00 });
    if (updateRes.statusCode !== 200) {
        console.error('Failed to update product:', updateRes.result);
        process.exit(1);
    }
    if ((updateRes.result as any).data.price !== 150.00) {
        console.error('Product price not updated!');
        process.exit(1);
    }
    console.log('Product updated.');

    // 5. Create Order
    console.log('\n5. Testing Create Order...');
    const orderData = {
        customer: 'Test Customer',
        phone: '+1234567890',
        total: 200.00,
        items: [{ productId: createdProduct.id, quantity: 1 }]
    };
    const createOrderRes = await mockRequestResponse(ordersHandler, 'POST', {}, orderData);
    if (createOrderRes.statusCode !== 201) {
        console.error('Failed to create order:', createOrderRes.result);
        process.exit(1);
    }
    const createdOrder = (createOrderRes.result as any).data;
    console.log('Order created:', createdOrder.id);

    // 6. Get Orders
    console.log('\n6. Testing Get Orders...');
    const getOrdersRes = await mockRequestResponse(ordersHandler, 'GET', {}, {});
    if (getOrdersRes.statusCode !== 200) {
        console.error('Failed to get orders:', getOrdersRes.result);
        process.exit(1);
    }
    console.log('Orders retrieved.');

    // 7. Delete Product
    console.log('\n7. Testing Delete Product...');
    const deleteRes = await mockRequestResponse(productHandler, 'DELETE', { id: createdProduct.id }, {});
    if (deleteRes.statusCode !== 200) {
        console.error('Failed to delete product:', deleteRes.result);
        process.exit(1);
    }
    console.log('Product deleted.');

    // Verify deletion
    const verifyDeleteRes = await mockRequestResponse(productHandler, 'GET', { id: createdProduct.id }, {});
    if (verifyDeleteRes.statusCode !== 404) {
        console.error('Product still exists after deletion!');
        process.exit(1);
    }

    // Cleanup Order
    await prisma.order.delete({ where: { id: createdOrder.id } });

    console.log('\n--- VERIFICATION SUCCESSFUL ---');
}

verifyAPI().catch(e => {
    console.error(e);
    process.exit(1);
});
