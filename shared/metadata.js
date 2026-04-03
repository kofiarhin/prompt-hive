const constants = require("./constants");

const USER_STATUSES = [
  { value: "active", label: "Active" },
  { value: "suspended", label: "Suspended" },
];

const CONTENT_STATUSES = [
  { value: "public", label: "Public" },
  { value: "private", label: "Private" },
  { value: "deleted", label: "Deleted" },
];

module.exports = {
  ...constants,
  USER_STATUSES,
  CONTENT_STATUSES,
};
