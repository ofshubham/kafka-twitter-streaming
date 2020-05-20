var tweetList = $("ul.tweets");
var socket = io();

tweets = [];
var i = 0;
var timer = 0;
socket.on("tweet", (tweet) => {
  tweets.push(tweet);
});

function appendTweets() {
  timer += 2;
  console.log(tweets.length, i, timer);
  if (
    tweets.length != 0 &&
    tweets.length > i &&
    typeof tweets[i] !== "undefined"
  ) {
    lineToBeAppended =
      "<li>" + tweets[i].username + ": " + tweets[i].tweet + "</li>";
    $(".tweets").prepend(lineToBeAppended);
    i += 1;
    $("div#count").text("Count: " + i);
  }
}

setInterval(appendTweets, 2000);

function emitKeyword() {
  var keywordValue = $("#search-bar").val();
  reqObject = { keyword: keywordValue };
  socket.emit("keyword", reqObject);
  tweets = [];
  i = 0;
  $("div#count").text("Count: " + i);
}

$(document).ready(function () {
  $("#search-btn").on("click", emitKeyword);
});
