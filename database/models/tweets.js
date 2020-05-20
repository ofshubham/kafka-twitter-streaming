var mongoose = require("../connection/db");
var Schema = mongoose.Schema;

var tweetSchema = new Schema({
  topic: String,
  value: { type: Object, unique: true },
  key: {
    type: String,
    unique: true,
  },
  offset: Number,
  partition: Number,
  highWaterOffset: Number,
  username: String,
  tweetText: String,
});

var tweet = mongoose.model("tweets", tweetSchema);

module.exports = tweet;
