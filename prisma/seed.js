const prisma = require('../src/utils/prismaClient');

const users = [
    {
        username: 'christianp',
        password: 'miao-70ef-42bc-9d0b-42',
    },
];

async function main() {
    console.log('Start seeding ...');
    users.forEach(async (element) => {
        const user = await prisma.user.create({ data: element });
        console.log(`User created: ${user}`);
    });
    console.log('Seeding finished.');
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
