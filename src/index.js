const express = require("express");
const cors = require("cors");
const pal_it = require("./helpers/helper");
const app = express();
const paletteRoute = require("./routes/palette");
app.use(cors());
app.options("*", cors());
app.use(express.json());
app.use("/api/palette", paletteRoute);

module.exports = app;
