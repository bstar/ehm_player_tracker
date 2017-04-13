const _ = require('lodash'),
      models = require('../models'),
      utils  = require('../lib/utils').utils;

exports.players = {
  getAll: (request, reply) => {
    models.player.findAll({
        include: [{ model: models.stat }]
      })
      .then((players) => {
        reply(players).code(200);
      });
  },

  getOne: (request, reply) => {
    models.player.find({
        where: { id: request.params.id },
        include: [{ model: models.stat }],
        limit: 1
      })
      .then((player) => {
        reply(player).code(200);
      });
  },

  cliCreate: (playerData) => {
    return new Promise((resolve, reject) => {
      models.player.create(playerData).then((player) => {
        playerData.stats.playerId = player.id;
        models.stat.create(playerData.stats).then(resolve);
      });
    });
  },

  cliUpdate: (csvPlayerData, dbPlayer) => {
    return new Promise((resolve, reject) => {
      var dbStats = dbPlayer.get().stats.pop().get();

      dbPlayer.updateAttributes(csvPlayerData).then(() => {
        var dataChanged = false;

        // TODO clean up, this is a really brittle way to see if the stats object changed
        for (var key in csvPlayerData.stats) {
          if (key !== "id" &&
              key !== "game_date" &&
              key !== "updatedAt" &&
              key !== "createdAt" &&
              csvPlayerData.stats[key] &&
              parseInt(dbStats[key]) &&
              parseInt(csvPlayerData.stats[key]) !== parseInt(dbStats[key]) ) {
                dataChanged = true;
                break;
              }
        }

        if (dataChanged) {
          csvPlayerData.stats.playerId = csvPlayerData.id;
          models.stat.create(csvPlayerData.stats).then(resolve);
        }
      });

    });
  },

  cliGetById: (id) => {
    return new Promise((resolve, reject) => {
      models.player.find({
          where: { id: id },
          include: [{ model: models.stat }],
          limit: 1
        })
        .then(resolve);
    });
  }
};
