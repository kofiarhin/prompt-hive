const mongoose = require("mongoose");

// Set test env vars
process.env.JWT_SECRET = "test-secret-key";
process.env.MONGO_URI = process.env.MONGO_URI_TEST || "mongodb://localhost:27017/prompthive_test";
process.env.NODE_ENV = "test";
process.env.CLIENT_URL = "http://localhost:5173";

async function connectDB() {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGO_URI);
  }
}

async function clearDB() {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
}

async function closeDB() {
  await mongoose.connection.close();
}

module.exports = { connectDB, clearDB, closeDB };
