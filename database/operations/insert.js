module.exports = function insert(model, data) {
  var insertObject = new model(data);
  insertObject.save().then(
    () => console.log("Data Saved!"),
    (err) => console.log(err.name)
  );
};
