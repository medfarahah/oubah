
console.log('Starting debug script...');
try {
    console.log('Importing express...');
    const express = await import('express');
    console.log('Express imported.');

    console.log('Importing cors...');
    const cors = await import('cors');
    console.log('Cors imported.');

    console.log('Importing register handler...');
    const register = await import('./api/auth/register');
    console.log('Register imported.');

    console.log('Importing products handler...');
    const products = await import('./api/products');
    console.log('Products imported.');

    console.log('Importing product [id] handler...');
    const product = await import('./api/products/[id]');
    console.log('Product ID imported.');

    console.log('Importing orders handler...');
    const orders = await import('./api/orders');
    console.log('Orders imported.');

    console.log('All imports successful.');
} catch (err) {
    console.error('Import failed:', err);
}
