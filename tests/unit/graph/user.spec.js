const prisma = require('../../../src/utils/prismaClient');
const {register, login} = require('../../../src/api/auth');
const { Query } = require('../../../src/graphql/resolvers/resolvers');

jest.mock('prisma');

prisma.user.findMany = jest.fn(()=>null);

describe('[GRAPH RESOLVERS]', () => {  

    it('[GET-USERS] Should return a list of users', async () => {
        const mockBody = { skip: 0, limit: 5 };
        const mockResult ={
            "id": 1, "username": "valid", "password": "miao",
            "id": 2, "username": "valid", "password": "miao",
            "id": 3, "username": "valid", "password": "miao",
            "id": 4, "username": "valid", "password": "miao",
            "id": 5, "username": "valid", "password": "miao",
        }

        prisma.user.findMany.mockResolvedValue(mockResult);

        const ctx = { body: {}, status: null, throw: jest.fn(), prisma};
        const response = await Query.getUsers(null, mockBody, ctx);
        
        expect(response).toBe(mockResult);
    });

});