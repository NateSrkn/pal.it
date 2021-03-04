const express = require("express");
const pal_it = require("../helpers/helper");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const { url } = req.query;
    if (!url) throw new Error();
    const pal = new pal_it(url);
    const { palette } = await pal.getPalette(req.query.size || undefined);
    res.send({ palette });
  } catch (error) {
    res.status(500).json({ error });
  }
});

module.exports = router;
