const { app } = require("./app.js");

const { PORT = 8080 } = process.env;

app.listen(port, (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("Listening on" + PORT);
  }
});
