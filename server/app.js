const express = require("express");
const app = express();

app.get("/", async (req, res, next) => {
  return res.json({ message: "welcome to prompt hive" });
});

module.exports = app;
