const express = require("express");
const cors = require("cors");
const pal_it = require("./helpers/helper");
const app = express();
const port = 3000;
const paletteRoute = require("./routes/palette");
app.use(cors());
app.options("*", cors());
app.use(express.json());
app.use("/api/palette", paletteRoute);

app.listen(port, () => {
  console.log(`Now listening on ${port}`);
});
