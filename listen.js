const { app, port } = require("./app.js");

app.listen(port, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("Listening on" + port);
  }
});
