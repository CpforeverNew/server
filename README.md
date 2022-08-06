# server

## Getting started
First set up environment variables for the app by running the following command:

```sh
cp .env.example .env
```

Then open `.env` and populate its values accordingly. If you're using Docker for local development you can leave the database variables as is.

### With Docker
Run the following to spin up MySQL and a Node environment:

```sh
docker-compose up -d
```

This will also create your database and populate it with the base tables and data needed to run the app.

Once the containers are up you can open a shell for the Node environment with:

```sh
docker-compose exec app bash
```

Then continue on to the section after next for info on spinning up the app.

### Without Docker
[`nvm`](https://github.com/nvm-sh/nvm) config is provided if you want to use it to install the version of Node that this app is developed against.

You'll also need a recent version of MySQL running. You'll need to import `src/database/migrations/base.sql` after creating a database named `cpforever`.

### Starting the app
Install the app's dependencies:

```sh
npm install
```

And then run any remaining migrations:

```sh
npx sequelize-cli db:migrate
```

Finally, you can start the server with:

```sh
npm run dev
```

This will start the server with hot reloading. If you'd like to test a production build you can run the following:

```sh
npm run build

npm run start
```
