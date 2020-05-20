let mongoose = require("mongoose");
let connectionString = require("../../config/dbconfig");
mongoose
  .connect(connectionString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .catch((error) => console.log(error));

module.exports = mongoose;
