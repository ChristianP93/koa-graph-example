/* eslint-disable no-undef */
const request = require('supertest');
const { ApolloServer, gql } = require('apollo-server-koa');
const { server, app } = require('../../server');
const graphQlOptions = require('../../src/graphql');

const prisma = require('../../src/utils/prismaClient');

const testServer = new ApolloServer(graphQlOptions);

const mockListen = jest.fn();
app.listen = mockListen;
let token;

describe('e2e: Create user and get list of users', () => {
    afterEach(() => {
        mockListen.mockReset();
    });

    test('Server works', async () => {
        expect(mockListen.mock.calls.length).toBe(1);
        expect(mockListen.mock.calls[0][0]).toBe(process.env.PORT || 3000);
    });

    test('Should pass: Register a new user', async () => {
        const response = await request(app.callback())
            .post('/auth/register')
            .set('Content-Type', 'application/json')
            .send({
                username: 'username42',
                password: 'miao',
            });
        expect(response.status).toBe(200);
        expect(JSON.parse(response.text)).toHaveProperty('message');
        expect(JSON.parse(response.text)).toHaveProperty('newUser');
    });

    test('Should pass: Login ', async () => {
        const response = await request(app.callback())
            .post('/auth/login')
            .set('Content-Type', 'application/json')
            .send({
                username: 'username42',
                password: 'miao',
            });
        expect(response.status).toBe(200);
        expect(JSON.parse(response.text)).toHaveProperty('token');
        token = JSON.parse(response.text).token;
    });

    it('Should successfully get users', async () => {
        testServer.context = () => ({ bearerToken: `Bearer ${token}`, prisma });
        const getUsers = gql`
            query GetUsers ($skip: Int, $limit: Int) {
                getUsers(limit: $limit, skip: $skip) {
                    id
                    username,
                    password
                }
            }
        `;

        const res = await testServer.executeOperation({
            query: getUsers,
            variables: { limit: 5, skip: 0 },
        });

        expect(res.data.getUsers[0]).toHaveProperty('username');
        expect(res.data.getUsers[0]).toHaveProperty('password');
    });

    afterAll(async () => {
        await prisma.user.deleteMany({});
        server.stop();
    });
});
