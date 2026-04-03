require("dotenv").config();

const { validateEnv } = require("./config/env");
const { connectDB } = require("./config/db");

validateEnv();

const app = require("./app");

const port = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server started on port ${port}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to database:", err.message);
    process.exit(1);
  });
