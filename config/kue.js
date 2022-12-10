const env = require("./environment");

const redisConfig = {
  redis: {
    port: 6379,
    host: env.redis_host,
  },
};

var kue = require("kue");

const queue = kue.createQueue(redisConfig);

module.exports = queue;
