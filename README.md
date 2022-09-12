# koa-apollo-server-example
An example GraphQL server with Koa + Apollo Server + Prisma + Basic Authentication(JWT);
In this example are included: e2e and unit test with docker (test env);

## What's included
- Koa Setup
- Apollo server
- Prisma Configuration
- Basic Authentication & Authorization Usage
- Docker & Docker-compose setup
- Docker & Docker-compose setup for test
- E2e test
- Unit Test
- Environment Setup(ESLint & Prettier, Dotenv, Nodemon)

## Installing / Getting started
``` bash
# install dependencies
yarn install
```

##  First run

Create an .env file from env.example running this command:
``` bash
cp env.example .env
cp env.test.example .env.test
cp config/default.example.yml config/default.yml
cp config/test.example.yml config/test.yml
```

Start docker with:
``` bash
yarn docker-build-and-up
# it could take a couple of minutes
```

Open a new terminal window and enter in docker container running:
``` bash
docker exec -it koa_graph bash
```

Once inside run:
``` bash
yarn prisma-init
# Please don't forget it!
```

## Second run
``` bash
yarn docker-up
```

## Test
``` bash
yarn docker-test
```

## E2E Test
``` bash
yarn docker-test-e2e
```
