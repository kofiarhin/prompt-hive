const DEFAULTS = {
  NODE_ENV: "development",
  PORT: 5000,
  CLIENT_URL: "http://localhost:5173",
  JWT_EXPIRES_IN: "7d",
  COOKIE_SECURE: false,
  COOKIE_SAME_SITE: "lax",
};

function toInt(value, key) {
  const parsed = Number.parseInt(value, 10);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    throw new Error(`${key} must be a positive integer`);
  }
  return parsed;
}

function toBool(value) {
  if (typeof value === "boolean") return value;
  return String(value).toLowerCase() === "true";
}

function normalizeNodeEnv(value) {
  const allowed = ["development", "test", "production"];
  if (!allowed.includes(value)) {
    throw new Error(`NODE_ENV must be one of: ${allowed.join(", ")}`);
  }
  return value;
}

function parseOrigins(value) {
  if (!value) return [];

  return String(value)
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
}

function buildConfig(source = process.env) {
  const nodeEnv = normalizeNodeEnv(source.NODE_ENV || DEFAULTS.NODE_ENV);
  const clientUrl = source.CLIENT_URL || DEFAULTS.CLIENT_URL;

  const config = {
    NODE_ENV: nodeEnv,
    PORT: toInt(source.PORT || DEFAULTS.PORT, "PORT"),
    CLIENT_URL: clientUrl,
    CLIENT_URLS: parseOrigins(clientUrl),
    MONGO_URI: source.MONGO_URI,
    JWT_SECRET: source.JWT_SECRET,
    JWT_EXPIRES_IN: source.JWT_EXPIRES_IN || DEFAULTS.JWT_EXPIRES_IN,
    COOKIE_SECURE:
      source.COOKIE_SECURE !== undefined
        ? toBool(source.COOKIE_SECURE)
        : nodeEnv === "production",
    COOKIE_SAME_SITE: (source.COOKIE_SAME_SITE || DEFAULTS.COOKIE_SAME_SITE).toLowerCase(),
  };

  const required = ["MONGO_URI", "JWT_SECRET"];
  const missing = required.filter((key) => !config[key]);

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(", ")}`
    );
  }

  if (!["lax", "strict", "none"].includes(config.COOKIE_SAME_SITE)) {
    throw new Error("COOKIE_SAME_SITE must be one of: lax, strict, none");
  }

  if (config.COOKIE_SAME_SITE === "none" && !config.COOKIE_SECURE) {
    throw new Error("COOKIE_SECURE must be true when COOKIE_SAME_SITE is 'none'");
  }

  return config;
}

let env;

function validateEnv() {
  env = buildConfig(process.env);
  return env;
}

function getEnv() {
  if (!env) {
    env = buildConfig(process.env);
  }
  return env;
}

module.exports = { validateEnv, getEnv, buildConfig, parseOrigins };
