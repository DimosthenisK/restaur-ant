# RestaurAnt

RestaurAnt is an app that satisfies the following requirements:
* User must be able to create an account and log in. (If a mobile application, this means that more users can use the app from the same phone).
* Implement 2 roles with different permission levels
    * Regular User: Can rate and leave a comment for a restaurant
    * Admin: Can add/edit/delete, restaurants, users and reviews
* Reviews should have:
    * A 5 star based rate
    * Date of the visit
    * Comment
* When a Regular User logs in he will see a Restaurant List ordered by Rate Average
* When a restaurant is selected, a detailed view should be presented showing:
    * The overall average rating
    * The highest rated review
    * The lowest rated review
    * Latest review showing with rate and comment
* REST API. Make it possible to perform all user actions via the API, including authentication (If a mobile application and you don’t know how to create your own backend you can use Firebase.com or similar services to create the API).
In any case, you should be able to explain how a REST API works and demonstrate that by creating functional tests that use the REST Layer directly. Please be prepared to use REST clients like Postman, cURL, etc. for this purpose.
* If it’s a web application, it must be a single-page application. All actions need to be done client side using AJAX, refreshing the page is not acceptable. (If a mobile application, disregard this).
* Functional UI/UX design is needed. You are not required to create a unique design, however, do follow best practices to make the project as functional as possible.

It accomplishes the above with a REST API in NestJS using JWT authentication and a frontend in NextJS with next-auth for the authentication and pure tailwindCSS for the styling. It also uses a Postgres database for persistence.

## Installation

After you clone this project, you need to create 2 .env files.
One for the backend with the following keys: `[DATABASE_URL, ENABLE_ENCRYPTION, JWT_SECRET, NODE_ENV]`
One for the frontend with the following keys: `[NEXTAUTH_URL, BACKEND_URL, NEXT_PUBLIC_BACKEND_URL]`

In addition to the .env files, you'll need to spin up a pg instance. This can happen from the docker-compose file in `restaur-ant-support`.
Create the instance by running `npm run compose`

These are some examples for the contents of the .env files, pointing to the docker pg instance:
Backend
```
DATABASE_URL="postgresql://user:password@localhost:5432/restaur-ant?schema=public"
ENABLE_ENCRYPTION=1
JWT_SECRET=secret
NODE_ENV=DEV
```

Frontend
```
NEXTAUTH_URL=http://localhost:3001
BACKEND_URL=http://localhost:3000
NEXT_PUBLIC_BACKEND_URL=http://localhost:3000
```

### Database

The database is PG with prisma as the ORM. You can initiate the database with `npx prisma db push`

### Backend

To install the backend you need the NestJS CLI utility
`npm i -g @nestjs/cli`
Then, you may install the project with `npm install` and run it with `npm start run`

### Frontend

To install the frontend you just need to run `npm install` and then `npm run dev`.

**Make sure to start the backend first, and THEN the frontend, so that they get port 3000 and port 3001.**

## Testing and API

The backend provides e2e tests that test all the endpoints with `npm run test:e2e`. It also provides OpenAPI definitions when running in NODE_ENV=DEV, which you may access in `/api`.

## Seeding

When you run the backend in NODE_ENV=DEV, you can call the `/app/seed` endpoint to seed the database with some example data.
