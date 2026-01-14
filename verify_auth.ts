
// import { api } from './src/lib/api'; 
// Mock fetch for node environment since src/lib/api.ts might use fetch
// import fetch from 'node-fetch';

// Polyfill fetch if needed, but since we are running in node, we might need to adjust how we call the API or just call the handlers directly?
// calling handlers directly is better as it avoids network issues and server setup.

// Actually, calling handlers requires simulating Request/Response objects which is annoying.
// Let's just use the prisma client directly to verify the password hash, 
// AND use a simple fetch to the running dev server? 
// User didn't say dev server is running. I should probably start it or just invoke the logic.
// Simpler: Just write a script that imports the handlers and mocks req/res.

import registerHandler from './api/auth/register';
import loginHandler from './api/auth/login';
import { prisma } from './lib/prisma';

async function mockRequestResponse(handler: any, method: string, body: any) {
    const req = {
        method,
        body,
    };

    let statusCode = 200;
    let result = null;
    const headers = {};

    const res = {
        setHeader: (key: any, value: any) => { (headers as any)[key] = value; },
        status: (code) => {
            statusCode = code;
            return res;
        },
        json: (data) => {
            result = data;
            return res;
        },
        end: () => { }
    };

    await handler(req, res);
    return { statusCode, result };
}

async function verify() {
    const email = `test_${Date.now()}@example.com`;
    const password = 'password123';

    console.log(`Testing registration for ${email}...`);
    const regRes = await mockRequestResponse(registerHandler, 'POST', {
        email,
        password,
        name: 'Test User'
    });

    console.log('Register Status:', regRes.statusCode);
    if (regRes.statusCode !== 201) {
        console.error('Registration failed:', regRes.result);
        process.exit(1);
    }
    console.log('Registration successful');

    // Verify password in DB is hashed
    const userInDb = await prisma.user.findUnique({ where: { email } });

    if (!userInDb) {
        console.error('User not found in DB');
        process.exit(1);
    }

    const userWithPassword = userInDb as any;

    if (userWithPassword.password === password) {
        console.error('SECURITY ERROR: Password stored in plain text!');
        process.exit(1);
    }
    if (!userWithPassword.password.startsWith('$2a$') && !userWithPassword.password.startsWith('$2b$')) {
        console.error('SECURITY ERROR: Password does not look like a bcrypt hash');
        console.log('Stored:', userWithPassword.password);
    }
    console.log('Password hashing verified.');

    console.log('Testing login...');
    const loginRes = await mockRequestResponse(loginHandler, 'POST', {
        email,
        password
    });

    console.log('Login Status:', loginRes.statusCode);
    if (loginRes.statusCode !== 200) {
        console.error('Login failed:', loginRes.result);
        process.exit(1);
    }
    console.log('Login successful');

    console.log('Testing login with wrong password...');
    const failLoginRes = await mockRequestResponse(loginHandler, 'POST', {
        email,
        password: 'wrongpassword'
    });

    console.log('Wrong Password Login Status:', failLoginRes.statusCode);
    if (failLoginRes.statusCode !== 401) {
        console.error('Security Check Failed: Login allowed with wrong password');
        process.exit(1);
    }
    console.log('Security check passed: Login rejected with wrong password');

    // Cleanup
    await prisma.user.delete({ where: { email } });
    console.log('Cleanup done. Verification Complete.');
}

verify().catch(e => {
    console.error(e);
    process.exit(1);
});
