const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { errorHandler } = require("./middleware/errorHandler");

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

// Middleware
app.use(
  cors({
    origin: [process.env.CLIENT_URL].filter(Boolean),
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// Rate limiting
app.use("/api/", apiLimiter);
app.use("/api/auth", authLimiter);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/metadata", metadataRoutes);
app.use("/api/content", contentRoutes);
app.use("/api/vote", voteRoutes);
app.use("/api/save", saveRoutes);
app.post("/api/content/:id/copy", optionalAuth, trackCopy);
app.use("/api/admin", adminRoutes);

// Health check
app.get("/", (req, res) => {
  res.json({ message: "PromptHive API" });
});

// Error handler
app.use(errorHandler);

module.exports = app;
