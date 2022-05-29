const Hapi = require('@hapi/hapi');

const booksRoute = require('./routes/books.route');

const init = async () => {
  const server = Hapi.Server({
    port: 5000,
    host: 'localhost',
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  server.route([
    ...booksRoute,
  ]);

  await server.start();

  // eslint-disable-next-line no-console
  console.log(`Server running: ${server.info.uri}`);
};

init();
