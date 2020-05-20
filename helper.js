const tweet = require("./database/models/tweets");
const insert = require("./database/operations/insert");

module.exports = function consumeAndPersist(consumer) {
  consumer.on("message", function (message) {
    message.value = JSON.parse(message.value);
    insert(tweet, message);
  });
};
