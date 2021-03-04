const app = require("./src/index");
const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
  console.log(`Server is now listening on ${port}`);
});

module.exports = server;
