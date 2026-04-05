const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const { errorHandler } = require("./middleware/errorHandler");
const { getEnv } = require("./config/env");

const authRoutes = require("./routes/auth");
const metadataRoutes = require("./routes/metadata");
const contentRoutes = require("./routes/content");
const voteRoutes = require("./routes/vote");
const saveRoutes = require("./routes/save");
const adminRoutes = require("./routes/admin");

const { trackCopy } = require("./controllers/copyController");
const { optionalAuth } = require("./middleware/auth");
const { apiLimiter, authLimiter } = require("./middleware/rateLimiter");

const app = express();

const allowedOrigins = (
  process.env.CLIENT_URLS || process.env.CLIENT_URL || "http://localhost:5173"
)
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use((req, res, next) => {
  const requestOrigin = req.headers.origin;
  const isAllowedOrigin =
    requestOrigin && allowedOrigins.includes(requestOrigin);
  const originalWriteHead = res.writeHead.bind(res);

  res.writeHead = (...args) => {
    if (isAllowedOrigin) {
      res.setHeader("Access-Control-Allow-Origin", requestOrigin);
      res.setHeader("Access-Control-Allow-Credentials", "true");
      res.setHeader("Vary", "Origin");
    }

    return originalWriteHead(...args);
  };

  if (isAllowedOrigin) {
    res.setHeader("Access-Control-Allow-Origin", requestOrigin);
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Vary", "Origin");
  }

  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET,POST,PUT,PATCH,DELETE,OPTIONS"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );

  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  return next();
});
const env = getEnv();

const corsOptions = {
  origin: [env.CLIENT_URL].filter(Boolean),
  credentials: true,
};

app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/auth", authLimiter);
app.use("/api", apiLimiter);

app.get("/", (req, res) => {
  res.json({
    message: "PromptHive API is running",
    env: env.NODE_ENV,
  });
});

app.get("/api/debug-routes", (req, res) => {
  res.json({
    ok: true,
    expectedRoutes: [
      "/api/auth",
      "/api/metadata",
      "/api/content",
      "/api/content/featured",
      "/api/content/top-rated",
      "/api/vote",
      "/api/save",
      "/api/admin",
    ],
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/metadata", metadataRoutes);
app.use("/api/content", contentRoutes);
app.use("/api/vote", voteRoutes);
app.use("/api/save", saveRoutes);
app.post("/api/content/:id/copy", optionalAuth, trackCopy);
app.use("/api/admin", adminRoutes);

app.use((req, res) => {
  res.status(404).json({
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

app.use(errorHandler);

module.exports = app;
