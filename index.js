const Hapi = require('hapi'),
      models = require('./models'),
      server = new Hapi.Server();

server.connection({ port : 3000 });
server.route(require('./lib/routes'));

models.sequelize.sync().then(() => {
  server.start(() => {
    console.log('Running on 3000');
  });
});
