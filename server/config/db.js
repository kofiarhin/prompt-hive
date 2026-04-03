const { getEnv } = require("./env");
const mongoose = require("mongoose");

async function connectDB() {
  const { MONGO_URI } = getEnv();
  const conn = await mongoose.connect(MONGO_URI);
  console.log(`MongoDB connected: ${conn.connection.host}`);
}

module.exports = { connectDB };
