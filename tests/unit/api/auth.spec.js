const bcrypt = require('bcryptjs');
const prisma = require('../../../src/utils/prismaClient');
const {register, login} = require('../../../src/api/auth');

jest.mock('prisma');

prisma.user.findUnique = jest.fn(()=>null);
prisma.user.create = jest.fn(()=>user);

describe('[AUTH]', () => {  

    it('[REGISTRATION] Should create new user', async () => {
        const mockUser = { username: 'valid', password: 'valid' };
        const securePassword = await bcrypt.hash(mockUser.password, 5);
        const newUser ={
            "id": 1,
            "username": "valid",
            "password": securePassword,
        }

        prisma.user.findUnique.mockResolvedValue(null);
        prisma.user.create.mockResolvedValue(newUser);

        const request = {body: mockUser};
        const ctx = {request, body: {}, status: null, throw: jest.fn(), prisma};

        const response = await register(ctx);
        
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('message');
        expect(response.body).toHaveProperty('newUser');
        expect(response.body.newUser).toHaveProperty('id');
        expect(response.body.newUser).toHaveProperty('username');
        expect(response.body.newUser).toHaveProperty('password');
        expect(response.body.message).toBe('REGISTRATION-SUCCEEDED');
        expect(response.body.newUser.username).toBe(mockUser.username);
        expect(response.body.newUser.password).toBe(securePassword);
    });

    it('[REGISTRATION] Shouldn\'t create new user: must returns user already exists', async () => {
        const mockUser = { username: 'valid', password: 'valid' };

        prisma.user.findUnique.mockResolvedValue([{}]);

        const request = {body: mockUser};
        const ctx = {request, body: {}, status: null, throw: jest.fn(), prisma};

        const response = await register(ctx);
        
        expect(response.status).toBe(406);
        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toBe('USERNAME-ALREADY-EXISTS');
    });

    it('[LOGIN] Should login user', async () => {
        const mockUser = { username: 'valid', password: 'valid' };
        const securePassword = await bcrypt.hash(mockUser.password, 5);
        const newUser ={
            "id": 1,
            "username": "valid",
            "password": securePassword,
        }

        prisma.user.findUnique.mockResolvedValue(newUser);

        const request = {body: mockUser};
        const ctx = {request, body: {}, status: null, throw: jest.fn(), prisma};

        const response = await login(ctx);

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('message');
        expect(response.body).toHaveProperty('token');
        expect(response.body).toHaveProperty('user');
        expect(response.body.message).toBe('LOGIN-SUCCEEDED');
        expect(response.body.user).toBe(newUser);
    });

    it('[LOGIN] Shouldn\'t login user if send incorrect password', async () => {
        const mockUser = { username: 'valid', password: 'valid' };
        const securePassword = await bcrypt.hash(mockUser.password, 5);

        const newUser ={
            "id": 1,
            "username": "valid",
            "password": securePassword,
        }

        prisma.user.findUnique.mockResolvedValue(mockUser);

        const request = {body: mockUser};
        const ctx = {request, body: {}, status: null, throw: jest.fn(), prisma};

        const response = await login(ctx);

        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toBe('PASSWORD-ERROR');
    });

    it('[LOGIN] Shouldn\'t login user if send incorrect username', async () => {
        const securePassword = await bcrypt.hash('miao', 5);
        const mockUser = { username: 'valid', password: securePassword };

        prisma.user.findUnique.mockResolvedValue(null);

        const request = {body: mockUser};
        const ctx = {request, body: {}, status: null, throw: jest.fn(), prisma};

        const response = await login(ctx);

        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toBe('USERNAME-NOT-FOUND');
    });
});
