/* eslint-disable no-undef */
const prisma = require('../../../src/utils/prismaClient');
const checkAuthBody = require('../../../src/middleware/auth/validateAuthBody')

jest.mock('prisma');

prisma.user.findUnique = jest.fn(()=>null);
prisma.user.create = jest.fn(()=>user);

describe('[AUTH]', () => {  
    it('[MIDDLEWARE-CHECK-BODY] Shouldn\'t create new user if send invalid bodyRequest', async () => {
        const invalidBodyRequest = { password: 'valid' };

        prisma.user.findUnique.mockResolvedValue([{}]);

        const request = {body: invalidBodyRequest};
        const ctx = {request, body: {}, status: null, throw: jest.fn(), prisma};

        const response = await checkAuthBody(ctx);
        
        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty('error');
        expect(response.body.error).toBe('expected an object with username, password but got: [object Object]');
    });
    
    
});
