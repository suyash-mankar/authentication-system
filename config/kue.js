const redisConfig = {
  redis: {
    port: 6379,
    host: process.env.REDIS_HOST,
  },
};

var kue = require("kue");

const queue = kue.createQueue(redisConfig);

module.exports = queue;
