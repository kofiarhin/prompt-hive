const Content = require("../models/Content");

function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

async function generateUniqueSlug(title) {
  const base = slugify(title);
  let slug = base;
  let count = 0;

  while (await Content.exists({ slug })) {
    count++;
    slug = `${base}-${count}`;
  }

  return slug;
}

module.exports = { slugify, generateUniqueSlug };
