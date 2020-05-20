const express = require("express");
const app = express();
const Twitter = require("twitter");
const path = require("path");
const config = require("./config/twitterConfig");
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const kafka = require("kafka-node");
const mainTopic = "tweetsmain3";
let consumeAndPersist = require("./helper");
(Consumer = kafka.Consumer), (client = new kafka.KafkaClient());
const port = 80;

app.use(express.static(path.join(__dirname, "/public")));
app.use(express.static(path.join(__dirname, "/assets")));

var users = [];
var tClient = new Twitter(config);
var topicsToCreate = [
  {
    topic: mainTopic,
    partitions: 1,
    replicationFactor: 1,
  },
];
client.createTopics(topicsToCreate, (error, result) => {
  if (!error) {
    consumer = new Consumer(client, [{ topic: mainTopic, partition: 0 }], {
      autoCommit: false,
    });
    consumeAndPersist(consumer);
  }
});

app.get("/", (req, res) => res.sendFile("index.html"));

io.on("connection", (socket) => {
  Producer = kafka.Producer;
  KeyedMessage = kafka.KeyedMessage;
  producer = new Producer(client);
  var stream = {};
  users.push(socket);
  console.log("Connected: Number of users online => %s", users.length);
  socket.on("keyword", (data) => {
    console.log(data.keyword);
    if (!isEmpty(stream)) {
      console.log("destroying...");
      stream.destroy();
    }
    stream = tClient.stream("statuses/filter", { track: data.keyword });
    streamAndSave(socket, stream, producer);
  });

  socket.on("disconnect", (data) => {
    console.log("1 disconnected");
    users.splice(users.indexOf(socket), 1);
    if (!isEmpty(stream)) {
      console.log("destroying...");
      stream.destroy();
    }
    console.log("Disconnected: Number of users online => %s", users.length);
  });
});

function isEmpty(obj) {
  return Object.keys(obj).length === 0;
}
function streamAndSave(socket, stream, producer) {
  stream.on("data", function (event) {
    tweet = {
      id: event.id_str,
      username: event.user.screen_name,
      tweet: event.truncated ? event.extended_tweet.full_text : event.text,
    };
    pushToKafka(tweet, producer);
    socket.emit("tweet", tweet);
  });

  stream.on("error", function (err) {
    console.log(err);
  });
}
function pushToKafka(tweet, producer) {
  let { id, ...tweetWithoutID } = tweet;
  tweetWithoutID = JSON.stringify(tweetWithoutID);
  payloads = [
    { topic: mainTopic, messages: tweetWithoutID, partition: 0, key: id },
  ];
  producer.send(payloads, function (err, data) {
    if (err) {
      console.log(err);
    }
  });
}

http.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`)
);
