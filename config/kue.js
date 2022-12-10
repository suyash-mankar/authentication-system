const redisConfig = {
  redis: {
    port: 6379,
    host: "red-cea5rt5a4996meago0lg",
  },
};

var kue = require("kue");

const queue = kue.createQueue(redisConfig);

module.exports = queue;
