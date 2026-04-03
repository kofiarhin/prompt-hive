module.exports = async function () {
  process.env.JWT_SECRET = "test-secret-key";
  process.env.MONGO_URI = process.env.MONGO_URI_TEST || "mongodb://localhost:27017/prompthive_test";
  process.env.NODE_ENV = "test";
  process.env.CLIENT_URL = "http://localhost:5173";
};
